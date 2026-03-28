import * as React from "react"
import prisma from "@/lib/prisma"
import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"
import { FileText, Download, ChevronRight, BarChart3, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default async function ReportsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>
  searchParams: Promise<{ category?: string }>
}) {
  const { lang } = await params
  const { category } = await searchParams
  const dict = await getDictionary(lang as Locale)

  const reports = await prisma.report.findMany({
    where: { 
      published: true,
      categoryEn: category || undefined
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="flex flex-col bg-background selection:bg-brand-blue/30 overflow-x-hidden">
       <header className="relative pt-40 pb-20 bg-[#050f1e] text-white">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
             <div className="absolute top-[10%] left-[-10%] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.3)_0%,transparent_70%)] animate-float-slow transition-transform" />
             <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
          </div>

          <div className="container relative z-10 mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-end">
             <div className="space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                <div className="flex items-center gap-4">
                   <div className="h-0.5 w-12 bg-brand-blue rounded-full" />
                   <span className="text-xs md:text-sm font-black text-brand-blue uppercase tracking-[0.4em]">Audit Timeline</span>
                </div>
                <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-black leading-[0.98] tracking-tighter text-white">
                   Official <br />
                   <span className="text-brand-blue italic font-serif font-normal">{lang === 'bn' ? 'প্রতিবেদন।' : 'Reports.'}</span>
                </h1>
                <p className="max-w-xl text-lg md:text-xl text-white/50 font-medium leading-relaxed">
                   Providing transparency through authoritative health statistics, annual evaluations, and specialized MIS reports.
                </p>
             </div>
             
             <div className="hidden lg:flex flex-col items-end gap-6 text-right pb-4">
                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl flex items-center gap-6 group">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue">Total Publications</span>
                      <span className="text-4xl font-black text-white">{reports.length}+ Files</span>
                   </div>
                   <div className="h-14 w-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform duration-500">
                      <BarChart3 className="w-8 h-8" />
                   </div>
                </div>
             </div>
          </div>
       </header>

       <section className="py-24 bg-background relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
             {reports.length === 0 ? (
                <div className="col-span-full py-32 text-center rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-secondary/30 dark:bg-transparent">
                   <FileText className="h-16 w-16 text-muted-foreground/20 mx-auto mb-6" />
                   <h4 className="text-2xl font-black text-foreground dark:text-white">Node Empty</h4>
                   <p className="text-muted-foreground font-medium mt-2">No reports matched the current sector query.</p>
                </div>
             ) : (
                reports.map((report) => (
                  <div key={report.id} className="group p-10 rounded-[3rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 flex flex-col items-start gap-10 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={report.fileUrl} target="_blank">
                           <Button className="h-16 w-16 rounded-[1.75rem] bg-[#050f1e] text-brand-blue shadow-2xl shadow-primary/20 hover:scale-110 active:scale-95 transition-all">
                              <Download className="h-7 w-7" />
                           </Button>
                        </Link>
                     </div>

                     <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-[1.75rem] border border-brand-blue/10 bg-brand-blue/5 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all duration-700">
                           <FileText className="h-10 w-10" />
                        </div>
                        <div className="flex flex-col space-y-2">
                           <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue">{lang === 'bn' ? report.categoryBn : report.categoryEn}</span>
                              <span className="h-1 w-1 rounded-full bg-slate-200" />
                              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">{report.year} Edition</span>
                           </div>
                           <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-brand-blue transition-colors">
                              {lang === 'bn' ? report.titleBn : report.titleEn}
                           </h3>
                        </div>
                     </div>

                     <div className="w-full flex items-center justify-between mt-auto">
                        <div className="px-5 py-2.5 bg-slate-50 dark:bg-white/5 rounded-full flex items-center gap-3 border border-slate-100 dark:border-white/10 group-hover:bg-brand-blue group-hover:text-white transition-colors duration-500">
                           <div className="h-1.5 w-1.5 rounded-full bg-brand-blue group-hover:bg-white animate-pulse" />
                           <span className="text-[10px] font-black uppercase tracking-widest leading-none">Status: Fully Disclosed</span>
                        </div>
                        <div className="flex items-center gap-2 text-brand-blue font-black uppercase text-[10px] tracking-widest group-hover:gap-4 transition-all">
                           Preview Archive <ChevronRight className="h-4 w-4" />
                        </div>
                     </div>
                  </div>
                ))
             )}
          </div>
       </section>

       <section className="py-24 bg-slate-50/50 dark:bg-black/20 border-t border-slate-100 dark:border-white/5 h-fit">
          <div className="container mx-auto px-6 md:px-12 p-16 rounded-[4rem] bg-[#050f1e] text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
             <div className="absolute inset-0 bg-brand-blue/5 opacity-40 animate-pulse" />
             <div className="relative z-10 space-y-6 text-center md:text-left">
                <h2 className="text-3xl font-black tracking-tight leading-none">Sector-Wide Accountability</h2>
                <p className="text-white/40 text-lg font-medium max-w-xl">Request official audit dossiers for specific health directories using our secure administrative protocols.</p>
             </div>
             <Link href={`/${lang}/contact`} className="relative z-10 group">
                <Button size="lg" className="rounded-full h-14 px-10 bg-brand-blue text-white hover:bg-white hover:text-black font-black text-sm uppercase tracking-widest transition-all shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95">
                   Request Audit Access <Mail className="h-5 w-5 ml-3" />
                </Button>
             </Link>
          </div>
       </section>
    </div>
  )
}
