import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Middleware-like function to verify admin access
async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return false;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  return user?.role === 'ADMIN';
}

// GET all colleges for the admin panel
export async function GET() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const colleges = await prisma.college.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(colleges);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch colleges' }, { status: 500 });
  }
}

// POST a new college
export async function POST(req: Request) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const data = await req.json();
    const college = await prisma.college.create({
      data: {
        name: data.name,
        location: data.location,
        description: data.description || '',
        fees: parseInt(data.fees),
        rating: parseFloat(data.rating),
        image: data.image || 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        avgPackage: data.avgPackage || '',
        highestPackage: data.highestPackage || '',
        establishedYear: parseInt(data.establishedYear) || new Date().getFullYear(),
      }
    });
    return NextResponse.json(college, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create college' }, { status: 500 });
  }
}

// DELETE a college
export async function DELETE(req: Request) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.college.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete college' }, { status: 500 });
  }
}
