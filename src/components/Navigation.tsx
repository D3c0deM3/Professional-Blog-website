'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Binary, Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/visualizations', label: 'Visual Lab' },
  { href: '/about', label: 'About' },
  { href: '/research', label: 'Research' },
  { href: '/materials', label: 'Materials' },
  { href: '/projects', label: 'Projects' },
  { href: '/achievements', label: 'Awards' },
  { href: '/qa', label: 'Q&A' },
  { href: '/ask-question', label: 'Ask' },
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
  const brandLabel = professorName || siteTitle || ''

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-400 ${
        isSolid
          ? 'h-[4.5rem] border-b border-slate-200/80 bg-[rgba(248,251,253,0.82)] shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-2xl'
          : 'h-20 bg-transparent'
      }`}
      style={{ transitionTimingFunction: 'var(--ease-smooth)' }}
    >
      <nav className="h-full container-padding">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          <Link
            href="/"
            onClick={(event) => {
              event.preventDefault()
              navigate('/')
            }}
            className="group flex min-w-0 items-center gap-3 transition-colors duration-300"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/80 text-primary shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
              <Binary className="h-4 w-4" />
            </span>
            <span className="min-w-0 truncate font-display text-base tracking-tight text-slate-950 sm:text-lg md:text-xl">
              {brandLabel}
            </span>
          </Link>

          <div className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-white/75 p-1.5 shadow-sm backdrop-blur-sm xl:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(event) => {
                  event.preventDefault()
                  navigate(link.href)
                }}
                prefetch
                className={`whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium transition-all duration-300 ${
                  isLinkActive(pathname || '/', link.href)
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-2xl border border-slate-200/80 bg-white/75 p-2 transition-colors duration-300 hover:bg-slate-100 xl:hidden"
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
        className={`fixed inset-x-0 top-[4.5rem] overflow-hidden border-b border-slate-200/80 bg-[rgba(248,251,253,0.96)] transition-all duration-500 xl:hidden ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ transitionTimingFunction: 'var(--ease-smooth)' }}
      >
        <div className="container-padding space-y-4 py-6">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(event) => {
                event.preventDefault()
                navigate(link.href)
              }}
              prefetch
              className={`block rounded-2xl px-4 py-3 text-base font-medium transition-all duration-300 ${
                isLinkActive(pathname || '/', link.href)
                  ? 'bg-slate-950 text-white'
                  : 'bg-white/70 text-slate-600 hover:bg-slate-100 hover:text-slate-950'
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
