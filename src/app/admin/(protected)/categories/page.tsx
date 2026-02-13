'use client'

import { useEffect, useState } from 'react'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { slugify } from '@/lib/slug'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
}

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '' })
  const [editing, setEditing] = useState<Category | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!newCategory.name) {
      toast.error('Name is required.')
      return
    }

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCategory,
          slug: newCategory.slug || slugify(newCategory.name),
        }),
      })

      if (response.ok) {
        const created = await response.json()
        setCategories((prev) => [...prev, created])
        setNewCategory({ name: '', slug: '', description: '' })
        toast.success('Category created.')
      } else {
        toast.error('Failed to create category.')
      }
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error('Failed to create category.')
    }
  }

  const handleUpdate = async () => {
    if (!editing) return

    try {
      const response = await fetch(`/api/admin/categories/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      })

      if (response.ok) {
        const updated = await response.json()
        setCategories((prev) => prev.map((cat) => (cat.id === updated.id ? updated : cat)))
        setEditing(null)
        setIsDialogOpen(false)
        toast.success('Category updated.')
      } else {
        toast.error('Failed to update category.')
      }
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Failed to update category.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return

    try {
      const response = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id))
        toast.success('Category deleted.')
      } else {
        toast.error('Failed to delete category.')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category.')
    }
  }

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
        <h1 className="font-display text-3xl mb-2">Material Categories</h1>
        <p className="text-muted-foreground">Organize academic materials into categories.</p>
      </div>

      <div className="rounded-xl border border-border bg-background p-6 shadow-sm space-y-4">
        <h2 className="font-display text-xl">Add Category</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={newCategory.name}
              onChange={(event) => {
                const name = event.target.value
                setNewCategory((prev) => ({ ...prev, name, slug: slugify(name) }))
              }}
              placeholder="Lecture Notes"
            />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              value={newCategory.slug}
              onChange={(event) => setNewCategory((prev) => ({ ...prev, slug: event.target.value }))}
              placeholder="lecture-notes"
            />
          </div>
          <div className="space-y-2 md:col-span-3">
            <RichTextEditor
              label="Description"
              value={newCategory.description}
              onChange={(value) => setNewCategory((prev) => ({ ...prev, description: value }))}
              rows={3}
            />
          </div>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{category.slug}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{category.description}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditing(category)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(category.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={editing.name}
                  onChange={(event) =>
                    setEditing({ ...editing, name: event.target.value, slug: slugify(event.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={editing.slug}
                  onChange={(event) => setEditing({ ...editing, slug: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <RichTextEditor
                  label="Description"
                  value={editing.description || ''}
                  onChange={(value) => setEditing({ ...editing, description: value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
