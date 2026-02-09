'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

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

  return (
    <section id="qa" className="section-padding bg-secondary/40">
      <div className="container-padding mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
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
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="mt-10"
        >
          <Accordion type="single" collapsible className="w-full rounded-2xl border border-border bg-background/80 px-6">
            {items.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>
                  <span className="flex flex-wrap items-center gap-3">
                    {item.category && <Badge variant="outline">{item.category}</Badge>}
                    <span>{item.question}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
