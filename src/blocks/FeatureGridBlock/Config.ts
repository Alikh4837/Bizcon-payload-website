import type { Block } from 'payload'

export const FeatureGridBlock: Block = {
  slug: 'featureGridBlock',
  interfaceName: 'FeatureGridBlock',
  labels: {
    plural: 'Feature Grid Blocks',
    singular: 'Feature Grid Block',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small label above the heading, e.g. "what we do"',
      },
    },
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'showNumbers',
      type: 'checkbox',
      admin: {
        description: 'Show 01 / 02 / 03 style numbers instead of no numbering (e.g. for a "Why us" list).',
      },
      defaultValue: false,
    },
    {
      name: 'items',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional. Shown above the heading if provided.',
          },
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'link',
          type: 'text',
          admin: {
            description: 'Optional. Relative (/services/x) or full URL.',
          },
        },
        {
          name: 'linkLabel',
          type: 'text',
          admin: {
            condition: (_data, siblingData) => Boolean(siblingData?.link),
          },
          defaultValue: 'Read More',
        },
      ],
      labels: {
        singular: 'Item',
        plural: 'Items',
      },
    },
  ],
}