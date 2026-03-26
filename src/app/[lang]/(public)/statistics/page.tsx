import * as React from "react"
import prisma from "@/lib/prisma"
import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"
import { BarChart3, TrendingUp, Users, Activity, ShieldCheck, Database, Calendar, Download, Zap, LayoutDashboard, Globe } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default async function StatisticsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const isBn = lang === "bn"

  const projectCounts = await prisma.project.groupBy({
    by: ['categoryEn'],
    _count: true
  })

  return (
    <div className="flex flex-col bg-background selection:bg-brand-blue/30 overflow-x-hidden">
       <header className="relative pt-48 pb-24 bg-[#050f1e] text-white">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
             <div className="absolute top-[10%] left-[-10%] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.3)_0%,transparent_70%)] animate-float-slow transition-transform" />
             <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
          </div>

          <div className="container relative z-10 mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-12 animate-in fade-in slide-in-from-left-12 duration-1000">
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="h-0.5 w-12 bg-brand-blue rounded-full" />
                      <span className="text-xs md:text-sm font-black text-brand-blue uppercase tracking-[0.4em]">Governance Oversight</span>
                   </div>
                   <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-black leading-[0.98] tracking-tighter text-white">
                      Pulse of the <br />
                      <span className="text-brand-blue italic font-serif font-normal">{isBn ? 'স্বাস্থ্য খাত।' : 'Registry.'}</span>
                   </h1>
                   <p className="max-w-xl text-lg md:text-xl text-white/50 font-medium leading-relaxed">
                      National MIS health statistics visualization for DGHS Bangladesh. Monitoring the digital transformation of 160M+ patient-nodes.
                   </p>
                </div>
             </div>
          </div>
       </header>

       <section className="py-24 bg-background relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
             <div className="space-y-16">
                <div className="space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                      <span className="text-xs font-black text-brand-blue uppercase tracking-[0.3em] font-sans">Operational Scale</span>
                   </div>
                   <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                      Architecting a <br />
                      <span className="text-brand-blue italic font-serif font-normal">healthier nation.</span>
                   </h2>
                   <p className="text-lg text-muted-foreground dark:text-gray-400 font-medium leading-relaxed max-w-xl">
                      Tracking health project distributions, deployment success metrics, and national service integration benchmarks at the DGHS Command Center.
                   </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                   <div className="p-10 rounded-[3rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group hover:shadow-2xl transition-all duration-700">
                      <Users className="h-12 w-12 text-brand-blue mb-6 group-hover:scale-110 transition-transform" />
                      <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">24.5M+</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Active Registry Nodes</p>
                   </div>
                   <div className="p-10 rounded-[3rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group hover:shadow-2xl transition-all duration-700">
                      <Globe className="h-12 w-12 text-brand-purple mb-6 group-hover:scale-110 transition-transform" />
                      <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">16k+</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Healthcare Facilities</p>
                   </div>
                </div>
             </div>
             
             <div className="space-y-12 lg:sticky lg:top-32 h-fit">
                <div className="bg-white dark:bg-black/20 p-12 rounded-[4rem] border border-slate-100 dark:border-white/10 shadow-2xl space-y-12">
                   <div className="flex items-center justify-between">
                      <div className="h-14 w-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue">
                         <LayoutDashboard className="w-8 h-8" />
                      </div>
                      <div className="text-right">
                         <h4 className="text-lg font-black dark:text-white tracking-tight">Project Landscape</h4>
                         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Global Deployment Index</p>
                      </div>
                   </div>

                   <div className="space-y-8">
                      {projectCounts.map((item) => (
                        <div key={item.categoryEn} className="space-y-3">
                           <div className="flex justify-between items-center px-1">
                              <span className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                                 <div className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                                 {item.categoryEn}
                              </span>
                              <span className="text-xs font-black text-brand-blue">{item._count} active</span>
                           </div>
                           <div className="h-2.5 bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-brand-blue rounded-full animate-in slide-in-from-left duration-1000" 
                                style={{ width: `${(item._count / Math.max(...projectCounts.map(i => i._count))) * 100}%` }} 
                              />
                           </div>
                        </div>
                      ))}
                   </div>

                   <div className="pt-8 border-t border-slate-50 dark:border-white/5">
                      <Button className="w-full h-16 rounded-2xl bg-[#050f1e] text-brand-blue hover:bg-brand-blue hover:text-white font-black text-sm uppercase tracking-widest transition-all">
                         Download Annual Audit Archive <Download className="h-5 w-5 ml-3" />
                      </Button>
                   </div>
                </div>
             </div>
          </div>
       </section>

       <section className="py-24 bg-[#050f1e] text-white overflow-hidden h-fit">
          <div className="container mx-auto px-6 md:px-12 p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
             <div className="absolute inset-0 bg-brand-blue/5 opacity-40 animate-pulse" />
             <div className="absolute bottom-[-20%] right-[-10%] opacity-10">
                <TrendingUp className="h-96 w-96 text-brand-blue" />
             </div>
             
             <div className="relative z-10 space-y-6 text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Real-time Data Sync</h2>
                <p className="text-white/40 text-xl font-medium max-w-xl">Our systems are architected for 99.9% uptime, ensuring national health data is processed and visualized with absolute integrity.</p>
             </div>
             
             <div className="relative z-10 group">
                <div className="absolute inset-0 bg-brand-blue blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col items-center">
                   <div className="flex items-center gap-3 text-emerald-400 mb-4 animate-pulse">
                      <Zap className="h-6 w-6" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Live Response</span>
                   </div>
                   <span className="text-4xl font-black tracking-tighter">1.2ms AVG</span>
                </div>
             </div>
          </div>
       </section>
    </div>
  )
}
