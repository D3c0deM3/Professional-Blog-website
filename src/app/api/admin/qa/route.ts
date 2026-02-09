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

    const items = await prisma.qA.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching Q&A items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Q&A items' },
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
    const { question, answer, category, order, published } = body

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      )
    }

    const qa = await prisma.qA.create({
      data: {
        question,
        answer,
        category,
        order: order ?? 0,
        published: published ?? true,
      },
    })

    return NextResponse.json(qa, { status: 201 })
  } catch (error) {
    console.error('Error creating Q&A item:', error)
    return NextResponse.json(
      { error: 'Failed to create Q&A item' },
      { status: 500 }
    )
  }
}
