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
        and: [{ publishedAt: { less_than: publishedAt } }, { id: { not_equals: currentId } }],
      },
      select: { title: true, slug: true },
    }),
    payload.find({
      collection: 'posts',
      limit: 1,
      overrideAccess: false,
      sort: 'publishedAt',
      where: {
        and: [{ publishedAt: { greater_than: publishedAt } }, { id: { not_equals: currentId } }],
      },
      select: { title: true, slug: true },
    }),
  ])

  const prevPost = prev.docs[0]
  const nextPost = next.docs[0]

  if (!prevPost && !nextPost) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8 border-t border-brand-line">
      {prevPost ? (
        <Link
          href={`/posts/${prevPost.slug}`}
          className="group rounded-lg border border-brand-line p-5 hover:border-brand-ink transition-colors"
        >
          <span className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
            ← Previous
          </span>
          <span className="font-display text-base font-medium text-brand-ink group-hover:underline">
            {prevPost.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {nextPost && (
        <Link
          href={`/posts/${nextPost.slug}`}
          className="group rounded-lg border border-brand-line p-5 text-right hover:border-brand-ink transition-colors"
        >
          <span className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
            Next →
          </span>
          <span className="font-display text-base font-medium text-brand-ink group-hover:underline">
            {nextPost.title}
          </span>
        </Link>
      )}
    </div>
  )
}
