import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user || user.role !== "STORE_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const store = await prisma.store.findUnique({
      where: { ownerId: user.id },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    const averageRating =
      store.ratings.length > 0 ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length : 0

    return NextResponse.json({
      store: {
        id: store.id,
        name: store.name,
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings: store.ratings.length,
      },
      ratings: store.ratings.map((rating) => ({
        id: rating.id,
        rating: rating.rating,
        createdAt: rating.createdAt,
        user: rating.user,
      })),
    })
  } catch (error) {
    console.error("Store owner dashboard error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
