import ResearchPapers from '@/sections/ResearchPapers'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ResearchPage() {
  const papers = await prisma.paper.findMany({
    where: { published: true },
    orderBy: { year: 'desc' },
    take: 50,
  })

  return <ResearchPapers papers={papers} />
}
