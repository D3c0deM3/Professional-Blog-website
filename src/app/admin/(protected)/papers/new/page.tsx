'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import FileUploadField from '@/components/admin/FileUploadField'

type PaperContentType = 'pdf' | 'written'

export default function NewPaper() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    journal: '',
    year: new Date().getFullYear(),
    language: 'English',
    abstract: '',
    doi: '',
    contentType: 'pdf' as PaperContentType,
    pdfUrl: '',
    content: '',
    published: true,
    featured: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.contentType === 'pdf' && !formData.pdfUrl.trim()) {
      toast.error('Please upload a PDF or provide a PDF URL.')
      return
    }

    if (formData.contentType === 'written' && !formData.content.trim()) {
      toast.error('Please add written content for this paper.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Paper created.')
        router.push('/admin/papers')
      } else {
        toast.error('Failed to create paper.')
      }
    } catch (error) {
      console.error('Error creating paper:', error)
      toast.error('Failed to create paper.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/papers">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-3xl">Add New Paper</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-background p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="authors">Authors *</Label>
            <Input
              id="authors"
              name="authors"
              value={formData.authors}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="journal">Journal/Conference *</Label>
            <Input
              id="journal"
              name="journal"
              value={formData.journal}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              required
              min={1900}
              max={2100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language *</Label>
            <Input
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              placeholder="English"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <RichTextEditor
            id="abstract"
            label="Abstract"
            value={formData.abstract}
            onChange={(value) => setFormData((prev) => ({ ...prev, abstract: value }))}
            rows={5}
          />
        </div>

        <div className="space-y-3">
          <Label>Paper Source *</Label>
          <div className="grid gap-3 md:grid-cols-2">
            <label
              className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                formData.contentType === 'pdf'
                  ? 'border-primary bg-secondary/70'
                  : 'border-border hover:bg-secondary/40'
              }`}
            >
              <input
                type="radio"
                name="contentType"
                value="pdf"
                checked={formData.contentType === 'pdf'}
                onChange={() => setFormData((prev) => ({ ...prev, contentType: 'pdf' }))}
                className="sr-only"
              />
              <div className="font-medium">Upload PDF</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Paper card will show a Download button.
              </p>
            </label>
            <label
              className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                formData.contentType === 'written'
                  ? 'border-primary bg-secondary/70'
                  : 'border-border hover:bg-secondary/40'
              }`}
            >
              <input
                type="radio"
                name="contentType"
                value="written"
                checked={formData.contentType === 'written'}
                onChange={() => setFormData((prev) => ({ ...prev, contentType: 'written' }))}
                className="sr-only"
              />
              <div className="font-medium">Write in Dashboard</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Paper card will show a Read More button.
              </p>
            </label>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="doi">DOI</Label>
            <Input
              id="doi"
              name="doi"
              value={formData.doi}
              onChange={handleChange}
            />
          </div>
          {formData.contentType === 'pdf' && (
            <FileUploadField
              label="PDF Upload *"
              value={formData.pdfUrl}
              onChange={(value) => setFormData((prev) => ({ ...prev, pdfUrl: value }))}
              accept=".pdf"
            />
          )}
        </div>

        {formData.contentType === 'written' && (
          <div className="space-y-2">
            <RichTextEditor
              id="content"
              label="Paper Content *"
              value={formData.content}
              onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
              rows={12}
              placeholder="Write the research paper content here..."
              required
            />
          </div>
        )}

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="h-4 w-4"
            />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4"
            />
            Featured
          </label>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Paper'}
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/papers">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
