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
    const { 
      titleEn, 
      titleBn, 
      descriptionEn, 
      descriptionBn, 
      categoryEn, 
      categoryBn, 
      status, 
      year, 
      locationEn, 
      locationBn,
      images
    } = body

    const slug = titleEn.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")

    const project = await prisma.project.create({
      data: {
        titleEn,
        titleBn,
        slug,
        descriptionEn,
        descriptionBn,
        categoryEn,
        categoryBn,
        status,
        year,
        locationEn,
        locationBn,
        ...(images && images.length > 0 ? {
          images: {
            create: images.map((img: { url: string; captionEn?: string; captionBn?: string }) => ({ 
              url: img.url,
              captionEn: img.captionEn || null,
              captionBn: img.captionBn || null
            }))
          }
        } : {}),
      },
    })

    // Log Activity
    await prisma.activityLog.create({
      data: {
        action: `Created Project: ${titleEn}`,
        entity: "PROJECT",
        entityId: project.id,
        userId: session.user.id!,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("API Error [POST /api/admin/projects]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
