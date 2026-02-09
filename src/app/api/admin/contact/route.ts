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

    const contact = await prisma.contact.findFirst()

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Error fetching contact info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact info' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      email,
      phone,
      office,
      officeHours,
      linkedin,
      github,
      twitter,
      googleScholar,
    } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const existing = await prisma.contact.findFirst()

    const contact = existing
      ? await prisma.contact.update({
          where: { id: existing.id },
          data: {
            email,
            phone,
            office,
            officeHours,
            linkedin,
            github,
            twitter,
            googleScholar,
          },
        })
      : await prisma.contact.create({
          data: {
            email,
            phone,
            office,
            officeHours,
            linkedin,
            github,
            twitter,
            googleScholar,
          },
        })

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Error updating contact info:', error)
    return NextResponse.json(
      { error: 'Failed to update contact info' },
      { status: 500 }
    )
  }
}
