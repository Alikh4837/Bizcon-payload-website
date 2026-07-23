'use client'

import type { TrendingBlock as TrendingBlockProps } from '@/payload-types'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'

const AUTO_ADVANCE_MS = 4500
const VISIBLE_DESKTOP = 3

export const TrendingBlock: React.FC<TrendingBlockProps> = (props) => {
  const { description, eyebrow, heading, items } = props
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const slides = items || []
  const slideCount = slides.length

  useEffect(() => {
    if (slideCount <= VISIBLE_DESKTOP) return

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount)
    }, AUTO_ADVANCE_MS)

    return () => clearInterval(timer)
  }, [slideCount])

  const goTo = (index: number) => {
    if (slideCount === 0) return
    setActiveIndex(((index % slideCount) + slideCount) % slideCount)
  }

  return (
    <div className="container">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          {eyebrow && (
            <span className="mb-3 inline-block font-mono text-xs font-semibold uppercase tracking-wider text-brand-accent">
              {eyebrow}
            </span>
          )}
          {heading && (
            <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-brand-ink">
              {heading}
            </h2>
          )}
          {description && (
            <p className="mt-4 text-muted-foreground text-base leading-relaxed">{description}</p>
          )}
        </div>

        {slideCount > VISIBLE_DESKTOP && (
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => goTo(activeIndex - 1)}
              className="rounded-full border border-brand-line p-2 hover:border-brand-accent hover:text-brand-accent transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => goTo(activeIndex + 1)}
              className="rounded-full border border-brand-line p-2 hover:border-brand-accent hover:text-brand-accent transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {slideCount > 0 && (
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(calc(-${activeIndex} * (100% / ${VISIBLE_DESKTOP} + 1.5rem)))`,
            }}
          >
            {slides.map((item, index) => (
              <TrendingCard key={index} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

type TrendingItem = NonNullable<TrendingBlockProps['items']>[number]

const TrendingCard: React.FC<{ item: TrendingItem }> = ({ item }) => {
  const { category, date, excerpt, image, link, title } = item
  const isExternal = link?.startsWith('http')

  const card = (
    <div className="group h-full overflow-hidden rounded-2xl border border-brand-line bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        {image && typeof image === 'object' ? (
          <Media
            resource={image}
            imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
        {category && (
          <span className="absolute right-3 top-3 rounded-md bg-background/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-ink backdrop-blur-sm">
            {category}
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-display text-base md:text-lg font-semibold leading-snug text-brand-ink line-clamp-2 group-hover:text-brand-accent transition-colors">
          {title}
        </h3>
        {excerpt && (
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {excerpt}
          </p>
        )}
        {date && (
          <p className="mt-3 text-xs text-muted-foreground">{formatDateTime(date)}</p>
        )}
      </div>
    </div>
  )

  const wrapperClasses = 'shrink-0' as const
  const wrapperStyle = { width: `calc(100% / ${3} - 1rem)` }

  if (!link) {
    return (
      <div className={wrapperClasses} style={wrapperStyle}>
        {card}
      </div>
    )
  }

  return isExternal ? (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={wrapperClasses}
      style={wrapperStyle}
    >
      {card}
    </a>
  ) : (
    <Link href={link} className={wrapperClasses} style={wrapperStyle}>
      {card}
    </Link>
  )
}
