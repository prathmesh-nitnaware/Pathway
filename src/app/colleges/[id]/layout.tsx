import { Metadata } from 'next'
import prisma from '@/lib/prisma'

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const college = await prisma.college.findUnique({
    where: { id },
    select: { name: true, location: true }
  })

  if (!college) {
    return { title: 'College Not Found' }
  }

  return {
    title: `${college.name} - Fees, Placements, Courses | College Discovery`,
    description: `Explore ${college.name} located in ${college.location}. View detailed information about fees, highest packages, top recruiters, and student reviews.`,
  }
}

export default function CollegeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
