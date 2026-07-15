import React from 'react'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const PostNavigation: React.FC<{
  currentId: string | number
  publishedAt?: string | null
}> = async ({ currentId, publishedAt }) => {
  if (!publishedAt) return null

  const payload = await getPayload({ config: configPromise })

  const [prev, next] = await Promise.all([
    payload.find({
      collection: 'posts',
      limit: 1,
      overrideAccess: false,
      sort: '-publishedAt',
      where: {
        and: [
          { publishedAt: { less_than: publishedAt } },
          { id: { not_equals: currentId } },
        ],
      },
      select: { title: true, slug: true },
    }),
    payload.find({
      collection: 'posts',
      limit: 1,
      overrideAccess: false,
      sort: 'publishedAt',
      where: {
        and: [
          { publishedAt: { greater_than: publishedAt } },
          { id: { not_equals: currentId } },
        ],
      },
      select: { title: true, slug: true },
    }),
  ])

  const prevPost = prev.docs[0]
  const nextPost = next.docs[0]

  if (!prevPost && !nextPost) return null

  return (
    <div className="flex justify-between items-center border-t border-border pt-6 mt-10 gap-4">
      <div>
        {prevPost && (
          <Link href={`/posts/${prevPost.slug}`} className="text-sm hover:underline">
            ← {prevPost.title}
          </Link>
        )}
      </div>
      <div className="text-right">
        {nextPost && (
          <Link href={`/posts/${nextPost.slug}`} className="text-sm hover:underline">
            {nextPost.title} →
          </Link>
        )}
      </div>
    </div>
  )
}