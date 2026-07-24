import type { Block } from 'payload'

export const TrustedBySliderBlock: Block = {
  slug: 'trustedBySliderBlock',
  interfaceName: 'TrustedBySliderBlock',

  labels: {
    singular: 'Trusted By Slider',
    plural: 'Trusted By Sliders',
  },

  fields: [
    {
      name: 'heading',
      label: 'Heading',
      type: 'text',
      required: true,
      defaultValue: "Trusted by the world's fastest growing companies",
    },

    {
      name: 'testimonials',
      label: 'Testimonials',
      type: 'array',
      minRows: 1,
      labels: {
        singular: 'Testimonial',
        plural: 'Testimonials',
      },
      admin: {
        initCollapsed: true,
        description: 'These auto-rotate every few seconds, with arrows for manual navigation.',
      },
      fields: [
        {
          name: 'avatar',
          label: 'Photo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'quote',
          label: 'Quote',
          type: 'textarea',
          required: true,
        },
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          required: true,
        },
        {
          name: 'company',
          label: 'Company Name',
          type: 'text',
          required: true,
          admin: {
            description: 'Shown next to the quote, e.g. "monday". Used as a fallback if no logo is set below.',
          },
        },
        {
          name: 'companyLogo',
          label: 'Company Wordmark/Logo (optional)',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },

    {
      name: 'metrics',
      label: 'Metric Cards',
      type: 'array',
      minRows: 1,
      maxRows: 3,
      labels: {
        singular: 'Metric Card',
        plural: 'Metric Cards',
      },
      admin: {
        initCollapsed: true,
        description: 'The 3 cards below the slider, e.g. logo + "Project management" + "275% Growth".',
      },
      fields: [
        {
          name: 'logo',
          label: 'Logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'description',
          label: 'Description',
          type: 'text',
          required: true,
        },
        {
          name: 'growthText',
          label: 'Growth Text',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g. "275% Growth"',
          },
        },
      ],
    },
  ],
}
