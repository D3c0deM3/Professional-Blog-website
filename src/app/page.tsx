import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
import Navigation from '@/components/Navigation'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import ResearchPapers from '@/sections/ResearchPapers'
import AcademicMaterials from '@/sections/AcademicMaterials'
import Projects from '@/sections/Projects'
import Achievements from '@/sections/Achievements'
import QA from '@/sections/QA'
import AskQuestion from '@/sections/AskQuestion'
import Contact from '@/sections/Contact'
import Footer from '@/components/Footer'

export default async function Home() {
  const [
    settings,
    aboutPage,
    papers,
    categories,
    materials,
    projects,
    achievements,
    qaItems,
    contact,
    papersCount,
    achievementsCount,
  ] = await Promise.all([
    prisma.siteSetting.findMany(),
    prisma.page.findFirst({ where: { slug: 'about', published: true } }),
    prisma.paper.findMany({
      where: { published: true },
      orderBy: { year: 'desc' },
      take: 6,
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.material.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 12,
    }),
    prisma.project.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
      take: 6,
    }),
    prisma.achievement.findMany({
      orderBy: [{ year: 'desc' }, { order: 'asc' }],
      take: 8,
    }),
    prisma.qA.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
      take: 8,
    }),
    prisma.contact.findFirst(),
    prisma.paper.count({ where: { published: true } }),
    prisma.achievement.count(),
  ])

  const settingsMap = settings.reduce<Record<string, string>>((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {})

  const stats = [
    {
      label: 'Years Teaching',
      value: parseInt(settingsMap.yearsTeaching || '0', 10),
      suffix: '+',
    },
    {
      label: 'Publications',
      value: papersCount,
      suffix: '+',
    },
    {
      label: 'Students Mentored',
      value: parseInt(settingsMap.studentsMentored || '0', 10),
      suffix: '+',
    },
    {
      label: 'Awards',
      value: parseInt(settingsMap.awardsCount || String(achievementsCount), 10),
      suffix: '',
    },
  ]

  return (
    <main className="min-h-screen">
      <Navigation
        siteTitle={settingsMap.siteTitle}
        professorName={settingsMap.professorName}
      />
      <Hero settings={settingsMap} />
      <About
        content={aboutPage?.content || ''}
        cvUrl={settingsMap.cvUrl}
        profileImageUrl={settingsMap.profileImageUrl}
        professorName={settingsMap.professorName}
      />
      <ResearchPapers papers={papers} />
      <AcademicMaterials categories={categories} materials={materials} />
      <Projects projects={projects} />
      <Achievements achievements={achievements} stats={stats} />
      <QA items={qaItems} />
      <AskQuestion contact={contact} />
      <Contact contact={contact} />
      <Footer footerText={settingsMap.footerText} />
    </main>
  )
}
