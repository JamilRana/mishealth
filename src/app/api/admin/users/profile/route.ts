import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PUT(req: Request) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, password } = await req.json()
    const updateData: any = { name }

    if (password && password.length >= 6) {
      updateData.password = await bcrypt.hash(password, 10)
    } else if (password && password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    })

    // Log the activity
    await prisma.activityLog.create({
      data: {
        action: `Updated Profile Identity for: ${user.email}`,
        entity: "USER",
        entityId: user.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API Error [PUT /api/admin/users/profile]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
