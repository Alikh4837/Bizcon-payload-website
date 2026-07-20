'use client'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

const circleBase =
  'flex items-center justify-center w-9 h-9 rounded-full text-sm border border-brand-line text-foreground transition-colors hover:border-brand-ink'

export const Pagination: React.FC<{
  className?: string
  page: number
  totalPages: number
}> = ({ className, page, totalPages }) => {
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1
  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  return (
    <div className={cn('flex items-center gap-2 my-12', className)}>
      {hasExtraPrevPages && (
        <>
          <Link href={`/blog/page/1`} className={circleBase}>
            1
          </Link>
          <span className="px-1 text-muted-foreground">…</span>
        </>
      )}

      {hasPrevPage && (
        <Link href={`/blog/page/${page - 1}`} className={circleBase}>
          {page - 1}
        </Link>
      )}

      <span
        className="flex items-center justify-center w-9 h-9 rounded-full text-sm font-medium text-background"
        style={{ backgroundColor: 'var(--brand-ink)' }}
      >
        {page}
      </span>

      {hasNextPage && (
        <Link href={`/blog/page/${page + 1}`} className={circleBase}>
          {page + 1}
        </Link>
      )}

      {hasExtraNextPages && (
        <>
          <span className="px-1 text-muted-foreground">…</span>
          <Link href={`/blog/page/${totalPages}`} className={circleBase}>
            {totalPages}
          </Link>
        </>
      )}

      {hasNextPage && (
        <Link href={`/blog/page/${page + 1}`} className={circleBase} aria-label="Next page">
          →
        </Link>
      )}
    </div>
  )
}
