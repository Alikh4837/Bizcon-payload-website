import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardPostData } from '@/components/Card'

export type Props = {
  posts: CardPostData[]
  /** Show the first post as a large featured card. Turn off on paginated pages beyond 1. */
  showFeatured?: boolean
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts, showFeatured = false } = props

  if (!posts?.length) return null

  const [first, ...rest] = posts
  const featuredPost = showFeatured ? first : undefined
  const gridPosts = showFeatured ? rest : posts

  return (
    <div className="flex flex-col gap-10">
      {featuredPost && typeof featuredPost === 'object' && (
        <Card doc={featuredPost} relationTo="posts" featured />
      )}

      <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6')}>
        {gridPosts?.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return <Card key={index} doc={result} relationTo="posts" />
          }
          return null
        })}
      </div>
    </div>
  )
}
