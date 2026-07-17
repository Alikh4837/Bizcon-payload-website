import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'
import { Media } from '@/components/Media'
import { getCategoryAccent } from '@/utilities/categoryAccent'
import { formatDateTime } from '@/utilities/formatDateTime'

export type CardPostData = Pick<
  Post,
  'slug' | 'categories' | 'meta' | 'title' | 'heroImage' | 'publishedAt'
>

export const Card: React.FC<{
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  featured?: boolean
  title?: string
}> = (props) => {
  const { className, doc, relationTo = 'posts', featured = false, title: titleFromProps } = props
  const { slug, title, meta, heroImage, publishedAt, categories } = doc || {}
  const titleToUse = titleFromProps || title
  const href = `/${relationTo}/${slug}`

  const category = categories?.find((c) => typeof c === 'object')
  const categoryTitle = typeof category === 'object' ? category?.title : undefined
  const categorySlug = typeof category === 'object' ? category?.slug : undefined
  const accent = getCategoryAccent(categorySlug)
  const excerpt = meta?.description

  if (!titleToUse) return null

  return (
    <article
      className={cn(
        'group relative flex overflow-hidden rounded-lg border border-brand-line bg-card transition-shadow hover:shadow-md',
        featured ? 'flex-col lg:flex-row' : 'flex-col',
        className,
      )}
      style={{ borderLeftColor: accent, borderLeftWidth: '3px' }}
    >
      <Link href={href} className="contents">
        {heroImage && typeof heroImage === 'object' && (
          <div
            className={cn(
              'relative overflow-hidden bg-muted',
              featured ? 'aspect-[16/10] lg:aspect-auto lg:w-1/2' : 'aspect-[16/10]',
            )}
          >
            <Media
              resource={heroImage}
              fill
              imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <div className={cn('flex flex-1 flex-col p-6', featured && 'lg:p-8 lg:justify-center')}>
          <div className="mb-3 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {categoryTitle && (
              <span style={{ color: accent }} className="font-semibold">
                {categoryTitle}
              </span>
            )}
            {publishedAt && <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>}
          </div>

          <h3
            className={cn(
              'font-display font-semibold leading-snug text-brand-ink group-hover:underline',
              featured ? 'text-2xl lg:text-3xl' : 'text-lg',
            )}
          >
            {titleToUse}
          </h3>

          {excerpt && (
            <p
              className={cn(
                'mt-3 text-muted-foreground',
                featured ? 'line-clamp-3 text-base' : 'line-clamp-2 text-sm',
              )}
            >
              {excerpt}
            </p>
          )}
        </div>
      </Link>
    </article>
  )
}
