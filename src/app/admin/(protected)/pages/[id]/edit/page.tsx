'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { slugify } from '@/lib/slug'
import MarkdownEditor from '@/components/admin/MarkdownEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PageForm {
  title: string
  slug: string
  metaDescription?: string | null
  content: string
  published: boolean
}

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [formData, setFormData] = useState<PageForm | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/pages/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          title: data.title,
          slug: data.slug,
          metaDescription: data.metaDescription,
          content: data.content,
          published: data.published,
        })
      })
      .catch((error) => {
        console.error('Error loading page:', error)
        toast.error('Failed to load page.')
      })
      .finally(() => setIsLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/pages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Page updated.')
        router.push('/admin/pages')
      } else {
        toast.error('Failed to update page.')
      }
    } catch (error) {
      console.error('Error updating page:', error)
      toast.error('Failed to update page.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !formData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
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
          <h1 className="font-display text-3xl">Edit Page</h1>
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
                setFormData((prev) => prev ? { ...prev, title, slug: slugify(title) } : prev)
              }}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(event) => setFormData((prev) => prev ? { ...prev, slug: event.target.value } : prev)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Input
            id="metaDescription"
            value={formData.metaDescription || ''}
            onChange={(event) => setFormData((prev) => prev ? { ...prev, metaDescription: event.target.value } : prev)}
          />
        </div>

        <MarkdownEditor
          label="Content *"
          value={formData.content}
          onChange={(value) => setFormData((prev) => prev ? { ...prev, content: value } : prev)}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(event) => setFormData((prev) => prev ? { ...prev, published: event.target.checked } : prev)}
            className="h-4 w-4"
          />
          Published
        </label>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/pages">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
