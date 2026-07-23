import type { Block } from 'payload'

export const MissionVisionBlock: Block = {
  slug: 'missionVisionBlock',
  interfaceName: 'MissionVisionBlock',
  labels: {
    plural: 'Mission/Vision Blocks',
    singular: 'Mission/Vision Block',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Fallback image shown beside the text. Overridden per-slide if a slide has its own image.',
      },
    },
    {
      name: 'slides',
      type: 'array',
      minRows: 1,
      admin: {
        initCollapsed: true,
        description:
          'One slide per entry, e.g. "Company mission", "Company vision", "Company value". Visitors step through them with prev/next arrows.',
      },
      labels: {
        singular: 'Slide',
        plural: 'Slides',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g. "Company mission"',
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
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional. Overrides the block-level fallback image for this slide only.',
          },
        },
      ],
    },
  ],
}
