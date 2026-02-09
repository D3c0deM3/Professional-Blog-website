'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Edit2, Plus, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface Category {
  id: string
  name: string
  slug: string
}

interface Material {
  id: string
  title: string
  description: string
  fileUrl: string
  fileType: string
  fileSize: string
  published: boolean
  category: Category
}

const PAGE_SIZE = 10

export default function MaterialsAdmin() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    Promise.all([fetch('/api/admin/materials'), fetch('/api/admin/categories')])
      .then(async ([materialsRes, categoriesRes]) => {
        const materialsData = await materialsRes.json()
        const categoriesData = await categoriesRes.json()
        setMaterials(materialsData)
        setCategories(categoriesData)
      })
      .catch((error) => {
        console.error('Error loading materials:', error)
        toast.error('Failed to load materials.')
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this material?')) return

    try {
      const response = await fetch(`/api/admin/materials/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setMaterials((prev) => prev.filter((item) => item.id !== id))
        toast.success('Material deleted.')
      } else {
        toast.error('Failed to delete material.')
      }
    } catch (error) {
      console.error('Error deleting material:', error)
      toast.error('Failed to delete material.')
    }
  }

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const matchesSearch =
        material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        categoryFilter === 'all' || material.category.slug === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [materials, searchQuery, categoryFilter])

  const totalPages = Math.max(1, Math.ceil(filteredMaterials.length / PAGE_SIZE))
  const paginatedMaterials = filteredMaterials.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

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
          <h1 className="font-display text-3xl">Materials</h1>
          <p className="text-muted-foreground">Manage downloadable academic materials.</p>
        </div>
        <Button asChild>
          <Link href="/admin/materials/new">
            <Plus className="h-4 w-4" />
            Add Material
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value)
              setPage(1)
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value) => {
            setCategoryFilter(value)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full md:w-56">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedMaterials.map((material) => (
            <TableRow key={material.id}>
              <TableCell>
                <div className="font-medium">{material.title}</div>
                <div className="text-xs text-muted-foreground">{material.description}</div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{material.category.name}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{material.fileType}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{material.fileSize}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button asChild size="icon" variant="ghost">
                    <Link href={`/admin/materials/${material.id}/edit`}>
                      <Edit2 className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(material.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredMaterials.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No materials found.
        </div>
      )}

      {filteredMaterials.length > PAGE_SIZE && (
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
