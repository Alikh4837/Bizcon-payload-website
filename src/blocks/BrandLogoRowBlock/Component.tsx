import type { BrandLogoRowBlock as BrandLogoRowBlockProps } from '@/payload-types'

import React from 'react'

import { Media } from '@/components/Media'

export const BrandLogoRowBlockComponent: React.FC<BrandLogoRowBlockProps> = (props) => {
  const { heading, logos } = props

  if (!logos || logos.length === 0) return null

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-card">
      <div className="container">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:justify-start">
            {logos.map((item, index) => {
              const { link, logo } = item

              const content =
                logo && typeof logo === 'object' ? (
                  <Media
                    resource={logo}
                    imgClassName="h-8 md:h-10 w-auto object-contain grayscale opacity-60 transition-opacity hover:opacity-100"
                  />
                ) : null

              if (!content) return null

              return link ? (
                <a key={index} href={link} target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              ) : (
                <div key={index}>{content}</div>
              )
            })}
          </div>

          {heading && (
            <h2 className="shrink-0 text-center text-2xl md:text-3xl font-bold leading-snug text-brand-ink md:text-right whitespace-nowrap">
              {heading}
            </h2>
          )}
        </div>
      </div>
    </section>
  )
}