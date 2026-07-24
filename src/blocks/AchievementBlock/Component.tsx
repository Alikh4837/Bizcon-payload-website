'use client'

import type { AchievementBlock as AchievementBlockProps } from '@/payload-types'

import { Award, Phone, Rocket, ShieldCheck, Star, Target, TrendingUp } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

const badgeIcons = {
  Award,
  Rocket,
  ShieldCheck,
  Star,
  Target,
  TrendingUp,
} as const

/**
 * Animates a number from 0 up to `value` once the element scrolls into view.
 * Re-usable for both the big stat and the bottom stats row.
 */
const useCountUp = (value: number, durationMs = 1400) => {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasRun = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true
          const start = performance.now()

          const tick = (now: number) => {
            const progress = Math.min((now - start) / durationMs, 1)
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplay(Math.round(eased * value))
            if (progress < 1) {
              requestAnimationFrame(tick)
            }
          }

          requestAnimationFrame(tick)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [value, durationMs])

  return { display, ref }
}

/** Fades + slides an element up once it scrolls into view. */
const useRevealOnScroll = <T extends HTMLElement>() => {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

const Stat: React.FC<{ number?: number | null; suffix?: string | null; label: string; big?: boolean }> = ({
  number,
  suffix,
  label,
  big,
}) => {
  const { display, ref } = useCountUp(number || 0)

  return (
    <div className={cn('text-center', big ? '' : 'flex flex-col items-center gap-2')}>
      {!big && <span className="block h-1.5 w-1.5 rounded-full bg-primary" />}
      <p
        className={cn(
          'font-bold tabular-nums leading-none',
          big ? 'text-6xl md:text-7xl' : 'text-3xl md:text-4xl',
        )}
      >
        {number != null ? (
          <>
            <span ref={ref}>{display}</span>
            {suffix}
          </>
        ) : null}
      </p>
      <p
        className={cn(
          'mt-2 text-muted-foreground',
          big ? 'text-sm md:text-base' : 'text-xs md:text-sm uppercase tracking-wide',
        )}
      >
        {label}
      </p>
    </div>
  )
}

export const AchievementBlockComponent: React.FC<AchievementBlockProps> = (props) => {
  const {
    eyebrow,
    title,
    description,
    cta,
    phoneNumber,
    image,
    imageBackground,
    badgeIcon,
    badgeLabel,
    statNumber,
    statSuffix,
    statLabel,
    stats,
  } = props

  const { ref: sectionRef, visible } = useRevealOnScroll<HTMLDivElement>()
  const { display: bigStatDisplay, ref: bigStatRef } = useCountUp(statNumber || 0)

  const BadgeIcon = badgeIcons[(badgeIcon as keyof typeof badgeIcons) || 'Award']

  const circleBg = imageBackground === 'gray' ? 'bg-gray-100' : 'bg-primary/10'

  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="container">
        <div
          ref={sectionRef}
          className={cn(
            'grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center',
            'transition-all duration-700 ease-out',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          {/* GRAPHIC */}
          <div className="relative mx-auto w-full max-w-md aspect-square">
            {/* soft decorative circle */}
            <div
              className={cn(
                'absolute inset-0 m-auto h-[85%] w-[85%] rounded-full',
                circleBg,
              )}
            />

            {/* illustration */}
            {image && (
              <Media
                resource={image}
                className="absolute inset-0 h-full w-full"
                imgClassName="h-full w-full object-contain"
              />
            )}

            {/* big stat, overlaid on the circle */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-5xl md:text-6xl font-bold leading-none">
                <span ref={bigStatRef}>{bigStatDisplay}</span>
                {statSuffix}
              </p>
              <p className="mt-2 max-w-[10rem] text-center text-sm text-muted-foreground">
                {statLabel}
              </p>
            </div>

            {/* floating badge */}
            {badgeLabel && (
              <div
                className={cn(
                  'absolute -top-2 right-2 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg',
                  'transition-all duration-700 delay-300 ease-out',
                  visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
                )}
              >
                <BadgeIcon className="h-5 w-5 shrink-0" />
                <span className="text-xs font-semibold uppercase leading-tight">
                  {badgeLabel}
                </span>
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div>
            {eyebrow && (
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary mb-4">
                {eyebrow}
              </span>
            )}

            {title && (
              <h2 className="text-4xl md:text-5xl font-bold mb-6">{title}</h2>
            )}

            {description && (
              <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-xl">
                {description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6">
              {cta?.[0]?.link && <CMSLink size="lg" {...cta[0].link} />}

              {phoneNumber && (
                <a
                  href={`tel:${phoneNumber.replace(/[^\d+]/g, '')}`}
                  className="flex items-center gap-2 font-semibold"
                >
                  <Phone className="h-5 w-5 text-primary" />
                  {phoneNumber}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM STATS ROW */}
        {stats && stats.length > 0 && (
          <div
            className={cn(
              'mt-16 md:mt-24 grid gap-10',
              'transition-all duration-700 delay-150 ease-out',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
            )}
            style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0, 1fr))` }}
          >
            {stats.map((stat, i) => (
              <Stat key={i} number={stat.number} suffix={stat.suffix} label={stat.label} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
