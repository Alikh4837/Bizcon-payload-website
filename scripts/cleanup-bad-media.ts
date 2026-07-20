/**
 * Cleanup script: finds and deletes corrupted Media documents left over from
 * the WordPress image migration (e.g. tiny lazy-load placeholder blobs that
 * got uploaded instead of the real photo), and clears the `heroImage`
 * reference on any Post pointing at one, so the next backfill run in
 * migrate-wordpress.ts will re-fetch a clean copy.
 *
 * Run with:
 *   npx tsx scripts/cleanup-bad-media.ts
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

// A real photo is essentially never this small. Lazy-load placeholders
// (1x1 GIFs, tiny base64 SVGs, etc.) are typically under 1-2 KB.
const MIN_VALID_IMAGE_BYTES = 2048

// Known magic bytes for common web image formats. If a file's first few
// bytes don't match ANY of these, it's not a real image file at all.
function hasValidImageSignature(buffer: Buffer): boolean {
  if (buffer.length < 12) return false

  const hex = buffer.subarray(0, 12).toString('hex')

  const isJPEG = hex.startsWith('ffd8ff')
  const isPNG = hex.startsWith('89504e47')
  const isGIF = hex.startsWith('474946383761') || hex.startsWith('474946383961')
  const isWEBP = hex.startsWith('52494646') && buffer.subarray(8, 12).toString() === 'WEBP'
  // AVIF files start with an ftyp box; the brand sits at offset 8
  const isAVIF = buffer.subarray(4, 8).toString() === 'ftyp'

  return isJPEG || isPNG || isGIF || isWEBP || isAVIF
}

async function cleanup() {
  const payload = await getPayload({ config })

  console.log('Scanning Media collection for corrupted uploads...\n')

  const allMedia = await payload.find({
    collection: 'media',
    limit: 1000,
    pagination: false,
  })

  const badMediaIds: (number | string)[] = []

  for (const doc of allMedia.docs) {
    const url = doc.url
    if (!url) continue

    try {
      // Fetch from your own local Payload server, not the original WP site
      const fullUrl = url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}${url}`
      const res = await fetch(fullUrl)

      if (!res.ok) {
        console.log(`  ! Could not fetch ${doc.filename} (${res.status}) — flagging as bad`)
        badMediaIds.push(doc.id)
        continue
      }

      const arrayBuffer = await res.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const looksLikePlaceholderName = /^[A-Za-z0-9+/]+=*(-[A-Za-z0-9+/]+=*)*\.(jpg|jpeg|png|webp|gif|avif)?$/.test(
        doc.filename || '',
      )
      const tooSmall = buffer.length < MIN_VALID_IMAGE_BYTES
      const badSignature = !hasValidImageSignature(buffer)

      if (tooSmall || badSignature) {
        console.log(
          `  ✗ ${doc.filename} — size=${buffer.length}B, validSignature=${!badSignature}${
            looksLikePlaceholderName ? ', base64-like filename' : ''
          }`,
        )
        badMediaIds.push(doc.id)
      }
    } catch (err) {
      console.log(`  ! Error checking ${doc.filename}:`, (err as Error).message)
      badMediaIds.push(doc.id)
    }
  }

  console.log(`\nFound ${badMediaIds.length} corrupted media documents out of ${allMedia.docs.length} total.\n`)

  if (badMediaIds.length === 0) {
    console.log('Nothing to clean up.')
    process.exit(0)
  }

  // Clear heroImage on any post pointing at a bad media doc, then delete the doc
  let clearedPosts = 0

  for (const mediaId of badMediaIds) {
    const affectedPosts = await payload.find({
      collection: 'blog',
      where: { heroImage: { equals: mediaId } },
      limit: 100,
    })

    for (const post of affectedPosts.docs) {
      await payload.update({
        collection: 'blog',
        id: post.id,
        data: { heroImage: null },
        context: { disableRevalidate: true },
      })
      clearedPosts += 1
      console.log(`  Cleared heroImage on post: ${post.title}`)
    }

    await payload.delete({
      collection: 'media',
      id: mediaId,
    })
  }

  console.log(`\n--- Cleanup report ---`)
  console.log(`Deleted media documents: ${badMediaIds.length}`)
  console.log(`Posts cleared (heroImage reset to empty): ${clearedPosts}`)
  console.log(`-----------------------\n`)
  console.log('Next step: re-run "npx tsx scripts/migrate-wordpress.ts" to backfill')
  console.log('clean images for the posts that were just cleared.\n')

  process.exit(0)
}

cleanup().catch((err) => {
  console.error('Cleanup script crashed:', err)
  process.exit(1)
})