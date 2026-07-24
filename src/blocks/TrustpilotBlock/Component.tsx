import type { TrustpilotBlock as TrustpilotBlockProps } from '@/payload-types'

import { Star } from 'lucide-react'
import React from 'react'

import { Media } from '@/components/Media'

const Stars: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fillPercent = Math.max(0, Math.min(1, rating - i)) * 100

        return (
          <span key={i} className="relative inline-block h-5 w-5 md:h-6 md:w-6">
            <Star className="absolute inset-0 h-full w-full text-muted-foreground/30" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercent}%` }}
            >
              <Star className="h-5 w-5 md:h-6 md:w-6 fill-primary text-primary" />
            </span>
          </span>
        )
      })}
    </div>
  )
}

export const TrustpilotBlockComponent: React.FC<TrustpilotBlockProps> = (props) => {
  const { platformLogo, heading, rating, reviewCount, link } = props

  const content = (
    <div className="flex flex-col items-center gap-4 text-center">
      {heading && <p className="text-lg font-semibold md:text-xl">{heading}</p>}

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
        {platformLogo && (
          <Media resource={platformLogo} imgClassName="h-6 md:h-7 w-auto object-contain" />
        )}
        <Stars rating={rating || 0} />
        {reviewCount && (
          <span className="text-sm text-muted-foreground">{reviewCount}</span>
        )}
      </div>
    </div>
  )

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="block transition-opacity hover:opacity-90"
          >
            {content}
          </a>
        ) : (
          content
        )}
      </div>
    </section>
  )
}
