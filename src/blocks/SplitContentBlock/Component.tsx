import React from 'react'

import type { SplitContentBlock as SplitContentBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

export const SplitContentBlockComponent: React.FC<SplitContentBlockProps> = (
  props,
) => {
  const {
    eyebrow,
    title,
    richText,
    image,
    imagePosition,
    rounded,
    background,
    padding,
  } = props

  const imageFirst = imagePosition === 'left'

  const paddingClasses = {
    small: 'py-12',
    medium: 'py-20',
    large: 'py-28',
  }

  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
  }

  return (
    <section
      className={cn(
        paddingClasses[padding || 'large'],
        backgroundClasses[background || 'white'],
      )}
    >
      <div className="container">

        <div
          className={cn(
            'grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center',
            imageFirst && 'lg:[&>*:first-child]:order-1',
          )}
        >
          {/* IMAGE */}

          {imageFirst && (
            <div>
              <Media
                resource={image}
                className={cn(
                  'overflow-hidden',
                  rounded && 'rounded-3xl',
                )}
                imgClassName="w-full h-full object-cover"
              />
            </div>
          )}

          {/* CONTENT */}

          <div className="max-w-xl">

            {eyebrow && (
              <p className="uppercase tracking-[0.2em] text-sm font-semibold text-primary mb-4">
                {eyebrow}
              </p>
            )}

            {title && (
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                {title}
              </h2>
            )}

            {richText && (
              <RichText
                data={richText}
                enableGutter={false}
              />
            )}

          </div>

          {!imageFirst && (
            <div>
              <Media
                resource={image}
                className={cn(
                  'overflow-hidden',
                  rounded && 'rounded-3xl',
                )}
                imgClassName="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

      </div>
    </section>
  )
}