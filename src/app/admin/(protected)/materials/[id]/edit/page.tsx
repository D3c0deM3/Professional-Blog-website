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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Category {
  id: string
  name: string
  slug: string
}

interface MaterialForm {
  title: string
  description: string
  fileUrl: string
  fileType: string
  fileSize: string
  categoryId: string
  published: boolean
}

export default function EditMaterial({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<MaterialForm | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([fetch('/api/admin/categories'), fetch(`/api/admin/materials/${id}`)])
      .then(async ([categoriesRes, materialRes]) => {
        const categoriesData = await categoriesRes.json()
        const materialData = await materialRes.json()
        setCategories(categoriesData)
        setFormData({
          title: materialData.title,
          description: materialData.description,
          fileUrl: materialData.fileUrl,
          fileType: materialData.fileType,
          fileSize: materialData.fileSize,
          categoryId: materialData.categoryId,
          published: materialData.published,
        })
      })
      .catch((error) => {
        console.error('Error loading material:', error)
        toast.error('Failed to load material.')
      })
      .finally(() => setIsLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/materials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Material updated.')
        router.push('/admin/materials')
      } else {
        toast.error('Failed to update material.')
      }
    } catch (error) {
      console.error('Error updating material:', error)
      toast.error('Failed to update material.')
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
          <Link href="/admin/materials">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-3xl">Edit Material</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-background p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(event) => setFormData((prev) => prev ? { ...prev, title: event.target.value } : prev)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData((prev) => prev ? { ...prev, categoryId: value } : prev)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <RichTextEditor
            id="description"
            label="Description *"
            value={formData.description}
            onChange={(value) => setFormData((prev) => prev ? { ...prev, description: value } : prev)}
            rows={4}
            required
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fileType">File Type *</Label>
            <Select
              value={formData.fileType}
              onValueChange={(value) => setFormData((prev) => prev ? { ...prev, fileType: value } : prev)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="code">Code</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="archive">Archive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fileSize">File Size *</Label>
            <Input
              id="fileSize"
              value={formData.fileSize}
              onChange={(event) => setFormData((prev) => prev ? { ...prev, fileSize: event.target.value } : prev)}
              required
            />
          </div>
        </div>

        <FileUploadField
          label="Upload File"
          value={formData.fileUrl}
          onChange={(value) => setFormData((prev) => prev ? { ...prev, fileUrl: value } : prev)}
        />

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/materials">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
