'use client'

import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Download, FileText, Code, BookOpen, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { stripRichText } from '@/lib/rich-text'

interface Category {
  id: string
  name: string
  slug: string
}

interface Material {
  id: string
  title: string
  description: string
  fileUrl: string
  fileType: string
  fileSize: string
  category: Category
}

interface AcademicMaterialsProps {
  categories: Category[]
  materials: Material[]
}

const fileTypeIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-5 w-5" />,
  code: <Code className="h-5 w-5" />,
  video: <BookOpen className="h-5 w-5" />,
  archive: <Archive className="h-5 w-5" />,
}

export default function AcademicMaterials({ categories, materials }: AcademicMaterialsProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const shouldReduceMotion = useReducedMotion()

  const filteredMaterials = useMemo(() => {
    if (activeCategory === 'all') return materials
    return materials.filter((material) => material.category.slug === activeCategory)
  }, [activeCategory, materials])

  return (
    <section id="materials" className="section-padding">
      <div className="container-padding mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          <div className="mx-auto mb-4 h-10 w-px bg-border" />
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">Academic Materials</h2>
          <p className="mt-4 text-base text-muted-foreground">
            Lecture notes, assignments, and reusable resources for students.
          </p>
        </motion.div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('all')}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.slug ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category.slug)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {filteredMaterials.map((material, index) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.05 }}
            >
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-secondary/60 text-primary">
                      {fileTypeIcons[material.fileType] || <FileText className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg">{material.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{stripRichText(material.description)}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline">{material.category.name}</Badge>
                        <span>{material.fileSize}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Button asChild size="sm" variant="outline" className="gap-2">
                      <a href={material.fileUrl}>
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    </Button>
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
