import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true, id: true }
        },
        answers: {
          include: {
            author: {
              select: { name: true, id: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch discussion' }, { status: 500 });
  }
}
