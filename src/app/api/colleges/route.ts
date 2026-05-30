import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const ratingStr = searchParams.get('rating');
    const feesStr = searchParams.get('fees');
    const pageStr = searchParams.get('page') || '1';
    const limitStr = searchParams.get('limit') || '10';
    
    const page = parseInt(pageStr, 10);
    const limit = parseInt(limitStr, 10);
    const skip = (page - 1) * limit;

    const whereClause: any = {
      AND: []
    };

    if (search) {
      whereClause.AND.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { courses: { some: { courseName: { contains: search, mode: 'insensitive' } } } }
        ]
      });
    }

    if (location) {
      whereClause.AND.push({
        location: { contains: location, mode: 'insensitive' }
      });
    }

    if (ratingStr) {
      const rating = parseFloat(ratingStr);
      if (!isNaN(rating)) {
        whereClause.AND.push({
          rating: { gte: rating }
        });
      }
    }

    if (feesStr) {
      const fees = parseFloat(feesStr);
      if (!isNaN(fees)) {
        whereClause.AND.push({
          fees: { lte: fees }
        });
      }
    }

    // If no conditions were added to AND, remove it
    const finalWhere = whereClause.AND.length > 0 ? whereClause : {};

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where: finalWhere,
        skip,
        take: limit,
        orderBy: { rating: 'desc' },
      }),
      prisma.college.count({ where: finalWhere })
    ]);

    return new Response(JSON.stringify({
      data: colleges,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }), { status: 200 });

  } catch (error: any) {
    console.error("Colleges API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
