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
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    const authors = typeof body.authors === 'string' ? body.authors.trim() : ''
    const journal = typeof body.journal === 'string' ? body.journal.trim() : ''
    const abstract = typeof body.abstract === 'string' ? body.abstract.trim() : ''
    const language = typeof body.language === 'string' && body.language.trim()
      ? body.language.trim()
      : 'English'
    const doi = typeof body.doi === 'string' && body.doi.trim() ? body.doi.trim() : null
    const year = Number.parseInt(String(body.year), 10)
    const contentType = body.contentType === 'written' ? 'written' : 'pdf'
    const published = typeof body.published === 'boolean' ? body.published : true
    const featured = typeof body.featured === 'boolean' ? body.featured : false

    if (!title || !authors || !journal || Number.isNaN(year)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const pdfUrl = contentType === 'pdf' && typeof body.pdfUrl === 'string' && body.pdfUrl.trim()
      ? body.pdfUrl.trim()
      : null
    const content = contentType === 'written' && typeof body.content === 'string'
      ? body.content.trim()
      : null

    if (contentType === 'pdf' && !pdfUrl) {
      return NextResponse.json(
        { error: 'PDF URL is required for PDF papers' },
        { status: 400 }
      )
    }

    if (contentType === 'written' && !content) {
      return NextResponse.json(
        { error: 'Written content is required for written papers' },
        { status: 400 }
      )
    }

    const paper = await prisma.paper.create({
      data: {
        title,
        authors,
        journal,
        year,
        abstract,
        language,
        doi,
        pdfUrl,
        contentType,
        content,
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
