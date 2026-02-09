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

    const [
      papers,
      materials,
      projects,
      achievements,
      qa,
      pendingQuestions,
    ] = await Promise.all([
      prisma.paper.count(),
      prisma.material.count(),
      prisma.project.count(),
      prisma.achievement.count(),
      prisma.qA.count(),
      prisma.questionSubmission.count({ where: { status: 'pending' } }),
    ])

    return NextResponse.json({
      papers,
      materials,
      projects,
      achievements,
      qa,
      pendingQuestions,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
