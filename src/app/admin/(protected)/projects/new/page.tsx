'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import FileUploadField from '@/components/admin/FileUploadField'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function NewProject() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    demoUrl: '',
    imageUrl: '',
    featured: false,
    published: true,
    order: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Project created.')
        router.push('/admin/projects')
      } else {
        toast.error('Failed to create project.')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to create project.')
    } finally {
      setIsSubmitting(false)
    }
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
          <h1 className="font-display text-3xl">Add Project</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-background p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(event) => setFormData((prev) => ({ ...prev, order: Number(event.target.value) }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <RichTextEditor
            id="description"
            label="Description *"
            value={formData.description}
            onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="technologies">Technologies *</Label>
          <Input
            id="technologies"
            value={formData.technologies}
            onChange={(event) => setFormData((prev) => ({ ...prev, technologies: event.target.value }))}
            placeholder="e.g., TypeScript, D3.js"
            required
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              value={formData.githubUrl}
              onChange={(event) => setFormData((prev) => ({ ...prev, githubUrl: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demoUrl">Demo URL</Label>
            <Input
              id="demoUrl"
              value={formData.demoUrl}
              onChange={(event) => setFormData((prev) => ({ ...prev, demoUrl: event.target.value }))}
            />
          </div>
        </div>

        <FileUploadField
          label="Project Image"
          value={formData.imageUrl}
          onChange={(value) => setFormData((prev) => ({ ...prev, imageUrl: value }))}
          accept=".png,.jpg,.jpeg,.webp"
        />

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(event) => setFormData((prev) => ({ ...prev, published: event.target.checked }))}
              className="h-4 w-4"
            />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(event) => setFormData((prev) => ({ ...prev, featured: event.target.checked }))}
              className="h-4 w-4"
            />
            Featured
          </label>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Project'}
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/projects">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
