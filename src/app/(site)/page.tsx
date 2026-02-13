import Hero from '@/sections/Hero'
import { getSettingsMap } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const settingsMap = await getSettingsMap()

  return <Hero settings={settingsMap} />
}
