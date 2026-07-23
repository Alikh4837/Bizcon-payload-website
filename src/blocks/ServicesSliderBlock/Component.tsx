'use client'

import type { ServicesSliderBlock as ServicesSliderBlockProps } from '@/payload-types'

import { ChevronLeft, ChevronRight, Mail } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

import { Media } from '@/components/Media'

export const ServicesSliderBlock: React.FC<ServicesSliderBlockProps> = (props) => {
  const {
    description,
    eyebrow,
    footerLink,
    footerLinkLabel,
    footerNote,
    heading,
    items,
    showFooterNote,
  } = props

  const cards = items || []
  const trackRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const updateEdges = () => {
    const el = trackRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }

  useEffect(() => {
    updateEdges()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', updateEdges, { passive: true })
    window.addEventListener('resize', updateEdges)
    return () => {
      el.removeEventListener('scroll', updateEdges)
      window.removeEventListener('resize', updateEdges)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length])

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-service-card]')
    const distance = card ? card.offsetWidth + 24 : el.clientWidth * 0.8
    el.scrollBy({ behavior: 'smooth', left: direction * distance })
  }

  return (
    <section className="w-full bg-[#0e1b34]">
      <div className="container py-16 md:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-md">
            {eyebrow && (
              <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                {eyebrow}
              </span>
            )}
            {heading && (
              <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-white">
                {heading}
              </h2>
            )}
          </div>

          <div className="flex flex-1 items-end justify-between gap-8">
            {description && (
              <p className="max-w-md text-sm md:text-base leading-relaxed text-white/60">
                {description}
              </p>
            )}

            {cards.length > 1 && (
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  aria-label="Previous"
                  disabled={atStart}
                  onClick={() => scrollByCard(-1)}
                  className="rounded-full border border-white/15 p-2.5 text-white transition-colors hover:border-brand-accent hover:text-brand-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  disabled={atEnd}
                  onClick={() => scrollByCard(1)}
                  className="rounded-full border border-white/15 p-2.5 text-white transition-colors hover:border-brand-accent hover:text-brand-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {cards.length > 0 && (
          <div
            ref={trackRef}
            className="-mx-1 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {cards.map((item, index) => (
              <ServiceCard key={index} item={item} />
            ))}
          </div>
        )}

        {showFooterNote && footerNote && (
          <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-white/10 pt-8 text-white/70">
            <Mail className="h-5 w-5 shrink-0 text-white/50" />
            <p className="text-sm md:text-base">
              {footerNote}{' '}
              {footerLinkLabel && footerLink && (
                <Link href={footerLink} className="font-medium text-white underline underline-offset-4 hover:text-brand-accent">
                  {footerLinkLabel}
                </Link>
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

type ServiceItem = NonNullable<ServicesSliderBlockProps['items']>[number]

const ServiceCard: React.FC<{ item: ServiceItem }> = ({ item }) => {
  const { badge, image, link, tag, title } = item
  const isExternal = link?.startsWith('http')

  const card = (
    <div
      data-service-card
      className="group relative h-[22rem] w-[78vw] shrink-0 snap-start overflow-hidden rounded-2xl sm:w-[19rem] md:h-[24rem] md:w-[21rem]"
    >
      {image && typeof image === 'object' ? (
        <Media
          resource={image}
          imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="h-full w-full bg-white/10" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {badge && (
        <span className="absolute left-4 top-4 rounded-full bg-brand-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-accent-foreground">
          {badge}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-white">{title}</h3>
        {tag && (
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/60">
            {tag}
          </p>
        )}
      </div>
    </div>
  )

  if (!link) return card

  return isExternal ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className="contents">
      {card}
    </a>
  ) : (
    <Link href={link} className="contents">
      {card}
    </Link>
  )
}
