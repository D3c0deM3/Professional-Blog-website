'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Edit2, Plus, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface QAItem {
  id: string
  question: string
  answer: string
  category?: string | null
  published: boolean
  order: number
}

const PAGE_SIZE = 10

export default function QAAdmin() {
  const [items, setItems] = useState<QAItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetch('/api/admin/qa')
      .then((res) => res.json())
      .then(setItems)
      .catch((error) => {
        console.error('Error fetching QA items:', error)
        toast.error('Failed to load Q&A items.')
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this Q&A item?')) return

    try {
      const response = await fetch(`/api/admin/qa/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id))
        toast.success('Q&A item deleted.')
      } else {
        toast.error('Failed to delete Q&A item.')
      }
    } catch (error) {
      console.error('Error deleting QA item:', error)
      toast.error('Failed to delete Q&A item.')
    }
  }

  const filtered = useMemo(() => {
    return items.filter((item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [items, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl">Q&A Items</h1>
          <p className="text-muted-foreground">Manage published Q&A content.</p>
        </div>
        <Button asChild>
          <Link href="/admin/qa/new">
            <Plus className="h-4 w-4" />
            Add Q&A
          </Link>
        </Button>
      </div>

      <div className="relative w-full md:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search Q&A..."
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value)
            setPage(1)
          }}
          className="pl-9"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Order</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="font-medium line-clamp-1">{item.question}</div>
                <div className="text-xs text-muted-foreground line-clamp-1">{item.answer}</div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{item.category}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{item.order}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button asChild size="icon" variant="ghost">
                    <Link href={`/admin/qa/${item.id}/edit`}>
                      <Edit2 className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No Q&A items found.
        </div>
      )}

      {filtered.length > PAGE_SIZE && (
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
