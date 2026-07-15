'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

export const CategoryFilter: React.FC<{
  categories: { title: string; slug: string }[]
  activeCategory?: string
}> = ({ categories, activeCategory }) => {
  const router = useRouter()

  return (
    <select
      className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-500"
      value={activeCategory || ''}
      onChange={(e) => {
        const value = e.target.value
        router.push(value ? `/posts?category=${value}` : '/posts')
      }}
    >
      <option value="">Select Category</option>
      {categories.map((cat) => (
        <option key={cat.slug} value={cat.slug}>
          {cat.title}
        </option>
      ))}
    </select>
  )
}