'use client'

import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import RichContent from '@/components/RichContent'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { stripRichText } from '@/lib/rich-text'

interface QAItem {
  id: string
  question: string
  answer: string
  category?: string | null
}

interface QAProps {
  items: QAItem[]
}

export default function QA({ items }: QAProps) {
  const shouldReduceMotion = useReducedMotion()
  const [query, setQuery] = useState('')

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return items

    return items.filter((item) => {
      const searchable = [
        item.question,
        item.category ?? '',
        stripRichText(item.answer),
      ]
        .join(' ')
        .toLowerCase()

      return searchable.includes(normalized)
    })
  }, [items, query])

  return (
    <section id="qa" className="section-padding bg-secondary/40">
      <div className="container-padding mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          <div className="mx-auto mb-4 h-10 w-px bg-border" />
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">Q&A</h2>
          <p className="mt-4 text-base text-muted-foreground">
            Common questions from students and collaborators.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
          className="mx-auto mt-8 w-full max-w-xl"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search questions, answers, or topics..."
              className="h-11 rounded-full bg-background/80 pl-10 pr-10"
              aria-label="Search Q&A"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="mt-10"
        >
          <Accordion type="single" collapsible className="w-full rounded-2xl border border-border bg-background/80 px-6">
            {filteredItems.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>
                  <span className="flex flex-wrap items-center gap-3">
                    {item.category && <Badge variant="outline">{item.category}</Badge>}
                    <span>{item.question}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <RichContent content={item.answer} className="text-sm text-muted-foreground" />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredItems.length === 0 && (
            <div className="mt-4 rounded-2xl border border-dashed border-border bg-background/70 px-6 py-8 text-center text-sm text-muted-foreground">
              No matching topics found.
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
