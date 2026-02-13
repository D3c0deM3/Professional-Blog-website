export interface User {
  id: string
  email: string
  name?: string
  role: string
}

export interface Page {
  id: string
  slug: string
  title: string
  content: string
  metaDescription?: string
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Paper {
  id: string
  title: string
  authors: string
  journal: string
  year: number
  abstract: string
  language: string
  doi?: string
  pdfUrl?: string
  contentType: 'pdf' | 'written'
  content?: string
  published: boolean
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface Material {
  id: string
  title: string
  description: string
  fileUrl: string
  fileType: string
  fileSize: string
  categoryId: string
  category: Category
  published: boolean
  downloadCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string
  githubUrl?: string
  demoUrl?: string
  imageUrl?: string
  featured: boolean
  published: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Achievement {
  id: string
  title: string
  description: string
  year: number
  institution?: string
  type: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface QuestionSubmission {
  id: string
  name: string
  email: string
  subject: string
  question: string
  status: 'pending' | 'answered' | 'published'
  answer?: string
  publishedAsQA: boolean
  createdAt: Date
  updatedAt: Date
}

export interface QA {
  id: string
  question: string
  answer: string
  category?: string
  order: number
  published: boolean
  views: number
  createdAt: Date
  updatedAt: Date
}

export interface Contact {
  id: string
  email: string
  phone?: string
  office?: string
  officeHours?: string
  linkedin?: string
  github?: string
  twitter?: string
  googleScholar?: string
}

export interface SiteSetting {
  id: string
  key: string
  value: string
  updatedAt: Date
}
