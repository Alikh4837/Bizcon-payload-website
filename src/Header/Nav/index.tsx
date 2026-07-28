'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, SearchIcon, X } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const cta = data?.ctaButton
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // The header uses backdrop-blur, which creates a new containing block for
  // `position: fixed` descendants in modern browsers. That means a fixed-position
  // drawer nested inside the header positions itself against the header's own
  // (short) box instead of the viewport. Portalling to <body> sidesteps that.
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close the drawer on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map(({ link }, i) => (
            <CMSLink
              key={i}
              {...link}
              appearance="link"
              className="text-sm font-medium text-slate-700 dark:text-white/80 hover:text-brand-accent transition-colors"
            />
          ))}
        </nav>

        <Link href="/search" className="hidden md:block" aria-label="Search">
          <SearchIcon className="w-4 h-4 text-slate-500 dark:text-white/60 hover:text-brand-accent transition-colors" />
        </Link>

        {cta?.url && (
          <Link
            href={cta.url}
            className="hidden sm:inline-flex items-center rounded-full bg-brand-accent px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
          >
            {cta.label || 'Get Started'}
          </Link>
        )}

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white hover:border-slate-400 dark:hover:border-white/40 transition-colors"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer — portalled to <body> so `fixed` is viewport-relative,
          not relative to the backdrop-blur header above (see note at top). */}
      {mounted &&
        createPortal(
          <div
            id="mobile-nav"
            className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
              open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-black/50"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <div
              className={`absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-white dark:bg-[#0E1B34] shadow-2xl transition-transform duration-300 ease-out ${
                open ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 px-5 py-4">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/50">
                  Menu
                </span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white hover:border-slate-400 dark:hover:border-white/40"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
                {navItems.map(({ link }, i) => (
                  <CMSLink
                    key={i}
                    {...link}
                    appearance="link"
                    className="rounded-lg px-4 py-3 text-base font-medium text-slate-800 dark:text-white/90 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-brand-accent transition-colors"
                  />
                ))}

                <Link
                  href="/search"
                  className="mt-2 flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-brand-accent transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <SearchIcon className="h-4 w-4" />
                  Search
                </Link>
              </nav>

              {cta?.url && (
                <div className="border-t border-slate-200 dark:border-white/10 p-5">
                  <Link
                    href={cta.url}
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center justify-center rounded-full bg-brand-accent px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
                  >
                    {cta.label || 'Get Started'}
                  </Link>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}