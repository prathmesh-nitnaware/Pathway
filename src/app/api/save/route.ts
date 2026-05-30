import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const savedColleges = await prisma.savedCollege.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        college: true
      },
      orderBy: {
        id: 'desc'
      }
    });

    return new Response(JSON.stringify(savedColleges), { status: 200 });

  } catch (error: any) {
    console.error("Get saved colleges error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const body = await req.json();
    const { collegeId } = body;

    if (!collegeId) {
      return new Response(JSON.stringify({ error: "College ID is required" }), { status: 400 });
    }

    const savedCollege = await prisma.savedCollege.create({
      data: {
        userId: session.user.id,
        collegeId
      },
      include: {
        college: true
      }
    });

    return new Response(JSON.stringify({ savedCollege, message: "College saved successfully" }), { status: 201 });

  } catch (error: any) {
    if (error.code === 'P2002') {
      return new Response(JSON.stringify({ error: "College is already saved" }), { status: 400 });
    }
    console.error("Save college error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const collegeId = searchParams.get('collegeId');

    if (!collegeId) {
      return new Response(JSON.stringify({ error: "College ID is required" }), { status: 400 });
    }

    await prisma.savedCollege.deleteMany({
      where: {
        userId: session.user.id,
        collegeId
      }
    });

    return new Response(JSON.stringify({ message: "College removed from saved list" }), { status: 200 });

  } catch (error: any) {
    console.error("Delete saved college error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
