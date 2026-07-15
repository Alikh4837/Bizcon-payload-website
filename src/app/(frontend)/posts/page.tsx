import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { BlogSidebar } from '@/components/BlogSideBar'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const revalidate = 600

type Args = {
  searchParams: Promise<{ category?: string }>
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { category } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  let categoryId: string | number | undefined

  if (category) {
    const categoryDoc = await payload.find({
      collection: 'categories',
      where: { slug: { equals: category } },
      limit: 1,
    })
    categoryId = categoryDoc.docs[0]?.id
  }

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    where: categoryId ? { categories: { in: [categoryId] } } : undefined,
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
          {posts.docs.length === 0 && (
            <p className="text-muted-foreground">No posts found in this category.</p>
          )}
          {posts.totalPages > 1 && posts.page && (
            <Pagination page={posts.page} totalPages={posts.totalPages} />
          )}
        </div>
        <BlogSidebar activeCategory={category} />
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Blog - BizCon Global`,
  }
}