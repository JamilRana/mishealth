import * as React from "react"
import prisma from "@/lib/prisma"
import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Newspaper,
  Calendar,
  AlertCircle,
  TrendingUp,
  LayoutGrid,
  CheckCircle2,
  XCircle,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default async function AdminNewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>
  searchParams: Promise<{ page?: string; q?: string; category?: string }>
}) {
  const { lang } = await params
  const { page, q, category } = await searchParams
  const dict = await getDictionary(lang as Locale)

  const newsItems = await prisma.news.findMany({
    where: q ? {
      OR: [
        { titleEn: { contains: q, mode: 'insensitive' } },
        { titleBn: { contains: q, mode: 'insensitive' } },
      ]
    } : undefined,
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
         <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-5 group">
               <Newspaper className="h-10 w-10 text-primary transition-transform group-hover:rotate-12 duration-500" /> Bulletin Board
            </h1>
            <p className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.3em] pl-16">National Health Information Stream Management</p>
         </div>
         <Link href={`/${lang}/admin/news/new`}>
            <Button className="h-16 rounded-[2rem] px-10 gap-3 font-black shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 text-sm uppercase tracking-widest leading-none">
               <Plus className="h-6 w-6" /> Push Bulletin
            </Button>
         </Link>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden">
         <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex flex-wrap items-center justify-between gap-6">
            <div className="relative flex-1 min-w-[300px] group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
               <input 
                  type="text" 
                  placeholder="Intercept news stream..." 
                  className="w-full h-16 bg-white border border-slate-100 rounded-3xl pl-16 pr-8 text-sm font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
               />
            </div>
            <div className="flex items-center gap-4">
               <Button variant="outline" className="h-16 rounded-3xl px-8 border-slate-100 bg-white font-bold gap-2">
                  <Filter className="h-4 w-4" /> Categorize
               </Button>
               <Button variant="outline" className="h-16 w-16 rounded-3xl border-slate-100 bg-white p-0">
                  <LayoutGrid className="h-5 w-5" />
               </Button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50">
                     <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 border-b border-slate-100">Broadcast Entity</th>
                     <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 border-b border-slate-100">Priority Scope</th>
                     <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 border-b border-slate-100">Visibility Status</th>
                     <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 border-b border-slate-100">Release Date</th>
                     <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 border-b border-slate-100 text-right">Operational Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {newsItems.map((news) => (
                    <tr key={news.id} className="group hover:bg-slate-50/80 transition-all duration-300">
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-4">
                          <div className={cn(
                            "h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-500 shadow-sm border",
                            news.isUrgent ? "bg-amber-50 text-amber-500 border-amber-100" : "bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary border-slate-200"
                          )}>
                             <Newspaper className="h-6 w-6" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-base font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">{news.titleEn}</span>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">/{news.slug}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       {news.isUrgent ? (
                         <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-amber-50 text-amber-600 border-amber-100 flex items-center gap-1 w-fit">
                            <AlertCircle className="h-3 w-3" /> ALERT/URGENT
                         </span>
                       ) : (
                         <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-slate-50 text-slate-400 border-slate-200 flex items-center gap-1 w-fit">
                            STANDARD
                         </span>
                       )}
                    </td>
                    <td className="px-8 py-6">
                       {news.published ? (
                         <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest">
                            <CheckCircle2 className="h-4 w-4" /> Live Broadcast
                         </div>
                       ) : (
                         <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                            <XCircle className="h-4 w-4" /> Encryption Locked
                         </div>
                       )}
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-500 font-mono tracking-tighter">{new Date(news.createdAt).toLocaleDateString()}</span>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-0.5">{new Date(news.createdAt).toLocaleTimeString()}</span>
                       </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                          <Link href={`/${lang}/news/${news.id}`} target="_blank">
                             <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl bg-white shadow-sm border-slate-200 hover:bg-slate-50 transition-all">
                                <Eye className="h-4 w-4 text-slate-400" />
                             </Button>
                          </Link>
                          <Link href={`/${lang}/admin/news/${news.id}/edit`}>
                             <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl bg-white shadow-sm border-slate-200 hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all">
                                <Edit className="h-4 w-4" />
                             </Button>
                          </Link>
                          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl bg-white shadow-sm border-slate-200 hover:bg-destructive/5 hover:border-destructive/20 hover:text-destructive transition-all">
                             <Trash2 className="h-4 w-4" />
                          </Button>
                       </div>
                    </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {newsItems.length === 0 && (
           <div className="p-32 text-center text-muted-foreground font-black uppercase tracking-[0.2em] italic opacity-20">
              No bulletin activity detected. Sync required.
           </div>
         )}

         <div className="p-10 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Visualizing {newsItems.length} of {newsItems.length} records</span>
            <div className="flex items-center gap-3">
               <Button disabled variant="outline" className="h-12 rounded-2xl border-slate-100 bg-white font-bold text-xs uppercase tracking-widest">Prev Stream</Button>
               <Button disabled variant="outline" className="h-12 rounded-2xl border-slate-100 bg-white font-bold text-xs uppercase tracking-widest">Next Stream</Button>
            </div>
         </div>
      </div>
    </div>
  )
}
