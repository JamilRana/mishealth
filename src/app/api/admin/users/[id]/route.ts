import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { id } = await params

  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, email, role, password } = body

    const data: any = { name, email, role }
    if (password) {
      data.password = await bcrypt.hash(password, 10)
    }

    const user = await prisma.user.update({
      where: { id },
      data,
    })

    await prisma.activityLog.create({
      data: {
        action: `Updated User Account: ${email} (${role})`,
        entity: "USER",
        entityId: id,
        userId: session.user.id!,
      },
    })

    return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role })
  } catch (error) {
    console.error("API Error [PUT /api/admin/users/[id]]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { id } = await params

  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Prevent self-deletion
  if (id === session.user.id) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 })
  }

  try {
    const user = await prisma.user.delete({
       where: { id }
    })

    await prisma.activityLog.create({
      data: {
        action: `Deleted User Account: ${user.email}`,
        entity: "USER",
        entityId: id,
        userId: session.user.id!,
      },
    })

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("API Error [DELETE /api/admin/users/[id]]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
