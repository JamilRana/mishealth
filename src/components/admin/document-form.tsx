"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { 
  Files, 
  Save, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Shield,
  Tag,
  ShieldCheck,
  Package
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Locale } from "@/i18n-config"
import { cn } from "@/lib/utils"
import { FileUpload } from "./file-upload"

const documentSchema = z.object({
  titleEn: z.string().min(5, "English title must be at least 5 characters"),
  titleBn: z.string().min(5, "Bengali title must be at least 5 characters"),
  categoryEn: z.string().min(3, "English category must be at least 3 characters"),
  categoryBn: z.string().min(3, "Bengali category must be at least 3 characters"),
  fileUrl: z.string().url("Wait for file upload to complete"),
  fileType: z.string().default("PDF"),
  fileSize: z.string().default("0 KB"),
})

type DocumentFormValues = z.infer<typeof documentSchema>

interface DocumentFormProps {
  lang: Locale
  initialData?: any
  id?: string
}

export function DocumentForm({ lang, initialData, id }: DocumentFormProps) {
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()

  const dict = {
    admin: {
       docs_back: lang === 'en' ? 'Back to Library' : 'লাইব্রেরিতে ফিরে যান',
       edit_doc: lang === 'en' ? 'Edit Document' : 'ডকুমেন্ট সম্পাদনা',
       new_doc: lang === 'en' ? 'Upload New Document' : 'নতুন ডকুমেন্ট আপলোড করুন',
       hub: lang === 'en' ? 'Technical Publication Hub' : 'টেকনিক্যাল পাবলিকেশন কেন্দ্র',
       save_metadata: lang === 'en' ? 'Save Document Metadata' : 'ডকুমেন্ট মেটাডেটা সংরক্ষণ করুন',
       success_title: lang === 'en' ? 'Document Uploaded!' : 'ডকুমেন্ট আপলোড সফল!',
       success_desc: lang === 'en' ? 'The file and metadata have been successfully stored.' : 'ফাইল এবং মেটাডেটা সফলভাবে সংরক্ষিত হয়েছে।',
       meta_title: lang === 'en' ? 'File Metadata' : 'ফাইলের তথ্য',
       title_en: lang === 'en' ? 'Document Title (EN)' : 'ডকুমেন্টের নাম (ইংরেজি)',
       title_bn: lang === 'en' ? 'Document Title (BN)' : 'ডকুমেন্টের নাম (বাংলা)',
       s3_module: lang === 'en' ? 'S3 Upload Module' : 'S3 আপলোড মডিউল',
       upload_label: lang === 'en' ? 'Select PDF or Circular to Upload' : 'পিডিএফ বা সার্কুলার নির্বাচন করুন',
       category_en: lang === 'en' ? 'Category (EN)' : 'বিভাগ (ইংরেজি)',
       category_bn: lang === 'en' ? 'Category (BN)' : 'বিভাগ (বাংলা)',
       classification: lang === 'en' ? 'Library Classification' : 'লাইব্রেরি শ্রেণীবিভাগ',
       syncing: lang === 'en' ? 'Finalising Metadata...' : 'মেটাডেটা চূড়ান্ত হচ্ছে...',
    }
  }

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: initialData || {
      titleEn: "",
      titleBn: "",
      categoryEn: "Manuals",
      categoryBn: "নির্দেশিকা",
      fileUrl: "",
      fileType: "PDF",
      fileSize: "0 KB",
    },
  })

  async function onSubmit(values: DocumentFormValues) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/admin/documents${id ? `/${id}` : ""}`, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        setSuccess(true)
        router.refresh()
        if (!id) {
           setTimeout(() => router.push(`/${lang}/admin/documents`), 2000)
        }
      } else {
        const data = await response.json()
        setError(data.error || "Failed to save document")
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
           <Link href={`/${lang}/admin/documents`} className="flex items-center text-sm font-bold text-brand-blue hover:underline group">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> {dict.admin.docs_back}
           </Link>
           <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
             {id ? dict.admin.edit_doc : dict.admin.new_doc}
           </h1>
           <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest pl-1">{dict.admin.hub}</p>
        </div>
        {!loading && !success && (
           <Button onClick={form.handleSubmit(onSubmit)} size="lg" className="rounded-full shadow-xl shadow-brand-blue/20 font-bold px-10 h-14 transition-all hover:scale-[1.05] group bg-brand-blue text-white">
              <Save className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform" /> {dict.admin.save_metadata}
           </Button>
        )}
      </div>

      {success && (
         <div className="p-8 pb-10 text-center space-y-6 bg-brand-green/10 border border-brand-green/20 rounded-[3rem] transition-all duration-700 shadow-xl shadow-brand-green/5 animate-in fade-in slide-in-from-top-10">
            <div className="h-16 w-16 bg-brand-green rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-brand-green/30">
               <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1">
               <h3 className="text-2xl font-bold text-foreground">{dict.admin.success_title}</h3>
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
         <div className="lg:col-span-2 space-y-12">
            <div className="p-10 rounded-[3rem] bg-card border border-border shadow-xl space-y-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-5 -scale-x-100 group-focus-within:opacity-10 transition-opacity">
                  <FileText className="h-32 w-32" />
               </div>
               <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground flex items-center gap-3 leading-none">
                     <span className="w-10 h-3 bg-brand-blue rounded-full" /> {dict.admin.meta_title}
                  </h3>
               </div>
               <div className="space-y-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">{dict.admin.title_en}</label>
                     <input 
                       {...form.register("titleEn")}
                       placeholder="Enter English document title..."
                       className="w-full h-14 rounded-2xl bg-muted border border-border px-6 font-bold text-foreground focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue focus:bg-background outline-none transition-all shadow-sm"
                     />
                     {form.formState.errors.titleEn && <p className="text-[10px] font-bold text-destructive mt-1 pl-1">{form.formState.errors.titleEn.message}</p>}
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">{dict.admin.title_bn}</label>
                     <input 
                       {...form.register("titleBn")}
                       placeholder="বাংলায় ডকুমেন্টের নাম..."
                       className="w-full h-14 rounded-2xl bg-muted border border-border px-6 font-bold text-foreground focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue focus:bg-background outline-none transition-all shadow-sm"
                     />
                     {form.formState.errors.titleBn && <p className="text-[10px] font-bold text-destructive mt-1 pl-1">{form.formState.errors.titleBn.message}</p>}
                  </div>
               </div>
            </div>

            <div className="p-10 rounded-[3rem] bg-card border border-border/50 shadow-xl space-y-8 group hover:border-brand-blue/30 transition-colors">
               <h3 className="text-2xl font-bold text-foreground flex items-center gap-3 leading-none">
                  <span className="w-10 h-3 bg-brand-green rounded-full group-hover:w-16 transition-all" /> {dict.admin.s3_module}
               </h3>
               <FileUpload 
                  onUpload={(data) => {
                     form.setValue("fileUrl", data.url)
                     form.setValue("fileType", data.name.split('.').pop()?.toUpperCase() || "PDF")
                     form.setValue("fileSize", data.size)
                     form.clearErrors("fileUrl")
                  }}
                  label={dict.admin.upload_label}
               />
               {form.formState.errors.fileUrl && <p className="text-[10px] font-bold text-destructive mt-1 text-center">{form.formState.errors.fileUrl.message}</p>}
               
               <div className="flex items-center gap-3 p-6 bg-muted border border-border rounded-3xl group">
                  <div className="h-10 w-10 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green group-hover:scale-110 transition-transform">
                     <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-foreground/80 uppercase tracking-widest leading-none">Secure S3 Transfer</span>
                     <span className="text-[9px] font-medium text-muted-foreground mt-1">AES-256 Cloud Encryption with SSL/TLS Protocol</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-10">
            <div className="p-10 rounded-[2.5rem] bg-slate-900 dark:bg-black/40 text-white space-y-10 shadow-2xl relative overflow-hidden group border border-white/5">
               <div className="flex items-center space-x-3 mb-2">
                  <div className="h-1 w-12 bg-brand-blue rounded-full transition-all group-hover:w-20" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-blue">{dict.admin.classification}</span>
               </div>
               
               <div className="space-y-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
                        <Tag className="h-3 w-3" /> {dict.admin.category_en}
                     </label>
                     <input 
                       {...form.register("categoryEn")}
                       className="w-full h-12 rounded-xl bg-slate-800/50 border border-slate-700/50 px-5 font-bold text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all text-white"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
                        <Tag className="h-3 w-3" /> {dict.admin.category_bn}
                     </label>
                     <input 
                       {...form.register("categoryBn")}
                       className="w-full h-12 rounded-xl bg-slate-800/50 border border-slate-700/50 px-5 font-bold text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all text-white"
                     />
                  </div>
               </div>

               <div className="pt-8 border-t border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                     <Package className="h-4 w-4 text-slate-600" />
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Storage Policy V2.0</span>
                  </div>
               </div>

               <div className="absolute bottom-0 right-0 p-8 opacity-5">
                  <Files className="h-24 w-24" />
               </div>
            </div>

            {loading && (
               <div className="flex flex-col items-center gap-4 text-brand-blue animate-pulse py-4">
                  <Loader2 className="h-12 w-12 animate-spin" />
                  <span className="font-black text-[10px] uppercase tracking-[0.3em] overflow-hidden whitespace-nowrap">{dict.admin.syncing}</span>
               </div>
            )}
         </div>
      </form>
    </div>
  )
}
