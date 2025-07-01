import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const sortBy = searchParams.get("sortBy") || "name"
    const sortOrder = searchParams.get("sortOrder") || "asc"

    const stores = await prisma.store.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } },
        ],
      },
      include: {
        ratings: {
          select: {
            rating: true,
            userId: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    })

    const storesWithRating = stores.map((store) => {
      const userRating = store.ratings.find((r) => r.userId === user.id)
      const averageRating =
        store.ratings.length > 0 ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length : 0

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        averageRating: Math.round(averageRating * 10) / 10,
        userRating: userRating?.rating || null,
        totalRatings: store.ratings.length,
      }
    })

    return NextResponse.json({ stores: storesWithRating })
  } catch (error) {
    console.error("Get stores error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
