'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { looksLikeHtml, sanitizeRichHtml } from '@/lib/rich-text'

interface RichContentProps {
  content?: string | null
  className?: string
  fallback?: string
}

export default function RichContent({
  content,
  className,
  fallback = '',
}: RichContentProps) {
  const value = content || fallback

  if (!value) {
    return null
  }

  if (looksLikeHtml(value)) {
    return (
      <div
        className={cn('markdown', className)}
        dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(value) }}
      />
    )
  }

  return (
    <div className={cn('markdown', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
    </div>
  )
}
