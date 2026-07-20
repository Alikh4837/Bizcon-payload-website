import type { CollectionConfig, CollectionAfterChangeHook } from 'payload'
import { revalidatePath } from 'next/cache'

import { authenticated } from '../access/authenticated'
import { anyone } from '../access/anyone'
import type { Blog } from '../payload-types'

const revalidateComment: CollectionAfterChangeHook = async ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate && doc.status === 'approved') {
    try {
      const post = await payload.findByID({
        id: typeof doc.post === 'object' ? doc.post.id : doc.post,
        collection: 'blog',
      })

      if (post?.slug) {
        revalidatePath(`/blog/${post.slug}`)
      }
    } catch {
      // swallow error
    }
  }

  return doc
}

export const Comments: CollectionConfig = {
  slug: 'comments',
  access: {
    create: anyone,
    delete: authenticated,
    read: ({ req }) => {
      if (req.user) return true
      return {
        status: {
          equals: 'approved',
        },
      }
    },
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'post', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'blog',
      required: true,
      index: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Not displayed publicly',
      },
    },
    {
      name: 'comment',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Spam', value: 'spam' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateComment],
  },
}