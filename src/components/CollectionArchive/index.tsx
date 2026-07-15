import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardPostData } from '@/components/Card'

export type Props = {
  posts: CardPostData[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10')}>
      {posts?.map((result, index) => {
        if (typeof result === 'object' && result !== null) {
          return <Card key={index} doc={result} relationTo="posts" />
        }
        return null
      })}
    </div>
  )
}