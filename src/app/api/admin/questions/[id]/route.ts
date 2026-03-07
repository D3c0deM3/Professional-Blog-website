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

    const question = await prisma.questionSubmission.findUnique({
      where: { id: id },
      include: { qa: true },
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(question)
  } catch (error) {
    console.error('Error fetching question:', error)
    return NextResponse.json(
      { error: 'Failed to fetch question' },
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

    await prisma.questionSubmission.delete({
      where: { id: id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting question:', error)
    return NextResponse.json(
      { error: 'Failed to delete question' },
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
    const { answer, publish, category } = body as {
      answer?: string
      publish?: boolean
      category?: string
    }

    const submission = await prisma.questionSubmission.findUnique({
      where: { id: id },
      include: { qa: true },
    })

    if (!submission) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    if (publish) {
      if (!answer || answer.trim().length === 0) {
        return NextResponse.json(
          { error: 'Answer is required to publish' },
          { status: 400 }
        )
      }

      const qa = submission.qa
        ? await prisma.qA.update({
            where: { id: submission.qa.id },
            data: {
              answer,
              category: category || submission.qa.category,
              published: true,
            },
          })
        : await prisma.qA.create({
            data: {
              question: submission.question,
              answer,
              category,
              published: true,
              submissionId: submission.id,
            },
          })

      const updated = await prisma.questionSubmission.update({
        where: { id: id },
        data: {
          answer,
          status: 'published',
          publishedAsQA: true,
        },
      })

      return NextResponse.json({ submission: updated, qa })
    }

    const updated = await prisma.questionSubmission.update({
      where: { id: id },
      data: {
        answer,
        status: answer ? 'answered' : 'pending',
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating question:', error)
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    )
  }
}
