import * as React from "react"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"
import { Button } from "@/components/ui/button"
import { TrendingUp, Database, ArrowRight, Activity, Zap, ShieldCheck, Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProjectCard } from "@/components/public/project-card"

export default async function ProjectsPage({
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

  const projects = await prisma.project.findMany({
    where: category ? { categoryEn: category } : undefined,
    orderBy: { year: "desc" },
    include: { images: true }
  })

  return (
    <div className="flex flex-col bg-background selection:bg-brand-blue/30 overflow-x-hidden">
       {/* High-Concept Header */}
       <header className="relative pt-48 pb-24 bg-[#050f1e] text-white">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
             <div className="absolute top-[10%] left-[-10%] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.3)_0%,transparent_70%)] animate-float-slow transition-transform" />
             <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
          </div>

          <div className="container relative z-10 mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-end">
             <div className="space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                <div className="flex items-center gap-4">
                   <div className="h-0.5 w-12 bg-brand-blue rounded-full" />
                   <span className="text-xs md:text-sm font-black text-brand-blue uppercase tracking-[0.4em]">Infrastructure Archive</span>
                </div>
                <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-black leading-[0.98] tracking-tighter text-white">
                   The National <br />
                   <span className="text-brand-blue italic font-serif font-normal">{isBn ? 'প্রকল্প পোর্টফোলিও।' : 'Portfolio.'}</span>
                </h1>
                <p className="max-w-xl text-lg md:text-xl text-white/50 font-medium leading-relaxed">
                   Comprehensive registry of national digital health initiatives, MIS deployments, and infrastructure assets under the DGHS stewardship.
                </p>
             </div>
             
             <div className="hidden lg:flex flex-col items-end gap-6 text-right pb-4">
                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl flex items-center gap-6 group">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue">Total Deployments</span>
                      <span className="text-4xl font-black text-white">{projects.length}+ Major Assets</span>
                   </div>
                   <div className="h-14 w-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue transition-transform duration-500 group-hover:scale-110">
                      <ShieldCheck className="w-8 h-8" />
                   </div>
                </div>
             </div>
          </div>
       </header>

       {/* Portfolio Grid Section */}
       <section className="py-24 bg-background relative selection:bg-brand-blue/30 selection:text-white">
          <div className="container mx-auto px-6 md:px-12">
             <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-20">
                {/* Taxonomy Filter Bar */}
                <aside className="space-y-12 lg:sticky lg:top-36 h-fit h-fit">
                   <div className="space-y-6">
                      <div className="flex items-center gap-3">
                         <Filter className="h-4 w-4 text-brand-blue" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Operational Sector</span>
                      </div>
                      <div className="flex flex-col gap-2">
                         {[dict.projects.ongoing, dict.projects.completed].map((status) => (
                           <div key={status} className="px-6 py-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-brand-blue/30 transition-all cursor-pointer group">
                              <span className="text-[11px] font-black text-slate-400 group-hover:text-brand-blue transition-colors uppercase tracking-[0.2em]">{status}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                   
                   <div className="p-10 rounded-[3rem] bg-[#050f1e] text-white space-y-8 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-all">
                         <Zap className="h-32 w-32" />
                      </div>
                      <div className="relative z-10 space-y-4">
                         <h4 className="text-xl font-black tracking-tight">{dict.projects.request_data_access}</h4>
                         <p className="text-white/40 text-[11px] font-medium leading-relaxed italic">{dict.projects.request_data_access_subtitle}</p>
                         <Link href={`/${lang}/contact`} className="block pt-4">
                            <Button size="lg" className="w-full rounded-2xl h-14 bg-brand-blue text-white hover:bg-white hover:text-black font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-brand-blue/20 group/btn">
                               Contact Command <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1" />
                            </Button>
                         </Link>
                      </div>
                   </div>
                </aside>

                {/* Projects Showcase Container */}
                <div className="space-y-12">
                   {projects.length === 0 ? (
                     <div className="p-32 text-center rounded-[4rem] border-2 border-dashed border-slate-200 dark:border-white/5 bg-slate-50/30 dark:bg-transparent">
                        <Database className="h-16 w-16 text-slate-300 mx-auto mb-6" />
                        <h4 className="text-2xl font-black text-slate-400">Node Empty</h4>
                        <p className="text-muted-foreground font-medium mt-2">No infrastructure records found for this Sector.</p>
                     </div>
                   ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-16 md:gap-y-24">
                        {projects.map((project, i) => (
                           <ProjectCard 
                              key={project.id} 
                              id={project.id} 
                              lang={lang} 
                              title={isBn ? project.titleBn : project.titleEn} 
                              category={isBn ? project.categoryBn : project.categoryEn} 
                              status={project.status} 
                              imageUrl={project.images?.[0]?.url} 
                              dict={dict} 
                              aspect={i % 3 === 0 ? "portrait" : "square"} 
                           />
                        ))}
                     </div>
                   )}
                </div>
             </div>
          </div>
       </section>

       <section className="py-16">
          <div className="container mx-auto px-6 md:px-12 flex items-center justify-center p-10 rounded-[3.5rem] bg-slate-50 border border-slate-100 relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity className="h-24 w-24" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] relative z-10">End of Infrastructure Registry Nodes</p>
          </div>
       </section>
    </div>
  )
}
