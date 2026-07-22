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
          'Trending news, insights and articles. Numbered automatically in the order listed below.',
      },
      labels: {
        singular: 'Item',
        plural: 'Items',
      },
      defaultValue: [
        {
          title:
            'How Does Political Instability In The Middle East Affect Global Oil Markets And Economics?',
          link: '/how-does-political-instability-in-the-middle-east-affect-global-oil-markets-and-economics',
        },
        {
          title: 'Can Machines Turn Evil? AI Safety Summit Seeks Answers',
          link: '/can-machines-turn-evil-ai-safety-summit-seeks-answers',
        },
        {
          title: 'Should We Fear Hackers? Is Your Company Data Really Safe?',
          link: '/should-we-fear-hackers-is-your-company-data-really-safe',
        },
        {
          title: 'How To Register Trademark Internationally',
          link: '/how-to-register-trademark-internationally',
        },
        {
          title: 'How To Register Trademark In The US',
          link: '/how-to-register-trademark-in-us',
        },
        {
          title: 'How To Register Trademark In Ireland',
          link: '/how-to-register-trademark-in-ireland',
        },
        {
          title: 'How To Register Trademark In Dubai',
          link: '/how-to-register-trademark-in-dubai',
        },
        {
          title: 'How To Write An Agreement',
          link: '/how-to-write-an-agreement',
        },
        {
          title: "Is Your Wallet Feeling The Squeeze? Inflation's Unexpected Return",
          link: '/is-your-wallet-feeling-the-squeeze-inflations-unexpected-return',
        },
        {
          title: 'Is Samsung Making America A Chip Powerhouse Again?',
          link: '/is-samsung-making-america-a-chip-powerhouse-again',
        },
      ],
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'category',
          type: 'text',
          admin: {
            description: 'Optional short tag, e.g. "Tax" or "Global Markets"',
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