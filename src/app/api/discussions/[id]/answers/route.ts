import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Verify question exists
    const question = await prisma.question.findUnique({ where: { id } });
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const answer = await prisma.answer.create({
      data: {
        content,
        questionId: id,
        authorId: session.user.id
      },
      include: {
        author: {
          select: { name: true, id: true }
        }
      }
    });

    return NextResponse.json(answer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to post answer' }, { status: 500 });
  }
}
