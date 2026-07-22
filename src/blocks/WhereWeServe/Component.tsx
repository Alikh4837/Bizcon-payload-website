import type { WhereWeServeBlock as WhereWeServeBlockProps } from '@/payload-types'

import { ArrowUpRight, Globe, MapPin } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const WhereWeServeBlock: React.FC<WhereWeServeBlockProps> = (props) => {
  const { description, eyebrow, heading, regions, stats } = props

  return (
    <div className="container">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-10">
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

      {/* Stats */}
      {stats && stats.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="font-display text-3xl md:text-4xl font-semibold text-brand-ink">
                {stat.value}
              </p>
              <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Map / regions panel */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-line bg-brand-surface px-6 py-14 md:px-12 md:py-16">
        {/* Decorative backdrop */}
        <Globe
          className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 text-brand-accent/[0.06]"
          strokeWidth={0.6}
        />

        {regions && regions.length > 0 && (
          <div className="relative">
            {/* Decorative connecting line (desktop only) */}
            {regions.length > 1 && (
              <div className="hidden lg:block absolute left-[12%] right-[12%] top-[26px] border-t border-dashed border-brand-accent/30" />
            )}

            <div
              className="relative grid gap-10 sm:grid-cols-2"
              style={{
                gridTemplateColumns:
                  regions.length >= 3 ? 'repeat(3, minmax(0, 1fr))' : undefined,
              }}
            >
              {regions.map((region, index) => {
                const { city, country, description: regionDescription, flag, link } = region

                const card = (
                  <>
                    <span className="relative mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-brand-line bg-card text-brand-accent shadow-sm">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-accent/20" />
                      <MapPin className="relative h-5 w-5" strokeWidth={1.75} />
                    </span>

                    <div className="text-center">
                      <p className="font-display text-lg font-semibold text-brand-ink">
                        {flag && <span className="mr-2">{flag}</span>}
                        {country}
                      </p>
                      {city && (
                        <p className="mt-0.5 font-mono text-xs uppercase tracking-wider text-brand-accent">
                          {city}
                        </p>
                      )}
                      {regionDescription && (
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                          {regionDescription}
                        </p>
                      )}
                      {link && (
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-accent">
                          Learn more
                          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </span>
                      )}
                    </div>
                  </>
                )

                const cardClasses =
                  'rounded-2xl border border-brand-line bg-card/80 backdrop-blur-sm p-6 shadow-sm transition-transform hover:-translate-y-1'

                return link ? (
                  <Link key={index} href={link} className={cardClasses}>
                    {card}
                  </Link>
                ) : (
                  <div key={index} className={cardClasses}>
                    {card}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
