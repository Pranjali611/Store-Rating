import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser, verifyPassword, hashPassword } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { passwordUpdateSchema } from "@/lib/validations"

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = passwordUpdateSchema.parse(body)

    // Get user with password
    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (!userWithPassword) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify current password
    const isValidPassword = await verifyPassword(validatedData.currentPassword, userWithPassword.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    // Hash new password and update
    const hashedNewPassword = await hashPassword(validatedData.newPassword)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    })

    return NextResponse.json({
      message: "Password updated successfully",
    })
  } catch (error) {
    console.error("Password update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
