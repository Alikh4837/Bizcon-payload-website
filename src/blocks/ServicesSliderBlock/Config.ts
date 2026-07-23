import type { Block } from 'payload'

export const ServicesSliderBlock: Block = {
  slug: 'servicesSliderBlock',
  interfaceName: 'ServicesSliderBlock',
  labels: {
    plural: 'Services Slider Blocks',
    singular: 'Services Slider Block',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small pill label above the heading, e.g. "CREATIVE APPROACH".',
      },
      defaultValue: 'Creative Approach',
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Our Services',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Short paragraph shown to the right of the heading.',
      },
    },
    {
      name: 'items',
      type: 'array',
      admin: {
        initCollapsed: true,
        description:
          'Service cards. This slider does not auto-play — visitors move it with the prev/next buttons.',
      },
      labels: {
        singular: 'Service',
        plural: 'Services',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Card background image.',
          },
        },
        {
          name: 'badge',
          type: 'text',
          admin: {
            description: 'Short one-word tag shown as a pill on the image, e.g. "TRUSTED" or "EXPERT".',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'tag',
          type: 'text',
          admin: {
            description: 'Small uppercase line under the title, e.g. "COMPETITORS RESEARCH".',
          },
        },
        {
          name: 'link',
          type: 'text',
          admin: {
            description: 'Optional. Relative (/services/x) or full URL.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Footer Note',
      fields: [
        {
          name: 'showFooterNote',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'footerNote',
          type: 'text',
          defaultValue: 'Save your precious time and effort spent for finding a solution.',
          admin: {
            condition: (_data, siblingData) => Boolean(siblingData?.showFooterNote),
          },
        },
        {
          name: 'footerLinkLabel',
          type: 'text',
          defaultValue: 'Contact us now',
          admin: {
            condition: (_data, siblingData) => Boolean(siblingData?.showFooterNote),
          },
        },
        {
          name: 'footerLink',
          type: 'text',
          defaultValue: '/contact',
          admin: {
            condition: (_data, siblingData) => Boolean(siblingData?.showFooterNote),
          },
        },
      ],
    },
  ],
}
