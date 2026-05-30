import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              }
            }
          },
          orderBy: {
            id: 'desc'
          }
        },
      }
    });

    if (!college) {
      return new Response(JSON.stringify({ error: "College not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(college), { status: 200 });

  } catch (error: any) {
    console.error("College detail API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
