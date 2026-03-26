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

    const project = await prisma.project.update({
      where: { id },
      data: {
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
        ...(images && images.length > 0 ? {
          images: {
            deleteMany: {},
            create: images.map((img: { url: string; captionEn?: string; captionBn?: string }) => ({ 
              url: img.url,
              captionEn: img.captionEn || null,
              captionBn: img.captionBn || null
            }))
          }
        } : {})
      },
    })

    // Log Activity
    await prisma.activityLog.create({
      data: {
        action: `Updated Project: ${titleEn}`,
        entity: "PROJECT",
        entityId: project.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("API Error [PUT /api/admin/projects/[id]]:", error)
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
    const project = await prisma.project.delete({
      where: { id },
    })

    // Log Activity
    await prisma.activityLog.create({
      data: {
        action: `Deleted Project: ${project.titleEn}`,
        entity: "PROJECT",
        entityId: project.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("API Error [DELETE /api/admin/projects/[id]]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
