'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface MarkdownEditorProps {
  label?: string
  value: string
  onChange: (value: string) => void
  rows?: number
}

export default function MarkdownEditor({ label, value, onChange, rows = 8 }: MarkdownEditorProps) {
  return (
    <div className="space-y-3">
      {label && <Label>{label}</Label>}
      <Tabs defaultValue="write" className="w-full">
        <TabsList>
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="write">
          <Textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={rows}
            placeholder="Write in Markdown..."
          />
        </TabsContent>
        <TabsContent value="preview">
          <div className="markdown rounded-md border border-border bg-background p-4 text-sm text-muted-foreground">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value || 'Nothing to preview.'}</ReactMarkdown>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
