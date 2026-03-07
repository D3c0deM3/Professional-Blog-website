'use client'

import { usePathname } from 'next/navigation'

export default function SitePageTransition({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
