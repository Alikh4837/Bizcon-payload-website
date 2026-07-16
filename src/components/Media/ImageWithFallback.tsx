'use client'
import React, { useState } from 'react'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

export const ImageWithFallback: React.FC<{
  resource: MediaType
  imgClassName?: string
  priority?: boolean
  fill?: boolean
}> = ({ resource, imgClassName, priority, fill }) => {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="flex items-center justify-center bg-muted text-muted-foreground text-sm rounded-md aspect-video">
        Image unavailable
      </div>
    )
  }

  return (
    <div onError={() => setFailed(true)}>
      <Media resource={resource} imgClassName={imgClassName} priority={priority} fill={fill} />
    </div>
  )
}