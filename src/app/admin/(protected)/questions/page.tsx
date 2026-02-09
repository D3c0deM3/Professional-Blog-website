'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Eye, MessageSquare, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface Question {
  id: string
  name: string
  email: string
  subject: string
  question: string
  status: 'pending' | 'answered' | 'published'
  createdAt: string
}

const PAGE_SIZE = 10

const statusStyles: Record<Question['status'], string> = {
  pending: 'bg-secondary text-secondary-foreground',
  answered: 'bg-accent text-accent-foreground',
  published: 'bg-primary text-primary-foreground',
}

export default function QuestionsAdmin() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/admin/questions')
      const data = await response.json()
      setQuestions(data)
    } catch (error) {
      console.error('Error fetching questions:', error)
      toast.error('Failed to load questions.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return

    try {
      const response = await fetch(`/api/admin/questions/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setQuestions(questions.filter((question) => question.id !== id))
        toast.success('Question deleted.')
      } else {
        toast.error('Unable to delete question.')
      }
    } catch (error) {
      console.error('Error deleting question:', error)
      toast.error('Unable to delete question.')
    }
  }

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) =>
      question.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [questions, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / PAGE_SIZE))
  const paginatedQuestions = filteredQuestions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Question Submissions</h1>
        <p className="text-muted-foreground">Review and respond to student questions.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by subject, name, or email..."
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value)
            setPage(1)
          }}
          className="pl-9"
        />
      </div>

      <div className="space-y-4">
        {paginatedQuestions.map((question) => (
          <Card key={question.id}>
            <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-lg">{question.subject}</h3>
                  <Badge className={statusStyles[question.status]}>
                    {question.status}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  From: {question.name} ({question.email})
                </p>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                  {question.question}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Submitted: {new Date(question.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild size="icon" variant="outline">
                  <Link href={`/admin/questions/${question.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(question.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          <MessageSquare className="mx-auto mb-4 h-10 w-10" />
          No questions submitted yet.
        </div>
      )}

      {filteredQuestions.length > PAGE_SIZE && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={page === index + 1}
                  onClick={() => setPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
