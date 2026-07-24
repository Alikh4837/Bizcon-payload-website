'use client'

import type { ProcessStepsBlock as ProcessStepsBlockProps } from '@/payload-types'

import React, { useEffect, useRef, useState } from 'react'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

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

export const ProcessStepsBlockComponent: React.FC<ProcessStepsBlockProps> = (props) => {
  const { eyebrow, title, image, steps, footerBadge, footerText, cta } = props

  const { ref: sectionRef, visible } = useRevealOnScroll<HTMLDivElement>()

  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="container">
        <div
          ref={sectionRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center"
        >
          {/* LEFT: eyebrow, title, numbered steps */}
          <div
            className={cn(
              'transition-all duration-700 ease-out',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
            )}
          >
            {eyebrow && (
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary mb-4">
                {eyebrow}
              </span>
            )}

            {title && <h2 className="text-4xl md:text-5xl font-bold mb-10">{title}</h2>}

            <div className="flex flex-col">
              {(steps || []).map((step, i) => {
                const isLast = i === (steps?.length || 0) - 1

                return (
                  <div
                    key={i}
                    className={cn(
                      'flex gap-6 transition-all duration-700 ease-out',
                      visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6',
                    )}
                    style={{ transitionDelay: visible ? `${i * 150}ms` : '0ms' }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      {!isLast && <div className="w-px flex-1 bg-border" />}
                    </div>

                    <div className={cn(!isLast && 'pb-8')}>
                      <h3 className="font-bold mb-1">{step.title}</h3>
                      {step.description && (
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT: illustration on a soft circular backdrop */}
          <div
            className={cn(
              'relative mx-auto w-full max-w-md aspect-square',
              'transition-all duration-700 delay-150 ease-out',
              visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            )}
          >
            <div className="absolute inset-0 m-auto h-[80%] w-[80%] rounded-full bg-primary/10" />
            {image && (
              <Media
                resource={image}
                className="absolute inset-0 h-full w-full"
                imgClassName="h-full w-full object-contain"
              />
            )}
          </div>
        </div>

        {/* FOOTER STRIP */}
        {(footerBadge || footerText || cta?.[0]?.link) && (
          <div
            className={cn(
              'mt-16 flex flex-wrap items-center justify-center gap-3',
              'transition-all duration-700 delay-300 ease-out',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
            )}
          >
            {footerBadge && (
              <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase text-primary-foreground">
                {footerBadge}
              </span>
            )}
            {footerText && <span className="text-muted-foreground">{footerText}</span>}
            {cta?.[0]?.link && (
              <CMSLink {...cta[0].link} appearance="inline" className="font-semibold underline" />
            )}
          </div>
        )}
      </div>
    </section>
  )
}
