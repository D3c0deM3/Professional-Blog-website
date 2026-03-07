import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const contact = await prisma.contact.findFirst()

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact info not found' },
        { status: 404 }
      )
    }

    const response = NextResponse.json(contact)
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    return response
  } catch (error) {
    console.error('Error fetching contact:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact info' },
      { status: 500 }
    )
  }
}
