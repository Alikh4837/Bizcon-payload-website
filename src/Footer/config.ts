import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'
import { generatePreviewPath } from '../utilities/generatePreviewPath'

export const Footer: GlobalConfig = {
  slug: 'footer',
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
      name: 'description',
      label: 'Tagline / Description',
      type: 'textarea',
      admin: {
        description: 'Short line under the logo, e.g. "Gearing your company through an innovative strategy."',
      },
    },

    {
      name: 'socialLinks',
      label: 'Social Links',
      type: 'array',
      maxRows: 6,
      labels: {
        singular: 'Social Link',
        plural: 'Social Links',
      },
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              label: 'Platform',
              type: 'select',
              required: true,
              admin: { width: '50%' },
              options: [
                { label: 'Facebook', value: 'Facebook' },
                { label: 'Instagram', value: 'Instagram' },
                { label: 'Twitter / X', value: 'Twitter' },
                { label: 'LinkedIn', value: 'Linkedin' },
                { label: 'YouTube', value: 'Youtube' },
                { label: 'GitHub', value: 'Github' },
              ],
            },
            {
              name: 'url',
              label: 'URL',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },

    {
      name: 'columns',
      label: 'Footer Columns',
      type: 'array',
      maxRows: 4,
      labels: {
        singular: 'Column',
        plural: 'Columns',
      },
      admin: {
        initCollapsed: true,
        description: 'e.g. "Company", "Services", "Customer" — up to 4 columns.',
      },
      fields: [
        {
          name: 'heading',
          label: 'Column Heading',
          type: 'text',
          required: true,
        },
        {
          name: 'links',
          label: 'Links',
          type: 'array',
          maxRows: 8,
          labels: {
            singular: 'Link',
            plural: 'Links',
          },
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              type: 'row',
              fields: [
                link({
                  appearances: false,
                  overrides: {
                    admin: { width: '70%' },
                  },
                }),
                {
                  name: 'badge',
                  label: 'Badge (optional)',
                  type: 'text',
                  admin: {
                    width: '30%',
                    description: 'e.g. "HOT". Leave empty to hide.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    {
      name: 'newsletter',
      label: 'Newsletter',
      type: 'group',
      fields: [
        {
          name: 'heading',
          label: 'Heading',
          type: 'text',
          defaultValue: 'Subscribe newsletter',
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          defaultValue: 'Subscribe our newsletter to get the latest news and updates!',
        },
        {
          name: 'placeholder',
          label: 'Input Placeholder',
          type: 'text',
          defaultValue: 'Enter your email',
        },
      ],
    },

    {
      name: 'bottomBar',
      label: 'Bottom Bar',
      type: 'group',
      fields: [
        {
          name: 'copyrightText',
          label: 'Copyright Text',
          type: 'text',
          admin: {
            description: 'e.g. "© 2026 BizCon Global. All rights reserved."',
          },
        },
        {
          name: 'policyLinks',
          label: 'Policy Links',
          type: 'array',
          maxRows: 4,
          labels: {
            singular: 'Link',
            plural: 'Links',
          },
          admin: {
            initCollapsed: true,
          },
          fields: [
            link({
              appearances: false,
            }),
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
