import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const MediumImpactHero: React.FC<Page['hero']> = ({ galleryImages, links, richText }) => {
  const images = (galleryImages || []).slice(0, 4)

  return (
    <div className="container pt-6 pb-16 md:pt-10 md:pb-24">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div className="max-w-xl">
          {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}

          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex flex-wrap gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {images.length > 0 && (
          <div className="relative mx-auto grid h-[26rem] w-full max-w-md grid-cols-2 gap-4 sm:h-[30rem]">
            {images.map((item, index) => {
              const { image } = item
              if (!image || typeof image !== 'object') return null

              // Alternate offsets so the four photos feel like a floating collage
              // rather than a rigid grid.
              const offsetClass = [
                'translate-y-4',
                '-translate-y-2',
                '-translate-y-6',
                'translate-y-2',
              ][index % 4]

              return (
                <div
                  key={index}
                  className={`overflow-hidden rounded-2xl border border-brand-line shadow-lg ${offsetClass} ${
                    index % 2 === 0 ? 'aspect-[3/4]' : 'aspect-square self-end'
                  }`}
                >
                  <Media resource={image} imgClassName="h-full w-full object-cover" />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
