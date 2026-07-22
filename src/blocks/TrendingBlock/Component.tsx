import type { TrendingBlock as TrendingBlockProps } from '@/payload-types'

import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const TrendingBlock: React.FC<TrendingBlockProps> = (props) => {
  const { description, eyebrow, heading, items } = props

  return (
    <div className="container">
      {(eyebrow || heading || description) && (
        <div className="max-w-2xl mb-10">
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
      )}

      {items && items.length > 0 && (
        <div className="grid gap-x-10 gap-y-1 md:grid-cols-2 md:divide-y-0 divide-y divide-brand-line/70">
          {items.map((item, index) => {
            const number = String(index + 1).padStart(2, '0')
            const isExternal = item.link?.startsWith('http')

            const inner = (
              <>
                <span className="shrink-0 font-display text-xl font-semibold text-brand-accent/70 tabular-nums">
                  {number}
                </span>
                <span className="flex-1 min-w-0">
                  {item.category && (
                    <span className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-accent mb-1">
                      {item.category}
                    </span>
                  )}
                  <span className="block font-display text-base md:text-lg font-medium leading-snug text-brand-ink transition-colors group-hover:text-brand-accent">
                    {item.title}
                  </span>
                </span>
                {item.link && (
                  <ArrowUpRight
                    className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-accent"
                    strokeWidth={1.75}
                  />
                )}
              </>
            )

            const rowClasses = 'group flex items-start gap-4 py-5 md:py-4'

            if (!item.link) {
              return (
                <div key={index} className={rowClasses}>
                  {inner}
                </div>
              )
            }

            return isExternal ? (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={rowClasses}
              >
                {inner}
              </a>
            ) : (
              <Link key={index} href={item.link} className={rowClasses}>
                {inner}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
