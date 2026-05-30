import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsString = searchParams.get('ids');

    if (!idsString) {
      return new Response(JSON.stringify({ error: "No college IDs provided" }), { status: 400 });
    }

    const ids = idsString.split(',').filter(id => id.trim() !== '');

    if (ids.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid college IDs" }), { status: 400 });
    }

    const colleges = await prisma.college.findMany({
      where: {
        id: {
          in: ids
        }
      },
      include: {
        courses: true
      }
    });

    return new Response(JSON.stringify(colleges), { status: 200 });

  } catch (error: any) {
    console.error("Compare API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
