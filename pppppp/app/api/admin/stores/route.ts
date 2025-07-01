import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { storeSchema } from "@/lib/validations"
import { hashPassword } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const sortBy = searchParams.get("sortBy") || "name"
    const sortOrder = searchParams.get("sortOrder") || "asc"

    const stores = await prisma.store.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } },
        ],
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
            address: true,
          },
        },
        ratings: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    })

    const storesWithRating = stores.map((store) => ({
      ...store,
      averageRating:
        store.ratings.length > 0 ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length : 0,
    }))

    return NextResponse.json({ stores: storesWithRating })
  } catch (error) {
    console.error("Get stores error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = storeSchema.parse(body)

    // Check if store email already exists
    const existingStore = await prisma.store.findUnique({
      where: { email: validatedData.email },
    })

    if (existingStore) {
      return NextResponse.json({ error: "Store with this email already exists" }, { status: 400 })
    }

    // Check if owner email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password and create store owner and store
    const hashedPassword = await hashPassword(validatedData.ownerPassword)

    const result = await prisma.$transaction(async (tx) => {
      // Create store owner
      const owner = await tx.user.create({
        data: {
          name: validatedData.ownerName,
          email: validatedData.email,
          password: hashedPassword,
          address: validatedData.address,
          role: "STORE_OWNER",
        },
      })

      // Create store
      const store = await tx.store.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          address: validatedData.address,
          ownerId: owner.id,
        },
      })

      return { owner, store }
    })

    return NextResponse.json({
      message: "Store and owner created successfully",
      store: result.store,
    })
  } catch (error) {
    console.error("Create store error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
