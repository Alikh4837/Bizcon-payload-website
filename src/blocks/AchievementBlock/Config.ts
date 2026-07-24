import type { Block } from 'payload'

import { linkGroup } from '../../fields/linkGroup'

export const AchievementBlock: Block = {
  slug: 'achievementBlock',
  interfaceName: 'AchievementBlock',

  labels: {
    singular: 'Achievement / Stats',
    plural: 'Achievement / Stats',
  },

  fields: [
    {
      name: 'eyebrow',
      label: 'Eyebrow',
      type: 'text',
    },

    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },

    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
    },

    linkGroup({
      appearances: ['default'],
      overrides: {
        name: 'cta',
        maxRows: 1,
        admin: {
          initCollapsed: true,
        },
      },
    }),

    {
      name: 'phoneNumber',
      label: 'Phone Number (optional)',
      type: 'text',
      admin: {
        description: 'Shown next to the CTA button, e.g. 1 800 222 000',
      },
    },

    {
      type: 'row',
      fields: [
        {
          name: 'image',
          label: 'Graphic / Image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            width: '50%',
            description: 'A transparent PNG works best for the illustration look.',
          },
        },
        {
          name: 'imageBackground',
          label: 'Circle Background',
          type: 'select',
          defaultValue: 'primary',
          admin: {
            width: '50%',
          },
          options: [
            { label: 'Primary tint', value: 'primary' },
            { label: 'Light Gray', value: 'gray' },
          ],
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'badgeIcon',
          label: 'Floating Badge Icon',
          type: 'select',
          defaultValue: 'Award',
          admin: {
            width: '50%',
          },
          options: [
            { label: 'Award', value: 'Award' },
            { label: 'Star', value: 'Star' },
            { label: 'Target', value: 'Target' },
            { label: 'Rocket', value: 'Rocket' },
            { label: 'Trending Up', value: 'TrendingUp' },
            { label: 'Shield Check', value: 'ShieldCheck' },
          ],
        },
        {
          name: 'badgeLabel',
          label: 'Floating Badge Text',
          type: 'text',
          admin: {
            width: '50%',
            description: 'e.g. "Creative Vision" — leave empty to hide the badge.',
          },
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'statNumber',
          label: 'Big Stat Number',
          type: 'number',
          required: true,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'statSuffix',
          label: 'Suffix',
          type: 'text',
          defaultValue: '+',
          admin: {
            width: '33%',
          },
        },
        {
          name: 'statLabel',
          label: 'Big Stat Label',
          type: 'text',
          required: true,
          admin: {
            width: '34%',
          },
        },
      ],
    },

    {
      name: 'stats',
      label: 'Bottom Stats Row',
      type: 'array',
      minRows: 0,
      maxRows: 6,
      labels: {
        singular: 'Stat',
        plural: 'Stats',
      },
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'number',
              label: 'Number',
              type: 'number',
              required: true,
              admin: { width: '34%' },
            },
            {
              name: 'suffix',
              label: 'Suffix',
              type: 'text',
              admin: { width: '33%' },
            },
            {
              name: 'label',
              label: 'Label',
              type: 'text',
              required: true,
              admin: { width: '33%' },
            },
          ],
        },
      ],
    },
  ],
}
