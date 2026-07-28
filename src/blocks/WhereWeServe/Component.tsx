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

import { WORLD_MAP_CENTROIDS, WORLD_MAP_PATHS, WORLD_MAP_VIEWBOX } from './worldMapData'

// A handful of common abbreviations editors might type into the "country"
// field — normalized the same way as the map data's own alias entries.
const COUNTRY_ALIASES: Record<string, string> = {
  uae: 'united arab emirates',
  uk: 'united kingdom',
  usa: 'united states',
}

const normalizeCountry = (value?: string | null) => {
  const key = (value || '').trim().toLowerCase()
  return COUNTRY_ALIASES[key] || key
}

export const WhereWeServeBlock: React.FC<WhereWeServeBlockProps> = (props) => {
  const { description, eyebrow, heading, regions, stats } = props

  const list = useMemo(() => regions || [], [regions])
  const [activeIndex, setActiveIndex] = useState(0)
  const active = list[activeIndex]

  const servedKeys = useMemo(
    () => new Set(list.map((region) => normalizeCountry(region.country))),
    [list],
  )

  // Pins — one per served region, placed at that country's real centroid in
  // the map's own coordinate space. Falls back to spreading unmatched
  // countries (e.g. a typo, or a micro-region not in the atlas) evenly along
  // the equator so nothing ever fails to render.
  const pins = useMemo(
    () =>
      list.map((region, index) => {
        const key = normalizeCountry(region.country)
        const centroid = WORLD_MAP_CENTROIDS[key]
        const point = centroid || { cx: 200 + ((index * 300) % 1600), cy: 430 }
        return { index, point, region }
      }),
    [list],
  )

  return (
    <div className="container">
      <div className="relative overflow-hidden rounded-3xl border border-brand-line bg-brand-surface p-6 md:p-10 lg:p-14">
        <div className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-16">
          {/* Left: real-geography world map, served countries highlighted + pinned */}
          <div>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-brand-line bg-card">
              <svg
                viewBox={WORLD_MAP_VIEWBOX}
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                {WORLD_MAP_PATHS.map((path, index) => {
                  const isServed = servedKeys.has(normalizeCountry(path.country))
                  return (
                    <path
                      key={index}
                      d={path.d}
                      className={
                        isServed
                          ? 'fill-brand-accent/60 stroke-brand-accent/80 transition-colors'
                          : 'fill-brand-ink/[0.08] stroke-brand-ink/10 transition-colors dark:fill-white/[0.08] dark:stroke-white/10'
                      }
                      strokeWidth={1}
                    />
                  )
                })}

                {/* Pins, drawn in the same coordinate space so they land exactly
                    on the country they represent. */}
                {pins.map(({ index, point, region }) => {
                  const isActive = index === activeIndex
                  return (
                    <g
                      key={index}
                      role="button"
                      tabIndex={0}
                      aria-label={`Show ${region.country}`}
                      onClick={() => setActiveIndex(index)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setActiveIndex(index)
                      }}
                      className="cursor-pointer outline-none"
                    >
                      {isActive && (
                        <circle
                          cx={point.cx}
                          cy={point.cy}
                          r={14}
                          className="fill-brand-accent/40"
                          style={{ transformOrigin: `${point.cx}px ${point.cy}px` }}
                        >
                          <animate
                            attributeName="r"
                            values="8;20;8"
                            dur="1.8s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.5;0;0.5"
                            dur="1.8s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                      <circle
                        cx={point.cx}
                        cy={point.cy}
                        r={isActive ? 10 : 8}
                        className={
                          isActive
                            ? 'fill-brand-accent stroke-card transition-all'
                            : 'fill-brand-ink/70 stroke-card transition-all hover:fill-brand-accent dark:fill-white/70'
                        }
                        strokeWidth={3}
                      />
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-accent" />
                Selected region
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-ink/60 dark:bg-white/60" />
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