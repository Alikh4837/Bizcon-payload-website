import type { Block } from 'payload'

export const TestimonialsBlock: Block = {
  slug: 'testimonialsBlock',
  interfaceName: 'TestimonialsBlock',
  labels: {
    plural: 'Testimonials Blocks',
    singular: 'Testimonials Block',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'testimonials',
    },
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'items',
      type: 'array',
      admin: {
        initCollapsed: true,
        description: 'Placeholder testimonials for now — swap in real client quotes when available.',
      },
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
        },
      ],
      labels: {
        singular: 'Testimonial',
        plural: 'Testimonials',
      },
    },
  ],
}