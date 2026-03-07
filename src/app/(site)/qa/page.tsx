import QA from '@/sections/QA'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

export default async function QAPage() {
  const items = await prisma.qA.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
    take: 100,
  })

  return <QA items={items} />
}
