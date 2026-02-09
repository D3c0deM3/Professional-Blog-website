'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface QuestionDetail {
  id: string
  name: string
  email: string
  subject: string
  question: string
  status: 'pending' | 'answered' | 'published'
  answer?: string | null
  createdAt: string
  qa?: {
    category?: string | null
  } | null
}

export default function QuestionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [question, setQuestion] = useState<QuestionDetail | null>(null)
  const [answer, setAnswer] = useState('')
  const [category, setCategory] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(`/api/admin/questions/${params.id}`)
        const data = await response.json()
        setQuestion(data)
        setAnswer(data.answer || '')
        setCategory(data.qa?.category || '')
      } catch (error) {
        console.error('Error fetching question:', error)
        toast.error('Failed to load question.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestion()
  }, [params.id])

  const handleSave = async () => {
    if (!answer.trim()) {
      toast.error('Answer is required.')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/questions/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer }),
      })

      if (response.ok) {
        const updated = await response.json()
        setQuestion((prev) => (prev ? { ...prev, ...updated } : updated))
        toast.success('Answer saved.')
      } else {
        toast.error('Failed to save answer.')
      }
    } catch (error) {
      console.error('Error updating question:', error)
      toast.error('Failed to save answer.')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!answer.trim()) {
      toast.error('Answer is required.')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/questions/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer, publish: true, category }),
      })

      if (response.ok) {
        const data = await response.json()
        setQuestion(data.submission)
        toast.success('Published to Q&A.')
        router.push('/admin/questions')
      } else {
        toast.error('Failed to publish.')
      }
    } catch (error) {
      console.error('Error publishing question:', error)
      toast.error('Failed to publish.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !question) {
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
          <Link href="/admin/questions">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-3xl">Question Detail</h1>
          <p className="text-muted-foreground">Respond and publish to Q&A.</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-xl">{question.subject}</h2>
          <Badge variant="outline">{question.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">From: {question.name} ({question.email})</p>
        <p className="text-sm text-muted-foreground">
          Submitted: {new Date(question.createdAt).toLocaleString()}
        </p>
        <div className="rounded-lg border border-border bg-secondary/50 p-4 text-sm">
          {question.question}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-6 shadow-sm space-y-4">
        <div className="space-y-2">
          <Label htmlFor="answer">Answer</Label>
          <Textarea
            id="answer"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            rows={6}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Q&A Category (optional)</Label>
          <Input
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="e.g., Research, Teaching"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            <CheckCircle2 className="h-4 w-4" />
            Save Answer
          </Button>
          <Button type="button" variant="outline" onClick={handlePublish} disabled={isSaving}>
            <Send className="h-4 w-4" />
            Publish to Q&A
          </Button>
        </div>
      </div>
    </div>
  )
}
