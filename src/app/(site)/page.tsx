import Hero from '@/sections/Hero'
import { getSettingsMap } from '@/lib/site-settings'

export const revalidate = 60

export default async function HomePage() {
  const settingsMap = await getSettingsMap()

  return <Hero settings={settingsMap} />
}
