import type { Block } from 'payload'

export const TrendingBlock: Block = {
  slug: 'trendingBlock',
  interfaceName: 'TrendingBlock',
  labels: {
    plural: 'Trending Blocks',
    singular: 'Trending Block',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small label above the heading, e.g. "STAY INFORMED"',
      },
      defaultValue: 'Stay Informed',
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Trending',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional short paragraph shown under the heading.',
      },
    },
    {
      name: 'items',
      type: 'array',
      admin: {
        initCollapsed: true,
        description:
          'Trending news, insights and articles. Displayed as an auto-sliding card carousel.',
      },
      labels: {
        singular: 'Item',
        plural: 'Items',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Card thumbnail image.',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'excerpt',
          type: 'textarea',
          admin: {
            description: 'Short 1-2 line teaser shown under the title.',
          },
        },
        {
          name: 'category',
          type: 'text',
          admin: {
            description: 'Optional short tag, e.g. "Tax" or "Global Markets" — shown as a badge on the image.',
          },
        },
        {
          name: 'date',
          type: 'date',
          admin: {
            description: 'Optional publish date shown on the card.',
          },
        },
        {
          name: 'link',
          type: 'text',
          admin: {
            description: 'Relative (/blog/x) or full URL to the article.',
          },
        },
      ],
    },
  ],
}