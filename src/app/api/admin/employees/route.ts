import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const employees = await prisma.employee.findMany({
      orderBy: { order: "asc" }
    })
    return NextResponse.json(employees)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const { nameEn, nameBn, designationEn, designationBn, phone, email, image, responsibilitiesEn, responsibilitiesBn, order } = body

    const employee = await prisma.employee.create({
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
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 })
  }
}
