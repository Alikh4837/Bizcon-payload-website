import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { CategoryFilter } from './CategoryFilter'

export const BlogSidebar: React.FC<{ activeCategory?: string }> = async ({ activeCategory }) => {
  const payload = await getPayload({ config: configPromise })

  const [categories, tags] = await Promise.all([
    payload.find({
      collection: 'categories',
      limit: 100,
      overrideAccess: false,
      select: { title: true, slug: true },
    }),
    payload.find({
      collection: 'tags',
      limit: 8, // trimmed — a full WP-style tag cloud reads as dated, keep this to a light supplement
      overrideAccess: false,
      select: { title: true, slug: true },
    }),
  ])

  return (
    <aside className="flex flex-col gap-8">
      <div className="rounded-lg border border-brand-line bg-card p-6">
        <h3 className="font-display text-lg font-semibold text-brand-ink mb-3">Search</h3>
        <form action="/search" method="GET">
          <input
            type="text"
            name="q"
            placeholder="Search articles..."
            className="w-full border border-brand-line bg-background text-foreground placeholder:text-muted-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </form>
      </div>

      <div className="rounded-lg border border-brand-line bg-card p-6">
        <h3 className="font-display text-lg font-semibold text-brand-ink mb-3">Topics</h3>
        <CategoryFilter
          categories={categories.docs.map((c) => ({ title: c.title, slug: c.slug || '' }))}
          activeCategory={activeCategory}
        />
      </div>

      {tags.docs.length > 0 && (
        <div className="rounded-lg border border-brand-line bg-card p-6">
          <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
            Related tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.docs.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="text-xs border border-brand-line text-muted-foreground rounded-full px-2.5 py-1 hover:border-brand-ink hover:text-foreground transition-colors"
              >
                {tag.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div
        className="rounded-lg p-6 text-brand-accent-foreground"
        style={{ backgroundColor: 'var(--brand-accent)' }}
      >
        <h3 className="font-display text-lg font-semibold mb-2">Have a question?</h3>
        <p className="text-sm mb-4 opacity-90">
          Talk to an advisor about tax, compliance, or setting up your business in the Gulf.
        </p>
        <Link
          href="/contact-us"
          className="inline-block rounded-md bg-brand-ink text-background text-sm font-medium px-4 py-2 hover:opacity-90 transition-opacity"
        >
          Book a consultation
        </Link>
      </div>
    </aside>
  )
}
