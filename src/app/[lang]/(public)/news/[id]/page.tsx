import * as React from "react"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"
import { Calendar, Clock, ChevronLeft, ArrowRight, Newspaper, Zap, Share2, Printer, History } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CloudImage } from "@/components/public/image-props"

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string; lang: Locale }>
}) {
  const { id, lang } = await params
  const dict = await getDictionary(lang as Locale)
  const isBn = lang === "bn"

  const news = await prisma.news.findUnique({
    where: { id },
  })

  if (!news || !news.published) {
    notFound()
  }

  return (
    <article className="flex flex-col bg-background selection:bg-brand-blue/30 overflow-x-hidden min-h-screen">
       <header className="relative pt-48 pb-24 bg-[#050f1e] text-white">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
          <div className="container relative z-10 mx-auto px-6 md:px-12 max-w-5xl">
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                <Link href={`/${lang}/news`} className="group inline-flex items-center gap-3 text-brand-blue hover:text-white transition-colors">
                   <ChevronLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
                   <span className="text-[10px] font-black uppercase tracking-widest">{dict.common.back_to_news || 'Archive Index'}</span>
                </Link>

                <div className="space-y-8">
                   <div className="flex flex-wrap items-center gap-6 text-brand-blue font-black uppercase text-[10px] tracking-widest">
                      <div className="flex items-center gap-2 px-3 py-1 bg-brand-blue/10 rounded-full border border-brand-blue/20">
                         <Newspaper className="h-3 w-3" /> System Bulletin
                      </div>
                      <span className="h-1 w-1 rounded-full bg-white/20" />
                      <div className="flex items-center gap-2">
                         <Calendar className="h-3 w-3" /> {new Date(news.createdAt).toLocaleDateString()}
                      </div>
                      <span className="h-1 w-1 rounded-full bg-white/20" />
                      <div className="flex items-center gap-2">
                         <Clock className="h-3 w-3" /> {new Date(news.createdAt).toLocaleTimeString()}
                      </div>
                   </div>
                   <h1 className="text-[clamp(1.8rem,5vw,4.5rem)] font-black leading-[1] tracking-tighter text-white">
                      {isBn ? news.titleBn : news.titleEn}
                   </h1>
                </div>
             </div>
          </div>
       </header>

       <section className="py-24 container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-20">
             <aside className="space-y-12 lg:sticky lg:top-36 h-fit">
                <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 space-y-8">
                   <div className="space-y-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue">Operational Share</span>
                      <div className="flex gap-4 pt-2">
                         <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-brand-blue hover:text-white transition-all shadow-sm">
                            <Share2 className="h-5 w-5" />
                         </Button>
                         <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                            <Printer className="h-5 w-5" />
                         </Button>
                      </div>
                   </div>
                   
                   <div className="pt-8 border-t border-slate-100 dark:border-white/10 space-y-4">
                      <div className="flex items-center gap-3">
                         <Zap className="h-5 w-5 text-brand-blue" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Identity Audit</span>
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">Immutable Record ID: {news.id}</p>
                   </div>
                </div>
             </aside>

             <div className="space-y-16">
                {news.coverImage && (
                  <div className="aspect-[16/9] rounded-[4rem] overflow-hidden border border-slate-100 dark:border-white/10 shadow-2xl relative group">
                     <CloudImage src={news.coverImage} alt={isBn ? news.titleBn : news.titleEn} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-[2s]" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}

                <div className="prose prose-xl prose-slate dark:prose-invert max-w-none prose-p:text-slate-600 dark:prose-p:text-gray-400 prose-p:font-medium prose-p:leading-relaxed prose-headings:font-black prose-headings:tracking-tighter prose-strong:text-brand-blue">
                   {isBn ? news.contentBn : news.contentEn}
                </div>

                <div className="pt-16 border-t border-slate-50 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-10">
                   <div className="flex items-center gap-4 text-emerald-500 font-black uppercase text-[10px] tracking-widest px-6 py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-full">
                      <History className="h-3 w-3" /> Fully Disclosed & Active
                   </div>
                   <Link href={`/${lang}/news`} className="group flex items-center gap-4 text-brand-blue font-black uppercase text-xs tracking-widest hover:gap-8 transition-all">
                      Archive Navigation <ArrowRight className="h-5 w-5" />
                   </Link>
                </div>
             </div>
          </div>
       </section>

       <footer className="py-24 border-t border-slate-50 dark:border-white/5 bg-slate-50/30 dark:bg-black/20 h-fit text-center">
          <p className="text-[10px] font-black text-slate-300 dark:text-white/10 uppercase tracking-[0.5em]">Official Information Systems Stream of DGHS Bangladesh</p>
       </footer>
    </article>
  )
}
