import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const papers = await prisma.paper.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(papers)
  } catch (error) {
    console.error('Error fetching papers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch papers' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, authors, journal, year, abstract, doi, pdfUrl, published, featured } = body

    const paper = await prisma.paper.create({
      data: {
        title,
        authors,
        journal,
        year: parseInt(year),
        abstract,
        doi,
        pdfUrl,
        published,
        featured,
      },
    })

    return NextResponse.json(paper, { status: 201 })
  } catch (error) {
    console.error('Error creating paper:', error)
    return NextResponse.json(
      { error: 'Failed to create paper' },
      { status: 500 }
    )
  }
}
