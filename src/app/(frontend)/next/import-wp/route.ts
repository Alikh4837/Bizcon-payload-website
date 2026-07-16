// Place this at: src/app/(frontend)/next/import-wp/route.ts
// Mirrors the existing next/seed/route.ts pattern exactly, so it reuses
// the same auth + local-API-with-transactions approach already in the repo.

import { createLocalReq, getPayload } from 'payload'
import { importWordPress } from '@/endpoints/importWordPress'
import config from '@payload-config'
import { headers } from 'next/headers'

export const maxDuration = 300 // image downloads + lexical conversion take longer than the seed route

export async function POST(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return new Response('Action forbidden.', { status: 403 })
  }

  try {
    const payloadReq = await createLocalReq({ user }, payload)

    const result = await importWordPress({ payload, req: payloadReq })

    return Response.json({ success: true, result })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error importing WordPress data' })
    return new Response('Error importing WordPress data.', { status: 500 })
  }
}
