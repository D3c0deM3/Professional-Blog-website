import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const q = request.nextUrl.searchParams.get('q')?.trim()
    if (!q || q.length < 2) {
      return NextResponse.json([])
    }

    const query = `%${q}%`

    const [papers, materials, projects, achievements, qaItems, pages] =
      await Promise.all([
        prisma.paper.findMany({
          where: {
            OR: [
              { title: { contains: q } },
              { authors: { contains: q } },
              { journal: { contains: q } },
              { abstract: { contains: q } },
            ],
          },
          select: { id: true, title: true, authors: true, year: true },
          take: 5,
        }),
        prisma.material.findMany({
          where: {
            OR: [
              { title: { contains: q } },
              { description: { contains: q } },
            ],
          },
          select: { id: true, title: true, fileType: true },
          take: 5,
        }),
        prisma.project.findMany({
          where: {
            OR: [
              { title: { contains: q } },
              { description: { contains: q } },
              { technologies: { contains: q } },
            ],
          },
          select: { id: true, title: true },
          take: 5,
        }),
        prisma.achievement.findMany({
          where: {
            OR: [
              { title: { contains: q } },
              { description: { contains: q } },
            ],
          },
          select: { id: true, title: true, year: true, type: true },
          take: 5,
        }),
        prisma.qA.findMany({
          where: {
            OR: [
              { question: { contains: q } },
              { answer: { contains: q } },
              { category: { contains: q } },
            ],
          },
          select: { id: true, question: true, category: true },
          take: 5,
        }),
        prisma.page.findMany({
          where: {
            OR: [
              { title: { contains: q } },
              { slug: { contains: q } },
            ],
          },
          select: { id: true, title: true, slug: true },
          take: 5,
        }),
      ])

    const results = [
      ...papers.map((p) => ({
        id: p.id,
        title: p.title,
        subtitle: `${p.authors} · ${p.year}`,
        type: 'Research Paper' as const,
        editUrl: `/admin/papers/${p.id}/edit`,
      })),
      ...materials.map((m) => ({
        id: m.id,
        title: m.title,
        subtitle: m.fileType.toUpperCase(),
        type: 'Material' as const,
        editUrl: `/admin/materials/${m.id}/edit`,
      })),
      ...projects.map((p) => ({
        id: p.id,
        title: p.title,
        subtitle: null,
        type: 'Project' as const,
        editUrl: `/admin/projects/${p.id}/edit`,
      })),
      ...achievements.map((a) => ({
        id: a.id,
        title: a.title,
        subtitle: `${a.type} · ${a.year}`,
        type: 'Achievement' as const,
        editUrl: `/admin/achievements/${a.id}/edit`,
      })),
      ...qaItems.map((qa) => ({
        id: qa.id,
        title: qa.question,
        subtitle: qa.category || null,
        type: 'Q&A' as const,
        editUrl: `/admin/qa/${qa.id}/edit`,
      })),
      ...pages.map((p) => ({
        id: p.id,
        title: p.title,
        subtitle: `/${p.slug}`,
        type: 'Page' as const,
        editUrl: `/admin/pages/${p.id}/edit`,
      })),
    ]

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
