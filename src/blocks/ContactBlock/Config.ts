import type { Block } from 'payload'

export const ContactBlock: Block = {
  slug: 'contactBlock',
  interfaceName: 'ContactBlock',
  labels: {
    plural: 'Contact Blocks',
    singular: 'Contact Block',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small label above the heading, e.g. "GET IN TOUCH"',
      },
      defaultValue: 'Get In Touch',
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: "Let's Start a Conversation",
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'A short paragraph shown under the heading.',
      },
      defaultValue:
        "Have a question about our services or want a quote? Fill out the form and our team will get back to you within one business day.",
    },
    {
      name: 'contactDetails',
      type: 'array',
      admin: {
        description: 'Office address, phone numbers, email, hours, and social links.',
        initCollapsed: true,
      },
      defaultValue: [
        {
          icon: 'mapPin',
          label: 'Visit Us',
          value: '167-A, Block G-1, Johar Town, Lahore',
        },
        {
          icon: 'phone',
          label: 'Call Us',
          value: '+92 345 4054003',
          link: 'tel:+923454054003',
        },
        {
          icon: 'mail',
          label: 'Email Us',
          value: 'info@bizconglobal.com',
          link: 'mailto:info@bizconglobal.com',
        },
        {
          icon: 'clock',
          label: 'Working Hours',
          value: 'Mon – Fri: 9:00 AM – 6:00 PM',
        },
      ],
      fields: [
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'mapPin',
          options: [
            { label: 'Location', value: 'mapPin' },
            { label: 'Phone', value: 'phone' },
            { label: 'Email', value: 'mail' },
            { label: 'Working Hours', value: 'clock' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'Website', value: 'globe' },
          ],
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          admin: {
            description:
              'Optional. Use tel:+92... for phone, mailto:for email, or a full https:// URL for social links.',
          },
        },
      ],
    },
    {
      name: 'mapEmbedUrl',
      type: 'text',
      admin: {
        description:
          'Optional. Paste a Google Maps "Embed a map" src URL here to show a map under your contact details.',
      },
    },
    {
      name: 'form',
      type: 'relationship',
      admin: {
        description: 'Select the form to display (create/edit forms under the Forms collection).',
      },
      relationTo: 'forms',
      required: true,
    },
  ],
}