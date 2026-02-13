import { prisma } from '@/lib/prisma'

export async function getSettingsMap() {
  const settings = await prisma.siteSetting.findMany()

  return settings.reduce<Record<string, string>>((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {})
}
