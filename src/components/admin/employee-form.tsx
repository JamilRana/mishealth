"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, Image as ImageIcon, Upload, X, CheckCircle2 } from "lucide-react"

interface EmployeeFormProps {
  initialData?: any
  lang: string
  onSuccess: () => void
}

export function EmployeeForm({ initialData, lang, onSuccess }: EmployeeFormProps) {
  const [loading, setLoading] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [imageUrl, setImageUrl] = React.useState<string | null>(initialData?.image || null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        setImageUrl(data.url)
        toast.success("Image uploaded successfully")
      } else {
        toast.error(data.error || "Upload failed")
      }
    } catch (err) {
      toast.error("Image upload failed")
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    const payload = {
      ...data,
      image: imageUrl,
      order: parseInt(data.order as string) || 0
    }

    const url = initialData 
      ? `/api/admin/employees/${initialData.id}` 
      : "/api/admin/employees"
    const method = initialData ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "Failed to save profile")
      }

      toast.success(initialData ? "Staff profile updated" : "Staff member onboarded")
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || "An unexpected system error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in duration-500 max-w-4xl mx-auto" key={initialData?.id || 'new'}>
      <div className="flex flex-col md:flex-row gap-10 items-start">
        {/* Profile Image Upload */}
        <div className="w-full md:w-1/3 space-y-4">
           <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">Identity Image</Label>
           <div className="relative group aspect-[3/4] rounded-[2.5rem] bg-muted border-2 border-dashed border-border overflow-hidden flex flex-col items-center justify-center transition-all hover:border-brand-blue/50">
              {imageUrl ? (
                <>
                  <img src={imageUrl} alt="Profile" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                     <Button type="button" variant="destructive" size="icon" className="rounded-xl" onClick={() => setImageUrl(null)}>
                        <X className="h-4 w-4" />
                     </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 p-6 text-center">
                   {uploading ? (
                      <Loader2 className="h-10 w-10 animate-spin text-brand-blue" />
                   ) : (
                      <Upload className="h-10 w-10 text-muted-foreground opacity-20" />
                   )}
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{uploading ? "Uploading..." : "Click to Upload Photo"}</p>
                   <input 
                     type="file" 
                     accept="image/*" 
                     className="absolute inset-0 opacity-0 cursor-pointer" 
                     onChange={handleImageUpload}
                     disabled={uploading}
                   />
                </div>
              )}
           </div>
           <p className="text-[9px] text-muted-foreground font-medium text-center italic">Supported: JPG, PNG, WEBP (Max 5MB)</p>
        </div>

        {/* Form Fields */}
        <div className="flex-1 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="nameEn" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Name (English)</Label>
              <Input id="nameEn" name="nameEn" defaultValue={initialData?.nameEn} required className="rounded-2xl h-12 border-border bg-card px-6 font-bold focus-visible:ring-brand-blue/20" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="nameBn" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">নাম (বাংলা)</Label>
              <Input id="nameBn" name="nameBn" defaultValue={initialData?.nameBn} required className="rounded-2xl h-12 border-border bg-card px-6 font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="designationEn" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Designation (EN)</Label>
              <Input id="designationEn" name="designationEn" defaultValue={initialData?.designationEn} required className="rounded-2xl h-12 border-border bg-card px-6 font-bold" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="designationBn" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">পদবী (বাংলা)</Label>
              <Input id="designationBn" name="designationBn" defaultValue={initialData?.designationBn} required className="rounded-2xl h-12 border-border bg-card px-6 font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Direct Line</Label>
              <Input id="phone" name="phone" defaultValue={initialData?.phone} placeholder="+880..." className="rounded-2xl h-12 border-border bg-card px-6 font-bold" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Official Email</Label>
              <Input id="email" name="email" type="email" defaultValue={initialData?.email} placeholder="name@mis.dghs.gov.bd" className="rounded-2xl h-12 border-border bg-card px-6 font-bold" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border">
        <div className="space-y-3">
          <Label htmlFor="responsibilitiesEn" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Key Responsibilities (English)</Label>
          <Textarea id="responsibilitiesEn" name="responsibilitiesEn" defaultValue={initialData?.responsibilitiesEn} className="rounded-2xl min-h-[120px] border-border bg-card p-6 font-medium leading-relaxed" />
        </div>
        <div className="space-y-3">
          <Label htmlFor="responsibilitiesBn" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">মূল দায়িত্ব (বাংলা)</Label>
          <Textarea id="responsibilitiesBn" name="responsibilitiesBn" defaultValue={initialData?.responsibilitiesBn} className="rounded-2xl min-h-[120px] border-border bg-card p-6 font-medium leading-relaxed" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-border">
        <div className="space-y-3 w-full sm:w-auto">
          <Label htmlFor="order" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Priority Order</Label>
          <Input id="order" name="order" type="number" defaultValue={initialData?.order || 0} className="rounded-2xl h-12 border-border bg-card px-6 font-bold w-full sm:w-32" />
        </div>

        <Button type="submit" disabled={loading || uploading} className="w-full sm:w-auto rounded-full px-12 h-14 font-black shadow-xl shadow-brand-blue/20 bg-brand-blue text-white hover:scale-105 transition-all">
          {loading ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : <CheckCircle2 className="mr-3 h-5 w-5" />}
          {initialData ? "Update Registry" : "Execute Onboarding"}
        </Button>
      </div>
    </form>
  )
}
