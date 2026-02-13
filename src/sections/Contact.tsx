'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Github, GraduationCap, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react'

interface ContactInfo {
  email: string
  phone?: string | null
  office?: string | null
  officeHours?: string | null
  linkedin?: string | null
  github?: string | null
  twitter?: string | null
  googleScholar?: string | null
}

interface ContactProps {
  contact: ContactInfo | null
}

export default function Contact({ contact }: ContactProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="contact" className="section-padding bg-secondary/40">
      <div className="container-padding mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="mx-auto mb-4 h-10 w-px bg-border" />
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">Get in Touch</h2>
          <p className="mt-4 text-base text-muted-foreground">
            For research collaborations, student inquiries, or speaking opportunities.
          </p>
        </motion.div>

        {contact?.email && (
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="mt-10"
          >
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-3 text-xl font-display text-foreground hover:text-primary"
            >
              <Mail className="h-6 w-6" />
              {contact.email}
            </a>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
          className="mt-10 grid gap-6 md:grid-cols-3"
        >
          {contact?.phone && (
            <div className="rounded-xl border border-border bg-background/80 p-6">
              <Phone className="mx-auto h-5 w-5 text-muted-foreground" />
              <p className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Phone</p>
              <p className="mt-2 text-sm text-foreground">{contact.phone}</p>
            </div>
          )}
          {contact?.office && (
            <div className="rounded-xl border border-border bg-background/80 p-6">
              <MapPin className="mx-auto h-5 w-5 text-muted-foreground" />
              <p className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Office</p>
              <p className="mt-2 text-sm text-foreground">{contact.office}</p>
            </div>
          )}
          {contact?.officeHours && (
            <div className="rounded-xl border border-border bg-background/80 p-6">
              <Mail className="mx-auto h-5 w-5 text-muted-foreground" />
              <p className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Office Hours</p>
              <p className="mt-2 text-sm text-foreground">{contact.officeHours}</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          {contact?.googleScholar && (
            <Link
              href={contact.googleScholar}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground hover:text-primary"
              aria-label="Google Scholar"
            >
              <GraduationCap className="h-5 w-5" />
            </Link>
          )}
          {contact?.linkedin && (
            <Link
              href={contact.linkedin}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground hover:text-primary"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          )}
          {contact?.github && (
            <Link
              href={contact.github}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground hover:text-primary"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </Link>
          )}
          {contact?.twitter && (
            <Link
              href={contact.twitter}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground hover:text-primary"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  )
}
