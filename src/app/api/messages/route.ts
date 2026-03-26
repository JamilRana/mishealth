import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validated = contactSchema.parse(body)

    const message = await prisma.message.create({
      data: {
        name: validated.name,
        email: validated.email,
        subject: validated.subject,
        body: validated.message, // Map 'message' from form to 'body' in schema
        resolved: false,
      },
    })

    return NextResponse.json({ success: true, id: message.id })
  } catch (error) {
    console.error("API Error [POST /api/messages]:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid Data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
