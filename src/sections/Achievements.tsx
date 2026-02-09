'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Award, BookOpen, GraduationCap, Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface Achievement {
  id: string
  title: string
  description: string
  year: number
  institution?: string | null
  type: string
}

interface StatItem {
  label: string
  value: number
  suffix?: string
}

interface AchievementsProps {
  achievements: Achievement[]
  stats: StatItem[]
}

const typeIcons: Record<string, React.ReactNode> = {
  award: <Trophy className="h-5 w-5" />,
  publication: <BookOpen className="h-5 w-5" />,
  grant: <Award className="h-5 w-5" />,
  education: <GraduationCap className="h-5 w-5" />,
}

export default function Achievements({ achievements, stats }: AchievementsProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="achievements" className="section-padding">
      <div className="container-padding mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          <div className="mx-auto mb-4 h-10 w-px bg-border" />
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">Achievements</h2>
          <p className="mt-4 text-base text-muted-foreground">
            Milestones and recognition across teaching, research, and service.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.05 }}
              className="rounded-xl border border-border bg-secondary/40 px-6 py-5 text-center"
            >
              <div className="font-display text-3xl text-foreground">
                {stat.value}
                {stat.suffix || ''}
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.05 }}
            >
              <Card className="h-full">
                <CardContent className="flex h-full gap-4 p-6">
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
                    {typeIcons[achievement.type] || <Award className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {achievement.year}
                    </div>
                    <h3 className="mt-2 font-display text-lg">{achievement.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{achievement.description}</p>
                    {achievement.institution && (
                      <p className="mt-2 text-xs text-muted-foreground">{achievement.institution}</p>
                    )}
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
