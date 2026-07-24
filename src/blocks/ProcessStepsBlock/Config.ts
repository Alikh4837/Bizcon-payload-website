import type { Block } from 'payload'

import { linkGroup } from '../../fields/linkGroup'

export const ProcessStepsBlock: Block = {
  slug: 'processStepsBlock',
  interfaceName: 'ProcessStepsBlock',

  labels: {
    singular: 'Process Steps',
    plural: 'Process Steps',
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
      name: 'image',
      label: 'Illustration',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    {
      name: 'steps',
      label: 'Steps',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      labels: {
        singular: 'Step',
        plural: 'Steps',
      },
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'title',
          label: 'Step Title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Step Description',
          type: 'textarea',
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'footerBadge',
          label: 'Footer Badge Text',
          type: 'text',
          admin: { width: '25%' },
        },
        {
          name: 'footerText',
          label: 'Footer Text',
          type: 'text',
          admin: {
            width: '40%',
            description:
              'Optional strip below the steps, e.g. "HURRAY — Let\'s make something great work together."',
          },
        },
      ],
    },

    linkGroup({
      overrides: {
        name: 'cta',
        maxRows: 1,
        admin: {
          initCollapsed: true,
          description: 'e.g. "Got a project in mind?"',
        },
      },
    }),
  ],
}