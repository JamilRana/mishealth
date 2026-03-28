import * as React from "react"
import prisma from "@/lib/prisma"
import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"
import { Newspaper, Calendar, ArrowRight, Clock, ChevronRight, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CloudImage } from "@/components/public/image-props"

export default async function NewsListingsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const isBn = lang === "bn"

  const newsItems = await prisma.news.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" }
  })

  const [topNews, ...remainingNews] = newsItems

  return (
    <div className="flex flex-col bg-background selection:bg-brand-blue/30 overflow-x-hidden">
<header className="relative pt-48 pb-24 bg-[#050f1e] text-white overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-[10%] left-[-10%] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.3)_0%,transparent_70%)] animate-float-slow transition-transform" />
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
          </div>
          <div className="container relative z-10 mx-auto px-6 md:px-12">
              <div className="max-w-3xl space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                 <div className="flex items-center gap-4">
                    <Zap className="w-5 h-5 text-brand-blue animate-pulse" />
                    <span className="text-xs font-black text-brand-blue uppercase tracking-[0.4em]">{isBn ? dict.news.official_broadcast : dict.news.official_broadcast}</span>
                 </div>
                 <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-black text-white leading-[0.95] tracking-tighter">
                    National Health <br />
                    <span className="text-brand-blue italic font-serif font-normal">{isBn ? 'সংবাদ।' : 'Bulletins.'}</span>
                 </h1>
                 <p className="text-lg md:text-xl font-medium text-white/60">
                   {dict.news.subtitle}
                 </p>
              </div>
           </div>
        </header>

       <section className="py-24 bg-background relative">
          <div className="container mx-auto px-6 md:px-12 space-y-24">
             {topNews && (
               <Link href={`/${lang}/news/${topNews.id}`} className="group block">
                  <div className="relative rounded-[4.5rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-brand-blue/10">
                     <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="aspect-[16/10] lg:aspect-square relative overflow-hidden bg-slate-50 dark:bg-white/5 flex items-center justify-center">
  {topNews.coverImage ? (
    <CloudImage 
      src={topNews.coverImage} 
      alt={isBn ? topNews.titleBn : topNews.titleEn} 
      // Using object-contain ensures the whole image "fits" without cropping
      className="h-full w-full object-contain p-8 group-hover:scale-105 transition-transform duration-1000" 
    />
  ) : (
    <div className="h-full w-full bg-brand-blue/5 flex items-center justify-center text-brand-blue/20">
      <Newspaper className="w-24 h-24" />
    </div>
  )}
  
  {/* Refined Badge: Increased padding (px-8) and improved positioning */}
  <div className="absolute top-8 left-8 z-20">
    <span className="px-8 py-3 bg-brand-blue text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-full shadow-[0_10px_30px_rgba(59,130,246,0.5)]">
       {dict.common.featured_headline}
    </span>
  </div>
</div>
                        <div className="p-12 md:p-20 flex flex-col justify-center space-y-10">
                           <div className="space-y-6">
                              <div className="flex items-center gap-3 text-brand-blue font-black uppercase text-[10px] tracking-widest">
                                 <Calendar className="h-3 w-3" /> {new Date(topNews.createdAt).toLocaleDateString()}
                                 <span className="h-1 w-1 rounded-full bg-slate-200" />
                                 <Clock className="h-3 w-3" /> {new Date(topNews.createdAt).toLocaleTimeString()}
                              </div>
                              <h2 className="text-3xl md:text-5xl font-black text-foreground dark:text-white tracking-tight leading-tight group-hover:text-brand-blue transition-colors">
                                 {isBn ? topNews.titleBn : topNews.titleEn}
                              </h2>
                              <p className="text-lg text-muted-foreground dark:text-gray-400 font-medium leading-relaxed line-clamp-4">
                                 {isBn ? topNews.excerptBn : topNews.excerptEn}
                              </p>
                           </div>
                           <div className="flex items-center gap-4 text-brand-blue font-black uppercase text-xs tracking-widest group-hover:gap-8 transition-all">
                              {dict.common.continue_reading} <ArrowRight className="h-5 w-5" />
                           </div>
                        </div>
                     </div>
                  </div>
               </Link>
             )}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16">
                 {remainingNews.map((news) => (
                   <Link key={news.id} href={`/${lang}/news/${news.id}`} className="group flex flex-col space-y-8">
                      <div className="aspect-[16/10] rounded-[3rem] overflow-hidden bg-secondary dark:bg-white/5 border border-slate-100 dark:border-white/10 group-hover:shadow-2xl transition-all duration-700">
                         {news.coverImage ? (
                           <CloudImage src={news.coverImage} alt={isBn ? news.titleBn : news.titleEn} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                         ) : (
                           <div className="h-full w-full bg-secondary dark:bg-white/5 flex items-center justify-center text-muted-foreground/20 dark:text-white/5">
                              <Newspaper className="w-16 h-16" />
                           </div>
                         )}
                      </div>
                      <div className="space-y-4 px-4">
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest bg-brand-blue/5 px-3 py-1 rounded-full">
                               System Bulletin
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground opacity-60 flex items-center gap-2">
                               <Calendar className="h-3 w-3" /> {new Date(news.createdAt).toLocaleDateString()}
                            </span>
                         </div>
                         <h3 className="text-2xl font-black text-foreground dark:text-white tracking-tight leading-snug group-hover:text-brand-blue transition-colors line-clamp-2">
                            {isBn ? news.titleBn : news.titleEn}
                         </h3>
                         <p className="text-sm font-medium text-muted-foreground dark:text-gray-400 line-clamp-3 leading-relaxed">
                            {isBn ? news.excerptBn : news.excerptEn}
                         </p>
                         <div className="pt-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-widest text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity">Read more</span>
                            <ChevronRight className="h-5 w-5 text-brand-blue transition-transform group-hover:translate-x-2" />
                         </div>
                      </div>
                   </Link>
                ))}
             </div>
          </div>
       </section>
    </div>
  )
}
