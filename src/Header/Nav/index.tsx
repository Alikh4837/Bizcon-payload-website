'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, SearchIcon, X } from 'lucide-react'

type SearchResult = {
  id: string
  title?: string | null
  slug?: string | null
  meta?: {
    description?: string | null
  } | null
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const cta = data?.ctaButton
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setOpen(false)
    setSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open && !searchOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open, searchOpen])

  useEffect(() => {
    if (!open && !searchOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, searchOpen])

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus()
    } else {
      setQuery('')
      setResults([])
    }
  }, [searchOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setSearching(false)
      return
    }

    const controller = new AbortController()
    setSearching(true)

    const timeout = setTimeout(async () => {
      try {
        const params = new URLSearchParams()
        params.set('where[or][0][title][like]', query)
        params.set('where[or][1][meta.description][like]', query)
        params.set('limit', '6')
        params.set('depth', '0')

        const res = await fetch(`/api/search?${params.toString()}`, {
          signal: controller.signal,
        })
        const data = await res.json()
        setResults(data?.docs || [])
      } catch (err) {
        if ((err as Error).name !== 'AbortError') setResults([])
      } finally {
        setSearching(false)
      }
    }, 300)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [query])

  const goToFullResults = (q: string) => {
    if (!q.trim()) return
    router.push(`/search?q=${encodeURIComponent(q)}`)
    setSearchOpen(false)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    goToFullResults(query)
  }

  return (
    <>
      <div className="flex items-center gap-3 sm:gap-6">
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

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="hidden md:block"
          aria-label="Search"
        >
          <SearchIcon className="w-4 h-4 text-slate-500 cursor-pointer dark:text-white/60 hover:text-brand-accent transition-colors" />
        </button>

        {cta?.url && (
          <Link
            href={cta.url}
            className="hidden sm:inline-flex items-center rounded-full bg-brand-accent px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
          >
            {cta.label || 'Get Started'}
          </Link>
        )}

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

      {mounted &&
        createPortal(
          <div
            id="mobile-nav"
            className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
              open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-black/50"
              onClick={() => setOpen(false)}
            />

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

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    setSearchOpen(true)
                  }}
                  className="mt-2 flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-brand-accent transition-colors"
                >
                  <SearchIcon className="h-4 w-4" />
                  Search
                </button>
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

      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-50 transition-opacity duration-200 ${
              searchOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <button
              type="button"
              aria-label="Close search"
              className="absolute inset-0 bg-black/50"
              onClick={() => setSearchOpen(false)}
            />

            <div
              className={`absolute left-0 right-0 top-0 bg-white dark:bg-[#0E1B34] shadow-2xl transition-transform duration-200 ease-out ${
                searchOpen ? 'translate-y-0' : '-translate-y-full'
              }`}
            >
              <div className="container py-6">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
                  <SearchIcon className="h-5 w-5 shrink-0 text-slate-400 dark:text-white/40" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="flex-1 bg-transparent text-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 outline-none"
                  />
                  <button
                    type="button"
                    aria-label="Close search"
                    onClick={() => setSearchOpen(false)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white hover:border-slate-400 dark:hover:border-white/40"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </form>

                {query.trim() && (
                  <div className="mt-6 max-h-[60vh] overflow-y-auto border-t border-slate-200 dark:border-white/10 pt-4">
                    {results.length > 0 ? (
                      <>
                        <ul className="space-y-1">
                          {results.map((result) => (
                            <li key={result.id}>
                              <Link
                                href={`/blog/${result.slug}`}
                                onClick={() => setSearchOpen(false)}
                                className="block rounded-lg px-3 py-3 hover:bg-slate-100 dark:hover:bg-white/5"
                              >
                                <p className="font-medium text-slate-900 dark:text-white">
                                  {result.title}
                                </p>
                                {result.meta?.description && (
                                  <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-white/50">
                                    {result.meta.description}
                                  </p>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <button
                          type="button"
                          onClick={() => goToFullResults(query)}
                          className="mt-2 w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-brand-accent hover:bg-slate-100 dark:hover:bg-white/5"
                        >
                          View all results for &ldquo;{query}&rdquo;
                        </button>
                      </>
                    ) : searching ? (
                      <p className="py-4 text-sm text-slate-500 dark:text-white/50">Searching…</p>
                    ) : (
                      <p className="py-4 text-sm text-slate-500 dark:text-white/50">
                        No results found.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}