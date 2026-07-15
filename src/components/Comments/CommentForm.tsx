'use client'
import React, { useState } from 'react'

export const CommentForm: React.FC<{ postId: string | number }> = ({ postId }) => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', comment: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post: postId,
          name: form.name,
          email: form.email,
          comment: form.comment,
        }),
      })

      if (!res.ok) throw new Error('Failed to submit')

      setStatus('success')
      setForm({ name: '', email: '', comment: '' })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-sm text-muted-foreground">
        Thanks — your comment has been submitted and is awaiting approval.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
      <input
        type="text"
        placeholder="Name"
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border border-border bg-background text-foreground rounded px-3 py-2 text-sm"
      />
      <input
        type="email"
        placeholder="Email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="border border-border bg-background text-foreground rounded px-3 py-2 text-sm"
      />
      <textarea
        placeholder="Comment"
        required
        rows={4}
        value={form.comment}
        onChange={(e) => setForm({ ...form, comment: e.target.value })}
        className="border border-border bg-background text-foreground rounded px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="bg-foreground text-background rounded px-4 py-2 text-sm w-fit disabled:opacity-50"
      >
        {status === 'submitting' ? 'Submitting...' : 'Post Comment'}
      </button>
      {status === 'error' && (
        <p className="text-sm text-destructive">Something went wrong. Please try again.</p>
      )}
    </form>
  )
}