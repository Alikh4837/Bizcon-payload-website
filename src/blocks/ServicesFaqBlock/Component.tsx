'use client'

import type { ServicesFaqBlock as ServicesFaqBlockProps } from '@/payload-types'

import { ChevronDown, HelpCircle, MessageCircle, MessageCircleQuestion, Users } from 'lucide-react'
import React, { useState } from 'react'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

const badgeIcons = {
  MessageCircleQuestion,
  MessageCircle,
  HelpCircle,
  Users,
} as const

/** A small flat decorative cloud shape (purely visual, no data behind it). */
const Cloud: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className,
  style,
}) => (
  <svg
    viewBox="0 0 64 32"
    className={className}
    style={style}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 24C11.373 24 6 19.075 6 13S11.373 2 18 2c3.06 0 5.85 1.06 7.98 2.82C27.67 2.11 30.66.5 34 .5c5.8 0 10.6 4.42 11.4 10.1C50.7 11.4 55 15.86 55 21.3 55 27.2 50.4 32 44.7 32H18z"
      fill="currentColor"
    />
  </svg>
)

export const ServicesFaqBlockComponent: React.FC<ServicesFaqBlockProps> = (props) => {
  const { eyebrow, heading, image, badgeIcon, items } = props

  const [openIndex, setOpenIndex] = useState<number>(0)

  const BadgeIcon =
    badgeIcons[(badgeIcon as keyof typeof badgeIcons) || 'MessageCircleQuestion']

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* PHOTO */}
          <div className="relative mx-auto w-full max-w-sm aspect-square">
            {/* soft decorative circle */}
            <div className="absolute inset-0 m-auto h-[85%] w-[85%] rounded-full bg-gradient-to-br from-primary/15 to-orange-500/10" />

            {image && (
              <Media
                resource={image}
                className="absolute inset-0 m-auto h-[85%] w-[85%] overflow-hidden rounded-full"
                imgClassName="h-full w-full object-cover"
              />
            )}

            {/* decorative clouds */}
            <Cloud className="absolute left-0 top-[18%] h-8 w-14 text-slate-200/80 animate-float" />
            <Cloud
              className="absolute right-2 top-[30%] h-6 w-11 text-slate-200/70 animate-float"
              style={{ animationDelay: '1s' }}
            />

            {/* floating badge */}
            <div className="absolute bottom-2 left-0 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <BadgeIcon className="h-8 w-8" />
            </div>
          </div>

          {/* CONTENT */}
          <div>
            {eyebrow && (
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                {eyebrow}
              </span>
            )}

            {heading && <h2 className="mb-8 text-4xl font-bold md:text-5xl">{heading}</h2>}

            {items && items.length > 0 && (
              <div className="divide-y divide-border">
                {items.map((item, i) => {
                  const isOpen = openIndex === i

                  return (
                    <div key={i} className="py-5">
                      <button
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? -1 : i)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-4 text-left"
                      >
                        <span className="font-semibold">{item.question}</span>
                        <ChevronDown
                          className={cn(
                            'h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300',
                            isOpen && 'rotate-180',
                          )}
                        />
                      </button>

                      <div
                        className={cn(
                          'grid transition-all duration-300 ease-out',
                          isOpen
                            ? 'grid-rows-[1fr] opacity-100 mt-3'
                            : 'grid-rows-[0fr] opacity-0',
                        )}
                      >
                        <div className="overflow-hidden">
                          <p className="max-w-md text-sm text-muted-foreground">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
