import type { Block } from 'payload'

export const WhereWeServeBlock: Block = {
  slug: 'whereWeServeBlock',
  interfaceName: 'WhereWeServeBlock',
  labels: {
    plural: 'Where We Serve Blocks',
    singular: 'Where We Serve Block',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small label above the heading, e.g. "GLOBAL FOOTPRINT"',
      },
      defaultValue: 'Global Footprint',
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Where We Serve',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue:
        'With a growing footprint across the Middle East, Europe and South Asia, BizCon Global brings the same depth of accounting, tax and advisory expertise to every market we operate in.',
    },
    {
      name: 'stats',
      type: 'array',
      admin: {
        initCollapsed: true,
        description: 'Small counters shown above the map, e.g. "3 / Countries Served".',
      },
      labels: {
        singular: 'Stat',
        plural: 'Stats',
      },
      defaultValue: [
        { value: '3', label: 'Countries Served' },
        { value: '8+', label: 'Service Lines' },
        { value: '24/7', label: 'Client Support' },
      ],
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'regions',
      type: 'array',
      admin: {
        initCollapsed: true,
        description: 'One entry per country/region served.',
      },
      labels: {
        singular: 'Region',
        plural: 'Regions',
      },
      minRows: 1,
      defaultValue: [
        {
          country: 'Pakistan',
          flag: '🇵🇰',
          city: 'Lahore',
          description:
            'Our home base — full-service accounting, taxation, ERP/IT, HRM and legal advisory for local and multinational clients.',
        },
        {
          country: 'Saudi Arabia',
          flag: '🇸🇦',
          city: 'Riyadh',
          description:
            'Supporting Vision 2030-aligned businesses with taxation, audit, assurance and startup incubation services.',
        },
        {
          country: 'Ireland',
          flag: '🇮🇪',
          city: 'Dublin',
          description:
            'Advisory, IFRS and cross-border tax support for companies expanding into the European market.',
        },
      ],
      fields: [
        {
          name: 'country',
          type: 'text',
          required: true,
        },
        {
          name: 'flag',
          type: 'text',
          admin: {
            description: 'Paste a flag emoji (e.g. 🇵🇰) — used as a lightweight visual marker.',
          },
        },
        {
          name: 'city',
          type: 'text',
          admin: {
            description: 'City or region within the country, e.g. "Lahore"',
          },
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'link',
          type: 'text',
          admin: {
            description: 'Optional. Link to a country-specific page.',
          },
        },
      ],
    },
  ],
}