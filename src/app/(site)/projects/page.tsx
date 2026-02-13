import Projects from '@/sections/Projects'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  })

  return <Projects projects={projects} />
}
