import type { LogoStripBlock as LogoStripBlockProps } from '@/payload-types'

import React from 'react'

import { Media } from '@/components/Media'

export const LogoStripBlock: React.FC<LogoStripBlockProps> = (props) => {
  const { heading, logos } = props

  return (
    <div className="container">
      {heading && (
        <p className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground mb-8">
          {heading}
        </p>
      )}

      {logos && logos.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-10">
          {logos.map((item, index) => {
            const { link, logo } = item
            const content =
              logo && typeof logo === 'object' ? (
                <Media resource={logo} imgClassName="h-10 w-auto object-contain grayscale opacity-70" />
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
      )}
    </div>
  )
}
