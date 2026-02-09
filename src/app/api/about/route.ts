import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const page = await prisma.page.findFirst({
      where: { slug: 'about', published: true },
    })

    if (!page) {
      return NextResponse.json(
        { error: 'About page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: page.id,
      title: page.title,
      content: page.content,
      updatedAt: page.updatedAt,
    })
  } catch (error) {
    console.error('Error fetching about content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    )
  }
}
