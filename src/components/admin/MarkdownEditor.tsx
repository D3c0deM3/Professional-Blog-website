'use client'

import RichTextEditor from '@/components/admin/RichTextEditor'

interface MarkdownEditorProps {
  label?: string
  value: string
  onChange: (value: string) => void
  rows?: number
}

export default function MarkdownEditor({ label, value, onChange, rows = 8 }: MarkdownEditorProps) {
  return (
    <RichTextEditor
      label={label}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder="Write with formatting tools..."
    />
  )
}
