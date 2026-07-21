import type { TeamBlock as TeamBlockProps } from '@/payload-types'

import { Linkedin } from 'lucide-react'
import React from 'react'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type MemberType = NonNullable<TeamBlockProps['members']>[number]

const groupLabels: Record<string, string> = {
  partners: 'Partners',
  managers: 'Managers',
}

export const TeamBlock: React.FC<TeamBlockProps> = (props) => {
  const { description, eyebrow, heading, members } = props

  const groups = ['partners', 'managers'].map((group) => ({
    group,
    label: groupLabels[group],
    members: (members || []).filter((member) => member.group === group),
  }))

  return (
    <div className="container">
      <div className="max-w-2xl mb-12">
        {eyebrow && (
          <span className="mb-3 inline-block font-mono text-xs font-semibold uppercase tracking-wider text-brand-accent">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-brand-ink mb-4">
          {heading}
        </h2>
        {description && (
          <p className="text-muted-foreground text-base leading-relaxed">{description}</p>
        )}
      </div>

      {groups.map(({ group, label, members: groupMembers }) => {
        if (groupMembers.length === 0) return null

        return (
          <div key={group} className="mb-14 last:mb-0">
            <h3 className="font-display text-xl font-semibold text-brand-ink mb-6">{label}</h3>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {groupMembers.map((member, index) => (
                <TeamMemberCard key={index} member={member} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const TeamMemberCard: React.FC<{ member: MemberType }> = ({ member }) => {
  const { credentials, linkedin, name, photo, role } = member

  return (
    <div className="rounded-2xl border border-brand-line bg-card p-6 shadow-sm">
      <div className="mb-4 h-20 w-20 overflow-hidden rounded-full bg-muted">
        {photo && typeof photo === 'object' && (
          <Media
            resource={photo}
            imgClassName={cn('h-full w-full object-cover')}
          />
        )}
      </div>

      <p className="font-display text-lg font-semibold text-brand-ink">{name}</p>
      <p className="text-sm font-medium text-brand-accent mb-2">{role}</p>

      {credentials && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{credentials}</p>
      )}

      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-brand-accent"
        >
          <Linkedin className="h-4 w-4" strokeWidth={1.75} />
          LinkedIn
        </a>
      )}
    </div>
  )
}
