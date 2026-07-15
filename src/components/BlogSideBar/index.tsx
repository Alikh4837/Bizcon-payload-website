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
      limit: 100,
      overrideAccess: false,
      select: { title: true, slug: true },
    }),
  ])

  return (
    <aside className="bg-card text-card-foreground border border-border rounded-md p-6 h-fit">
      <div className="mb-8">
        <h3 className="font-bold text-lg mb-3 text-foreground">Search</h3>
        <form action="/search" method="GET">
          <input
            type="text"
            name="q"
            placeholder="Search..."
            className="w-full border border-border bg-background text-foreground placeholder:text-muted-foreground rounded px-3 py-2 text-sm"
          />
        </form>
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-lg mb-3 text-foreground">Categories</h3>
        <CategoryFilter
          categories={categories.docs.map((c) => ({ title: c.title, slug: c.slug || '' }))}
          activeCategory={activeCategory}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-3 text-foreground">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.docs.length === 0 && (
            <p className="text-sm text-muted-foreground">No tags yet</p>
          )}
          {tags.docs.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.slug}`}
              className="text-sm border border-border text-foreground rounded px-3 py-1 hover:bg-accent"
            >
              {tag.title}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}