'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export const BackLink: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={`inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand-accent transition-colors ${className || ''}`}
    >
      <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
      Back
    </button>
  )
}
