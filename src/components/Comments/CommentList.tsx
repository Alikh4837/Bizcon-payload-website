import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { formatDateTime } from 'src/utilities/formatDateTime'

export const CommentList: React.FC<{ postId: string | number }> = async ({ postId }) => {
  const payload = await getPayload({ config: configPromise })

  const comments = await payload.find({
    collection: 'comments',
    overrideAccess: false,
    where: { post: { equals: postId } },
    sort: '-createdAt',
    limit: 50,
  })

  if (comments.docs.length === 0) {
    return <p className="text-sm text-muted-foreground">No comments yet.</p>
  }

  return (
    <div className="flex flex-col gap-6">
      {comments.docs.map((comment) => (
        <div key={comment.id} className="border-b border-border pb-4">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-semibold text-sm">{comment.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDateTime(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm">{comment.comment}</p>
        </div>
      ))}
    </div>
  )
}