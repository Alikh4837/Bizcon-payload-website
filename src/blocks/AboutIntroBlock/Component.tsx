import type { AboutIntroBlock as AboutIntroBlockProps } from '@/payload-types'

import Link from 'next/link'
import React from 'react'

import { Media } from '@/components/Media'

export const AboutIntroBlock: React.FC<AboutIntroBlockProps> = (props) => {
  const {
    ctaLink,
    ctaLinkLabel,
    ctaText,
    description,
    eyebrow,
    features,
    heading,
    primaryImage,
    secondaryImage,
  } = props

  const isExternal = ctaLink?.startsWith('http')

  return (
    <div className="container">
      <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* Text column */}
        <div>
          {eyebrow && (
            <span className="mb-3 inline-block font-mono text-xs font-semibold uppercase tracking-wider text-brand-accent">
              {eyebrow}
            </span>
          )}
          {heading && (
            <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-brand-ink mb-4">
              {heading}
            </h2>
          )}
          {description && (
            <p className="text-muted-foreground text-base leading-relaxed mb-10 max-w-lg">
              {description}
            </p>
          )}

          {features && features.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-2 mb-10">
              {features.map((feature, index) => (
                <div key={index}>
                  {feature.icon && typeof feature.icon === 'object' && (
                    <div className="mb-4 h-10 w-10">
                      <Media resource={feature.icon} imgClassName="h-10 w-10 object-contain" />
                    </div>
                  )}
                  <h3 className="font-display text-base font-semibold text-brand-ink mb-1.5">
                    {feature.heading}
                  </h3>
                  {feature.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {ctaText && (
            <div className="flex items-center gap-4 border-t border-brand-line pt-6">
              <p className="text-sm md:text-base text-brand-ink font-medium">{ctaText}</p>
              {ctaLinkLabel && ctaLink && (
                <Link
                  href={ctaLink}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="inline-flex shrink-0 items-center text-sm font-semibold text-brand-accent hover:underline whitespace-nowrap"
                >
                  {ctaLinkLabel}
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Image collage column */}
        {(primaryImage || secondaryImage) && (
          <div className="relative">
            {primaryImage && typeof primaryImage === 'object' && (
              <div className="aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl">
                <Media resource={primaryImage} imgClassName="h-full w-full object-cover" />
              </div>
            )}
            {secondaryImage && typeof secondaryImage === 'object' && (
              <div className="absolute -bottom-8 -right-4 w-40 sm:w-52 overflow-hidden rounded-2xl border-4 border-background shadow-lg md:-right-10">
                <div className="aspect-square w-full">
                  <Media resource={secondaryImage} imgClassName="h-full w-full object-cover" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
