import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = { published: true }
    if (featured === 'true') {
      where.featured = true
    }

    const papers = await prisma.paper.findMany({
      where,
      orderBy: { year: 'desc' },
      take: limit,
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
