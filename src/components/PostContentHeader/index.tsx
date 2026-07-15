import React from 'react'
import { formatDateTime } from 'src/utilities/formatDateTime'
import type { Post } from '@/payload-types'
import { formatAuthors } from '@/utilities/formatAuthors'
import { Media } from '@/components/Media'

export const PostContentHeader: React.FC<{ post: Post }> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''
  const hasCategories = categories && categories.length > 0

  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{title}</h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
        {hasAuthors && <span>By {formatAuthors(populatedAuthors)}</span>}
        {publishedAt && <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>}
        {hasCategories && (
          <span className="uppercase">
            {categories
              ?.map((c) => (typeof c === 'object' ? c.title : ''))
              .filter(Boolean)
              .join(', ')}
          </span>
        )}
      </div>

      {heroImage && typeof heroImage !== 'string' && (
        <div className="rounded-md overflow-hidden mb-8">
          <Media resource={heroImage} imgClassName="w-full h-auto object-cover" />
        </div>
      )}
    </div>
  )
}