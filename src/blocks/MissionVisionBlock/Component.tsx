'use client'

import type { MissionVisionBlock as MissionVisionBlockProps } from '@/payload-types'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useState } from 'react'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

export const MissionVisionBlock: React.FC<MissionVisionBlockProps> = (props) => {
  const { image: fallbackImage, slides } = props

  const [activeIndex, setActiveIndex] = useState(0)

  const items = slides || []
  if (items.length === 0) return null

  const active = items[activeIndex]
  const activeImage = (active.image && typeof active.image === 'object' ? active.image : null) ||
    (fallbackImage && typeof fallbackImage === 'object' ? fallbackImage : null)

  const goTo = (index: number) => {
    const next = (index + items.length) % items.length
    setActiveIndex(next)
  }

  return (
    <div className="container">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* Image */}
        {activeImage && (
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl lg:order-2">
            <Media
              resource={activeImage}
              imgClassName="h-full w-full object-cover transition-opacity duration-300"
            />
          </div>
        )}

        {/* Text + controls */}
        <div className="lg:order-1">
          <span className="mb-3 inline-block font-mono text-xs font-semibold uppercase tracking-wider text-brand-accent">
            {active.label}
          </span>
          <h3 className="font-display text-2xl md:text-3xl font-semibold leading-tight text-brand-ink mb-4">
            {active.heading}
          </h3>
          {active.description && (
            <p className="text-muted-foreground text-base leading-relaxed mb-10 max-w-lg">
              {active.description}
            </p>
          )}

          {items.length > 1 && (
            <div className="flex items-center gap-6 border-t border-brand-line pt-6">
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={() => goTo(activeIndex - 1)}
                  className="rounded-full border border-brand-line p-2.5 text-brand-ink transition-colors hover:border-brand-accent hover:text-brand-accent"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  onClick={() => goTo(activeIndex + 1)}
                  className="rounded-full border border-brand-line p-2.5 text-brand-ink transition-colors hover:border-brand-accent hover:text-brand-accent"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="flex gap-2">
                {items.map((slide, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Go to ${slide.label}`}
                    onClick={() => goTo(index)}
                    className={cn(
                      'h-1.5 rounded-full transition-all',
                      index === activeIndex ? 'w-6 bg-brand-accent' : 'w-1.5 bg-brand-line',
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
