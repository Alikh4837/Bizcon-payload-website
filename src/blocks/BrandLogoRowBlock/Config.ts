import type { Block } from 'payload'

export const BrandLogoRowBlock: Block = {
  slug: 'brandLogoRowBlock',
  interfaceName: 'BrandLogoRowBlock',

  labels: {
    singular: 'Brand Logo Row',
    plural: 'Brand Logo Rows',
  },

  fields: [
    {
      name: 'logos',
      label: 'Logos',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      labels: {
        singular: 'Logo',
        plural: 'Logos',
      },
      admin: {
        initCollapsed: true,
        description:
          'Shown full-color, evenly spaced across the row — no heading, no card borders. Meant to sit directly under the Trusted By Slider block.',
      },
      fields: [
        {
          name: 'logo',
          label: 'Logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'link',
          label: 'Link (optional)',
          type: 'text',
          admin: {
            description: 'Optional. Full URL to the brand/client site.',
          },
        },
      ],
    },
  ],
}