'use client'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

const circleBase =
  'flex items-center justify-center w-9 h-9 rounded-full text-sm border border-gray-200 transition-colors'

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
          <Link href={`/posts/page/1`} className={circleBase}>
            1
          </Link>
          <span className="px-1">…</span>
        </>
      )}

      {hasPrevPage && (
        <Link href={`/posts/page/${page - 1}`} className={circleBase}>
          {page - 1}
        </Link>
      )}

      <span className={cn(circleBase, 'bg-black text-white border-black')}>{page}</span>

      {hasNextPage && (
        <Link href={`/posts/page/${page + 1}`} className={circleBase}>
          {page + 1}
        </Link>
      )}

      {hasExtraNextPages && (
        <>
          <span className="px-1">…</span>
          <Link href={`/posts/page/${totalPages}`} className={circleBase}>
            {totalPages}
          </Link>
        </>
      )}

      {hasNextPage && (
        <Link href={`/posts/page/${page + 1}`} className={circleBase} aria-label="Next page">
          →
        </Link>
      )}
    </div>
  )
}