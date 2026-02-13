'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import FileUploadField from '@/components/admin/FileUploadField'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ProjectForm {
  title: string
  description: string
  technologies: string
  githubUrl?: string | null
  demoUrl?: string | null
  imageUrl?: string | null
  featured: boolean
  published: boolean
  order: number
}

export default function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [formData, setFormData] = useState<ProjectForm | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          title: data.title,
          description: data.description,
          technologies: data.technologies,
          githubUrl: data.githubUrl,
          demoUrl: data.demoUrl,
          imageUrl: data.imageUrl,
          featured: data.featured,
          published: data.published,
          order: data.order,
        })
      })
      .catch((error) => {
        console.error('Error loading project:', error)
        toast.error('Failed to load project.')
      })
      .finally(() => setIsLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Project updated.')
        router.push('/admin/projects')
      } else {
        toast.error('Failed to update project.')
      }
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Failed to update project.')
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
          <Link href="/admin/projects">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-3xl">Edit Project</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-background p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(event) => setFormData({ ...formData, title: event.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(event) => setFormData({ ...formData, order: Number(event.target.value) })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <RichTextEditor
            id="description"
            label="Description *"
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="technologies">Technologies *</Label>
          <Input
            id="technologies"
            value={formData.technologies}
            onChange={(event) => setFormData({ ...formData, technologies: event.target.value })}
            required
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              value={formData.githubUrl || ''}
              onChange={(event) => setFormData({ ...formData, githubUrl: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demoUrl">Demo URL</Label>
            <Input
              id="demoUrl"
              value={formData.demoUrl || ''}
              onChange={(event) => setFormData({ ...formData, demoUrl: event.target.value })}
            />
          </div>
        </div>

        <FileUploadField
          label="Project Image"
          value={formData.imageUrl || ''}
          onChange={(value) => setFormData({ ...formData, imageUrl: value })}
          accept=".png,.jpg,.jpeg,.webp"
        />

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(event) => setFormData({ ...formData, published: event.target.checked })}
              className="h-4 w-4"
            />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(event) => setFormData({ ...formData, featured: event.target.checked })}
              className="h-4 w-4"
            />
            Featured
          </label>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/projects">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
