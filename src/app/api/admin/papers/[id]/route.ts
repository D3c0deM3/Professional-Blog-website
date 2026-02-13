import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const paper = await prisma.paper.findUnique({
      where: { id: id },
    })

    if (!paper) {
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(paper)
  } catch (error) {
    console.error('Error fetching paper:', error)
    return NextResponse.json(
      { error: 'Failed to fetch paper' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data: any = {}

    if (typeof body.title === 'string') data.title = body.title.trim()
    if (typeof body.authors === 'string') data.authors = body.authors.trim()
    if (typeof body.journal === 'string') data.journal = body.journal.trim()
    if (typeof body.abstract === 'string') data.abstract = body.abstract.trim()
    if (typeof body.doi === 'string') {
      data.doi = body.doi.trim() ? body.doi.trim() : null
    }

    if (typeof body.language === 'string') {
      const normalizedLanguage = body.language.trim()
      if (normalizedLanguage) {
        data.language = normalizedLanguage
      }
    }

    if (typeof body.year !== 'undefined') {
      const parsedYear = Number.parseInt(String(body.year), 10)
      if (!Number.isNaN(parsedYear)) {
        data.year = parsedYear
      }
    }

    if (typeof body.published === 'boolean') data.published = body.published
    if (typeof body.featured === 'boolean') data.featured = body.featured

    const hasContentType = typeof body.contentType === 'string'
    const normalizedContentType = body.contentType === 'written' ? 'written' : 'pdf'

    if (hasContentType && normalizedContentType === 'pdf') {
      const normalizedPdfUrl = typeof body.pdfUrl === 'string' ? body.pdfUrl.trim() : ''
      if (!normalizedPdfUrl) {
        return NextResponse.json(
          { error: 'PDF URL is required for PDF papers' },
          { status: 400 }
        )
      }
      data.contentType = 'pdf'
      data.pdfUrl = normalizedPdfUrl
      data.content = null
    }

    if (hasContentType && normalizedContentType === 'written') {
      const normalizedContent = typeof body.content === 'string' ? body.content.trim() : ''
      if (!normalizedContent) {
        return NextResponse.json(
          { error: 'Written content is required for written papers' },
          { status: 400 }
        )
      }
      data.contentType = 'written'
      data.content = normalizedContent
      data.pdfUrl = null
    }

    if (!hasContentType) {
      if (typeof body.pdfUrl === 'string') {
        data.pdfUrl = body.pdfUrl.trim() ? body.pdfUrl.trim() : null
      }
      if (typeof body.content === 'string') {
        data.content = body.content.trim() ? body.content.trim() : null
      }
    }

    const paper = await prisma.paper.update({
      where: { id: id },
      data,
    })

    return NextResponse.json(paper)
  } catch (error) {
    console.error('Error updating paper:', error)
    return NextResponse.json(
      { error: 'Failed to update paper' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await prisma.paper.delete({
      where: { id: id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting paper:', error)
    return NextResponse.json(
      { error: 'Failed to delete paper' },
      { status: 500 }
    )
  }
}
