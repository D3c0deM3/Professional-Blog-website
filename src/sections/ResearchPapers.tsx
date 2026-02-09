'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { FileText, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface Paper {
  id: string
  title: string
  authors: string
  journal: string
  year: number
  abstract: string
  doi?: string | null
  pdfUrl?: string | null
}

interface ResearchPapersProps {
  papers: Paper[]
}

export default function ResearchPapers({ papers }: ResearchPapersProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="research" className="section-padding bg-secondary/40">
      <div className="container-padding mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          <div className="mx-auto mb-4 h-10 w-px bg-border" />
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">Research Papers</h2>
          <p className="mt-4 text-base text-muted-foreground">
            Peer-reviewed publications in data structures and algorithmic theory.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {papers.map((paper, index) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.06 }}
            >
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <Badge variant="outline">{paper.year}</Badge>
                  <div>
                    <h3 className="font-display text-lg">{paper.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{paper.authors}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {paper.journal}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{paper.abstract}</p>
                  <div className="mt-auto flex flex-wrap gap-3 text-sm">
                    {paper.pdfUrl && (
                      <Link
                        href={paper.pdfUrl}
                        className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
                      >
                        <FileText className="h-4 w-4" />
                        PDF
                      </Link>
                    )}
                    {paper.doi && (
                      <Link
                        href={paper.doi}
                        className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
                      >
                        <ExternalLink className="h-4 w-4" />
                        DOI
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
