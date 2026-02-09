'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { slugify } from '@/lib/slug'
import MarkdownEditor from '@/components/admin/MarkdownEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function NewPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    metaDescription: '',
    content: '',
    published: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug: formData.slug || slugify(formData.title),
        }),
      })

      if (response.ok) {
        toast.success('Page created.')
        router.push('/admin/pages')
      } else {
        toast.error('Failed to create page.')
      }
    } catch (error) {
      console.error('Error creating page:', error)
      toast.error('Failed to create page.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/pages">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-3xl">Add Page</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-background p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(event) => {
                const title = event.target.value
                setFormData((prev) => ({ ...prev, title, slug: slugify(title) }))
              }}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(event) => setFormData((prev) => ({ ...prev, slug: event.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Input
            id="metaDescription"
            value={formData.metaDescription}
            onChange={(event) => setFormData((prev) => ({ ...prev, metaDescription: event.target.value }))}
          />
        </div>

        <MarkdownEditor
          label="Content *"
          value={formData.content}
          onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(event) => setFormData((prev) => ({ ...prev, published: event.target.checked }))}
            className="h-4 w-4"
          />
          Published
        </label>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Page'}
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/pages">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
