'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

const AlgorithmicBackground = dynamic(
  () => import('@/components/AlgorithmicBackground'),
  { ssr: false }
)

export default function BackgroundGate() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const isHomePage = pathname === '/'

  return (
    <AlgorithmicBackground
      density={isHomePage ? 'medium' : 'low'}
      motionScale={isHomePage ? 0.9 : 0.6}
      className={`fixed inset-0 -z-10 ${isHomePage ? 'opacity-[0.92]' : 'opacity-75'}`}
    />
  )
}
