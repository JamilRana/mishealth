import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { titleEn, titleBn, categoryEn, categoryBn, fileUrl, fileType, fileSize, year } = body

    const document = await prisma.document.create({
      data: {
        titleEn,
        titleBn,
        categoryEn,
        categoryBn,
        fileUrl,
        year: year || new Date().getFullYear(),
        fileType: fileType || "PDF",
      },
    })

    await prisma.activityLog.create({
      data: {
        action: `Uploaded/Created Document: ${titleEn}`,
        entity: "DOCUMENT",
        entityId: document.id,
        userId: session.user.id!,
      },
    })

    return NextResponse.json(document)
  } catch (error) {
    console.error("API Error [POST /api/admin/documents]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
