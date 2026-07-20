import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { SeedButton } from './SeedButton'
import './index.scss'

const baseClass = 'before-dashboard'

const quickLinks = [
  { href: '/admin/collections/pages', label: 'Pages', desc: 'Edit Home, About, Services, Contact and every other page on bizconglobal.com.' },
  { href: '/admin/collections/blog', label: 'Blog', desc: 'Write and publish blog posts. Changes preview live before you publish.' },
  { href: '/admin/globals/header', label: 'Header / Navigation', desc: 'Control the menu links shown at the top of every page.' },
  { href: '/admin/globals/footer', label: 'Footer', desc: 'Control the links and info shown at the bottom of every page.' },
  { href: '/admin/collections/media', label: 'Media', desc: 'Upload and manage images used across the site.' },
]

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to the Bizcon Global content dashboard</h4>
      </Banner>
      <p>Pick where you want to make changes. Every edit shows a live preview of the real page before you publish.</p>
      <div className={`${baseClass}__grid`}>
        {quickLinks.map((item) => (
          <a key={item.href} href={item.href} className={`${baseClass}__card`}>
            <strong>{item.label}</strong>
            <span>{item.desc}</span>
          </a>
        ))}
      </div>
      <details className={`${baseClass}__advanced`}>
        <summary>Advanced: seed demo content</summary>
        <p>
          <SeedButton />
          {' — only use this on a fresh/test site. It overwrites content with sample data.'}
        </p>
      </details>
    </div>
  )
}

export default BeforeDashboard