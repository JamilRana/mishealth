import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { uploadFile, initializeBucket } from "@/lib/storage"

let bucketInitialized = false

export async function POST(req: Request) {
  const session = await auth()

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Try to initialize bucket, but don't fail if it errors
    if (!bucketInitialized) {
      try {
        await initializeBucket()
      } catch (initError) {
        console.warn("MinIO bucket init failed, using local storage:", initError)
      }
      bucketInitialized = true
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Optional: Max size 10MB
    const MAX_SIZE = 10 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File exceeds 10MB limit" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const url = await uploadFile(buffer, file.name, file.type)

    return NextResponse.json({ 
      url, 
      name: file.name, 
      type: file.type,
      size: `${Math.round(file.size / 1024)} KB`
    })
  } catch (error) {
    console.error("API Error [POST /api/admin/upload]:", error)
    return NextResponse.json({ error: "Upload Failed" }, { status: 500 })
  }
}
