import type { Metadata } from 'next'
import { IBM_Plex_Sans, Source_Serif_4 } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import BackgroundGate from '@/components/BackgroundGate'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

const display = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700'],
})

const body = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Data Structures & Algorithms | Professor Portfolio',
  description: 'Academic portfolio of a PhD professor specializing in Data Structures and Algorithms research and teaching.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <BackgroundGate />
          {children}
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
