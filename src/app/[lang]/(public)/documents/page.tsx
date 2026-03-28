import * as React from "react"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"
import { Button } from "@/components/ui/button"
import { FileSearch, Download, Search, Filter, Database, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function DocumentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>
  searchParams: Promise<{ category?: string }>
}) {
  const { lang } = await params
  const { category } = await searchParams
  const dict = await getDictionary(lang as Locale)
  const isBn = lang === "bn"

  const documents = await prisma.document.findMany({
    where: category ? { categoryEn: category } : undefined,
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="flex flex-col">
<header className="relative pt-32 pb-24 bg-[#050f1e] text-white overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-[10%] left-[-10%] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.3)_0%,transparent_70%)] animate-float-slow transition-transform" />
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
          </div>
          <div className="container relative z-10 mx-auto px-6 md:px-12">
              <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                 <div className="flex items-center gap-3 text-brand-blue">
                    <Database className="w-5 h-5 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-[0.4em]">{dict.docs.title1} {dict.docs.title2} </span>
                 </div>
                 <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-black text-white leading-[0.95] tracking-tighter">
                    {dict.docs.title1} <br />
                    <span className="text-brand-blue italic font-serif font-normal">{dict.docs.title2}</span>
                 </h1>
                 <p className="text-lg md:text-xl font-medium text-white/60">
                    {dict.docs.subtitle}
                 </p>
              </div>
           </div>
        </header>

       <section className="py-24 bg-background relative">
          <div className="container mx-auto px-6 md:px-12">
             <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-20">
                <aside className="space-y-12 lg:sticky lg:top-32 h-fit">
                   <div className="relative group">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                      <input 
                         type="text" 
                         placeholder="Query repository..." 
                         className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-16 pr-8 text-sm font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
                      />
                   </div>
                   
                   <div className="space-y-6">
                      <div className="flex items-center gap-3">
                         <Filter className="h-4 w-4 text-brand-blue" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category Filter</span>
                      </div>
                      <div className="flex flex-col gap-2">
                         {["Manuals", "Protocols", "Reports", "Guidelines"].map((cat) => (
                           <Link key={cat} href={`/${lang}/documents?category=${cat}`}>
                              <Button 
                                 variant={category === cat ? "default" : "ghost"} 
                                 className={cn(
                                   "w-full justify-start h-12 rounded-xl font-bold px-6",
                                   category !== cat && "bg-slate-50 dark:bg-white/5 border border-transparent hover:bg-slate-100 dark:hover:bg-white/10"
                                 )}
                              >
                                 {cat}
                              </Button>
                           </Link>
                         ))}
                      </div>
                   </div>
                </aside>

                <div className="space-y-12">
                   {documents.length === 0 ? (
                     <div className="p-24 text-center rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/5 bg-slate-50/30 dark:bg-transparent">
                        <FileSearch className="h-16 w-16 text-slate-300 mx-auto mb-6" />
                        <h4 className="text-2xl font-black text-slate-400">Node Empty</h4>
                        <p className="text-muted-foreground font-medium mt-2">No documents currently assigned to this sector.</p>
                     </div>
                   ) : (
                     <div className="grid grid-cols-1 gap-6">
                        {documents.map((doc) => (
                          <div key={doc.id} className="group p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={doc.fileUrl} target="_blank">
                                   <Button className="h-14 w-14 rounded-2xl bg-brand-blue shadow-xl shadow-brand-blue/20 hover:scale-110 active:scale-95 transition-all">
                                      <Download className="h-6 w-6" />
                                   </Button>
                                </Link>
                             </div>
                             
                             <div className="flex items-start gap-8">
                                <div className="h-16 w-16 shrink-0 rounded-2xl bg-brand-blue/5 border border-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all duration-700">
                                   <FileSearch className="w-8 h-8" />
                                </div>
                                <div className="space-y-2 max-w-[70%]">
                                   <div className="flex items-center gap-3">
                                      <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest">{lang === 'bn' ? doc.categoryBn : doc.categoryEn}</span>
                                      <span className="h-1 w-1 rounded-full bg-slate-200" />
                                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">{doc.year}</span>
                                   </div>
                                   <h3 className="text-2xl font-black text-foreground dark:text-white tracking-tight group-hover:text-brand-blue transition-colors leading-tight">
                                      {lang === 'bn' ? doc.titleBn : doc.titleEn}
                                   </h3>
                                   <div className="flex items-center gap-2 pt-4">
                                      <ShieldCheck className="h-3 w-3 text-emerald-500" />
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Official Asset Sync</span>
                                   </div>
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>
                   )}
                </div>
             </div>
          </div>
       </section>
    </div>
  )
}
