import type { Block } from 'payload'

import { linkGroup } from '../../fields/linkGroup'

export const ServicesStatsHeroBlock: Block = {
  slug: 'servicesStatsHeroBlock',
  interfaceName: 'ServicesStatsHeroBlock',

  labels: {
    singular: 'Services Stats Hero',
    plural: 'Services Stats Heroes',
  },

  fields: [
    {
      name: 'eyebrow',
      label: 'Eyebrow',
      type: 'text',
      defaultValue: 'Creative Approach',
    },

    {
      name: 'heading',
      label: 'Heading',
      type: 'text',
      required: true,
      defaultValue: 'Reach your business goals in record time.',
    },

    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
    },

    {
      name: 'statCards',
      label: 'Stat Card (left, stacked)',
      type: 'array',
      minRows: 1,
      maxRows: 3,
      labels: {
        singular: 'Stat',
        plural: 'Stats',
      },
      admin: {
        initCollapsed: true,
        description: 'Up to 3 rows shown in the stacked card on the left.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              label: 'Value',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
                description: 'e.g. "99%" or "4.9"',
              },
            },
            {
              name: 'showStars',
              label: 'Show 5-star rating under value',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'label',
          label: 'Label',
          type: 'textarea',
          required: true,
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'highlightIcon',
          label: 'Highlight Badge Icon',
          type: 'select',
          defaultValue: 'Trophy',
          admin: {
            width: '50%',
          },
          options: [
            { label: 'Trophy', value: 'Trophy' },
            { label: 'Award', value: 'Award' },
            { label: 'Star', value: 'Star' },
            { label: 'Shield Check', value: 'ShieldCheck' },
            { label: 'Rocket', value: 'Rocket' },
          ],
        },
        {
          name: 'highlightText',
          label: 'Highlight Badge Text',
          type: 'text',
          defaultValue: 'Best corporate services agency in world.',
          admin: {
            width: '50%',
            description: 'Shown in the gradient pill. Leave empty to hide it.',
          },
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'reviewCount',
          label: 'Review Count',
          type: 'text',
          admin: {
            width: '30%',
            description: 'e.g. "722+"',
          },
        },
        {
          name: 'reviewText',
          label: 'Review Text',
          type: 'textarea',
          admin: {
            width: '70%',
            description: 'e.g. "5 star reviews from our satisfied customers." Leave empty to hide this row.',
          },
        },
      ],
    },

    linkGroup({
      appearances: ['default'],
      overrides: {
        name: 'cta',
        maxRows: 1,
        admin: {
          initCollapsed: true,
          description: 'Optional CTA button, not shown in the reference but available if needed.',
        },
      },
    }),
  ],
}
