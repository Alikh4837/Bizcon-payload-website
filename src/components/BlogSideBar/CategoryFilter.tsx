import Link from 'next/link'
import React from 'react'

import { cn } from '@/utilities/ui'
import { getCategoryAccent } from '@/utilities/categoryAccent'

export const CategoryFilter: React.FC<{
  categories: { title: string; slug: string }[]
  activeCategory?: string
}> = ({ categories, activeCategory }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/blog"
        className={cn(
          'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
          !activeCategory
            ? 'border-brand-ink bg-brand-ink text-background'
            : 'border-brand-line text-foreground hover:border-brand-ink',
        )}
      >
        All
      </Link>

      {categories.map((cat) => {
        const isActive = activeCategory === cat.slug
        const accent = getCategoryAccent(cat.slug)

        return (
          <Link
            key={cat.slug}
            href={`/blog?category=${cat.slug}`}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              isActive ? 'text-background' : 'border-brand-line text-foreground hover:border-brand-ink',
            )}
            style={isActive ? { backgroundColor: accent, borderColor: accent } : undefined}
          >
            {cat.title}
          </Link>
        )
      })}
    </div>
  )
}
