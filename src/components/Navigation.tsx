'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/research', label: 'Research Papers' },
  { href: '/materials', label: 'Academic Materials' },
  { href: '/projects', label: 'Projects' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/qa', label: 'Q&A' },
  { href: '/ask-question', label: 'Ask a Question' },
  { href: '/contact', label: 'Contact' },
]

interface NavigationProps {
  siteTitle?: string
  professorName?: string
}

function isLinkActive(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/'
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function Navigation({ siteTitle, professorName }: NavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    navLinks.forEach((link) => {
      router.prefetch(link.href)
    })
  }, [router])

  const navigate = (href: string) => {
    if (!href || pathname === href) {
      setIsMobileMenuOpen(false)
      return
    }

    router.push(href)

    setIsMobileMenuOpen(false)
  }

  const isHomePage = pathname === '/'
  const isSolid = !isHomePage || isScrolled || isMobileMenuOpen

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        isSolid
          ? 'bg-white/90 backdrop-blur-xl border-b border-border h-16'
          : 'bg-transparent h-20'
      }`}
      style={{ transitionTimingFunction: 'var(--ease-smooth)' }}
    >
      <nav className="h-full container-padding">
        <div className="h-full flex items-center justify-between max-w-7xl mx-auto">
          <Link
            href="/"
            onClick={(event) => {
              event.preventDefault()
              navigate('/')
            }}
            className="font-display text-lg md:text-xl tracking-tight hover:text-primary transition-colors duration-300"
          >
            {siteTitle || professorName || ''}
          </Link>

          <div className="hidden xl:flex items-center gap-2 rounded-full border border-border/70 bg-white/70 p-1 backdrop-blur-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(event) => {
                  event.preventDefault()
                  navigate(link.href)
                }}
                prefetch
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
                  isLinkActive(pathname || '/', link.href)
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 hover:bg-secondary rounded-lg transition-colors duration-300"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`xl:hidden fixed inset-x-0 top-16 bg-white border-b border-border transition-all duration-500 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ transitionTimingFunction: 'var(--ease-smooth)' }}
      >
        <div className="container-padding py-6 space-y-4">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(event) => {
                event.preventDefault()
                navigate(link.href)
              }}
              prefetch
              className={`block rounded-lg px-3 py-2 text-lg font-medium transition-all duration-300 ${
                isLinkActive(pathname || '/', link.href)
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
              }`}
              style={{
                transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
