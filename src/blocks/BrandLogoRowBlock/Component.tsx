import type { BrandLogoRowBlock as BrandLogoRowBlockProps } from '@/payload-types'

import React from 'react'

import { Media } from '@/components/Media'

export const BrandLogoRowBlockComponent: React.FC<BrandLogoRowBlockProps> = (props) => {
  const { logos } = props

  if (!logos || logos.length === 0) return null

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-8">
          {logos.map((item, index) => {
            const { link, logo } = item

            const content =
              logo && typeof logo === 'object' ? (
                <Media resource={logo} imgClassName="h-7 md:h-8 w-auto object-contain" />
              ) : null

            if (!content) return null

            return link ? (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-90 transition-opacity hover:opacity-100"
              >
                {content}
              </a>
            ) : (
              <div key={index}>{content}</div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
