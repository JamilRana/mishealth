"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { 
  Database, 
  MapPin, 
  Tag, 
  Calendar, 
  Activity, 
  ArrowLeft, 
  Loader2, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Plus
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Locale } from "@/i18n-config"
import { cn } from "@/lib/utils"

const projectSchema = z.object({
  titleEn: z.string().min(3, "English title must be at least 3 characters"),
  titleBn: z.string().min(3, "Bengali title must be at least 3 characters"),
  descriptionEn: z.string().min(10, "English description must be at least 10 characters"),
  descriptionBn: z.string().min(10, "Bengali description must be at least 10 characters"),
  categoryEn: z.string().min(3, "English category must be at least 3 characters"),
  categoryBn: z.string().min(3, "Bengali category must be at least 3 characters"),
  status: z.enum(["ONGOING", "COMPLETED"]),
  year: z.coerce.number().min(1900, "Invalid year"),
  locationEn: z.string().min(3, "English location must be at least 3 characters"),
  locationBn: z.string().min(3, "Bengali location must be at least 3 characters"),
})

type ProjectFormValues = z.infer<typeof projectSchema>

interface ProjectFormProps {
  lang: Locale
  initialData?: any
  id?: string
}

export function ProjectForm({ lang, initialData, id }: ProjectFormProps) {
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [uploading, setUploading] = React.useState(false)
  const [imageUrl, setImageUrl] = React.useState<string | null>(initialData?.images?.[0]?.url || null)
  const [imageCaptionEn, setImageCaptionEn] = React.useState<string>(initialData?.images?.[0]?.captionEn || "")
  const [imageCaptionBn, setImageCaptionBn] = React.useState<string>(initialData?.images?.[0]?.captionBn || "")
  const router = useRouter()

  const dict = {
    admin: {
      projects_back: lang === 'en' ? 'Back to List' : 'তালিকায় ফিরে যান',
      edit_project: lang === 'en' ? 'Edit Project' : 'প্রকল্প সম্পাদনা',
      new_project: lang === 'en' ? 'New Portfolio Project' : 'নতুন পোর্টফোলিও প্রকল্প',
      project_meta: lang === 'en' ? 'Project Information & Logistics' : 'প্রকল্পের তথ্য ও লজিস্টিকস',
      save_changes: lang === 'en' ? 'Save Project Changes' : 'প্রকল্পের পরিবর্তন সংরক্ষণ করুন',
      save_success: lang === 'en' ? 'Project Saved!' : 'প্রকল্প সংরক্ষিত!',
      save_success_desc: lang === 'en' ? 'The system has been updated successfully.' : 'সিস্টেম সফলভাবে আপডেট করা হয়েছে।',
      info_en: lang === 'en' ? 'English Information' : 'ইংরেজি তথ্য',
      info_bn: lang === 'en' ? 'Bengali Information' : 'বাংলা তথ্য',
      title_en: lang === 'en' ? 'Project Title (EN)' : 'প্রকল্পের শিরোনাম (ইংরেজি)',
      title_bn: lang === 'en' ? 'প্রকল্পের নাম (BN)' : 'প্রকল্পের নাম (বাংলা)',
      desc_en: lang === 'en' ? 'Description Overview (EN)' : 'বর্ণনা ওভারভিউ (ইংরেজি)',
      desc_bn: lang === 'en' ? 'প্রকল্পের বর্ণনা (BN)' : 'প্রকল্পের বর্ণনা (বাংলা)',
      media: lang === 'en' ? 'Media Assets' : 'মিডিয়া অ্যাসেটস',
      remove: lang === 'en' ? 'Remove' : 'সরিয়ে ফেলুন',
      uploading: lang === 'en' ? 'Uploading...' : 'আপলোড হচ্ছে...',
      upload_hint: lang === 'en' ? 'Upload Project Cover' : 'প্রকল্পের কভার আপলোড করুন',
      metadata: lang === 'en' ? 'System Metadata' : 'সিস্টেম মেটাডেটা',
      status: lang === 'en' ? 'Project Status' : 'প্রকল্পের অবস্থা',
      year: lang === 'en' ? 'Launch Year' : 'উদ্বোধনের বছর',
      category_hint: lang === 'en' ? 'Category En' : 'বিভাগ (ইংরেজি)',
      location_hint: lang === 'en' ? 'Location En' : 'অবস্থান (ইংরেজি)',
    }
  }

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData ? {
      titleEn: initialData.titleEn,
      titleBn: initialData.titleBn,
      descriptionEn: initialData.descriptionEn,
      descriptionBn: initialData.descriptionBn,
      categoryEn: initialData.categoryEn,
      categoryBn: initialData.categoryBn,
      status: initialData.status as any,
      year: initialData.year,
      locationEn: initialData.locationEn || "",
      locationBn: initialData.locationBn || "",
    } : {
      titleEn: "",
      titleBn: "",
      descriptionEn: "",
      descriptionBn: "",
      categoryEn: "Public Health",
      categoryBn: "জনস্বাস্থ্য",
      status: "ONGOING",
      year: new Date().getFullYear(),
      locationEn: "Dhaka, Bangladesh",
      locationBn: "ঢাকা, বাংলাদেশ",
    },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    
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
      } else {
        setError(data.error || "Upload failed")
      }
    } catch (err) {
      setError("Image upload failed")
    } finally {
      setUploading(false)
    }
  }

  async function onSubmit(values: ProjectFormValues) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/admin/projects${id ? `/${id}` : ""}`, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          images: imageUrl ? [{
            url: imageUrl,
            captionEn: imageCaptionEn || null,
            captionBn: imageCaptionBn || null
          }] : []
        }),
      })

      if (response.ok) {
        setSuccess(true)
        router.refresh()
        if (!id) {
           setTimeout(() => router.push(`/${lang}/admin/projects`), 2000)
        }
      } else {
        const data = await response.json()
        setError(data.error || "Failed to save project")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-4">
           <Link href={`/${lang}/admin/projects`} className="flex items-center text-sm font-bold text-brand-blue hover:underline group">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> {dict.admin.projects_back}
           </Link>
           <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
             {id ? dict.admin.edit_project : dict.admin.new_project}
           </h1>
           <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest pl-1">{dict.admin.project_meta}</p>
        </div>
        {!loading && !success && (
           <Button onClick={form.handleSubmit(onSubmit)} size="lg" className="rounded-full shadow-xl shadow-brand-blue/20 font-bold px-10 h-14 transition-all hover:scale-[1.05] group bg-brand-blue hover:bg-brand-blue/90 text-white">
              <Save className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform" /> {dict.admin.save_changes}
           </Button>
        )}
      </div>

      {success && (
         <div className="p-8 pb-10 text-center space-y-6 bg-brand-green/10 border border-brand-green/20 rounded-[3rem] transition-all duration-700 shadow-xl shadow-brand-green/5 animate-in fade-in slide-in-from-top-10">
            <div className="h-16 w-16 bg-brand-green rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-brand-green/30">
               <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1">
               <h3 className="text-2xl font-bold text-foreground">{dict.admin.save_success}</h3>
               <p className="text-muted-foreground text-sm font-medium">{dict.admin.save_success_desc}</p>
            </div>
         </div>
      )}

      {error && (
         <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-bold">{error}</span>
         </div>
      )}

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
         {/* Main Form Area */}
         <div className="lg:col-span-2 space-y-12">
            
            {/* English Section */}
            <div className="p-10 rounded-[3rem] bg-card border border-border shadow-xl space-y-10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-5 -scale-x-100 group-focus-within:opacity-10 transition-opacity">
                  <Database className="h-32 w-32" />
               </div>
               <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                     <span className="w-10 h-3 bg-brand-blue rounded-full" /> {dict.admin.info_en}
                  </h3>
               </div>
               <div className="space-y-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">{dict.admin.title_en}</label>
                     <input 
                       {...form.register("titleEn")}
                       placeholder="Enter technical project name..."
                       className="w-full h-14 rounded-2xl bg-muted border border-border px-6 font-bold text-foreground focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue focus:bg-background outline-none transition-all shadow-sm"
                     />
                     {form.formState.errors.titleEn && <p className="text-xs font-bold text-destructive pl-1 mt-2">{form.formState.errors.titleEn.message}</p>}
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">{dict.admin.desc_en}</label>
                     <textarea 
                       {...form.register("descriptionEn")}
                       placeholder="Describe the project goals and impact in English..."
                       rows={6}
                       className="w-full rounded-[2rem] bg-muted border border-border p-8 font-medium text-foreground leading-relaxed focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue focus:bg-background outline-none transition-all shadow-sm resize-none"
                     />
                     {form.formState.errors.descriptionEn && <p className="text-xs font-bold text-destructive pl-1 mt-2">{form.formState.errors.descriptionEn.message}</p>}
                  </div>
               </div>
            </div>

            {/* Bengali Section */}
            <div className="p-10 rounded-[3rem] bg-card border border-border shadow-xl space-y-10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-focus-within:opacity-5 transition-opacity">
                  <Database className="h-32 w-32" />
               </div>
               <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                     <span className="w-10 h-3 bg-slate-900 dark:bg-slate-100 rounded-full" /> {dict.admin.info_bn}
                  </h3>
               </div>
               <div className="space-y-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">{dict.admin.title_bn}</label>
                     <input 
                       {...form.register("titleBn")}
                       placeholder="প্রকল্পের নাম লিখুন..."
                       className="w-full h-14 rounded-2xl bg-muted border border-border px-6 font-bold text-foreground focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue focus:bg-background outline-none transition-all shadow-sm"
                     />
                     {form.formState.errors.titleBn && <p className="text-xs font-bold text-destructive pl-1 mt-2">{form.formState.errors.titleBn.message}</p>}
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">{dict.admin.desc_bn}</label>
                     <textarea 
                       {...form.register("descriptionBn")}
                       placeholder="প্রকল্পের বিস্তারিত বর্ণনা প্রদান করুন..."
                       rows={6}
                       className="w-full rounded-[2rem] bg-muted border border-border p-8 font-medium text-foreground leading-relaxed focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue focus:bg-background outline-none transition-all shadow-sm resize-none"
                     />
                     {form.formState.errors.descriptionBn && <p className="text-xs font-bold text-destructive pl-1 mt-2">{form.formState.errors.descriptionBn.message}</p>}
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar Controls */}
         <div className="space-y-10">
            {/* Image Upload Section */}
            <div className="p-8 rounded-[2.5rem] bg-card border border-border space-y-6 shadow-xl group">
               <div className="flex items-center space-x-3">
                  <div className="h-1 w-12 bg-brand-green rounded-full transition-all group-hover:w-20" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-green">{dict.admin.media}</span>
               </div>
               
                <div className="space-y-6">
                   {imageUrl ? (
                     <div className="relative aspect-video rounded-2xl overflow-hidden border border-border group-hover:border-brand-green/30 transition-colors">
                        <img src={imageUrl} alt="Project Preview" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <Button 
                             type="button" 
                             variant="destructive" 
                             size="sm" 
                             className="rounded-xl font-bold"
                             onClick={() => { setImageUrl(null); setImageCaptionEn(""); setImageCaptionBn(""); }}
                           >
                              {dict.admin.remove}
                           </Button>
                        </div>
                     </div>
                   ) : (
                     <div className="relative aspect-video rounded-3xl bg-muted border-2 border-dashed border-border transition-all hover:border-brand-blue flex flex-col items-center justify-center p-6 text-center space-y-3">
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                        {uploading ? (
                           <Loader2 className="h-10 w-10 animate-spin text-brand-blue" />
                        ) : (
                           <Plus className="h-10 w-10 text-muted-foreground/30" />
                        )}
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{uploading ? dict.admin.uploading : dict.admin.upload_hint}</p>
                     </div>
                   )}
                   
                   {imageUrl && (
                     <div className="space-y-4 pt-4 border-t border-border/50">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">
                           {lang === 'en' ? 'Caption (EN)' : 'শিরোনাম (ইংরেজি)'}
                         </label>
                         <input 
                           value={imageCaptionEn}
                           onChange={(e) => setImageCaptionEn(e.target.value)}
                           placeholder={lang === 'en' ? 'Image caption in English' : 'ইংরেজিতে ছবির শিরোনাম'}
                           className="w-full h-10 rounded-xl bg-muted border border-border px-4 text-sm"
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">
                           {lang === 'en' ? 'Caption (BN)' : 'শিরোনাম (বাংলা)'}
                         </label>
                         <input 
                           value={imageCaptionBn}
                           onChange={(e) => setImageCaptionBn(e.target.value)}
                           placeholder={lang === 'en' ? 'Image caption in Bengali' : 'বাংলায় ছবির শিরোনাম'}
                           className="w-full h-10 rounded-xl bg-muted border border-border px-4 text-sm"
                         />
                       </div>
                     </div>
                   )}
                </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-slate-900 dark:bg-black/30 text-white space-y-8 shadow-2xl relative overflow-hidden group">
               <div className="flex items-center space-x-3 mb-2">
                  <div className="h-1 w-12 bg-brand-blue rounded-full transition-all group-hover:w-20" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-blue">{dict.admin.metadata}</span>
               </div>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
                        <Activity className="h-3 w-3" /> {dict.admin.status}
                     </label>
                     <select 
                       {...form.register("status")}
                       className="w-full h-12 rounded-xl bg-slate-800 border-none px-4 font-bold text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all appearance-none cursor-pointer text-white"
                     >
                        <option value="ONGOING">ONGOING (চলমান)</option>
                        <option value="COMPLETED">COMPLETED (সম্পন্ন)</option>
                     </select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
                        <Calendar className="h-3 w-3" /> {dict.admin.year}
                     </label>
                     <input 
                       {...form.register("year")}
                       type="number"
                       className="w-full h-12 rounded-xl bg-slate-800 border-none px-4 font-bold text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all text-white"
                     />
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-800">
                     <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">LOGISTICAL TAGS</p>
                     
                     <div className="space-y-4">
                        <div className="space-y-1">
                           <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest pl-1">{dict.admin.category_hint}</span>
                           <input 
                             {...form.register("categoryEn")}
                             className="w-full h-10 rounded-lg bg-slate-800 border-none px-4 font-medium text-xs focus:ring-2 focus:ring-brand-blue outline-none transition-all text-white"
                           />
                        </div>
                        <div className="space-y-1">
                           <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest pl-1">{dict.admin.location_hint}</span>
                           <input 
                             {...form.register("locationEn")}
                             className="w-full h-10 rounded-lg bg-slate-800 border-none px-4 font-medium text-xs focus:ring-2 focus:ring-brand-blue outline-none transition-all text-white"
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {loading && (
               <div className="flex flex-col items-center gap-4 text-brand-blue animate-pulse py-4">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <span className="font-black text-xs uppercase tracking-[0.3em] overflow-hidden whitespace-nowrap">Synchronising Cloud Data...</span>
               </div>
            )}
         </div>
      </form>
    </div>
  )
}
