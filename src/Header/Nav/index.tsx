'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const cta = data?.ctaButton

  return (
    <div className="flex items-center gap-6">
      <nav className="hidden md:flex items-center gap-8">
        {navItems.map(({ link }, i) => {
          return (
            <CMSLink
              key={i}
              {...link}
              appearance="link"
              className="text-sm font-medium text-foreground/80 hover:text-brand-accent transition-colors"
            />
          )
        })}
      </nav>

      <Link href="/search" className="hidden md:block">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-4 h-4 text-foreground/60 hover:text-brand-accent transition-colors" />
      </Link>

      {cta?.url && (
        <Link
          href={cta.url}
          className="inline-flex items-center rounded-full bg-brand-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
        >
          {cta.label || 'Get Started'}
        </Link>
      )}
    </div>
  )
}
