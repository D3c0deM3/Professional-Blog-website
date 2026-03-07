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

  return (
    <AlgorithmicBackground
      density="low"
      motionScale={0.65}
      className="fixed inset-0 -z-10 opacity-80"
    />
  )
}
