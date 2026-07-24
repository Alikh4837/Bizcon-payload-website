import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  OrderedListFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const SplitContentBlock: Block = {
  slug: 'splitContentBlock',
  interfaceName: 'SplitContentBlock',

  labels: {
    singular: 'Split Content',
    plural: 'Split Content',
  },

  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'eyebrow',
          label: 'Eyebrow',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'imagePosition',
          label: 'Image Position',
          type: 'select',
          defaultValue: 'right',
          admin: {
            width: '50%',
          },
          options: [
            {
              label: 'Image Left',
              value: 'left',
            },
            {
              label: 'Image Right',
              value: 'right',
            },
          ],
        },
      ],
    },

    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },

    {
      name: 'richText',
      label: false,
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({
              enabledHeadingSizes: ['h2', 'h3', 'h4'],
            }),
            UnorderedListFeature(),
            OrderedListFeature(),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
    },

    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    {
      type: 'row',
      fields: [
        {
          name: 'rounded',
          label: 'Rounded Image',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            width: '50%',
          },
        },

        {
          name: 'background',
          label: 'Background',
          type: 'select',
          defaultValue: 'white',
          admin: {
            width: '50%',
          },
          options: [
            {
              label: 'White',
              value: 'white',
            },
            {
              label: 'Light Gray',
              value: 'gray',
            },
          ],
        },
      ],
    },

    {
      name: 'padding',
      label: 'Section Padding',
      type: 'select',
      defaultValue: 'large',
      options: [
        {
          label: 'Small',
          value: 'small',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'Large',
          value: 'large',
        },
      ],
    },
  ],
}