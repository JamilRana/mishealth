import * as React from "react"
import prisma from "@/lib/prisma"
import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"
import { ShieldCheck, Database, History, User, Clock, ArrowRight, ShieldAlert, Activity } from "lucide-react"

export default async function ActivityLogsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const logs = await prisma.activityLog.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: { user: true }
  })

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 py-10">
         <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-widest flex items-center gap-6 group">
               <History className="h-10 w-10 text-brand-blue transition-transform group-hover:rotate-[-12deg] duration-500" /> SYSTEM AUDIT STREAM
            </h1>
            <p className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.4em] pl-16">Immutable Infrastructure Governance Log (Last 50 Events)</p>
         </div>
         <div className="px-6 py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-full flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Global Sync Status: Operational</span>
         </div>
      </div>

      <div className="bg-white dark:bg-black/20 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-2xl overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 dark:bg-white/[0.02]">
                     <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 dark:border-white/5">Event Node</th>
                     <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 dark:border-white/5">Action Directive</th>
                     <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 dark:border-white/5">Initiated By</th>
                     <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 dark:border-white/5 text-right">Timestamp</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                  {logs.map((log) => (
                    <tr key={log.id} className="group hover:bg-slate-50/80 dark:hover:bg-white/[0.04] transition-all duration-300">
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                             <Activity className="h-5 w-5" />
                          </div>
                          <span className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-brand-blue transition-colors uppercase">{log.entity}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-black/20 text-slate-500 whitespace-nowrap">
                          {log.action}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-400 group-hover:text-brand-blue transition-all">
                             <User className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-bold text-slate-600 dark:text-gray-400 tracking-tight">{log.user.name}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex flex-col items-end">
                          <span className="text-sm font-black text-slate-600 dark:text-gray-400 font-mono tracking-tighter">{new Date(log.createdAt).toLocaleDateString()}</span>
                          <span className="text-[10px] font-bold text-brand-blue opacity-40 group-hover:opacity-100 transition-opacity uppercase tracking-widest mt-1">{new Date(log.createdAt).toLocaleTimeString()}</span>
                       </div>
                    </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {logs.length === 0 && (
           <div className="p-32 text-center text-muted-foreground font-black uppercase tracking-[0.2em] italic opacity-20">
              Zero system events detected. Monitoring active.
           </div>
         )}
      </div>
    </div>
  )
}
