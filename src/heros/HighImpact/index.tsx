'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

const AUTO_ADVANCE_MS = 5000

export const HighImpactHero: React.FC<Page['hero']> = ({ galleryImages, links }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const [activeIndex, setActiveIndex] = useState(0)

  const slides = (galleryImages || []).filter(
    (item) => item.image && typeof item.image === 'object',
  )
  const activeSlide = slides[activeIndex]

  useEffect(() => {
    setHeaderTheme('dark')
  })

  useEffect(() => {
    if (slides.length <= 1) return

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, AUTO_ADVANCE_MS)

    return () => clearInterval(timer)
  }, [slides.length])

  const goTo = (index: number) => {
    setActiveIndex(((index % slides.length) + slides.length) % slides.length)
  }

  return (
    <div
      className="relative -mt-16 min-h-[80vh] flex items-center justify-center text-white overflow-hidden"
      data-theme="dark"
    >
      <div className="container mb-8 z-10 relative flex items-center justify-center">
        <div className="max-w-[36.5rem] text-center">
          {activeSlide?.heading && (
            <h1 className="mb-4 text-4xl md:text-5xl font-display font-semibold leading-tight">
              {activeSlide.heading}
            </h1>
          )}
          {activeSlide?.description && (
            <p className="mb-6 text-base md:text-lg text-white/85">{activeSlide.description}</p>
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex justify-center gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="w-full select-none absolute inset-0 -z-10 bg-brand-ink">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Media fill imgClassName="object-contain" priority={index === 0} resource={slide.image} />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => goTo(activeIndex - 1)}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => goTo(activeIndex + 1)}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goTo(index)}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex ? 'w-6 bg-white' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
