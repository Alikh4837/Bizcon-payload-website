import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { AboutIntroBlock } from '@/blocks/AboutIntroBlock/Component'
import { MissionVisionBlock } from '@/blocks/MissionVisionBlock/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContactBlock } from '@/blocks/ContactBlock/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { TeamBlock } from '@/blocks/TeamBlock/Component'
import { FeatureGridBlock } from '@/blocks/FeatureGridBlock/Component'
import { ServicesSliderBlock } from '@/blocks/ServicesSliderBlock/Component'
import { TestimonialsBlock } from '@/blocks/TestimonialsBlock/Component'
import { LogoStripBlock } from '@/blocks/LogoStripBlock/Component'
import { TrendingBlock } from '@/blocks/TrendingBlock/Component'
import { WhereWeServeBlock } from '@/blocks/WhereWeServe/Component'
import { SplitContentBlockComponent } from './SplitContentBlock/Component'
import { AchievementBlockComponent } from './AchievementBlock/Component'
import { ProcessStepsBlockComponent } from '@/blocks/ProcessStepsBlock/Component'
import { TrustedBySliderBlockComponent } from '@/blocks/TrustedBySliderBlock/Component'


const blockComponents = {
  aboutIntroBlock: AboutIntroBlock,
  missionVisionBlock: MissionVisionBlock,
  archive: ArchiveBlock,
  contactBlock: ContactBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  teamBlock: TeamBlock,
  featureGridBlock: FeatureGridBlock,
  servicesSliderBlock: ServicesSliderBlock,
  testimonialsBlock: TestimonialsBlock,
  logoStripBlock: LogoStripBlock,
  trendingBlock: TrendingBlock,
  whereWeServeBlock: WhereWeServeBlock,
  splitContentBlock: SplitContentBlockComponent,
  achievementBlock: AchievementBlockComponent,
  processStepsBlock: ProcessStepsBlockComponent,
  trustedBySliderBlock: TrustedBySliderBlockComponent,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
