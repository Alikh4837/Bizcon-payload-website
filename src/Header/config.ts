import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'
import { generatePreviewPath } from '../utilities/generatePreviewPath'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  admin: {
    livePreview: {
      url: ({ req }) =>
        generatePreviewPath({
          slug: '/',
          collection: 'pages',
          req,
        }),
    },
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      admin: {
        initCollapsed: true,
        description: 'These links appear left-to-right in the site header, on every page. Drag to reorder.',
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}