'use client'

import type { ComponentProps } from 'react'
import { Toaster as Sonner } from 'sonner'

export function Toaster(props: ComponentProps<typeof Sonner>) {
  return (
    <Sonner
      theme="light"
      toastOptions={{
        style: {
          background: 'hsl(var(--card))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
        },
      }}
      {...props}
    />
  )
}
