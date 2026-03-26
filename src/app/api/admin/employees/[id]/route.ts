import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    const body = await req.json()
    const { nameEn, nameBn, designationEn, designationBn, phone, email, image, responsibilitiesEn, responsibilitiesBn, order } = body

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        nameEn,
        nameBn,
        designationEn,
        designationBn,
        phone,
        email,
        image,
        responsibilitiesEn,
        responsibilitiesBn,
        order: parseInt(order) || 0
      }
    })

    return NextResponse.json(employee)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    await prisma.employee.delete({
      where: { id }
    })
    return NextResponse.json({ message: "Employee deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 })
  }
}
