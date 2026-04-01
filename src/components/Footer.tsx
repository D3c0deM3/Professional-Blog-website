'use client'

import Link from 'next/link'
import { ArrowUp } from 'lucide-react'

interface FooterProps {
  footerText?: string
  onBackToTop?: () => void
}

export default function Footer({ footerText, onBackToTop }: FooterProps) {
  const scrollToTop = () => {
    if (onBackToTop) {
      onBackToTop()
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative mt-20 border-t border-slate-200/70 bg-white/40 dark:border-white/10 dark:bg-slate-950/40">
      <div className="algorithm-signal-grid absolute inset-0 opacity-25" aria-hidden />
      <div className="container-padding relative py-8">
        <div className="algorithm-panel mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Interactive Data Structures & Algorithms portfolio</p>
            <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
              © {new Date().getFullYear()} {footerText || ''}. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300 hover:text-slate-950 dark:hover:text-white"
            >
              Admin
            </Link>
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 transition-all duration-300 hover:text-slate-950 dark:hover:text-white"
            >
              <span>Back to top</span>
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
