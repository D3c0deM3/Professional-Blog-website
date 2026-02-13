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
    <footer className="bg-secondary/60 border-t border-border">
      <div className="container-padding py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {footerText || ''}. All rights reserved.
          </p>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Admin
            </Link>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-300 group"
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
