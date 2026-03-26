"use client"

import * as React from "react"
import { Upload, X, File as FileIcon, Loader2, CheckCircle2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface FileUploadProps {
  onUpload: (data: { url: string; name: string; type: string; size: string }) => void
  label?: string
  accept?: string
}

export function FileUpload({ onUpload, label = "Upload File (Max 10MB)", accept = ".pdf,.docx,.xlsx" }: FileUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<{ name: string; size: string } | null>(null)
  const fileRef = React.useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    setFile(selected)
    setIsUploading(true)

    const formData = new FormData()
    formData.append("file", selected)

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setPreview({ name: data.name, size: data.size })
        onUpload(data)
        toast.success("File synchronized with cloud storage")
      } else {
        const error = await response.json()
        toast.error(error.error || "Upload failed")
        setFile(null)
      }
    } catch (error) {
       console.error("Upload Client Error:", error)
       toast.error("Network error during upload")
       setFile(null)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4 w-full">
      <div 
        onClick={() => !isUploading && fileRef.current?.click()}
        className={cn(
          "relative min-h-[140px] rounded-[2.5rem] border-2 border-dashed border-border flex flex-col items-center justify-center p-8 text-center transition-all duration-500 group cursor-pointer overflow-hidden",
          isUploading ? "bg-muted border-brand-blue animate-pulse cursor-wait" : "hover:border-brand-blue hover:bg-brand-blue/[0.03] bg-card",
          preview ? "bg-brand-green/[0.03] border-brand-green/30" : ""
        )}
      >
        <input 
          ref={fileRef}
          type="file" 
          className="hidden" 
          onChange={handleFile}
          accept={accept}
          disabled={isUploading}
        />

        {preview ? (
          <div className="flex flex-col sm:flex-row items-center gap-6 text-brand-green animate-in zoom-in-95 duration-500">
             <div className="h-16 w-16 bg-brand-green rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-brand-green/20">
                <CheckCircle2 className="h-8 w-8" />
             </div>
             <div className="flex flex-col text-center sm:text-left space-y-1">
                <span className="text-base font-bold text-foreground truncate max-w-[250px]">{preview.name}</span>
                <div className="flex items-center justify-center sm:justify-start gap-2 opacity-80">
                   <ShieldCheck className="h-3 w-3" />
                   <span className="text-[10px] uppercase font-black tracking-widest">Encrypted Storage • {preview.size}</span>
                </div>
             </div>
             <Button 
               type="button"
               variant="ghost" 
               size="icon" 
               onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); }}
               className="h-10 w-10 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
             >
                <X className="h-5 w-5" />
             </Button>
          </div>
        ) : isUploading ? (
          <div className="flex flex-col items-center gap-4">
             <div className="relative h-12 w-12">
                <Loader2 className="h-12 w-12 text-brand-blue animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Upload className="h-5 w-5 text-brand-blue opacity-50" />
                </div>
             </div>
             <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Uploading to S3...</span>
                <p className="text-[10px] text-muted-foreground font-medium italic">Establishing secure connection</p>
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 group-hover:scale-105 transition-transform duration-500">
            <div className="h-14 w-14 bg-muted border border-border rounded-[1.5rem] flex items-center justify-center text-muted-foreground group-hover:bg-brand-blue group-hover:text-white group-hover:border-brand-blue transition-all duration-500 group-hover:rotate-6 shadow-sm">
              <Upload className="h-6 w-6" />
            </div>
            <div className="space-y-1">
               <p className="text-xs font-black text-foreground uppercase tracking-[0.1em]">{label}</p>
               <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-60">PDF, DOCX, XLSX (MAX 10MB)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
