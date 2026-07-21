import type { TestimonialsBlock as TestimonialsBlockProps } from '@/payload-types'

import React from 'react'

export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = (props) => {
  const { eyebrow, heading, items } = props

  return (
    <div className="container">
      <div className="mb-10">
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

      {items && items.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div key={index} className="rounded-2xl border border-brand-line bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                &ldquo;{item.quote}&rdquo;
              </p>
              <p className="font-display font-semibold text-brand-ink">{item.name}</p>
              {item.role && (
                <p className="text-xs uppercase tracking-wider text-muted-foreground mt-0.5">
                  {item.role}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
