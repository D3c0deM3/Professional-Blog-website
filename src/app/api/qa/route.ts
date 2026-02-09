import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const qaItems = await prisma.qA.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(qaItems)
  } catch (error) {
    console.error('Error fetching Q&A:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Q&A' },
      { status: 500 }
    )
  }
}
