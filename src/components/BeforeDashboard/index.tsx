import React from 'react'

import { SeedButton } from './SeedButton'
import './index.scss'

const BeforeDashboard: React.FC = () => {
  return (
    <div className="bizcon-dashboard">
      <div className="bizcon-dashboard__banner">
        <h4>Welcome to the Bizcon Global content dashboard</h4>
        <p>Every edit below shows a live preview of the real page before you publish.</p>
      </div>
      <div className="bizcon-dashboard__actions">
        <a href="/admin/collections/pages" className="bizcon-dashboard__action">
          Edit Homepage
        </a>
        <a href="/admin/collections/blog/create" className="bizcon-dashboard__action">
          Write a Blog Post
        </a>
        <a href="/" target="_blank" rel="noreferrer" className="bizcon-dashboard__action">
          Preview Live Site
        </a>
      </div>
      <details className="bizcon-dashboard__advanced">
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