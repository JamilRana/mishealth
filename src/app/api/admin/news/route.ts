import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: Request) {
  const session = await auth()

  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { titleEn, titleBn, contentEn, contentBn, excerptEn, excerptBn, isUrgent, coverImage } = body

    console.log("📝 Creating news with coverImage:", coverImage)
    console.log("📝 coverImage type:", typeof coverImage, "value:", coverImage)

    const slugBase = titleEn.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")
    const slug = `${slugBase}-${crypto.randomBytes(4).toString('hex')}`

    const newsData = {
      titleEn,
      titleBn,
      slug,
      contentEn,
      contentBn,
      excerptEn,
      excerptBn,
      coverImage: coverImage && coverImage.trim() !== "" ? coverImage : null,
      published: true,
      isUrgent: isUrgent || false,
    }

    console.log("📝 News data - titleEn:", titleEn, "coverImage:", coverImage)

    const news = await prisma.news.create({
      data: newsData,
    })

    console.log("✅ News created:", news.id, "coverImage:", news.coverImage)

    // Log Activity
    await prisma.activityLog.create({
      data: {
        action: `Created News: ${titleEn}`,
        entity: "NEWS",
        entityId: news.id,
        userId: session.user.id!,
      },
    })

    return NextResponse.json(news)
  } catch (error) {
    console.error("API Error [POST /api/admin/news]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
