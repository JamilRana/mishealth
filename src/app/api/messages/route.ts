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
    console.log("Received message:", body)
    const validated = contactSchema.parse(body)

    const message = await prisma.message.create({
      data: {
        name: validated.name,
        email: validated.email,
        subject: validated.subject,
        body: validated.message,
        resolved: false,
      },
    })

    console.log("Message created:", message.id)
    return NextResponse.json({ success: true, id: message.id })
  } catch (error) {
    console.error("API Error [POST /api/messages]:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid Data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal Server Error", message: String(error) }, { status: 500 })
  }
}
