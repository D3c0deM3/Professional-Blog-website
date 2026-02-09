'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Edit2, Eye, EyeOff, Plus, Search, Star, Trash2 } from 'lucide-react'
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

interface Paper {
  id: string
  title: string
  authors: string
  journal: string
  year: number
  published: boolean
  featured: boolean
}

const PAGE_SIZE = 10

export default function PapersAdmin() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchPapers()
  }, [])

  const fetchPapers = async () => {
    try {
      const response = await fetch('/api/admin/papers')
      const data = await response.json()
      setPapers(data)
    } catch (error) {
      console.error('Error fetching papers:', error)
      toast.error('Failed to load papers.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this paper?')) return

    try {
      const response = await fetch(`/api/admin/papers/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPapers(papers.filter((paper) => paper.id !== id))
        toast.success('Paper deleted.')
      } else {
        toast.error('Unable to delete paper.')
      }
    } catch (error) {
      console.error('Error deleting paper:', error)
      toast.error('Unable to delete paper.')
    }
  }

  const handleTogglePublished = async (id: string, currentValue: boolean) => {
    try {
      const response = await fetch(`/api/admin/papers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentValue }),
      })

      if (response.ok) {
        setPapers(papers.map((paper) =>
          paper.id === id ? { ...paper, published: !currentValue } : paper
        ))
      }
    } catch (error) {
      console.error('Error updating paper:', error)
      toast.error('Unable to update paper.')
    }
  }

  const handleToggleFeatured = async (id: string, currentValue: boolean) => {
    try {
      const response = await fetch(`/api/admin/papers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentValue }),
      })

      if (response.ok) {
        setPapers(papers.map((paper) =>
          paper.id === id ? { ...paper, featured: !currentValue } : paper
        ))
      }
    } catch (error) {
      console.error('Error updating paper:', error)
      toast.error('Unable to update paper.')
    }
  }

  const filteredPapers = useMemo(() => {
    return papers.filter((paper) =>
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [papers, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredPapers.length / PAGE_SIZE))
  const paginatedPapers = filteredPapers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
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
          <h1 className="font-display text-3xl">Research Papers</h1>
          <p className="text-muted-foreground">Manage publications and featured content.</p>
        </div>
        <Button asChild>
          <Link href="/admin/papers/new">
            <Plus className="h-4 w-4" />
            Add Paper
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search papers..."
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
            <TableHead>Title</TableHead>
            <TableHead>Authors</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedPapers.map((paper) => (
            <TableRow key={paper.id}>
              <TableCell>
                <div className="font-medium">{paper.title}</div>
                <div className="text-xs text-muted-foreground">{paper.journal}</div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{paper.authors}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{paper.year}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePublished(paper.id, paper.published)}
                    className="text-muted-foreground hover:text-foreground"
                    title={paper.published ? 'Published' : 'Draft'}
                  >
                    {paper.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(paper.id, paper.featured)}
                    className="text-muted-foreground hover:text-foreground"
                    title={paper.featured ? 'Featured' : 'Not featured'}
                  >
                    <Star className="h-4 w-4" fill={paper.featured ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button asChild size="icon" variant="ghost">
                    <Link href={`/admin/papers/${paper.id}/edit`}>
                      <Edit2 className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(paper.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredPapers.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No papers found.
        </div>
      )}

      {filteredPapers.length > PAGE_SIZE && (
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
