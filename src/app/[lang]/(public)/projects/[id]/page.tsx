import * as React from "react"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ChevronLeft, 
  ArrowRight, 
  Database, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Activity,
  History,
  FileText
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CloudImage } from "@/components/public/image-props"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string; lang: Locale }>
}) {
  const { id, lang } = await params
  const dict = await getDictionary(lang as Locale)
  const isBn = lang === "bn"

  const project = await prisma.project.findUnique({
    where: { id },
    include: { images: true }
  })

  if (!project) {
    notFound()
  }

  return (
    <article className="flex flex-col bg-background selection:bg-brand-blue/30 overflow-x-hidden min-h-screen">
       {/* High-Concept Header */}
       <header className="relative pt-48 pb-24 bg-[#050f1e] text-white overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
          <div className="absolute top-[20%] left-[-10%] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.2)_0%,transparent_70%)] animate-float-slow transition-transform opacity-30" />
          
          <div className="container relative z-10 mx-auto px-6 md:px-12 max-w-5xl">
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                <Link href={`/${lang}/projects`} className="group inline-flex items-center gap-3 text-brand-blue hover:text-white transition-colors">
                   <ChevronLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
                   <span className="text-[10px] font-black uppercase tracking-widest">{dict.common.back_to_projects || 'Infrastructure Registry'}</span>
                </Link>

                <div className="space-y-8">
                   <div className="flex flex-wrap items-center gap-6 text-brand-blue font-black uppercase text-[10px] tracking-widest">
                      <div className="flex items-center gap-2 px-3 py-1 bg-brand-blue/10 rounded-full border border-brand-blue/20">
                         <Building2 className="h-3 w-3" /> System Asset
                      </div>
                      <span className="h-1 w-1 rounded-full bg-white/20" />
                      <div className="flex items-center gap-2">
                         <MapPin className="h-3 w-3" /> Mohakhali, Dhaka
                      </div>
                      <span className="h-1 w-1 rounded-full bg-white/20" />
                      <div className="flex items-center gap-2 text-emerald-400 capitalize">
                         <Activity className="h-3 w-3" /> {project.status.toLowerCase()}
                      </div>
                   </div>
                   <h1 className="text-[clamp(2.2rem,6vw,5.5rem)] font-black leading-[1] tracking-tighter text-white">
                      {isBn ? project.titleBn : project.titleEn}
                   </h1>
                </div>
             </div>
          </div>
       </header>

       {/* Detailed Project Information */}
       <section className="py-24 container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-20">
             <aside className="space-y-12 lg:sticky lg:top-36 h-fit">
                <div className="p-10 rounded-[3.5rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 space-y-10 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-700 overflow-hidden relative">
                   <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                   
                   <div className="space-y-8 relative z-10">
                      <div className="space-y-3">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sector Archive</span>
                         <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">{isBn ? project.categoryBn : project.categoryEn}</h4>
                      </div>

                      <div className="flex flex-col gap-6 pt-4 border-t border-slate-100 dark:border-white/10">
                         <div className="flex items-center gap-4 group/item">
                            <div className="h-10 w-10 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-400 group-hover/item:text-brand-blue transition-colors shadow-sm">
                               <Calendar className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deployment</span>
                               <span className="text-sm font-bold text-slate-900 dark:text-white">FY {project.year}</span>
                            </div>
                         </div>
                         <div className="flex items-center gap-4 group/item">
                            <div className="h-10 w-10 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-400 group-hover/item:text-brand-purple transition-colors shadow-sm">
                               <ShieldCheck className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Audit Status</span>
                               <span className="text-sm font-bold text-slate-900 dark:text-white">Fully Verified</span>
                            </div>
                         </div>
                      </div>
                   </div>
                   
                   <div className="pt-4 relative z-10">
                      <Link href={`/${lang}/contact`} className="block">
                         <Button size="lg" className="w-full rounded-2xl h-16 bg-[#050f1e] text-brand-blue hover:bg-brand-blue hover:text-white font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20 group/btn">
                            Request Insight <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1" />
                         </Button>
                      </Link>
                   </div>
                </div>

                <div className="p-10 rounded-[3rem] border border-slate-100 dark:border-white/10 bg-white dark:bg-black/20 space-y-6">
                   <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-brand-blue" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Infrastructure Impact</span>
                   </div>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center group/stat">
                         <span className="text-xs font-bold text-muted-foreground group-hover/stat:text-brand-blue transition-colors">National Sync</span>
                         <span className="text-[10px] font-black text-brand-blue">Active</span>
                      </div>
                      <div className="h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full w-full bg-brand-blue rounded-full animate-pulse" />
                      </div>
                   </div>
                </div>
             </aside>

             <div className="space-y-16">
                <div className="grid grid-cols-1 gap-12">
                   {project.images && project.images.length > 0 ? (
                      project.images.map((img, i) => (
                        <div key={img.id} className="aspect-[16/10] rounded-[4rem] overflow-hidden border border-slate-100 dark:border-white/10 shadow-2xl relative group">
                           <CloudImage src={img.url} alt={`${project.titleEn} - View ${i + 1}`} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-[2s]" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))
                   ) : (
                      <div className="aspect-[16/10] rounded-[4rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-200 dark:text-white/5">
                         <Database className="h-32 w-32" />
                      </div>
                   )}
                </div>

                <div className="prose prose-xl prose-slate dark:prose-invert max-w-none prose-p:text-slate-600 dark:prose-p:text-gray-400 prose-p:font-medium prose-p:leading-relaxed prose-headings:font-black prose-headings:tracking-tighter prose-strong:text-brand-blue">
                   <h2 className="text-4xl md:text-5xl mb-12">Strategic Overview</h2>
                   {isBn ? project.descriptionBn : project.descriptionEn}
                </div>

                <div className="pt-24 border-t border-slate-50 dark:border-white/10 space-y-12">
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-widest">Archive Metadata</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center gap-6">
                         <div className="h-12 w-12 rounded-2xl bg-white dark:bg-black/20 flex items-center justify-center text-brand-blue shadow-sm">
                            <FileText className="h-6 w-6" />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resource Entity</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white uppercase">Project Dossier #8.2</span>
                         </div>
                      </div>
                      <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center gap-6">
                         <div className="h-12 w-12 rounded-2xl bg-white dark:bg-black/20 flex items-center justify-center text-brand-purple shadow-sm">
                            <History className="h-6 w-6" />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Legacy Status</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white uppercase">Permanent Archive Entry</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </section>

<footer className="py-24 border-t border-slate-200 bg-secondary/50 h-fit text-center">
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em]">Official Information Systems Stream of DGHS Bangladesh</p>
        </footer>
    </article>
  )
}
