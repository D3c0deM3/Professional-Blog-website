'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Download, ExternalLink, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { stripRichText } from '@/lib/rich-text'

interface Paper {
  id: string
  title: string
  authors: string
  journal: string
  year: number
  language: string
  abstract: string
  doi?: string | null
  contentType: string
  pdfUrl?: string | null
  content?: string | null
}

interface ResearchPapersProps {
  papers: Paper[]
}

export default function ResearchPapers({ papers }: ResearchPapersProps) {
  const shouldReduceMotion = useReducedMotion()
  const [selectedLanguage, setSelectedLanguage] = useState('all')

  const languages = useMemo(() => {
    return Array.from(
      new Set(
        papers
          .map((paper) => paper.language?.trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b))
  }, [papers])

  const filteredPapers = useMemo(() => {
    if (selectedLanguage === 'all') return papers
    return papers.filter((paper) => paper.language === selectedLanguage)
  }, [papers, selectedLanguage])

  return (
    <section id="research" className="section-padding bg-secondary/40">
      <div className="container-padding mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          <div className="mx-auto mb-4 h-10 w-px bg-border" />
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">Research Papers</h2>
          <p className="mt-4 text-base text-muted-foreground">
            Peer-reviewed publications in data structures and algorithmic theory.
          </p>
        </motion.div>

        <div className="mx-auto mt-8 w-full max-w-xs">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {languages.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPapers.map((paper, index) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.06 }}
            >
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{paper.year}</Badge>
                    <Badge variant="outline">{paper.language || 'English'}</Badge>
                  </div>
                  <div>
                    <h3 className="font-display text-lg">{paper.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{paper.authors}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {paper.journal}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{stripRichText(paper.abstract)}</p>
                  <div className="mt-auto flex flex-wrap gap-2 text-sm">
                    {paper.contentType === 'pdf' && paper.pdfUrl && (
                      <Button asChild size="sm" variant="outline">
                        <a href={paper.pdfUrl} download>
                          <Download className="h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    )}
                    {paper.contentType === 'written' && (
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/research/${paper.id}`}>
                          <FileText className="h-4 w-4" />
                          Read More
                        </Link>
                      </Button>
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

        {filteredPapers.length === 0 && (
          <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No papers found for the selected language.
          </div>
        )}
      </div>
    </section>
  )
}
