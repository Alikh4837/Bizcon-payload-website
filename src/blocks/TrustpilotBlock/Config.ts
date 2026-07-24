import type { Block } from 'payload'

export const TrustpilotBlock: Block = {
  slug: 'trustpilotBlock',
  interfaceName: 'TrustpilotBlock',

  labels: {
    singular: 'Review Badge (Trustpilot)',
    plural: 'Review Badges',
  },

  fields: [
    {
      name: 'platformLogo',
      label: 'Platform Logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description:
          'Upload the official Trustpilot logo file from your own Trustpilot business account/brand kit — do not use a logo pulled from elsewhere.',
      },
    },
    {
      name: 'heading',
      label: 'Heading',
      type: 'text',
      required: true,
      defaultValue: 'Rated Excellent by our customers',
    },
    {
      name: 'rating',
      label: 'Rating',
      type: 'number',
      required: true,
      min: 0,
      max: 5,
      defaultValue: 4.8,
      admin: {
        description: 'Out of 5. Use your real, current Trustpilot score.',
        step: 0.1,
      },
    },
    {
      name: 'reviewCount',
      label: 'Review Count Text',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "Based on 1,240 reviews". Use your real, current count.',
      },
    },
    {
      name: 'link',
      label: 'Link to Trustpilot Profile',
      type: 'text',
      admin: {
        description: 'Optional. Sends visitors to your actual Trustpilot profile page.',
      },
    },
  ],
}
