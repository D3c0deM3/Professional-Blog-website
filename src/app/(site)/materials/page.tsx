import AcademicMaterials from '@/sections/AcademicMaterials'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function MaterialsPage() {
  const [categories, materials] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.material.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 60,
    }),
  ])

  return <AcademicMaterials categories={categories} materials={materials} />
}
