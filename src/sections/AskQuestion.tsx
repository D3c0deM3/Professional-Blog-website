'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Mail, MapPin, Clock, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface ContactInfo {
  email: string
  phone?: string | null
  office?: string | null
  officeHours?: string | null
}

interface AskQuestionProps {
  contact: ContactInfo | null
}

export default function AskQuestion({ contact }: AskQuestionProps) {
  const shouldReduceMotion = useReducedMotion()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    question: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.subject || !formData.question) {
      toast.error('Please fill in all required fields.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit question')
      }

      toast.success('Question submitted successfully.')
      setFormData({ name: '', email: '', subject: '', question: '' })
    } catch (error) {
      console.error('Error submitting question:', error)
      toast.error('Unable to submit your question. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="ask-question" className="section-padding">
      <div className="container-padding mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-4 text-xs uppercase tracking-[0.35em] text-muted-foreground">
              <span>Ask</span>
              <span className="divider-line" />
            </div>
            <h2 className="mt-6 font-display text-3xl sm:text-4xl md:text-5xl">Ask a Question</h2>
            <p className="mt-4 text-base text-muted-foreground">
              Submit questions about research, coursework, or collaboration opportunities.
            </p>

            <div className="mt-10 space-y-6 text-sm text-muted-foreground">
              {contact?.email && (
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em]">Email</p>
                    <p className="mt-1 text-foreground">{contact.email}</p>
                  </div>
                </div>
              )}
              {contact?.officeHours && (
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em]">Office Hours</p>
                    <p className="mt-1 text-foreground">{contact.officeHours}</p>
                  </div>
                </div>
              )}
              {contact?.office && (
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em]">Office</p>
                    <p className="mt-1 text-foreground">{contact.office}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="rounded-2xl border border-border bg-background/80 p-6 shadow-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.edu"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Topic of your question"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="question"
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write your question here..."
                  required
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Submitting...' : 'Send Question'}
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
