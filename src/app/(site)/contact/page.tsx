import Contact from '@/sections/Contact'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

export default async function ContactPage() {
  const contact = await prisma.contact.findFirst()

  return <Contact contact={contact} />
}
