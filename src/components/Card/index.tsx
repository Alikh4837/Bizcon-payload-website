'use client'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { className, doc, relationTo = 'posts', title: titleFromProps } = props
  const { slug, title } = doc || {}
  const titleToUse = titleFromProps || title
  const href = `/${relationTo}/${slug}`

  return (
    <article className={cn(className)}>
      {titleToUse && (
        <Link
          href={href}
          className="font-bold text-xl leading-snug text-foreground hover:underline"
        >
          {titleToUse}
        </Link>
      )}
    </article>
  )
}