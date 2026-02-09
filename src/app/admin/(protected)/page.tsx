'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Eye,
  FileText,
  FolderGit,
  HelpCircle,
  MessageSquare,
  Trophy,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface DashboardStats {
  papers: number
  materials: number
  projects: number
  achievements: number
  qa: number
  pendingQuestions: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    papers: 0,
    materials: 0,
    projects: 0,
    achievements: 0,
    qa: 0,
    pendingQuestions: 0,
  })

  useEffect(() => {
    // Fetch dashboard stats
    Promise.all([
      fetch('/api/admin/stats').then(res => res.json()),
    ])
      .then(([statsData]) => {
        setStats(statsData)
      })
      .catch(console.error)
  }, [])

  const statCards = [
    { label: 'Research Papers', value: stats.papers, icon: FileText, href: '/admin/papers' },
    { label: 'Materials', value: stats.materials, icon: BookOpen, href: '/admin/materials' },
    { label: 'Projects', value: stats.projects, icon: FolderGit, href: '/admin/projects' },
    { label: 'Achievements', value: stats.achievements, icon: Trophy, href: '/admin/achievements' },
    { label: 'Q&A Items', value: stats.qa, icon: HelpCircle, href: '/admin/qa' },
    { label: 'Pending Questions', value: stats.pendingQuestions, icon: MessageSquare, href: '/admin/questions' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin panel</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/" target="_blank">
            <Eye className="w-4 h-4" />
            View Website
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="transition-shadow"
            >
              <Card>
                <CardContent className="flex items-start justify-between p-6">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">{card.label}</p>
                    <p className="font-display text-3xl">{card.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg border border-border bg-secondary flex items-center justify-center text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <h2 className="font-display text-xl mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild variant="outline">
              <Link href="/admin/papers/new">
                <FileText className="w-5 h-5" />
                Add Paper
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/materials/new">
                <BookOpen className="w-5 h-5" />
                Add Material
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/projects/new">
                <FolderGit className="w-5 h-5" />
                Add Project
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/qa/new">
                <HelpCircle className="w-5 h-5" />
                Add Q&A
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
