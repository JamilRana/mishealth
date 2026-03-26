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
  TrendingUp,
  LayoutGrid,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
  Building2,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default async function AdminProjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>
  searchParams: Promise<{ page?: string; q?: string; category?: string }>
}) {
  const { lang } = await params
  const { page, q, category } = await searchParams
  const dict = await getDictionary(lang as Locale)

  const projects = await prisma.project.findMany({
    where: q ? {
      OR: [
        { titleEn: { contains: q, mode: 'insensitive' } },
        { titleBn: { contains: q, mode: 'insensitive' } },
      ]
    } : undefined,
    orderBy: { year: "desc" },
    include: { images: true }
  })

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
         <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-5 group">
               <Database className="h-10 w-10 text-primary transition-transform group-hover:rotate-12 duration-500" /> Infrastructure Portfolio
            </h1>
            <p className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.3em] pl-16">National MIS Digital Asset Governance</p>
         </div>
         <Link href={`/${lang}/admin/projects/new`}>
            <Button className="h-16 rounded-[2rem] px-10 gap-3 font-black shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 text-sm uppercase tracking-widest leading-none">
               <Plus className="h-6 w-6" /> Deploy Project
            </Button>
         </Link>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden">
         <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex flex-wrap items-center justify-between gap-6">
            <div className="relative flex-1 min-w-[300px] group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
               <input 
                  type="text" 
                  placeholder="Intercept portfolio stream..." 
                  className="w-full h-16 bg-white border border-slate-100 rounded-3xl pl-16 pr-8 text-sm font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
               />
            </div>
            <div className="flex items-center gap-4">
               <Button variant="outline" className="h-16 rounded-3xl px-8 border-slate-100 bg-white font-bold gap-2">
                  <Filter className="h-4 w-4" /> Filter Stack
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
                     <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 border-b border-slate-100">Project Entity</th>
                     <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 border-b border-slate-100">Category</th>
                     <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 border-b border-slate-100">Status</th>
                     <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 border-b border-slate-100">Release Phase</th>
                     <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 border-b border-slate-100 text-right">Operational Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {projects.map((project) => (
                    <tr key={project.id} className="group hover:bg-slate-50/80 transition-all duration-300">
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500 shadow-sm border border-slate-100 group-hover:border-primary/20 flex items-center justify-center">
                             <Building2 className="h-6 w-6" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-base font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">{project.titleEn}</span>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">/{project.slug}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 bg-slate-50 text-slate-500 whitespace-nowrap">
                          {project.categoryEn}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       {project.status === "COMPLETED" ? (
                         <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest leading-none">
                            <CheckCircle2 className="h-4 w-4" /> Fully Implemented
                         </div>
                       ) : (
                         <div className="flex items-center gap-2 text-brand-blue font-bold text-xs uppercase tracking-widest leading-none">
                            <Clock className="h-4 w-4" /> Active Mission
                         </div>
                       )}
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                             <Calendar className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-bold text-slate-600 font-mono">{project.year}</span>
                       </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                          <Link href={`/${lang}/projects/${project.id}`} target="_blank">
                             <Button variant="outline" size="icon" className="h-11 w-11 rounded-2xl bg-white shadow-xl border-slate-200 hover:bg-slate-50 transition-all">
                                <Eye className="h-5 w-5 text-slate-400 hover:text-primary" />
                             </Button>
                          </Link>
                          <Link href={`/${lang}/admin/projects/${project.id}/edit`}>
                             <Button variant="outline" size="icon" className="h-11 w-11 rounded-2xl bg-white shadow-xl border-slate-200 hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all">
                                <Edit className="h-5 w-5" />
                             </Button>
                          </Link>
                          <Button variant="outline" size="icon" className="h-11 w-11 rounded-2xl bg-white shadow-xl border-slate-200 hover:bg-destructive/5 hover:border-destructive/20 hover:text-destructive transition-all">
                             <Trash2 className="h-5 w-5" />
                          </Button>
                       </div>
                    </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {projects.length === 0 && (
           <div className="p-32 text-center text-muted-foreground font-black uppercase tracking-[0.2em] italic opacity-20">
              No registry activity detected. Deployment required.
           </div>
         )}

         <div className="p-10 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest px-8">Visualizing {projects.length} nodes from national HIS database</span>
            <div className="flex items-center gap-3">
               <Button disabled variant="outline" className="h-12 rounded-2xl border-slate-100 bg-white shadow-sm font-bold text-[10px] uppercase tracking-widest px-8">Prev Block</Button>
               <Button disabled variant="outline" className="h-12 rounded-2xl border-slate-100 bg-white shadow-sm font-bold text-[10px] uppercase tracking-widest px-8">Next Block</Button>
            </div>
         </div>
      </div>
    </div>
  )
}
