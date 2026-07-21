import type { Block } from 'payload'

export const TeamBlock: Block = {
  slug: 'teamBlock',
  interfaceName: 'TeamBlock',
  labels: {
    plural: 'Team Blocks',
    singular: 'Team Block',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small label above the heading, e.g. "MEET THE TEAM"',
      },
      defaultValue: 'Meet The Team',
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Our Proud Team',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'A short paragraph shown under the heading.',
      },
    },
    {
      name: 'members',
      type: 'array',
      admin: {
        description: 'Add one entry per team member. Group determines which section they appear in.',
        initCollapsed: true,
      },
      labels: {
        singular: 'Team Member',
        plural: 'Team Members',
      },
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
          admin: {
            description: 'e.g. "Partner" or "Manager"',
          },
          required: true,
        },
        {
          name: 'group',
          type: 'select',
          defaultValue: 'partners',
          options: [
            { label: 'Partners', value: 'partners' },
            { label: 'Managers', value: 'managers' },
          ],
          required: true,
        },
        {
          name: 'credentials',
          type: 'textarea',
          admin: {
            description: 'Qualifications / experience line shown under the role.',
          },
        },
        {
          name: 'linkedin',
          type: 'text',
          admin: {
            description: 'Optional. Full LinkedIn profile URL.',
          },
        },
      ],
    },
  ],
}