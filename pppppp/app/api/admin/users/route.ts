import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { userSchema } from "@/lib/validations"
import { hashPassword } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const roleFilter = searchParams.get("role") || ""
    const sortBy = searchParams.get("sortBy") || "name"
    const sortOrder = searchParams.get("sortOrder") || "asc"

    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { address: { contains: search, mode: "insensitive" } },
            ],
          },
          roleFilter ? { role: roleFilter as any } : {},
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        store: {
          select: {
            name: true,
            ratings: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    })

    const usersWithRating = users.map((user) => ({
      ...user,
      storeRating:
        user.store && user.store.ratings.length > 0
          ? user.store.ratings.reduce((sum, r) => sum + r.rating, 0) / user.store.ratings.length
          : null,
    }))

    return NextResponse.json({ users: usersWithRating })
  } catch (error) {
    console.error("Get users error:", error)
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
    const validatedData = userSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(validatedData.password)

    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        address: validatedData.address,
        role: validatedData.role,
      },
    })

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
