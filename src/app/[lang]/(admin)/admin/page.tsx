import * as React from "react"
import prisma from "@/lib/prisma"
import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"
import { 
  Database, 
  Files, 
  FileText, 
  Newspaper, 
  MessageSquare, 
  Activity,
  ArrowRight,
  TrendingUp,
  Clock,
  Users,
  Plus,
  LayoutDashboard
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AdminCharts } from "@/components/admin/admin-charts"

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  const counts = {
    projects: await prisma.project.count(),
    documents: await prisma.document.count(),
    reports: await prisma.report.count(),
    news: await prisma.news.count(),
    users: await prisma.user.count(),
    messages: await prisma.message.count({ where: { resolved: false } }),
  }

  const activityTrend = [
    { name: "Oct", count: 12 },
    { name: "Nov", count: 18 },
    { name: "Dec", count: 24 },
    { name: "Jan", count: 14 },
    { name: "Feb", count: 21 },
    { name: "Mar", count: counts.projects + counts.documents + counts.news },
  ]

  const contentDistribution = [
    { name: "Projects", value: counts.projects },
    { name: "Documents", value: counts.documents },
    { name: "Reports", value: counts.reports },
    { name: "News", value: counts.news },
  ]

  const recentLogs = await prisma.activityLog.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { user: true }
  })

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
         <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight flex items-center gap-4 group">
               <LayoutDashboard className="h-10 w-10 text-primary transition-transform group-hover:rotate-12 duration-500" /> Executive Overview
            </h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-[0.25em] pl-14">MIS Operations & Governance Center</p>
         </div>
         <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Status</p>
               <p className="text-sm font-bold text-emerald-500 uppercase flex items-center gap-1 justify-end mt-1">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" /> Live System
               </p>
            </div>
            <div className="h-10 w-[1px] bg-slate-200 hidden sm:block mx-4" />
            <Link href={`/${lang}/admin/logs`}>
               <Button variant="outline" className="rounded-2xl h-14 px-8 border-slate-100 font-bold bg-white shadow-sm hover:shadow-xl transition-all">
                  Audit Logs
               </Button>
            </Link>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
         <StatCard icon={Database} label="Portfolio Projects" value={counts.projects} color="text-primary" bg="bg-primary/5" note="+2 this month" />
         <StatCard icon={Files} label="Digital Manuals" value={counts.documents} color="text-emerald-500" bg="bg-emerald-500/5" note="Cloud synced" />
         <StatCard icon={FileText} label="MIS Publications" value={counts.reports} color="text-blue-500" bg="bg-blue-500/5" note="Bilingual" />
         <StatCard icon={MessageSquare} label="Unread Feedback" value={counts.messages} color="text-amber-500" bg="bg-amber-500/5" isAlert={counts.messages > 0} note="Requires attention" />
      </div>

      <AdminCharts activityData={activityTrend} distributionData={contentDistribution} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">System Audit Stream</h3>
               </div>
               <Link href={`/${lang}/admin/logs`} className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-widest leading-none">
                  Full Timeline <ArrowRight className="h-3 w-3" />
               </Link>
            </div>
            
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden divide-y">
               {recentLogs.length === 0 ? (
                 <div className="p-16 text-center text-muted-foreground font-medium italic">No recent activity detected. All systems ready.</div>
               ) : (
                 recentLogs.map((log) => (
                    <div key={log.id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all duration-300 group">
                       <div className="flex items-center space-x-5">
                          <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100 group-hover:border-primary">
                             <Clock className="h-6 w-6" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors">{log.action}</span>
                             <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">{log.user.name}</span>
                                <span className="h-1 w-1 bg-slate-200 rounded-full" />
                                <span className="text-[10px] uppercase font-black tracking-widest text-primary">{new Date(log.createdAt).toLocaleTimeString()}</span>
                             </div>
                          </div>
                       </div>
                       <div className="px-5 py-2 bg-slate-100/50 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:bg-primary/10 group-hover:text-primary transition-all">
                          {log.entity}
                       </div>
                    </div>
                 ))
               )}
            </div>
         </div>

         <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
               <TrendingUp className="h-5 w-5 text-primary" />
               <h3 className="text-xl font-bold text-slate-900 tracking-tight">Governance</h3>
            </div>
            
            <div className="p-10 rounded-[2.5rem] bg-slate-900 text-white space-y-10 shadow-2xl relative overflow-hidden group">
               <div className="space-y-3 relative z-10">
                  <div className="flex items-center gap-3">
                     <span className="h-1 w-10 bg-primary rounded-full transition-all group-hover:w-16" />
                     <h4 className="text-xs font-black uppercase tracking-widest text-primary">Content Lifecycle</h4>
                  </div>
                  <h4 className="text-2xl font-black leading-tight tracking-tight">National HIS<br/>Portfolio Master CMS</h4>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">Broadcast updates, publish documentation and curate health HIS project success metrics.</p>
               </div>
               
               <div className="space-y-4 pt-4 relative z-10">
                  <Link href={`/${lang}/admin/projects/new`} className="block">
                     <Button className="w-full justify-between h-14 rounded-2xl bg-primary hover:bg-primary/90 font-bold px-8 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all group/btn">
                        Portfolio Entry <Plus className="h-5 w-5 group-hover/btn:rotate-90 transition-transform" />
                     </Button>
                  </Link>
                  <Link href={`/${lang}/admin/news/new`} className="block">
                     <Button variant="outline" className="w-full justify-between h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold px-8 transition-all hover:scale-[1.02]">
                        Push Bulletin <Newspaper className="h-5 w-5" />
                     </Button>
                  </Link>
               </div>
               
               <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 group-hover:rotate-0 duration-700">
                  <TrendingUp className="h-40 w-40" />
               </div>
            </div>

            <Link href={`/${lang}/admin/users`} className="block">
               <div className="p-10 rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white flex flex-col items-center text-center space-y-4 hover:border-primary hover:bg-primary/5 transition-all duration-500 cursor-pointer group shadow-sm hover:shadow-xl">
                  <div className="h-14 w-14 bg-slate-50 rounded-[1.25rem] flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100 group-hover:border-primary">
                     <Users className="h-7 w-7" />
                  </div>
                  <div className="space-y-1">
                     <h4 className="text-xl font-black text-slate-900 tracking-tight">Identity Governance</h4>
                     <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.25em]">Manage system access tokens</p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                     <span className="h-6 px-3 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center">
                        {counts.users} Active Seats
                     </span>
                  </div>
               </div>
            </Link>
         </div>
      </div>
   </div>
  )
}

function StatCard({ icon: Icon, label, value, color, bg, isAlert, note }: any) {
  return (
    <div className={cn(
      "p-10 rounded-[2.5rem] border shadow-xl space-y-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-white border-slate-100/50 hover:-translate-y-2", 
      isAlert && "ring-4 ring-amber-500/10 border-amber-500/20"
    )}>
       <div className={cn("h-16 w-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500", bg, color, "group-hover:scale-110 shadow-lg border border-white/50")}>
         <Icon className="h-8 w-8" />
       </div>
       <div className="flex flex-col space-y-2">
         <span className={cn("text-6xl font-black tracking-tighter leading-none", color)}>{value}</span>
         <div className="space-y-1">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">{label}</span>
            <span className={cn("text-[9px] font-bold uppercase tracking-widest opacity-60", color)}>{note}</span>
         </div>
       </div>
       {isAlert && <div className="absolute top-6 right-6 h-3 w-3 bg-amber-500 rounded-full animate-ping" />}
       <div className="absolute -bottom-10 -right-10 p-10 opacity-[0.03] group-hover:opacity-10 transition-all duration-700">
          <Icon className="h-40 w-40" />
       </div>
    </div>
  )
}
