'use client'

import type { TrustedBySliderBlock as TrustedBySliderBlockProps } from '@/payload-types'

import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { Media } from '@/components/Media'

const AUTOPLAY_MS = 5000

/** Subtle dotted backdrop standing in for the "world map" behind the slider. */
const DotMapBackdrop: React.FC = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 -z-10 opacity-60"
    style={{
      backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
      backgroundSize: '14px 14px',
      color: 'var(--muted-foreground)',
      maskImage:
        'radial-gradient(ellipse 60% 70% at 50% 50%, black 40%, transparent 80%)',
      WebkitMaskImage:
        'radial-gradient(ellipse 60% 70% at 50% 50%, black 40%, transparent 80%)',
    }}
  />
)

export const TrustedBySliderBlockComponent: React.FC<TrustedBySliderBlockProps> = (props) => {
  const { heading, testimonials, metrics } = props

  const count = testimonials?.length || 0
  const [active, setActive] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (count > 1) {
      timerRef.current = setInterval(() => {
        setActive((prev) => (prev + 1) % count)
      }, AUTOPLAY_MS)
    }
  }

  useEffect(() => {
    resetTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  const goTo = (index: number) => {
    setActive(((index % count) + count) % count)
    resetTimer()
  }

  const current = testimonials?.[active]

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        {heading && (
          <h2 className="mx-auto mb-16 max-w-2xl text-center text-3xl md:text-4xl font-bold leading-tight">
            {heading}
          </h2>
        )}

        {/* SLIDER */}
        {current && (
          <div className="relative mx-auto max-w-3xl">
            <DotMapBackdrop />

            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Previous testimonial"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-10 flex h-10 w-10 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-muted transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Next testimonial"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-10 flex h-10 w-10 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-muted transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div
              key={active}
              className="animate-fade-in flex flex-col items-center gap-8 text-center md:flex-row md:items-center md:text-left"
            >
              {/* AVATAR + QUOTE BUBBLE */}
              <div className="relative mx-auto h-40 w-40 shrink-0 md:mx-0">
                <div className="h-full w-full overflow-hidden rounded-full bg-muted">
                  {current.avatar && (
                    <Media
                      resource={current.avatar}
                      imgClassName="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="absolute -bottom-2 -left-2 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <Quote className="h-5 w-5 fill-current" />
                </div>
              </div>

              {/* QUOTE CONTENT */}
              <div>
                <div className="mb-3 flex justify-center md:justify-start">
                  {current.companyLogo ? (
                    <Media
                      resource={current.companyLogo}
                      imgClassName="h-6 w-auto object-contain"
                    />
                  ) : (
                    <span className="text-lg font-bold">{current.company}</span>
                  )}
                </div>

                <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                  &ldquo;{current.quote}&rdquo;
                </p>

                <p className="mt-4 text-sm font-semibold uppercase tracking-wide">
                  {current.name}
                  {current.company && `, ${current.company}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* METRIC CARDS */}
        {metrics && metrics.length > 0 && (
          <div
            className="mt-16 grid gap-6"
            style={{ gridTemplateColumns: `repeat(${Math.min(metrics.length, 3)}, minmax(0, 1fr))` }}
          >
            {metrics.map((metric, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-4 rounded-2xl border bg-card px-6 py-8 text-center"
              >
                {metric.logo && (
                  <Media resource={metric.logo} imgClassName="h-7 w-auto object-contain" />
                )}
                <p className="text-sm text-muted-foreground">{metric.description}</p>
                <p className="text-sm font-semibold text-primary">{metric.growthText}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
