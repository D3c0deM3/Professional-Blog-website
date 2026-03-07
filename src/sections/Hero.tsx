'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, FileText, Mail } from 'lucide-react'
import RichContent from '@/components/RichContent'
import { Button } from '@/components/ui/button'

interface HeroProps {
  settings: Record<string, string>
}

const sectionRouteMap: Record<string, string> = {
  '#about': '/about',
  '#research': '/research',
  '#materials': '/materials',
  '#projects': '/projects',
  '#achievements': '/achievements',
  '#qa': '/qa',
  '#ask-question': '/ask-question',
  '#contact': '/contact',
}

function normalizeCtaLink(link?: string) {
  if (!link) return ''
  if (link.startsWith('#')) {
    return sectionRouteMap[link] || '/'
  }
  return link
}

export default function Hero({ settings }: HeroProps) {
  const shouldReduceMotion = useReducedMotion()
  const headline = settings.heroHeadline || ''
  const primaryLabel = settings.heroPrimaryCtaLabel
  const primaryLink = normalizeCtaLink(settings.heroPrimaryCtaLink)
  const secondaryLabel = settings.heroSecondaryCtaLabel
  const secondaryLink = normalizeCtaLink(settings.heroSecondaryCtaLink)
  const identityLine = [settings.professorName, settings.professorTitle, settings.department]
    .filter(Boolean)
    .join(' · ')

  const container = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.12 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden pt-28"
    >
      <div className="container-padding relative z-10 mx-auto flex max-w-7xl flex-col items-center text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl space-y-8 px-6 py-10 sm:px-10 sm:py-12"
        >
          {identityLine && (
            <motion.div variants={item} className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              {identityLine}
            </motion.div>
          )}

          <motion.div variants={item}>
            <RichContent
              content={headline}
              className="text-balance font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl [&_p]:my-0 [&_p]:leading-[1.15] [&_h1]:my-0 [&_h1]:text-inherit [&_h2]:my-0 [&_h2]:text-inherit"
            />
          </motion.div>

          <motion.div variants={item} className="mx-auto max-w-2xl text-lg text-muted-foreground [&_p]:my-0">
            <RichContent content={settings.heroSubheadline || ''} />
          </motion.div>

          <motion.div variants={item} className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            {primaryLabel && primaryLink && (
              <Button asChild size="lg">
                <Link href={primaryLink}>
                  <FileText className="h-5 w-5" />
                  {primaryLabel}
                </Link>
              </Button>
            )}
            {secondaryLabel && secondaryLink && (
              <Button asChild size="lg" variant="outline">
                <Link href={secondaryLink}>
                  <Mail className="h-5 w-5" />
                  {secondaryLabel}
                </Link>
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>

    </section>
  )
}
