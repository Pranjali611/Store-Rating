import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ratingSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user || user.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = ratingSchema.parse(body)

    // Check if store exists
    const store = await prisma.store.findUnique({
      where: { id: validatedData.storeId },
    })

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    // Upsert rating (create or update)
    const rating = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId: user.id,
          storeId: validatedData.storeId,
        },
      },
      update: {
        rating: validatedData.rating,
      },
      create: {
        rating: validatedData.rating,
        userId: user.id,
        storeId: validatedData.storeId,
      },
    })

    return NextResponse.json({
      message: "Rating submitted successfully",
      rating,
    })
  } catch (error) {
    console.error("Submit rating error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
