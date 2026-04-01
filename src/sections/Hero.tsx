'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import RichContent from '@/components/RichContent'
import { cn } from '@/lib/utils'
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

function SurfacePanel({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn('algorithm-panel', className)}>{children}</div>
}

function HeroAlgorithmBoard() {
  return (
    <SurfacePanel className="algorithm-signal-grid overflow-hidden p-6 sm:p-7">
      <div className="pointer-events-none absolute -right-12 top-8 h-40 w-40 rounded-full border border-emerald-500/20 bg-emerald-300/10 blur-2xl" />
      <div className="pointer-events-none absolute -left-12 bottom-0 h-36 w-36 rounded-full border border-sky-500/20 bg-sky-300/10 blur-2xl" />

      <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-5 shadow-sm md:col-span-2">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Core Teaching Areas</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-950">From structural invariants to efficient algorithms.</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            The portfolio highlights the main foundations of data structures and algorithms: correctness, efficiency, balancing, traversal, and the way abstract models map to executable systems.
          </p>
        </div>

        {[
          'Balanced trees, rotations, and ordered search structures.',
          'Graph models, traversal logic, and connectivity reasoning.',
          'Stacks, queues, linked lists, and pointer-based operations.',
          'Algorithm analysis through complexity, proofs, and design strategy.',
          'Visualization-based teaching for search, balancing, and dynamic updates.',
          'Interactive demonstrations designed to support classroom explanation.',
        ].map((row) => (
          <div
            key={row}
            className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 text-sm font-medium leading-6 text-slate-700 shadow-sm"
          >
            {row}
          </div>
        ))}
      </div>
    </SurfacePanel>
  )
}

export default function Hero({ settings }: HeroProps) {
  const shouldReduceMotion = useReducedMotion()
  const headline = settings.heroHeadline || 'Data Structures & Algorithms'
  const primaryLabel = settings.heroPrimaryCtaLabel
  const primaryLink = normalizeCtaLink(settings.heroPrimaryCtaLink)
  const identityLine = settings.professorTitle || settings.department || ''

  const reveal = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
  }

  return (
    <div className="relative overflow-hidden pb-20">
      <section id="home" className="relative pt-28 sm:pt-32">
        <div className="container-padding relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <motion.div variants={reveal} initial="hidden" animate="show" className="relative space-y-8">
              <div className="space-y-5">
                {identityLine && <div className="algorithm-kicker">{identityLine}</div>}

                <div className="space-y-5">
                  <RichContent
                    content={headline}
                    className="text-balance font-display text-4xl text-slate-950 sm:text-5xl md:text-6xl lg:text-[4.4rem] [&_p]:my-0 [&_p]:leading-[1.02] [&_h1]:my-0 [&_h1]:text-inherit [&_h2]:my-0 [&_h2]:text-inherit"
                  />
                  <div className="max-w-2xl text-lg text-slate-600 [&_p]:my-0">
                    <RichContent
                      content={
                        settings.heroSubheadline ||
                        'Interactive visual systems for teaching algorithms, data structures, and rigorous computational thinking.'
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {primaryLabel && primaryLink && (
                  <Button asChild size="lg" className="rounded-full px-7 shadow-lg shadow-slate-900/10">
                    <Link href={primaryLink}>
                      {primaryLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                <Button asChild size="lg" variant="outline" className="rounded-full border-emerald-700/20 bg-emerald-50/70 px-7 text-emerald-800 hover:bg-emerald-100">
                  <Link href="/visualizations">Visualization Lab</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              variants={reveal}
              initial="hidden"
              animate="show"
              transition={{ delay: shouldReduceMotion ? 0 : 0.12 }}
            >
              <HeroAlgorithmBoard />
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  )
}
