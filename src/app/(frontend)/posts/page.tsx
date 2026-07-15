import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { BlogSidebar } from '@/components/BlogSidebar'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className="pt-16 pb-24">
      <PageClient />
      <div className="container grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">
        <div>
          <CollectionArchive posts={posts.docs} />
          {posts.totalPages > 1 && posts.page && (
            <Pagination page={posts.page} totalPages={posts.totalPages} />
          )}
        </div>
        <BlogSidebar />
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Blog - BizCon Global`,
  }
}