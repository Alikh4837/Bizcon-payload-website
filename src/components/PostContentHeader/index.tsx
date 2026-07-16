import React from 'react'
import { formatDateTime } from 'src/utilities/formatDateTime'
import type { Post } from '@/payload-types'
import { formatAuthors } from '@/utilities/formatAuthors'
import { Media } from '@/components/Media'
import { getCategoryAccent } from '@/utilities/categoryAccent'

export const PostContentHeader: React.FC<{ post: Post }> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''
  const primaryCategory = categories?.find((c) => typeof c === 'object')
  const categoryTitle = typeof primaryCategory === 'object' ? primaryCategory?.title : undefined
  const categorySlug = typeof primaryCategory === 'object' ? primaryCategory?.slug : undefined
  const accent = getCategoryAccent(categorySlug)

  return (
    <div className="mb-10">
      {categoryTitle && (
        <span
          className="mb-4 inline-block font-mono text-xs font-semibold uppercase tracking-wider"
          style={{ color: accent }}
        >
          {categoryTitle}
        </span>
      )}

      <h1 className="font-display text-3xl md:text-5xl font-semibold leading-tight text-brand-ink mb-5">
        {title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 font-mono text-xs uppercase tracking-wider text-muted-foreground mb-8 pb-8 border-b border-brand-line">
        {hasAuthors && <span>By {formatAuthors(populatedAuthors)}</span>}
        {publishedAt && <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>}
      </div>

      {heroImage && typeof heroImage !== 'string' && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted">
          <Media resource={heroImage} fill imgClassName="object-cover" />
        </div>
      )}
    </div>
  )
}
