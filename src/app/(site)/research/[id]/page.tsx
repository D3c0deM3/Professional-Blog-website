import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays, Download, ExternalLink, FileText, Languages, User2 } from 'lucide-react'
import RichContent from '@/components/RichContent'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { stripRichText } from '@/lib/rich-text'

export const dynamic = 'force-dynamic'

interface PaperPageProps {
  params: Promise<{ id: string }>
}

export default async function PaperPage({ params }: PaperPageProps) {
  const { id } = await params

  if (!id) {
    notFound()
  }

  const paper = await prisma.paper.findUnique({
    where: { id },
  })

  if (!paper || !paper.published) {
    notFound()
  }

  const abstract = stripRichText(paper.abstract)
  const contentWordCount = paper.content ? stripRichText(paper.content).split(/\s+/).filter(Boolean).length : 0
  const readingMinutes = contentWordCount > 0 ? Math.max(1, Math.ceil(contentWordCount / 220)) : null

  return (
    <section className="section-padding bg-secondary/40">
      <div className="container-padding mx-auto max-w-6xl">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/research">
            <ArrowLeft className="h-4 w-4" />
            Back to Research
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <article className="rounded-3xl border border-border bg-background/90 p-6 shadow-sm sm:p-10">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{paper.year}</Badge>
              <Badge variant="outline">{paper.language || 'English'}</Badge>
              <Badge variant="outline">{paper.contentType === 'written' ? 'Written Article' : 'PDF Paper'}</Badge>
            </div>

            <h1 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">{paper.title}</h1>

            <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <p className="inline-flex items-center gap-2">
                <User2 className="h-4 w-4" />
                {paper.authors}
              </p>
              <p className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {paper.journal}
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-secondary/35 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Abstract</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {abstract || 'No abstract provided for this paper.'}
              </p>
            </div>

            <div className="divider-line my-8" />

            {paper.contentType === 'written' ? (
              paper.content ? (
                <RichContent
                  content={paper.content}
                  className="text-[1.03rem] leading-8 text-foreground/90"
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-background/70 p-6 text-sm text-muted-foreground">
                  Full written content has not been added yet.
                </div>
              )
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-background/70 p-6 text-sm text-muted-foreground">
                This paper is provided as a PDF file. Use the download button from the panel on the right.
              </div>
            )}
          </article>

          <aside className="h-fit space-y-4 lg:sticky lg:top-24">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Paper Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Language</span>
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    {paper.language || 'English'}
                  </span>
                </p>
                <p className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Year</span>
                  <span className="font-medium">{paper.year}</span>
                </p>
                {readingMinutes && (
                  <p className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Read Time</span>
                    <span className="font-medium">~{readingMinutes} min</span>
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {paper.contentType === 'pdf' && paper.pdfUrl && (
                  <Button asChild className="w-full justify-start">
                    <a href={paper.pdfUrl} download>
                      <Download className="h-4 w-4" />
                      Download PDF
                    </a>
                  </Button>
                )}
                {paper.doi && (
                  <Button asChild variant="outline" className="w-full justify-start">
                    <a href={paper.doi} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Open DOI
                    </a>
                  </Button>
                )}
                {paper.contentType === 'written' && (
                  <div className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    Formatted in-app for continuous reading.
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </section>
  )
}
