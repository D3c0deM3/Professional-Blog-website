import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SitePageTransition from '@/components/SitePageTransition'
import { getSettingsMap } from '@/lib/site-settings'

export const revalidate = 60

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settingsMap = await getSettingsMap()

  return (
    <main className="min-h-screen">
      <Navigation
        siteTitle={settingsMap.siteTitle}
        professorName={settingsMap.professorName}
      />
      <SitePageTransition>{children}</SitePageTransition>
      <Footer footerText={settingsMap.footerText} />
    </main>
  )
}
