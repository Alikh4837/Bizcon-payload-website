import type { ServicesStatsHeroBlock as ServicesStatsHeroBlockProps } from '@/payload-types'

import { Award, Rocket, ShieldCheck, Star, Trophy } from 'lucide-react'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

const highlightIcons = {
  Trophy,
  Award,
  Star,
  ShieldCheck,
  Rocket,
} as const

const FiveStars: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex items-center gap-0.5', className)}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
    ))}
  </div>
)

export const ServicesStatsHeroBlockComponent: React.FC<ServicesStatsHeroBlockProps> = (
  props,
) => {
  const {
    eyebrow,
    heading,
    description,
    statCards,
    highlightIcon,
    highlightText,
    reviewCount,
    reviewText,
    cta,
  } = props

  const HighlightIcon = highlightIcons[(highlightIcon as keyof typeof highlightIcons) || 'Trophy']

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="container">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* STAT CARD */}
          <div className="relative">
            {/* decorative dot pattern, tucked behind/left of the card */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-10 top-1/2 hidden h-72 w-72 -translate-y-1/2 opacity-40 md:block"
              style={{
                backgroundImage:
                  'radial-gradient(currentColor 1.5px, transparent 1.5px)',
                backgroundSize: '14px 14px',
                color: 'var(--muted-foreground)',
                maskImage:
                  'radial-gradient(circle at 30% 50%, black 0%, black 55%, transparent 75%)',
                WebkitMaskImage:
                  'radial-gradient(circle at 30% 50%, black 0%, black 55%, transparent 75%)',
              }}
            />

            {statCards && statCards.length > 0 && (
              <div className="relative mx-auto max-w-sm divide-y divide-border overflow-hidden rounded-2xl border bg-card shadow-lg">
                {statCards.map((stat, i) => (
                  <div key={i} className="flex items-center gap-4 px-8 py-6">
                    <div className="flex flex-col items-start">
                      <span className="text-4xl font-bold leading-none">{stat.value}</span>
                      {stat.showStars && <FiveStars className="mt-2" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div>
            {eyebrow && (
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                {eyebrow}
              </span>
            )}

            {heading && <h1 className="mb-6 text-4xl font-bold md:text-5xl">{heading}</h1>}

            {description && (
              <p className="mb-8 max-w-xl text-base text-muted-foreground md:text-lg">
                {description}
              </p>
            )}

            {highlightText && (
              <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-primary px-5 py-3 text-sm font-semibold text-white">
                <HighlightIcon className="h-4 w-4 shrink-0" />
                {highlightText}
              </div>
            )}

            {cta?.[0]?.link && (
              <div className="mb-8">
                <CMSLink size="lg" {...cta[0].link} />
              </div>
            )}

            {(reviewCount || reviewText) && (
              <div className="flex items-center gap-4">
                {reviewCount && (
                  <span className="text-3xl font-bold leading-none">{reviewCount}</span>
                )}

                <div className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-background">
                  <FiveStars className="[&_svg]:fill-background [&_svg]:text-background" />
                </div>

                {reviewText && (
                  <>
                    <span className="h-8 w-px bg-border" />
                    <p className="max-w-[10rem] text-sm text-muted-foreground">{reviewText}</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
