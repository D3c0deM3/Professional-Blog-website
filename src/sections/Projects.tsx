'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Project {
  id: string
  title: string
  description: string
  technologies: string
  githubUrl?: string | null
  demoUrl?: string | null
  imageUrl?: string | null
}

interface ProjectsProps {
  projects: Project[]
}

export default function Projects({ projects }: ProjectsProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="projects" className="section-padding bg-secondary/40">
      <div className="container-padding mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <div className="flex items-center gap-4 text-xs uppercase tracking-[0.35em] text-muted-foreground">
              <span>Projects</span>
              <span className="divider-line" />
            </div>
            <h2 className="mt-6 font-display text-3xl sm:text-4xl md:text-5xl">Algorithmic Projects</h2>
            <p className="mt-4 text-base text-muted-foreground">
              Implementation-focused work spanning algorithm design and data structure engineering.
            </p>
          </div>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.08 }}
            >
              <Card className="h-full">
                <CardContent className="grid h-full gap-6 p-6 md:grid-cols-[1fr_1.2fr]">
                  <div className="relative h-44 overflow-hidden rounded-xl border border-border bg-secondary/60">
                    {project.imageUrl ? (
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
                        Project
                      </div>
                    )}
                  </div>
                  <div className="flex h-full flex-col gap-3">
                    <div>
                      <h3 className="font-display text-xl">{project.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.split(',').map((tech) => (
                        <Badge key={tech.trim()} variant="outline">
                          {tech.trim()}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-auto flex flex-wrap gap-2">
                      {project.githubUrl && (
                        <Button asChild size="sm" variant="outline">
                          <Link href={project.githubUrl}>
                            <Github className="h-4 w-4" />
                            GitHub
                          </Link>
                        </Button>
                      )}
                      {project.demoUrl && (
                        <Button asChild size="sm" variant="outline">
                          <Link href={project.demoUrl}>
                            <ExternalLink className="h-4 w-4" />
                            Demo
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
