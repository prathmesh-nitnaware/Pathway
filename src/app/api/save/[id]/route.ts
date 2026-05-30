import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { id } = await params;

    // Check if the saved college exists and belongs to the user
    const savedCollege = await prisma.savedCollege.findUnique({
      where: {
        id
      }
    });

    if (!savedCollege) {
      return new Response(JSON.stringify({ error: "Saved college not found" }), { status: 404 });
    }

    if (savedCollege.userId !== session.user.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    await prisma.savedCollege.delete({
      where: {
        id
      }
    });

    return new Response(JSON.stringify({ message: "College removed from saved list" }), { status: 200 });

  } catch (error: any) {
    console.error("Delete saved college error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
