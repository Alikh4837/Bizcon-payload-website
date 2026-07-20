import React from 'react'

export const Icon: React.FC = () => {
  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      src="/favicon.png"
      alt="Bizcon Global"
      width={32}
      height={32}
      style={{ borderRadius: 6, objectFit: 'contain' }}
    />
  )
}