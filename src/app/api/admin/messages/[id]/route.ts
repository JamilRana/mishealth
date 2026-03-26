import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

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
    const { resolved } = body

    const message = await prisma.message.update({
      where: { id },
      data: { resolved },
    })

    // Log Activity
    await prisma.activityLog.create({
        data: {
          action: `Message Resolution changed for: ${message.email} (Resolved: ${resolved})`,
          entity: "MESSAGE",
          entityId: message.id,
          userId: session.user.id!,
        },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error("API Error [PUT /api/admin/messages/[id]]:", error)
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

  try {
    const message = await prisma.message.delete({
      where: { id },
    })

    // Log Activity
    await prisma.activityLog.create({
        data: {
          action: `Deleted Contact Message From: ${message.email}`,
          entity: "MESSAGE",
          entityId: message.id,
          userId: session.user.id!,
        },
    })

    return NextResponse.json({ message: "Message deleted successfully" })
  } catch (error) {
    console.error("API Error [DELETE /api/admin/messages/[id]]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
