'use client'

import { useEffect, useMemo } from 'react'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import { FontFamily, FontSize, TextStyle } from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Highlighter,
  Italic,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  Redo2,
  Strikethrough,
  Table2,
  Underline as UnderlineIcon,
  Undo2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface RichTextEditorProps {
  label?: string
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
  id?: string
  required?: boolean
  className?: string
}

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px']
const FONT_FAMILIES = [
  { label: 'Default', value: '' },
  { label: 'Serif', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Sans', value: 'Arial, "Helvetica Neue", sans-serif' },
  { label: 'Mono', value: '"Courier New", Courier, monospace' },
  { label: 'Modern', value: '"Trebuchet MS", Verdana, sans-serif' },
]

function toPlainText(value: string) {
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  rows = 8,
  placeholder = 'Write and format content...',
  id,
  required,
  className,
}: RichTextEditorProps) {
  const minHeight = useMemo(() => {
    return Math.max(180, rows * 24)
  }, [rows])

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Color,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      FontFamily,
      FontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder }),
    ],
    content: value || '<p></p>',
    editorProps: {
      attributes: {
        class:
          'ProseMirror min-h-[180px] rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        style: `min-height:${minHeight}px`,
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if ((value || '<p></p>') !== current) {
      editor.commands.setContent(value || '<p></p>', { emitUpdate: false })
    }
  }, [editor, value])

  if (!editor) {
    return (
      <div className={cn('space-y-3', className)}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="h-56 animate-pulse rounded-lg border border-border bg-secondary/40" />
      </div>
    )
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Enter URL', previousUrl || 'https://')

    if (url === null) return
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const currentFontSize = (editor.getAttributes('textStyle').fontSize as string) || '16px'
  const currentFontFamily = (editor.getAttributes('textStyle').fontFamily as string) || ''

  return (
    <div className={cn('space-y-3', className)}>
      {label && <Label htmlFor={id}>{label}</Label>}

      {required && (
        <input
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          value={toPlainText(value)}
          readOnly
          required
        />
      )}

      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <div className="flex flex-wrap items-center gap-1 border-b border-border bg-secondary/35 p-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()} title="Undo">
            <Undo2 className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()} title="Redo">
            <Redo2 className="h-3.5 w-3.5" />
          </Button>

          <div className="mx-1 h-5 w-px bg-border" />

          <select
            className="h-8 rounded-md border border-border bg-background px-2 text-xs"
            value={editor.isActive('heading', { level: 1 }) ? 'h1' : editor.isActive('heading', { level: 2 }) ? 'h2' : 'p'}
            onChange={(event) => {
              const value = event.target.value
              if (value === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run()
              else if (value === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run()
              else editor.chain().focus().setParagraph().run()
            }}
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
          </select>

          <select
            className="h-8 rounded-md border border-border bg-background px-2 text-xs"
            value={currentFontSize}
            onChange={(event) => editor.chain().focus().setFontSize(event.target.value).run()}
          >
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <select
            className="h-8 rounded-md border border-border bg-background px-2 text-xs"
            value={currentFontFamily}
            onChange={(event) => {
              const family = event.target.value
              if (!family) {
                editor.chain().focus().unsetFontFamily().run()
                return
              }
              editor.chain().focus().setFontFamily(family).run()
            }}
            title="Font family"
          >
            {FONT_FAMILIES.map((family) => (
              <option key={family.label} value={family.value}>
                {family.label}
              </option>
            ))}
          </select>

          <label className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-background px-2 text-xs">
            Color
            <input
              type="color"
              className="h-5 w-5 cursor-pointer border-none bg-transparent p-0"
              value={(editor.getAttributes('textStyle').color as string) || '#111827'}
              onChange={(event) => editor.chain().focus().setColor(event.target.value).run()}
            />
          </label>

          <label className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-background px-2 text-xs">
            Highlight
            <input
              type="color"
              className="h-5 w-5 cursor-pointer border-none bg-transparent p-0"
              value={(editor.getAttributes('highlight').color as string) || '#fff59d'}
              onChange={(event) => editor.chain().focus().toggleHighlight({ color: event.target.value }).run()}
            />
          </label>

          <div className="mx-1 h-5 w-px bg-border" />

          <Button type="button" variant={editor.isActive('bold') ? 'secondary' : 'ghost'} size="sm" onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
            <Bold className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" variant={editor.isActive('italic') ? 'secondary' : 'ghost'} size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
            <Italic className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" variant={editor.isActive('underline') ? 'secondary' : 'ghost'} size="sm" onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
            <UnderlineIcon className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" variant={editor.isActive('strike') ? 'secondary' : 'ghost'} size="sm" onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
            <Strikethrough className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" variant={editor.isActive('highlight') ? 'secondary' : 'ghost'} size="sm" onClick={() => editor.chain().focus().toggleHighlight().run()} title="Highlight">
            <Highlighter className="h-3.5 w-3.5" />
          </Button>

          <div className="mx-1 h-5 w-px bg-border" />

          <Button type="button" variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'} size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">
            <List className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'} size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered List">
            <ListOrdered className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" variant={editor.isActive('taskList') ? 'secondary' : 'ghost'} size="sm" onClick={() => editor.chain().focus().toggleTaskList().run()} title="Checklist">
            <ListChecks className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" variant={editor.isActive('link') ? 'secondary' : 'ghost'} size="sm" onClick={setLink} title="Link">
            <Link2 className="h-3.5 w-3.5" />
          </Button>

          <div className="mx-1 h-5 w-px bg-border" />

          <Button
            type="button"
            variant={editor.isActive({ textAlign: 'left' }) ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            title="Align left"
          >
            <AlignLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive({ textAlign: 'center' }) ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            title="Align center"
          >
            <AlignCenter className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive({ textAlign: 'right' }) ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            title="Align right"
          >
            <AlignRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive({ textAlign: 'justify' }) ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            title="Justify"
          >
            <AlignJustify className="h-3.5 w-3.5" />
          </Button>

          <div className="mx-1 h-5 w-px bg-border" />

          <Button type="button" variant={editor.isActive('table') ? 'secondary' : 'ghost'} size="sm" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table">
            <Table2 className="h-3.5 w-3.5" />
            Table
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().addRowAfter().run()} title="Add Row">
            +Row
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().addColumnAfter().run()} title="Add Column">
            +Col
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().deleteRow().run()} title="Delete Row">
            -Row
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().deleteColumn().run()} title="Delete Column">
            -Col
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().deleteTable().run()} title="Delete Table">
            Del Table
          </Button>
        </div>

        <div className="p-3">
          <EditorContent editor={editor} id={id} />
        </div>
      </div>
    </div>
  )
}
