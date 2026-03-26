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
    const { titleEn, titleBn, contentEn, contentBn, excerptEn, excerptBn, isUrgent, coverImage } = body

    console.log("📝 Updating news:", id, "with coverImage:", coverImage)

    const news = await prisma.news.update({
      where: { id },
      data: {
        titleEn,
        titleBn,
        contentEn,
        contentBn,
        excerptEn,
        excerptBn,
        coverImage: coverImage || null,
        isUrgent: isUrgent ?? false
      },
    })

    console.log("✅ News updated:", news.id, "coverImage:", news.coverImage)

    // Log Activity
    await prisma.activityLog.create({
      data: {
        action: `Updated News Bulletin: ${titleEn}`,
        entity: "NEWS",
        entityId: news.id,
        userId: session.user.id!,
      },
    })

    return NextResponse.json(news)
  } catch (error) {
    console.error("API Error [PUT /api/admin/news/[id]]:", error)
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
    const news = await prisma.news.delete({
      where: { id },
    })

    // Log Activity
    await prisma.activityLog.create({
      data: {
        action: `Deleted News Bulletin: ${news.titleEn}`,
        entity: "NEWS",
        entityId: news.id,
        userId: session.user.id!,
      },
    })

    return NextResponse.json({ message: "News deleted successfully" })
  } catch (error) {
    console.error("API Error [DELETE /api/admin/news/[id]]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
