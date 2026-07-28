'use client'

import type { TestimonialsBlock as TestimonialsBlockProps } from '@/payload-types'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const AUTO_ADVANCE_MS = 4500
const VISIBLE_DESKTOP = 3

export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = (props) => {
  const { description, eyebrow, heading, items } = props
  const slides = items || []
  const slideCount = slides.length
  const loopable = slideCount > VISIBLE_DESKTOP

  // Same infinite-loop trick as TrendingBlock: pad with clones of the tail/head
  // so we can navigate through an extended array and silently snap back once
  // we drift into the cloned padding.
  const extendedSlides = loopable
    ? [
        ...slides.slice(slideCount - VISIBLE_DESKTOP),
        ...slides,
        ...slides.slice(0, VISIBLE_DESKTOP),
      ]
    : slides

  const [index, setIndex] = useState(loopable ? VISIBLE_DESKTOP : 0)
  const [withTransition, setWithTransition] = useState(true)

  useEffect(() => {
    if (!loopable) return

    const timer = setInterval(() => {
      setIndex((current) => current + 1)
    }, AUTO_ADVANCE_MS)

    return () => clearInterval(timer)
  }, [loopable])

  const handleTransitionEnd = () => {
    if (!loopable) return

    if (index >= slideCount + VISIBLE_DESKTOP) {
      setWithTransition(false)
      setIndex(index - slideCount)
    } else if (index < VISIBLE_DESKTOP) {
      setWithTransition(false)
      setIndex(index + slideCount)
    }
  }

  useEffect(() => {
    if (withTransition) return
    const raf = requestAnimationFrame(() => setWithTransition(true))
    return () => cancelAnimationFrame(raf)
  }, [withTransition])

  const goNext = () => setIndex((current) => current + 1)
  const goPrev = () => setIndex((current) => current - 1)

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

        {loopable && (
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous"
              onClick={goPrev}
              className="rounded-full border border-brand-line p-2 hover:border-brand-accent hover:text-brand-accent transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={goNext}
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
            onTransitionEnd={handleTransitionEnd}
            className={`flex gap-6 ${withTransition ? 'transition-transform duration-500 ease-out' : ''}`}
            style={{
              transform: `translateX(calc(-${index} * (100% / ${VISIBLE_DESKTOP} + 1.5rem)))`,
            }}
          >
            {extendedSlides.map((item, i) => (
              <TestimonialCard key={i} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

type TestimonialItem = NonNullable<TestimonialsBlockProps['items']>[number]

const TestimonialCard: React.FC<{ item: TestimonialItem }> = ({ item }) => {
  const { quote, name, role } = item

  return (
    <div
      className="flex h-full shrink-0 flex-col rounded-2xl border border-brand-line bg-card p-6 shadow-sm"
      style={{ width: `calc(100% / ${VISIBLE_DESKTOP} - 1rem)` }}
    >
      <p className="mb-4 line-clamp-6 text-sm leading-relaxed text-muted-foreground">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-auto">
        <p className="font-display font-semibold text-brand-ink">{name}</p>
        {role && (
          <p className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">{role}</p>
        )}
      </div>
    </div>
  )
}