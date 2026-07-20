import React from 'react'

export const Icon: React.FC = () => {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--theme-elevation-800)',
        color: '#fff',
        fontWeight: 700,
        fontSize: 14,
      }}
    >
      BC
    </div>
  )
}