'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ContactForm {
  email: string
  phone?: string
  office?: string
  officeHours?: string
  linkedin?: string
  github?: string
  twitter?: string
  googleScholar?: string
}

export default function ContactAdmin() {
  const [formData, setFormData] = useState<ContactForm>({
    email: '',
    phone: '',
    office: '',
    officeHours: '',
    linkedin: '',
    github: '',
    twitter: '',
    googleScholar: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/admin/contact')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setFormData({
            email: data.email || '',
            phone: data.phone || '',
            office: data.office || '',
            officeHours: data.officeHours || '',
            linkedin: data.linkedin || '',
            github: data.github || '',
            twitter: data.twitter || '',
            googleScholar: data.googleScholar || '',
          })
        }
      })
      .catch((error) => {
        console.error('Error loading contact info:', error)
        toast.error('Failed to load contact info.')
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Contact info updated.')
      } else {
        toast.error('Failed to update contact info.')
      }
    } catch (error) {
      console.error('Error updating contact info:', error)
      toast.error('Failed to update contact info.')
    } finally {
      setIsSubmitting(false)
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
        <h1 className="font-display text-3xl mb-2">Contact Information</h1>
        <p className="text-muted-foreground">Update public contact details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-background p-6 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="office">Office</Label>
            <Input
              id="office"
              value={formData.office}
              onChange={(event) => setFormData((prev) => ({ ...prev, office: event.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="officeHours">Office Hours</Label>
          <Input
            id="officeHours"
            value={formData.officeHours}
            onChange={(event) => setFormData((prev) => ({ ...prev, officeHours: event.target.value }))}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={formData.linkedin}
              onChange={(event) => setFormData((prev) => ({ ...prev, linkedin: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              value={formData.github}
              onChange={(event) => setFormData((prev) => ({ ...prev, github: event.target.value }))}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              value={formData.twitter}
              onChange={(event) => setFormData((prev) => ({ ...prev, twitter: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="googleScholar">Google Scholar</Label>
            <Input
              id="googleScholar"
              value={formData.googleScholar}
              onChange={(event) => setFormData((prev) => ({ ...prev, googleScholar: event.target.value }))}
            />
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Contact Info'}
        </Button>
      </form>
    </div>
  )
}
