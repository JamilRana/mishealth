import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadBucketCommand, CreateBucketCommand, PutBucketPolicyCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import fs from "fs"
import path from "path"
import crypto from "crypto"

const S3_ENDPOINT = process.env.MINIO_ENDPOINT || "http://localhost:9000"
const S3_PUBLIC_URL = process.env.MINIO_PUBLIC_URL || S3_ENDPOINT
const S3_BUCKET = process.env.MINIO_BUCKET || "mis-portal"
const S3_REGION = process.env.MINIO_REGION || "us-east-1"
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || "minioadmin"
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || "minioadmin"

const USE_MINIO = MINIO_ACCESS_KEY && MINIO_SECRET_KEY && !MINIO_ACCESS_KEY.startsWith("YOUR_")

const s3Client = new S3Client({
  endpoint: S3_ENDPOINT,
  region: S3_REGION,
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
})

/**
 * Initialize MinIO bucket if it doesn't exist
 */
export async function initializeBucket(): Promise<boolean> {
  if (!USE_MINIO) return false

  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: S3_BUCKET }))
    console.log("✅ MinIO bucket already exists")
    return true
  } catch {
    try {
      await s3Client.send(new CreateBucketCommand({ Bucket: S3_BUCKET }))
      console.log("✅ MinIO bucket created")

      const policy = {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "PublicReadGetObject",
            Effect: "Allow",
            Principal: "*",
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${S3_BUCKET}/*`],
          },
        ],
      }

      await s3Client.send(
        new PutBucketPolicyCommand({
          Bucket: S3_BUCKET,
          Policy: JSON.stringify(policy),
        })
      )
      console.log("✅ MinIO bucket policy set")
      return true
    } catch (error) {
      console.error("❌ Failed to initialize MinIO bucket:", error)
      return false
    }
  }
}

/**
 * Uploads a file buffer to storage (MinIO or Local Fallback).
 * Returns the public access URL.
 */
export async function uploadFile(file: Buffer, originalFileName: string, contentType: string): Promise<string> {
  const fileExt = path.extname(originalFileName)
  const uniqueName = `${crypto.randomUUID()}${fileExt}`

  if (USE_MINIO) {
    try {
      const command = new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: uniqueName,
        Body: file,
        ContentType: contentType,
      })

      await s3Client.send(command)
      return `${S3_PUBLIC_URL}/${S3_BUCKET}/${uniqueName}`
    } catch (error) {
      console.error("MinIO Upload Error, falling back to local:", error)
    }
  }

  // Local Fallback
  const uploadDir = path.join(process.cwd(), "public", "uploads")
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }
  const fullPath = path.join(uploadDir, uniqueName)
  fs.writeFileSync(fullPath, file)
  return `/uploads/${uniqueName}`
}

/**
 * Generates a presigned URL for secure direct browser uploads.
 */
export async function getUploadUrl(fileName: string, contentType: string): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
  const fileExt = path.extname(fileName)
  const key = `${crypto.randomUUID()}${fileExt}`

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: contentType,
  })

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
  const publicUrl = `${S3_PUBLIC_URL}/${S3_BUCKET}/${key}`

  return { uploadUrl, key, publicUrl }
}

/**
 * Generates a presigned URL for downloading a file.
 */
export async function getDownloadUrl(key: string): Promise<string> {
  if (!USE_MINIO) {
    return `/${key}`
  }

  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
  })

  return getSignedUrl(s3Client, command, { expiresIn: 3600 })
}

/**
 * Deletes a file from storage.
 */
export async function deleteFile(key: string): Promise<boolean> {
  if (!USE_MINIO) {
    const filePath = path.join(process.cwd(), "public", key)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
    return true
  }

  try {
    await s3Client.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }))
    return true
  } catch (error) {
    console.error("Delete Error:", error)
    return false
  }
}

/**
 * Extracts key from MinIO URL or path
 */
export function extractKey(urlOrPath: string): string {
  if (urlOrPath.startsWith("http")) {
    const url = new URL(urlOrPath)
    return url.pathname.replace(`/${S3_BUCKET}/`, "")
  }
  return urlOrPath.replace("/uploads/", "")
}
