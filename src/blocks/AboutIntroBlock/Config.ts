import type { Block } from 'payload'

export const AboutIntroBlock: Block = {
  slug: 'aboutIntroBlock',
  interfaceName: 'AboutIntroBlock',
  labels: {
    plural: 'About Intro Blocks',
    singular: 'About Intro Block',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small label above the heading, e.g. "About company"',
      },
      defaultValue: 'About company',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Powerful agency for corporate business.',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'primaryImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Larger image in the collage.',
            width: '50%',
          },
        },
        {
          name: 'secondaryImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Smaller overlapping image, shown offset over the larger one.',
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      admin: {
        initCollapsed: true,
        description: 'Up to 4 short feature callouts, e.g. "Trusted company", "Award winning".',
      },
      labels: {
        singular: 'Feature',
        plural: 'Features',
      },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional small icon.',
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
      ],
    },
    {
      type: 'collapsible',
      label: 'Bottom CTA line',
      fields: [
        {
          name: 'ctaText',
          type: 'text',
          admin: {
            description: 'e.g. "Let\'s make something great work together."',
          },
        },
        {
          name: 'ctaLinkLabel',
          type: 'text',
          defaultValue: 'Got a project in mind?',
          admin: {
            condition: (_data, siblingData) => Boolean(siblingData?.ctaText),
          },
        },
        {
          name: 'ctaLink',
          type: 'text',
          defaultValue: '/contact',
          admin: {
            condition: (_data, siblingData) => Boolean(siblingData?.ctaText),
          },
        },
      ],
    },
  ],
}
