import { getCachedGlobal } from '@/utilities/getGlobals'
import { Facebook, Github, Instagram, Linkedin, Send, Twitter, Youtube } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

const socialIcons = {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Github,
} as const

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const { description, socialLinks, columns, newsletter, bottomBar } = footerData || {}

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-8">
          {/* BRAND */}
          <div className="lg:col-span-1">
            <Link className="flex items-center" href="/">
              <Logo />
            </Link>

            {description && (
              <p className="mt-4 max-w-[16rem] text-sm text-white/60">{description}</p>
            )}

            {socialLinks && socialLinks.length > 0 && (
              <div className="mt-5 flex items-center gap-3">
                {socialLinks.map((item, i) => {
                  const Icon = socialIcons[(item.platform as keyof typeof socialIcons) || 'Facebook']

                  return (
                    <a
                      key={i}
                      href={item.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.platform || 'Social link'}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* LINK COLUMNS */}
          {columns &&
            columns.length > 0 &&
            columns.map((column, i) => (
              <div key={i}>
                {column.heading && (
                  <p className="mb-4 text-sm font-semibold text-white">{column.heading}</p>
                )}

                {column.links && column.links.length > 0 && (
                  <ul className="flex flex-col gap-3">
                    {column.links.map((item, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <CMSLink className="text-sm text-white/60 hover:text-white" {...item.link} />
                        {item.badge && (
                          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-black">
                            {item.badge}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

          {/* NEWSLETTER */}
          <div className="lg:col-span-1">
            {newsletter?.heading && (
              <p className="mb-4 text-sm font-semibold text-white">{newsletter.heading}</p>
            )}

            {newsletter?.description && (
              <p className="mb-4 text-sm text-white/60">{newsletter.description}</p>
            )}

            <form className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1.5 pl-4">
              <input
                type="email"
                required
                placeholder={newsletter?.placeholder || 'Enter your email'}
                className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center gap-4 py-6 text-sm text-white/50 md:flex-row md:justify-between">
          {bottomBar?.copyrightText && <p>{bottomBar.copyrightText}</p>}

          {bottomBar?.policyLinks && bottomBar.policyLinks.length > 0 && (
            <nav className="flex flex-wrap items-center gap-6">
              {bottomBar.policyLinks.map(({ link }, i) => (
                <CMSLink className="text-white/50 hover:text-white" key={i} {...link} />
              ))}
            </nav>
          )}

          <ThemeSelector />
        </div>
      </div>
    </footer>
  )
}
