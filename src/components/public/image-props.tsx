"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Download, Share2 as ShareIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageProps {
  src: string
  alt: string
  className?: string
  objectFit?: "cover" | "contain" | "fill"
}

export function CloudImage({ src, alt, className, objectFit = "cover" }: ImageProps) {
  const [error, setError] = React.useState(false)

  if (error) {
    return <div className={cn("w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center", className)}>
      <span className="text-muted-foreground text-sm">Image not available</span>
    </div>
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className={cn("w-full h-full transition-transform duration-500", objectFit === "contain" ? "object-contain" : "object-cover", className)}
    />
  )
}

interface DownloadButtonProps {
  imageUrl: string
  fileName?: string
}

export function DownloadButton({ imageUrl, fileName }: DownloadButtonProps) {
  const handleDownload = () => {
    window.open(imageUrl, '_blank')
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="font-bold text-muted-foreground gap-2 hover:bg-muted uppercase tracking-widest text-[10px]"
      onClick={handleDownload}
    >
      <Download className="h-4 w-4" />
      Download
    </Button>
  )
}

export function ShareButton({ title, url }: { title: string, url: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="font-bold text-muted-foreground gap-2 hover:bg-muted uppercase tracking-widest text-[10px]"
      onClick={handleShare}
    >
      <ShareIcon className="h-4 w-4" /> Share
    </Button>
  )
}