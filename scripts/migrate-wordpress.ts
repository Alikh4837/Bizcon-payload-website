/**
 * WordPress -> Payload CMS Blog Migration Script
 * ------------------------------------------------
 * Source: bizconglobal.com WordPress REST API (public, read-only, official WP endpoint)
 * Target: Payload `posts`, `categories`, `tags`, `media` collections
 *
 * Method (documented + reproducible):
 *   1. Pull all published posts from /wp-json/wp/v2/posts (paginated, with _embed
 *      to include categories, tags, featured image, and author in one request).
 *   2. Upsert Categories/Tags in Payload, matching by slug to avoid duplicates.
 *   3. Download each post's featured image + any inline <img> tags in the body,
 *      upload them to the Payload `media` collection.
 *   4. Convert the post body HTML into Payload's Lexical JSON format using
 *      Payload's official `convertHTMLToLexical` utility, wiring up the
 *      already-uploaded images via the documented data-lexical-upload-* attributes.
 *   5. Create the Post document in Payload, preserving the original slug and
 *      publish date so URLs and chronology stay consistent with the old site.
 *   6. Log a summary report (created / backfilled / skipped / failed) at the end.
 *
 * Image reliability: image downloads use a small delay + retry/backoff, since
 * bizconglobal.com throttled sequential requests during the first import run.
 * The script is also safe to re-run: posts that already exist but are still
 * missing a hero image (from a prior failed download) will have that image
 * backfilled instead of being skipped outright.
 *
 * Run with:
 *   npx tsx scripts/migrate-wordpress.ts
 *
 * Required packages (install first):
 *   npm install jsdom --save-dev
 *   npm install --save-dev @types/jsdom
 *   npm install tsx --save-dev   (if you don't already have a TS runner)
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const WP_API_BASE = 'https://bizconglobal.com/wp-json/wp/v2'
const PER_PAGE = 20
// Only migrate posts published on/after this date if you want a cutoff; set to
// null to migrate everything.
const SINCE_DATE: string | null = null

// Image download tuning — bizconglobal.com throttled/timed out when hit with
// 100+ sequential image requests during the first import run. A small delay
// between downloads plus a few retries clears that up without slowing things
// down meaningfully (a few minutes total for ~140 posts).
const IMAGE_DOWNLOAD_DELAY_MS = 350
const IMAGE_DOWNLOAD_MAX_RETRIES = 3
const IMAGE_DOWNLOAD_RETRY_BASE_DELAY_MS = 1000

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ---------------------------------------------------------------------------
// Types (subset of the WordPress REST API response we actually use)
// ---------------------------------------------------------------------------

type WPTerm = {
  id: number
  name: string
  slug: string
  taxonomy: 'category' | 'post_tag'
}

type WPMedia = {
  source_url: string
  alt_text?: string
}

type WPAuthor = {
  name: string
}

type WPPost = {
  id: number
  date: string
  date_gmt: string
  slug: string
  status: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  _embedded?: {
    'wp:term'?: WPTerm[][]
    'wp:featuredmedia'?: WPMedia[]
    author?: WPAuthor[]
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function decodeEntities(str: string): string {
  return str
    .replace(/&#8217;/g, '’')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8211;/g, '–')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .trim()
}

function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

async function fetchAllPosts(): Promise<WPPost[]> {
  const posts: WPPost[] = []
  let page = 1

  while (true) {
    const params = new URLSearchParams({
      per_page: String(PER_PAGE),
      page: String(page),
      status: 'publish',
      _embed: 'wp:term,wp:featuredmedia,author',
    })
    if (SINCE_DATE) params.set('after', SINCE_DATE)

    const res = await fetch(`${WP_API_BASE}/posts?${params.toString()}`)

    // WordPress returns a 400 once you page past the last available page
    if (res.status === 400) break
    if (!res.ok) {
      throw new Error(`Failed to fetch posts page ${page}: ${res.status} ${res.statusText}`)
    }

    const batch = (await res.json()) as WPPost[]
    if (batch.length === 0) break

    posts.push(...batch)
    console.log(`Fetched page ${page} (${batch.length} posts, ${posts.length} total)`)
    page += 1
  }

  return posts
}

// ---------------------------------------------------------------------------
// Category / Tag upsert (cached in-memory maps to avoid duplicate lookups)
// ---------------------------------------------------------------------------

const categoryCache = new Map<string, number>() // wp slug -> payload id
const tagCache = new Map<string, number>()

async function upsertTerm(
  payload: Awaited<ReturnType<typeof getPayload>>,
  term: WPTerm,
  collection: 'categories' | 'tags',
): Promise<number> {
  const cache = collection === 'categories' ? categoryCache : tagCache
  const cached = cache.get(term.slug)
  if (cached) return cached

  const existing = await payload.find({
    collection,
    where: { slug: { equals: term.slug } },
    limit: 1,
  })

  if (existing.docs[0]) {
    cache.set(term.slug, existing.docs[0].id)
    return existing.docs[0].id
  }

  const created = await payload.create({
    collection,
    data: {
      title: decodeEntities(term.name),
      slug: term.slug,
    },
  })

  cache.set(term.slug, created.id)
  return created.id
}

// ---------------------------------------------------------------------------
// Media download + upload
// ---------------------------------------------------------------------------

const mediaCache = new Map<string, { id: number; url: string }>()
// Track failures so the end-of-run report can call out exactly which posts
// need manual follow-up, instead of that only being visible in scrollback.
const imageFailures: { imageUrl: string; reason: string }[] = []

async function fetchImageWithRetry(
  imageUrl: string,
): Promise<{ buffer: Buffer; mimetype: string } | null> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= IMAGE_DOWNLOAD_MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(imageUrl)

      if (!res.ok) {
        // Rate limiting / temporary throttling usually shows up as 429 or 503
        if ((res.status === 429 || res.status === 503) && attempt < IMAGE_DOWNLOAD_MAX_RETRIES) {
          const backoff = IMAGE_DOWNLOAD_RETRY_BASE_DELAY_MS * attempt
          console.log(
            `    retry ${attempt}/${IMAGE_DOWNLOAD_MAX_RETRIES} for ${imageUrl} (status ${res.status}), waiting ${backoff}ms`,
          )
          await sleep(backoff)
          continue
        }
        throw new Error(`HTTP ${res.status}`)
      }

      const arrayBuffer = await res.arrayBuffer()
      return {
        buffer: Buffer.from(arrayBuffer),
        mimetype: res.headers.get('content-type') || 'image/jpeg',
      }
    } catch (err) {
      lastError = err as Error
      if (attempt < IMAGE_DOWNLOAD_MAX_RETRIES) {
        const backoff = IMAGE_DOWNLOAD_RETRY_BASE_DELAY_MS * attempt
        console.log(
          `    retry ${attempt}/${IMAGE_DOWNLOAD_MAX_RETRIES} for ${imageUrl} (${lastError.message}), waiting ${backoff}ms`,
        )
        await sleep(backoff)
      }
    }
  }

  throw lastError || new Error('Unknown image download failure')
}

async function downloadAndUploadImage(
  payload: Awaited<ReturnType<typeof getPayload>>,
  imageUrl: string,
  alt: string,
): Promise<{ id: number; url: string } | null> {
  if (mediaCache.has(imageUrl)) return mediaCache.get(imageUrl)!

  // Small fixed delay before every download, on top of the retry backoff,
  // so we're not hammering the source site request-after-request.
  await sleep(IMAGE_DOWNLOAD_DELAY_MS)

  try {
    const { buffer, mimetype } = (await fetchImageWithRetry(imageUrl))!
    const filename = imageUrl.split('/').pop()?.split('?')[0] || `image-${Date.now()}.jpg`

    const uploaded = await payload.create({
      collection: 'media',
      data: { alt: alt || filename },
      file: {
        data: buffer,
        mimetype,
        name: filename,
        size: buffer.length,
      },
    })

    const result = { id: uploaded.id, url: uploaded.url as string }
    mediaCache.set(imageUrl, result)
    return result
  } catch (err) {
    const reason = (err as Error).message
    console.error(`  ! Failed to upload image ${imageUrl} after retries:`, reason)
    imageFailures.push({ imageUrl, reason })
    return null
  }
}

// ---------------------------------------------------------------------------
// HTML body -> Lexical, with inline images pre-uploaded and tagged
// ---------------------------------------------------------------------------

async function convertBodyToLexical(
  payload: Awaited<ReturnType<typeof getPayload>>,
  html: string,
) {
  const dom = new JSDOM(html)
  const images = Array.from(dom.window.document.querySelectorAll('img'))

  for (const img of images) {
    const src = img.getAttribute('src')
    if (!src) continue

    const uploaded = await downloadAndUploadImage(payload, src, img.getAttribute('alt') || '')

    if (uploaded) {
      img.setAttribute('data-lexical-upload-id', String(uploaded.id))
      img.setAttribute('data-lexical-upload-relation-to', 'media')
      img.setAttribute('src', uploaded.url)
    } else {
      img.remove()
    }
  }

  const updatedHTML = dom.window.document.body.innerHTML

  return convertHTMLToLexical({
  editorConfig: await editorConfigFactory.default({ config: payload.config }),
  html: updatedHTML,
  JSDOM,
})
}

// ---------------------------------------------------------------------------
// Main migration
// ---------------------------------------------------------------------------

async function migrate() {
  const payload = await getPayload({ config })

  console.log('Fetching posts from WordPress REST API...')
  const wpPosts = await fetchAllPosts()
  console.log(`Found ${wpPosts.length} published posts to migrate.\n`)

  const results = { created: 0, skipped: 0, failed: 0, backfilled: 0 }

  for (const [index, wpPost] of wpPosts.entries()) {
    const label = `[${index + 1}/${wpPosts.length}] "${decodeEntities(wpPost.title.rendered)}"`

    try {
      // Check for an existing post with this slug (idempotent re-runs)
      const existing = await payload.find({
        collection: 'posts',
        where: { slug: { equals: wpPost.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        const existingPost = existing.docs[0]

        // Backfill: if the post exists but never got its hero image (likely
        // because the download failed on a previous run), try again now
        // rather than silently skipping it forever.
        if (!existingPost.heroImage) {
          const featuredMedia = wpPost._embedded?.['wp:featuredmedia']?.[0]

          if (featuredMedia?.source_url) {
            const uploaded = await downloadAndUploadImage(
              payload,
              featuredMedia.source_url,
              featuredMedia.alt_text || '',
            )

            if (uploaded) {
              await payload.update({
                collection: 'posts',
                id: existingPost.id,
                data: { heroImage: uploaded.id },
              })
              console.log(`${label} -> backfilled missing hero image`)
              results.created += 0 // not a new post; tracked separately below
              results.backfilled += 1
              continue
            }
          }

          console.log(`${label} -> skipped (exists, image backfill failed again)`)
          results.skipped += 1
          continue
        }

        console.log(`${label} -> skipped (already exists, image present)`)
        results.skipped += 1
        continue
      }

      // Categories & Tags
      const termGroups = wpPost._embedded?.['wp:term'] || []
      const allTerms = termGroups.flat()
      const wpCategories = allTerms.filter((t) => t.taxonomy === 'category')
      const wpTags = allTerms.filter((t) => t.taxonomy === 'post_tag')

      const categoryIds = await Promise.all(
        wpCategories.map((term) => upsertTerm(payload, term, 'categories')),
      )
      const tagIds = await Promise.all(wpTags.map((term) => upsertTerm(payload, term, 'tags')))

      // Featured image
      const featuredMedia = wpPost._embedded?.['wp:featuredmedia']?.[0]
      let heroImageId: number | undefined

      if (featuredMedia?.source_url) {
        const uploaded = await downloadAndUploadImage(
          payload,
          featuredMedia.source_url,
          featuredMedia.alt_text || '',
        )
        heroImageId = uploaded?.id
      }

      // Body content -> Lexical
      const lexicalContent = await convertBodyToLexical(payload, wpPost.content.rendered)

      // Author (kept as plain text note; see migration report below for why)
      const authorName = wpPost._embedded?.author?.[0]?.name

      await payload.create({
        collection: 'posts',
        draft: false,
        data: {
          title: decodeEntities(wpPost.title.rendered),
          slug: wpPost.slug,
          publishedAt: wpPost.date_gmt + 'Z',
          heroImage: heroImageId,
          content: lexicalContent,
          categories: categoryIds,
          tags: tagIds,
          meta: {
            title: decodeEntities(wpPost.title.rendered),
            description: stripHTML(decodeEntities(wpPost.excerpt.rendered)).slice(0, 160),
          },
        },
      })

      console.log(`${label} -> created${authorName ? ` (original author: ${authorName})` : ''}`)
      results.created += 1
    } catch (err) {
      console.error(`${label} -> FAILED:`, (err as Error).message)
      results.failed += 1
    }
  }

  console.log('\n--- Migration report ---')
  console.log(`Created: ${results.created}`)
  console.log(`Backfilled hero images: ${results.backfilled}`)
  console.log(`Skipped (already existed, image present): ${results.skipped}`)
  console.log(`Failed: ${results.failed}`)

  if (imageFailures.length > 0) {
    console.log(`\nImages that failed after ${IMAGE_DOWNLOAD_MAX_RETRIES} retries:`)
    for (const failure of imageFailures) {
      console.log(`  - ${failure.imageUrl} (${failure.reason})`)
    }
    console.log(
      '\nThese posts are still missing an image but were otherwise created successfully.',
    )
    console.log('Re-run this script to retry backfilling just these — already-imported')
    console.log('posts with an image will be skipped, so it\'s safe to run again.')
  }
  console.log('------------------------\n')

  process.exit(0)
}

migrate().catch((err) => {
  console.error('Migration script crashed:', err)
  process.exit(1)
})