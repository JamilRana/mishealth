"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { 
  Newspaper, 
  Save, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Megaphone,
  Plus
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Locale } from "@/i18n-config"
import { cn } from "@/lib/utils"

const newsSchema = z.object({
  titleEn: z.string().min(5, "English title must be at least 5 characters"),
  titleBn: z.string().min(5, "Bengali title must be at least 5 characters"),
  contentEn: z.string().min(20, "English content must be at least 20 characters"),
  contentBn: z.string().min(20, "Bengali content must be at least 20 characters"),
  excerptEn: z.string().min(10, "English excerpt must be at least 10 characters"),
  excerptBn: z.string().min(10, "Bengali excerpt must be at least 10 characters"),
  isUrgent: z.boolean().default(false),
})

type NewsFormValues = z.infer<typeof newsSchema>

interface NewsFormProps {
  lang: Locale
  initialData?: any
  id?: string
}

export function NewsForm({ lang, initialData, id }: NewsFormProps) {
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [uploading, setUploading] = React.useState(false)
  const [coverImage, setCoverImage] = React.useState<string | null>(initialData?.coverImage || null)
  const router = useRouter()

  const dict = {
    admin: {
      news_back: lang === 'en' ? 'Back to Bulletins' : 'নিউজ বুলেটিলে ফিরে যান',
      edit_news: lang === 'en' ? 'Edit News Bulletin' : 'নিউজ বুলেটিল সম্পাদনা',
      new_news: lang === 'en' ? 'Compose New Announcement' : 'নতুন ঘোষণা লিখুন',
      hub: lang === 'en' ? 'Public Communication Hub' : 'জনযোগাযোগ কেন্দ্র',
      publish: lang === 'en' ? 'Publish Update' : 'আপডেট প্রকাশ করুন',
      success: lang === 'en' ? 'Announcement Published!' : 'ঘোষণা প্রকাশিত হয়েছে!',
      success_desc: lang === 'en' ? 'The public update is now live on the portal.' : 'পাবলিক আপডেট এখন পোর্টালে লাইভ।',
      headline_en: lang === 'en' ? 'Headline (EN)' : 'শিরোনাম (ইংরেজি)',
      headline_bn: lang === 'en' ? 'শিরোনাম (BN)' : 'শিরোনাম (বাংলা)',
      excerpt_en: lang === 'en' ? 'Brief Excerpt (EN)' : 'সংক্ষিপ্ত বিবরণ (ইংরেজি)',
      excerpt_bn: lang === 'en' ? 'সংক্ষিপ্ত বিবরণ (BN)' : 'সংক্ষিপ্ত বিবরণ (বাংলা)',
      content_en: lang === 'en' ? 'Full Content (EN)' : 'বিস্তারিত বিবরণ (ইংরেজি)',
      content_bn: lang === 'en' ? 'বিস্তারিত বিবরণ (BN)' : 'বিস্তারিত বিবরণ (বাংলা)',
      media: lang === 'en' ? 'Media Assets' : 'মিডিয়া অ্যাসেটস',
      remove: lang === 'en' ? 'Remove' : 'সরিয়ে ফেলুন',
      upload_hint: lang === 'en' ? 'Upload Cover Image' : 'কভার ইমেজ আপলোড করুন',
      settings: lang === 'en' ? 'Announcement Settings' : 'ঘোষণা সেটিংস',
      urgent: lang === 'en' ? 'Urgent Alert' : 'জরুরি সতর্কতা',
      sync: lang === 'en' ? 'Syncing with Cloud...' : 'ক্লাউডের সাথে সিঙ্ক হচ্ছে...',
    }
  }

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: initialData || {
      titleEn: "",
      titleBn: "",
      contentEn: "",
      contentBn: "",
      excerptEn: "",
      excerptBn: "",
      isUrgent: false,
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
        setCoverImage(data.url)
      } else {
        setError(data.error || "Upload failed")
      }
    } catch (err) {
      setError("Image upload failed")
    } finally {
      setUploading(false)
    }
  }

  async function onSubmit(values: NewsFormValues) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/admin/news${id ? `/${id}` : ""}`, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          coverImage
        }),
      })

      if (response.ok) {
        setSuccess(true)
        router.refresh()
        if (!id) {
           setTimeout(() => router.push(`/${lang}/admin/news`), 2000)
        }
      } else {
        const data = await response.json()
        setError(data.error || "Failed to save news bulletin")
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
           <Link href={`/${lang}/admin/news`} className="flex items-center text-sm font-bold text-brand-blue hover:underline group">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> {dict.admin.news_back}
           </Link>
           <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
             {id ? dict.admin.edit_news : dict.admin.new_news}
           </h1>
           <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest pl-1">{dict.admin.hub}</p>
        </div>
        {!loading && !success && (
           <Button onClick={form.handleSubmit(onSubmit)} size="lg" className="rounded-full shadow-xl shadow-brand-blue/20 font-bold px-10 h-14 transition-all hover:scale-[1.05] group bg-brand-blue text-white">
              <Save className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform" /> {dict.admin.publish}
           </Button>
        )}
      </div>

      {success && (
         <div className="p-8 pb-10 text-center space-y-6 bg-brand-green/10 border border-brand-green/20 rounded-[3rem] transition-all duration-700 shadow-xl shadow-brand-green/5 animate-in fade-in slide-in-from-top-10">
            <div className="h-16 w-16 bg-brand-green rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-brand-green/30">
               <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1">
               <h3 className="text-2xl font-bold text-foreground">{dict.admin.success}</h3>
               <p className="text-muted-foreground text-sm font-medium">{dict.admin.success_desc}</p>
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
            
            {/* English Content */}
            <div className="p-10 rounded-[3rem] bg-card border border-border shadow-xl space-y-10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-5 -scale-x-100 group-focus-within:opacity-10 transition-opacity">
                  <Newspaper className="h-32 w-32" />
               </div>
               <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                     <span className="w-10 h-3 bg-brand-blue rounded-full" /> English Bulletin
                  </h3>
               </div>
               <div className="space-y-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">{dict.admin.headline_en}</label>
                     <input 
                       {...form.register("titleEn")}
                       placeholder="Enter news headline..."
                       className="w-full h-14 rounded-2xl bg-muted border border-border px-6 font-bold text-foreground focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue focus:bg-background outline-none transition-all shadow-sm"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">{dict.admin.excerpt_en}</label>
                     <input 
                       {...form.register("excerptEn")}
                       placeholder="Short summary for list views..."
                       className="w-full h-12 rounded-xl bg-muted border border-border px-6 font-medium text-foreground focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all shadow-sm"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">{dict.admin.content_en}</label>
                     <textarea 
                       {...form.register("contentEn")}
                       placeholder="Provide full announcement details..."
                       rows={8}
                       className="w-full rounded-[2rem] bg-muted border border-border p-8 font-medium text-foreground leading-relaxed focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue focus:bg-background outline-none transition-all shadow-sm resize-none"
                     />
                  </div>
               </div>
            </div>

            {/* Bengali Content */}
            <div className="p-10 rounded-[3rem] bg-card border border-border shadow-xl space-y-10 relative overflow-hidden group">
               <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                     <span className="w-10 h-3 bg-slate-900 dark:bg-slate-100 rounded-full" /> Bengali Bulletin
                  </h3>
               </div>
               <div className="space-y-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">{dict.admin.headline_bn}</label>
                     <input 
                       {...form.register("titleBn")}
                       placeholder="শিরোনাম লিখুন..."
                       className="w-full h-14 rounded-2xl bg-muted border border-border px-6 font-bold text-foreground focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue focus:bg-background outline-none transition-all shadow-sm"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">{dict.admin.excerpt_bn}</label>
                     <input 
                       {...form.register("excerptBn")}
                       placeholder="সংক্ষিপ্ত বিবরণ লিখুন..."
                       className="w-full h-12 rounded-xl bg-muted border border-border px-6 font-medium text-foreground focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all shadow-sm"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">{dict.admin.content_bn}</label>
                     <textarea 
                       {...form.register("contentBn")}
                       placeholder="বিস্তারিত বিবরণ প্রদান করুন..."
                       rows={8}
                       className="w-full rounded-[2rem] bg-muted border border-border p-8 font-medium text-foreground leading-relaxed focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue focus:bg-background outline-none transition-all shadow-sm resize-none"
                     />
                  </div>
               </div>
            </div>
         </div>

         {/* Settings Sidebar */}
         <div className="space-y-10">
            {/* Image Upload Section */}
            <div className="p-8 rounded-[2.5rem] bg-card border border-border space-y-6 shadow-xl group">
               <div className="flex items-center space-x-3">
                  <div className="h-1 w-12 bg-brand-green rounded-full transition-all group-hover:w-20" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-green">{dict.admin.media}</span>
               </div>
               
               <div className="space-y-6">
                  {coverImage ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-border group-hover:border-brand-green/30 transition-colors">
                       <img src={coverImage} alt="Cover Preview" className="h-full w-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="sm" 
                            className="rounded-xl font-bold"
                            onClick={() => setCoverImage(null)}
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
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{uploading ? dict.admin.publish : dict.admin.upload_hint}</p>
                    </div>
                  )}
               </div>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-slate-900 dark:bg-black/30 text-white space-y-8 shadow-2xl relative overflow-hidden group">
               <div className="flex items-center space-x-3 mb-2">
                  <div className="h-1 w-12 bg-brand-blue rounded-full" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-blue">{dict.admin.settings}</span>
               </div>
               
               <div className="space-y-10">
                  <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10 group-hover:bg-white/10 transition-colors">
                     <div className="flex flex-col">
                        <span className="text-sm font-bold">{dict.admin.urgent}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">High Visibility</span>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          {...form.register("isUrgent")}
                          className="sr-only peer" 
                        />
                        <div className="w-12 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue transition-all shadow-sm"></div>
                     </label>
                  </div>

                  <div className="space-y-6 pt-4 border-t border-slate-800">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">SYSTEM NOTIFICATIONS</p>
                     <div className="p-6 rounded-2xl bg-white/5 space-y-2">
                        <p className="text-xs font-medium text-slate-400 leading-relaxed">Checking "{dict.admin.urgent}" will pin this announcement to the top of the public portal and trigger visual highlights.</p>
                     </div>
                  </div>
               </div>

               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Megaphone className="h-24 w-24" />
               </div>
            </div>

            {loading && (
               <div className="flex flex-col items-center gap-4 text-brand-blue animate-pulse py-4">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <span className="font-black text-xs uppercase tracking-[0.3em]">{dict.admin.sync}</span>
               </div>
            )}
         </div>
      </form>
    </div>
  )
}
