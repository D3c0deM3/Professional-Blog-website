import About from '@/sections/About'
import { prisma } from '@/lib/prisma'
import { getSettingsMap } from '@/lib/site-settings'

export const revalidate = 60

export default async function AboutPage() {
  const [settingsMap, aboutPage] = await Promise.all([
    getSettingsMap(),
    prisma.page.findFirst({ where: { slug: 'about', published: true } }),
  ])

  return (
    <About
      content={aboutPage?.content || ''}
      cvUrl={settingsMap.cvUrl}
      profileImageUrl={settingsMap.profileImageUrl}
      professorName={settingsMap.professorName}
    />
  )
}
