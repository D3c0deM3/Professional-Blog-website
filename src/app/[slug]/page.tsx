import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params

  if (!slug) {
    notFound()
  }

  const page = await prisma.page.findUnique({
    where: { slug },
  })

  if (!page || !page.published) {
    notFound()
  }

  const settings = await prisma.siteSetting.findMany()
  const settingsMap = settings.reduce<Record<string, string>>((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {})

  return (
    <main className="min-h-screen">
      <header className="border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="container-padding mx-auto flex max-w-6xl items-center justify-between py-6">
          <Link href="/" className="font-display text-lg">
            {settingsMap.siteTitle || ''}
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Back to home
          </Link>
        </div>
      </header>
      <section className="section-padding">
        <div className="container-padding mx-auto max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl">{page.title}</h1>
          <div className="divider-line my-8" />
          <div className="markdown text-muted-foreground">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{page.content}</ReactMarkdown>
          </div>
        </div>
      </section>
    </main>
  )
}
