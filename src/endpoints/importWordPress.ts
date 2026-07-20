import type { Payload, PayloadRequest } from 'payload'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'

// ------------------------------------------------------------------
// CONFIG — change this to the site you're migrating from
// ------------------------------------------------------------------
const WP_BASE_URL = 'https://bizconglobal.com'
const WP_API = `${WP_BASE_URL}/wp-json/wp/v2`
const PER_PAGE = 20 // WP REST API max is 100, keep smaller so image downloads don't time out

// ------------------------------------------------------------------
// Small helpers
// ------------------------------------------------------------------
const decodeEntities = (str: string) =>
  str
    .replace(/&amp;/g, '&')
    .replace(/&#8217;|&#039;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').trim()

async function wpFetchAll<T>(endpoint: string): Promise<T[]> {
  const results: T[] = []
  let page = 1
  let totalPages = 1

  do {
    const res = await fetch(`${WP_API}/${endpoint}${endpoint.includes('?') ? '&' : '?'}per_page=${PER_PAGE}&page=${page}`)
    if (!res.ok) {
      // WP returns 400 once you page past the last page — treat as "done"
      if (res.status === 400) break
      throw new Error(`WP API request failed: ${endpoint} (${res.status})`)
    }
    totalPages = Number(res.headers.get('X-WP-TotalPages') || '1')
    const data = (await res.json()) as T[]
    results.push(...data)
    page += 1
  } while (page <= totalPages)

  return results
}

// ------------------------------------------------------------------
// Image download + upload (dedup by source URL so the same featured
// image / inline image is never uploaded twice)
// ------------------------------------------------------------------
const mediaCache = new Map<string, number>() // wp image URL -> payload media ID

async function uploadImageFromUrl(
  payload: Payload,
  imageUrl: string,
  alt: string,
): Promise<{ id: number; url: string } | null> {
  if (!imageUrl) return null
  const cached = mediaCache.get(imageUrl)
  if (cached) {
    const doc = await payload.findByID({ collection: 'media', id: cached })
    return { id: cached, url: doc.url || '' }
  }

  try {
    const res = await fetch(imageUrl)
    if (!res.ok) throw new Error(`status ${res.status}`)
    const arrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const created = await payload.create({
      collection: 'media',
      data: { alt: alt || '' },
      file: {
        data: buffer,
        mimetype: res.headers.get('content-type') || 'image/jpeg',
        name: imageUrl.split('/').pop()?.split('?')[0] || `image-${Date.now()}.jpg`,
        size: buffer.length,
      },
    })

    mediaCache.set(imageUrl, created.id)
    return { id: created.id, url: created.url || '' }
  } catch (err) {
    payload.logger.warn(`Failed to import image ${imageUrl}: ${(err as Error).message}`)
    return null
  }
}

// Finds every <img> in the post HTML, uploads it to Payload Media,
// then rewrites the tag with the data attributes convertHTMLToLexical
// needs in order to turn it into a real upload node.
async function embedImagesForLexical(payload: Payload, html: string): Promise<string> {
  const dom = new JSDOM(html)
  const images = Array.from(dom.window.document.querySelectorAll('img'))

  for (const img of images) {
    const src = img.getAttribute('src')
    if (!src) {
      img.remove()
      continue
    }
    const absoluteSrc = src.startsWith('http') ? src : new URL(src, WP_BASE_URL).toString()
    const uploaded = await uploadImageFromUrl(payload, absoluteSrc, img.getAttribute('alt') || '')

    if (uploaded) {
      img.setAttribute('src', uploaded.url)
      img.setAttribute('data-lexical-upload-id', String(uploaded.id))
      img.setAttribute('data-lexical-upload-relation-to', 'media')
    } else {
      img.remove()
    }
  }

  return dom.window.document.body.innerHTML
}

// ------------------------------------------------------------------
// WordPress types (only the fields we actually use)
// ------------------------------------------------------------------
type WPCategory = { id: number; name: string; slug: string }
type WPTag = { id: number; name: string; slug: string }
type WPUser = { id: number; name: string; slug: string }
type WPMedia = { id: number; source_url: string; alt_text: string }
type WPPost = {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  author: number
  featured_media: number
  categories: number[]
  tags: number[]
}

// ------------------------------------------------------------------
// Main import
// ------------------------------------------------------------------
export async function importWordPress({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}) {
  const editorConfig = await editorConfigFactory.default({ config: payload.config })

  // ---- 1. Categories -------------------------------------------------
  payload.logger.info('Importing categories…')
  const wpCategories = await wpFetchAll<WPCategory>('categories')
  const categoryMap = new Map<number, number>() // wp id -> payload id

  for (const cat of wpCategories) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
    })
    const doc =
      existing.docs[0] ??
      (await payload.create({
        collection: 'categories',
        data: { title: decodeEntities(cat.name), slug: cat.slug },
      }))
    categoryMap.set(cat.id, doc.id)
  }

  // ---- 2. Tags ---------------------------------------------------------
  payload.logger.info('Importing tags…')
  const wpTags = await wpFetchAll<WPTag>('tags')
  const tagMap = new Map<number, number>()

  for (const tag of wpTags) {
    const existing = await payload.find({
      collection: 'tags',
      where: { slug: { equals: tag.slug } },
      limit: 1,
    })
    const doc =
      existing.docs[0] ??
      (await payload.create({
        collection: 'tags',
        data: { title: decodeEntities(tag.name), slug: tag.slug },
      }))
    tagMap.set(tag.id, doc.id)
  }

  // ---- 3. Authors (WP public API only exposes name + slug, not email) --
  payload.logger.info('Importing authors…')
  const wpUsers = await wpFetchAll<WPUser>('users')
  const authorMap = new Map<number, number>()

  for (const author of wpUsers) {
    const fakeEmail = `${author.slug}@imported.bizconglobal.local`
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: fakeEmail } },
      limit: 1,
    })
    const doc =
      existing.docs[0] ??
      (await payload.create({
        collection: 'users',
        data: {
          name: decodeEntities(author.name),
          email: fakeEmail,
          password: crypto.randomUUID(), // random — these accounts aren't meant to log in
        },
      }))
    authorMap.set(author.id, doc.id)
  }

  // ---- 4. Posts ----------------------------------------------------------
  payload.logger.info('Importing posts…')
  const wpPosts = await wpFetchAll<WPPost>('posts')

  for (const post of wpPosts) {
    payload.logger.info(`  -> ${post.slug}`)

    const existing = await payload.find({
      collection: 'blog',
      where: { slug: { equals: post.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      payload.logger.info(`     already imported, skipping`)
      continue
    }

    // Hero / featured image
    let heroImageId: number | undefined
    if (post.featured_media) {
      try {
        const media = await fetch(`${WP_API}/media/${post.featured_media}`)
        if (media.ok) {
          const mediaJson = (await media.json()) as WPMedia
          const uploaded = await uploadImageFromUrl(
            payload,
            mediaJson.source_url,
            mediaJson.alt_text || '',
          )
          heroImageId = uploaded?.id
        }
      } catch (err) {
        payload.logger.warn(`Featured media fetch failed for post ${post.slug}`)
      }
    }

    // Body content: pull inline images out, upload them, then convert to Lexical
    const htmlWithUploads = await embedImagesForLexical(payload, post.content.rendered)
    const lexicalContent = convertHTMLToLexical({
      editorConfig,
      html: htmlWithUploads,
      JSDOM,
    })

    await payload.create({
      collection: 'blog',
      data: {
        title: decodeEntities(post.title.rendered),
        slug: post.slug,
        heroImage: heroImageId,
        content: lexicalContent,
        categories: post.categories.map((id) => categoryMap.get(id)).filter(Boolean) as number[],
        tags: post.tags.map((id) => tagMap.get(id)).filter(Boolean) as number[],
        authors: authorMap.has(post.author) ? [authorMap.get(post.author) as number] : undefined,
        publishedAt: post.date,
        _status: 'published',
        meta: {
          title: decodeEntities(post.title.rendered),
          description: stripHtml(decodeEntities(post.excerpt.rendered)).slice(0, 160),
        },
      },
      req,
    })
  }

  payload.logger.info('WordPress import complete.')

  return {
    categories: categoryMap.size,
    tags: tagMap.size,
    authors: authorMap.size,
    posts: wpPosts.length,
  }
}