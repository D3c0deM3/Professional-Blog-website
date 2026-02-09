'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface QAForm {
  question: string
  answer: string
  category?: string | null
  order: number
  published: boolean
}

export default function EditQA({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [formData, setFormData] = useState<QAForm | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/qa/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          question: data.question,
          answer: data.answer,
          category: data.category,
          order: data.order,
          published: data.published,
        })
      })
      .catch((error) => {
        console.error('Error loading QA item:', error)
        toast.error('Failed to load Q&A item.')
      })
      .finally(() => setIsLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/qa/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Q&A item updated.')
        router.push('/admin/qa')
      } else {
        toast.error('Failed to update Q&A item.')
      }
    } catch (error) {
      console.error('Error updating Q&A item:', error)
      toast.error('Failed to update Q&A item.')
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
          <Link href="/admin/qa">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-3xl">Edit Q&A</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-background p-6 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="question">Question *</Label>
          <Input
            id="question"
            value={formData.question}
            onChange={(event) => setFormData({ ...formData, question: event.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="answer">Answer *</Label>
          <Textarea
            id="answer"
            value={formData.answer}
            onChange={(event) => setFormData({ ...formData, answer: event.target.value })}
            rows={5}
            required
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category || ''}
              onChange={(event) => setFormData({ ...formData, category: event.target.value })}
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

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(event) => setFormData({ ...formData, published: event.target.checked })}
            className="h-4 w-4"
          />
          Published
        </label>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/qa">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
