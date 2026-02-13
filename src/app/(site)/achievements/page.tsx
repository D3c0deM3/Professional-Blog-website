import Achievements from '@/sections/Achievements'
import { prisma } from '@/lib/prisma'
import { getSettingsMap } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'

export default async function AchievementsPage() {
  const [settingsMap, achievements, papersCount, achievementsCount] = await Promise.all([
    getSettingsMap(),
    prisma.achievement.findMany({
      orderBy: [{ year: 'desc' }, { order: 'asc' }],
      take: 100,
    }),
    prisma.paper.count({ where: { published: true } }),
    prisma.achievement.count(),
  ])

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

  return <Achievements achievements={achievements} stats={stats} />
}
