/**
 * Backfill missing width/height on Media docs.
 * ------------------------------------------------
 * Root cause: images sourced from bizconglobal.com are served as AVIF.
 * `payload.create({ collection: 'media', file: {...} })` uploads the file fine,
 * but the built-in dimension-extraction step (image-size) can silently fail to
 * read AVIF metadata, leaving `width`/`height` as null in the DB even though
 * the file itself is stored correctly and served fine at /api/media/file/...
 *
 * This script finds every Media doc with a null/missing width or height,
 * re-fetches the actual file bytes from Payload's own media file endpoint,
 * extracts real dimensions with `sharp` (which reads AVIF metadata reliably),
 * and patches the doc.
 *
 * Run with:
 *   npx tsx scripts/backfill-media-dimensions.ts
 *
 * Requires `sharp` (already a Payload dependency, but if not installed):
 *   npm install sharp --save-dev
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import sharp from 'sharp'

// Base URL used to fetch each file's bytes via Payload's own media route.
// Adjust if your local/prod URL differs.
const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'

async function run() {
  const payload = await getPayload({ config })

  console.log('Scanning media collection for missing width/height...\n')

  const results = { fixed: 0, skipped: 0, failed: 0 }
  let page = 1
  const limit = 100

  while (true) {
    const batch = await payload.find({
      collection: 'media',
      limit,
      page,
      pagination: true,
    })

    if (batch.docs.length === 0) break

    for (const doc of batch.docs) {
      const needsFix = !doc.width || !doc.height

      if (!needsFix) {
        results.skipped += 1
        continue
      }

      if (!doc.filename) {
        console.log(`  ! Doc ${doc.id} has no filename, skipping`)
        results.failed += 1
        continue
      }

      const fileUrl = `${SERVER_URL}/api/media/file/${doc.filename}`

      try {
        const res = await fetch(fileUrl)
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} fetching ${fileUrl}`)
        }

        const buffer = Buffer.from(await res.arrayBuffer())
        const metadata = await sharp(buffer).metadata()

        if (!metadata.width || !metadata.height) {
          throw new Error('sharp could not determine dimensions either — file may be corrupt')
        }

        await payload.update({
          collection: 'media',
          id: doc.id,
          data: {
            width: metadata.width,
            height: metadata.height,
          },
          context: { disableRevalidate: true },
        })

        console.log(`  ✓ Fixed "${doc.filename}" -> ${metadata.width}x${metadata.height}`)
        results.fixed += 1
      } catch (err) {
        console.error(`  ✗ Failed "${doc.filename}":`, (err as Error).message)
        results.failed += 1
      }
    }

    if (!batch.hasNextPage) break
    page += 1
  }

  console.log('\n--- Backfill report ---')
  console.log(`Fixed: ${results.fixed}`)
  console.log(`Skipped (already had dimensions): ${results.skipped}`)
  console.log(`Failed: ${results.failed}`)
  console.log('-----------------------\n')

  process.exit(0)
}

run().catch((err) => {
  console.error('Backfill script crashed:', err)
  process.exit(1)
})