'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Download, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AboutProps {
  content: string
  cvUrl?: string
  profileImageUrl?: string
  professorName?: string
}

export default function About({ content, cvUrl, profileImageUrl, professorName }: AboutProps) {
  const shouldReduceMotion = useReducedMotion()
  const initial = { opacity: 0, y: shouldReduceMotion ? 0 : 20 }

  return (
    <section id="about" className="section-padding">
      <div className="container-padding mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1.4fr] lg:items-center">
          <motion.div
            initial={initial}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-secondary/60">
              {profileImageUrl ? (
                <Image
                  src={profileImageUrl}
                  alt={professorName || 'Professor portrait'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-border bg-background text-3xl font-semibold">
                    {(professorName || '')
                      .split(' ')
                      .filter(Boolean)
                      .map((chunk) => chunk[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em]">Portrait</span>
                </div>
              )}
            </div>
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full border border-foreground/10" />
            <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full border border-foreground/10" />
          </motion.div>

          <motion.div
            initial={initial}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          >
            <div className="flex items-center gap-4 text-xs uppercase tracking-[0.35em] text-muted-foreground">
              <span>About</span>
              <span className="divider-line" />
            </div>
            <h2 className="mt-6 text-3xl font-display sm:text-4xl md:text-5xl">Academic Profile</h2>
            <div className="mt-8 space-y-4 text-base text-muted-foreground leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {cvUrl && (
                <Button asChild>
                  <Link href={cvUrl}>
                    <Download className="h-4 w-4" />
                    Download CV
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline">
                <Link href="/collaboration">
                  Read Full Bio
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
