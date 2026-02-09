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

    const qa = await prisma.qA.findUnique({
      where: { id: id },
    })

    if (!qa) {
      return NextResponse.json(
        { error: 'Q&A item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(qa)
  } catch (error) {
    console.error('Error fetching Q&A item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Q&A item' },
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

    const qa = await prisma.qA.update({
      where: { id: id },
      data: body,
    })

    return NextResponse.json(qa)
  } catch (error) {
    console.error('Error updating Q&A item:', error)
    return NextResponse.json(
      { error: 'Failed to update Q&A item' },
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

    await prisma.qA.delete({
      where: { id: id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting Q&A item:', error)
    return NextResponse.json(
      { error: 'Failed to delete Q&A item' },
      { status: 500 }
    )
  }
}
