#!/usr/bin/env node

import { S3Client, HeadBucketCommand, CreateBucketCommand, PutBucketPolicyCommand, PutPublicAccessBlockCommand } from "@aws-sdk/client-s3"

const S3_ENDPOINT = process.env.MINIO_ENDPOINT || "http://localhost:9000"
const S3_BUCKET = process.env.MINIO_BUCKET || "mis-portal"
const S3_REGION = process.env.MINIO_REGION || "us-east-1"
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || "minioadmin"
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || "minioadmin"

const s3Client = new S3Client({
  endpoint: S3_ENDPOINT,
  region: S3_REGION,
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
})

async function setupMinIO() {
  console.log("🔧 Setting up MinIO bucket...\n")

  try {
    console.log(`📡 Connecting to MinIO at ${S3_ENDPOINT}...`)
    
    // Check if bucket exists
    await s3Client.send(new HeadBucketCommand({ Bucket: S3_BUCKET }))
    console.log(`✅ Bucket "${S3_BUCKET}" already exists`)
  } catch (error: any) {
    if (error.name === "NoSuchBucket" || error.$metadata?.httpStatusCode === 404) {
      // Create bucket
      console.log(`📦 Creating bucket "${S3_BUCKET}"...`)
      await s3Client.send(new CreateBucketCommand({ Bucket: S3_BUCKET }))
      console.log(`✅ Bucket "${S3_BUCKET}" created`)
    } else {
      throw error
    }
  }

  // Set public access policy
  console.log(`🔒 Setting bucket policy for public read access...`)
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
  console.log(`✅ Bucket policy set`)

  // Disable block public access
  console.log(`🔓 Disabling block public access...`)
  await s3Client.send(
    new PutPublicAccessBlockCommand({
      Bucket: S3_BUCKET,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: false,
        BlockPublicPolicy: false,
        IgnorePublicAcls: false,
        RestrictPublicBuckets: false,
      },
    })
  )
  console.log(`✅ Block public access disabled`)

  console.log(`\n🎉 MinIO setup complete!`)
  console.log(`   Endpoint: ${S3_ENDPOINT}`)
  console.log(`   Bucket: ${S3_BUCKET}`)
  console.log(`   Public URL: ${S3_ENDPOINT}/${S3_BUCKET}/<file>`)
}

setupMinIO().catch((error) => {
  console.error("❌ Setup failed:", error.message)
  process.exit(1)
})
