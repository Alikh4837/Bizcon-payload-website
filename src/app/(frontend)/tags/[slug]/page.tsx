import type { Metadata } from 'next/types'
import { notFound } from 'next/navigation'
import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { BlogSidebar } from '@/components/BlogSideBar'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const revalidate = 600

type Args = {
  params: Promise<{ slug: string }>
}

export default async function TagPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const tagDoc = await payload.find({
    collection: 'tags',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const tag = tagDoc.docs[0]
  if (!tag) notFound()

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    where: { tags: { in: [tag.id] } },
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className="pt-16 pb-24">
      <div className="container mb-8">
        <h1 className="text-2xl font-bold">Tag: {tag.title}</h1>
      </div>
      <div className="container grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">
        <div>
          <CollectionArchive posts={posts.docs} />
          {posts.docs.length === 0 && (
            <p className="text-muted-foreground">No posts found with this tag.</p>
          )}
          {posts.totalPages > 1 && posts.page && (
            <Pagination page={posts.page} totalPages={posts.totalPages} />
          )}
        </div>
        <BlogSidebar />
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const tags = await payload.find({
    collection: 'tags',
    limit: 1000,
    pagination: false,
    select: { slug: true },
  })

  return tags.docs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  return {
    title: `Tag: ${slug} - BizCon Global`,
  }
}