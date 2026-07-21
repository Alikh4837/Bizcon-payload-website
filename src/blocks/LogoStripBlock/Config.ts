import type { Block } from 'payload'

export const LogoStripBlock: Block = {
  slug: 'logoStripBlock',
  interfaceName: 'LogoStripBlock',
  labels: {
    plural: 'Logo Strip Blocks',
    singular: 'Logo Strip Block',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'We work with the best brands',
    },
    {
      name: 'logos',
      type: 'array',
      admin: {
        initCollapsed: true,
        description: 'Placeholder logos for now — swap in real partner/client logos when available.',
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          admin: {
            description: 'Optional. Full URL to the partner/brand site.',
          },
        },
      ],
      labels: {
        singular: 'Logo',
        plural: 'Logos',
      },
    },
  ],
}