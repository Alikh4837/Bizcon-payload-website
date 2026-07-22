import type { FeatureGridBlock as FeatureGridBlockProps } from '@/payload-types'

import Link from 'next/link'
import React from 'react'

import { Media } from '@/components/Media'

export const FeatureGridBlock: React.FC<FeatureGridBlockProps> = (props) => {
  const { eyebrow, heading, items, showNumbers } = props

  return (
    <div className="container">
      {(eyebrow || heading) && (
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
        </div>
      )}

      {items && items.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-brand-line bg-card shadow-sm"
            >
              {item.image && typeof item.image === 'object' && (
                <div className="aspect-[16/10] w-full overflow-hidden">
                  <Media resource={item.image} imgClassName="h-full w-full object-cover" />
                </div>
              )}
              <div className="p-6">
                {showNumbers && (
                  <span className="block font-display text-2xl font-semibold text-brand-accent mb-3">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                )}
                <h3 className="font-display text-lg font-semibold text-brand-ink mb-2">
                  {item.heading}
                </h3>
                {item.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {item.description}
                  </p>
                )}
                {item.link && (
                  <Link
                    href={item.link}
                    className="inline-flex text-sm font-medium text-brand-accent hover:underline"
                  >
                    {item.linkLabel || 'Read More'}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
