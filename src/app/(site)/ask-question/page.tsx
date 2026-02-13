import AskQuestion from '@/sections/AskQuestion'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AskQuestionPage() {
  const contact = await prisma.contact.findFirst()

  return <AskQuestion contact={contact} />
}
