'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  FileText,
  FileStack,
  BookOpen,
  FolderGit,
  Trophy,
  HelpCircle,
  MessageSquare,
  Settings,
  LogOut,
  Mail,
  Layers,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/papers', label: 'Research Papers', icon: FileText },
  { href: '/admin/materials', label: 'Materials', icon: BookOpen },
  { href: '/admin/categories', label: 'Categories', icon: Layers },
  { href: '/admin/projects', label: 'Projects', icon: FolderGit },
  { href: '/admin/achievements', label: 'Achievements', icon: Trophy },
  { href: '/admin/pages', label: 'Pages', icon: FileStack },
  { href: '/admin/qa', label: 'Q&A', icon: HelpCircle },
  { href: '/admin/questions', label: 'Questions', icon: MessageSquare },
  { href: '/admin/contact', label: 'Contact', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-background flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/admin" className="font-display text-lg">
          Admin Panel
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              item.href === '/admin'
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-foreground ring-1 ring-primary/20 shadow-sm'
                      : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-3 px-4 py-3 w-full text-muted-foreground hover:bg-secondary rounded-lg transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
