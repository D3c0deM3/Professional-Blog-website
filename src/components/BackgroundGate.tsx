'use client'

import { usePathname } from 'next/navigation'
import AlgorithmicBackground from '@/components/AlgorithmicBackground'

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
