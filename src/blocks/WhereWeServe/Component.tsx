'use client'

import type { WhereWeServeBlock as WhereWeServeBlockProps } from '@/payload-types'

import { ArrowUpRight, MapPin } from 'lucide-react'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Rough lat/lng for common regions, used only to place a decorative pin on the
// map — approximate on purpose, this is a stylized illustration, not a
// navigational map.
const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  australia: { lat: -25, lng: 134 },
  bangladesh: { lat: 24, lng: 90 },
  canada: { lat: 56, lng: -106 },
  china: { lat: 35, lng: 105 },
  egypt: { lat: 26, lng: 30 },
  france: { lat: 47, lng: 2 },
  germany: { lat: 51, lng: 10 },
  india: { lat: 21, lng: 78 },
  ireland: { lat: 53, lng: -8 },
  italy: { lat: 42, lng: 12 },
  japan: { lat: 36, lng: 138 },
  kenya: { lat: 1, lng: 38 },
  malaysia: { lat: 4, lng: 102 },
  pakistan: { lat: 30, lng: 70 },
  qatar: { lat: 25, lng: 51 },
  'saudi arabia': { lat: 24, lng: 45 },
  singapore: { lat: 1, lng: 104 },
  'south africa': { lat: -30, lng: 25 },
  spain: { lat: 40, lng: -4 },
  turkey: { lat: 39, lng: 35 },
  uae: { lat: 24, lng: 54 },
  'united arab emirates': { lat: 24, lng: 54 },
  'united kingdom': { lat: 54, lng: -2 },
  'united states': { lat: 39, lng: -98 },
  usa: { lat: 39, lng: -98 },
}

const toPercent = (lat: number, lng: number) => ({
  left: ((lng + 180) / 360) * 100,
  top: ((90 - lat) / 180) * 100,
})

export const WhereWeServeBlock: React.FC<WhereWeServeBlockProps> = (props) => {
  const { description, eyebrow, heading, regions, stats } = props

  const list = useMemo(() => regions || [], [regions])
  const [activeIndex, setActiveIndex] = useState(0)
  const active = list[activeIndex]

  const pins = useMemo(
    () =>
      list.map((region, index) => {
        const key = region.country?.trim().toLowerCase() || ''
        const coords = COUNTRY_COORDS[key]
        const position = coords
          ? toPercent(coords.lat, coords.lng)
          : // Spread unrecognized countries evenly along the equator so nothing
            // ever fails to render.
            { left: 15 + ((index * 70) % 70), top: 55 }
        return { index, position, region }
      }),
    [list],
  )

  return (
    <div className="container">
      <div className="relative overflow-hidden rounded-3xl border border-brand-line bg-brand-surface p-6 md:p-10 lg:p-14">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Left: stylized world map with pins */}
          <div>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-brand-line bg-card">
              {/* Abstract continent silhouettes — decorative, not geographically precise */}
              <svg
                viewBox="0 0 100 55"
                className="absolute inset-0 h-full w-full text-brand-ink/[0.08]"
                fill="currentColor"
                aria-hidden="true"
              >
                <ellipse cx="20" cy="16" rx="10" ry="7" />
                <ellipse cx="27" cy="30" rx="6" ry="10" />
                <ellipse cx="50" cy="14" rx="8" ry="6" />
                <ellipse cx="53" cy="30" rx="7" ry="11" />
                <ellipse cx="70" cy="18" rx="13" ry="9" />
                <ellipse cx="80" cy="38" rx="7" ry="6" />
                <ellipse cx="86" cy="47" rx="5" ry="3" />
              </svg>

              {/* Pins */}
              {pins.map(({ index, position, region }) => {
                const isActive = index === activeIndex
                return (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Show ${region.country}`}
                    onClick={() => setActiveIndex(index)}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${position.left}%`, top: `${position.top}%` }}
                  >
                    <span
                      className={`relative flex h-4 w-4 items-center justify-center rounded-full border-2 border-card shadow-sm transition-transform ${
                        isActive ? 'scale-125 bg-brand-accent' : 'bg-brand-ink/60 hover:bg-brand-accent'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-accent/50" />
                      )}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-accent" />
                Selected region
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-ink/60" />
                Where we serve
              </span>
            </div>
          </div>

          {/* Right: heading, description, finder */}
          <div>
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

            {stats && stats.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4 border-y border-brand-line py-6">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <p className="font-display text-2xl font-semibold text-brand-ink">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {list.length > 0 && (
              <div className="mt-8">
                <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-brand-ink">
                  Find a Region
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Select
                    value={String(activeIndex)}
                    onValueChange={(value) => setActiveIndex(Number(value))}
                  >
                    <SelectTrigger className="sm:w-64">
                      <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                    <SelectContent>
                      {list.map((region, index) => (
                        <SelectItem key={index} value={String(index)}>
                          {region.flag ? `${region.flag} ` : ''}
                          {region.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {active?.link ? (
                    <Button asChild>
                      <Link href={active.link}>View Region</Link>
                    </Button>
                  ) : (
                    <Button type="button" disabled>
                      View Region
                    </Button>
                  )}
                </div>

                {active && (
                  <div className="mt-5 flex items-start gap-4 rounded-2xl border border-brand-line bg-card p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-line bg-brand-surface text-brand-accent">
                      <MapPin className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold text-brand-ink">
                        {active.flag && <span className="mr-2">{active.flag}</span>}
                        {active.country}
                      </p>
                      {active.city && (
                        <p className="mt-0.5 font-mono text-xs uppercase tracking-wider text-brand-accent">
                          {active.city}
                        </p>
                      )}
                      {active.description && (
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          {active.description}
                        </p>
                      )}
                      {active.link && (
                        <Link
                          href={active.link}
                          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-accent"
                        >
                          Learn more
                          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
