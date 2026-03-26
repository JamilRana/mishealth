import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { id } = await params

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { titleEn, titleBn, categoryEn, categoryBn, fileUrl, fileType } = body

    const document = await prisma.document.update({
      where: { id },
      data: {
        titleEn,
        titleBn,
        categoryEn,
        categoryBn,
        fileUrl,
        fileType,
      },
    })

    await prisma.activityLog.create({
      data: {
        action: `Updated Document: ${titleEn}`,
        entity: "DOCUMENT",
        entityId: document.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json(document)
  } catch (error) {
    console.error("API Error [PUT /api/admin/documents/[id]]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { id } = await params

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const document = await prisma.document.delete({
      where: { id },
    })

    await prisma.activityLog.create({
      data: {
        action: `Deleted Document: ${document.titleEn}`,
        entity: "DOCUMENT",
        entityId: document.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ message: "Document deleted successfully" })
  } catch (error) {
    console.error("API Error [DELETE /api/admin/documents/[id]]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
