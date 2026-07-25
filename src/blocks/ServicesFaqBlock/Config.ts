import type { Block } from 'payload'

export const ServicesFaqBlock: Block = {
  slug: 'servicesFaqBlock',
  interfaceName: 'ServicesFaqBlock',

  labels: {
    singular: 'Services FAQ',
    plural: 'Services FAQs',
  },

  fields: [
    {
      name: 'eyebrow',
      label: 'Eyebrow',
      type: 'text',
      defaultValue: 'Frequently Asked Questions',
    },

    {
      name: 'heading',
      label: 'Heading',
      type: 'text',
      required: true,
      defaultValue: 'What we can do for you and company.',
    },

    {
      type: 'row',
      fields: [
        {
          name: 'image',
          label: 'Photo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            width: '50%',
            description: 'Shown in a circle on the left.',
          },
        },
        {
          name: 'badgeIcon',
          label: 'Floating Badge Icon',
          type: 'select',
          defaultValue: 'MessageCircleQuestion',
          admin: {
            width: '50%',
          },
          options: [
            { label: 'Question Bubble', value: 'MessageCircleQuestion' },
            { label: 'Chat', value: 'MessageCircle' },
            { label: 'Help Circle', value: 'HelpCircle' },
            { label: 'Users', value: 'Users' },
          ],
        },
      ],
    },

    {
      name: 'items',
      label: 'FAQ Items',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      labels: {
        singular: 'FAQ Item',
        plural: 'FAQ Items',
      },
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'question',
          label: 'Question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          label: 'Answer',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
