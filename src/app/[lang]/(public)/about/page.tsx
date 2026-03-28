import * as React from "react"
import prisma from "@/lib/prisma"
import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"
import { Building2, Users, ShieldCheck, Database, ArrowRight, User, Mail, Phone, ChevronRight, CheckCircle2, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const isBn = lang === "bn"

  const employees = await prisma.employee.findMany({
    orderBy: { order: "asc" }
  })

  return (
    <div className="flex flex-col bg-background selection:bg-brand-blue/30 overflow-x-hidden">
       <header className="relative pt-48 pb-24 bg-[#050f1e] text-white">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
             <div className="absolute top-[10%] left-[-10%] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.3)_0%,transparent_70%)] animate-float-slow transition-transform" />
          </div>

          <div className="container relative z-10 mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-12 animate-in fade-in slide-in-from-left-12 duration-1000">
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="h-0.5 w-12 bg-brand-blue rounded-full" />
                      <span className="text-xs md:text-sm font-black text-brand-blue uppercase tracking-[0.4em]">{dict.about.governance_policy}</span>
                   </div>
<h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-black leading-[0.98] tracking-tighter text-white">
                       The core <br />
                       <span className="text-brand-blue italic font-serif font-normal">{isBn ? dict.about.mis_unit : dict.about.mis_unit}</span>
                    </h1>
                   <p className="max-w-xl text-lg md:text-xl text-white/50 font-medium leading-relaxed">
                      Maintaining the digital backbone of DGHS Bangladesh. Facilitating secure health data governance with architectural excellence.
                   </p>
                </div>
             </div>
          </div>
       </header>

       <section className="py-32 bg-background relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-12">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32 items-center">
                <div className="space-y-12">
                   <div className="space-y-6">
<div className="flex items-center gap-3">
                          <div className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                          <span className="text-xs font-black text-brand-blue uppercase tracking-[0.3em]">{dict.about.institutional_mission}</span>
                       </div>
                       <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                          Integrity across <br />
                          <span className="text-brand-blue">{isBn ? dict.about.national_datasets : dict.about.national_datasets}</span>
                       </h2>
                   </div>
                   <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-muted-foreground prose-p:font-medium text-slate-600 dark:text-gray-400">
                      <p>
                         The Management Information System (MIS) of the Directorate General of Health Services (DGHS) is the technological heart of the health sector in Bangladesh. We are architecting a sustainable, digital-first infrastructure to monitor and evaluate national health metrics in real-time.
                      </p>
                      <p className="mt-8">
                         Our directive involves standardizing data protocols and ensuring high-availability systems for clinical operations at every level of governance.
                      </p>
                   </div>
<div className="grid grid-cols-2 gap-8 pt-8">
                       <div className="p-10 rounded-[2.5rem] bg-secondary dark:bg-white/5 border border-slate-100 dark:border-white/10 group hover:shadow-2xl transition-all duration-700">
                          <CheckCircle2 className="h-10 w-10 text-brand-blue mb-6 group-hover:scale-110 transition-transform" />
                          <p className="text-2xl font-black text-foreground dark:text-white tracking-tight leading-tight">{dict.about.data_integrity}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground dark:text-slate-400 mt-2">{dict.about.zero_trust}</p>
                       </div>
                       <div className="p-10 rounded-[2.5rem] bg-secondary dark:bg-white/5 border border-slate-100 dark:border-white/10 group hover:shadow-2xl transition-all duration-700">
                          <Users className="h-10 w-10 text-brand-purple mb-6 group-hover:scale-110 transition-transform" />
                          <p className="text-2xl font-black text-foreground dark:text-white tracking-tight leading-tight">{dict.about.nationwide}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground dark:text-slate-400 mt-2">160M Citizen Outreach</p>
                       </div>
                    </div>
                </div>
                
                <div className="relative group perspective-[1000px]">
                   <div className="absolute inset-0 bg-brand-blue/20 rounded-[4rem] blur-[120px] opacity-10 group-hover:opacity-30 transition-opacity duration-1000" />
                   <div className="aspect-[4/5] rounded-[4.5rem] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-hidden relative group-hover:rotate-1 transition-transform duration-1000">
                      <div className="absolute inset-0 bg-gradient-brand opacity-10" />
                      <div className="absolute inset-0 flex items-center justify-center text-slate-300 transform group-hover:scale-110 transition-transform duration-[1.5s]">
                         <Building2 className="w-64 h-64 opacity-20" />
                      </div>
                      <div className="absolute bottom-12 left-12 right-12 p-10 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[3rem] space-y-4">
                         <div className="flex items-center gap-3">
<span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{dict.about.live_infrastructure}</span>
                         </div>
                         <h4 className="text-2xl font-black text-white leading-tight">MIS Operational Command Center</h4>
                         <p className="text-white/50 text-sm font-medium">{dict.about.headquarters}</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </section>

       <section className="py-32 bg-slate-900 relative overflow-hidden text-white">
          <div className="container mx-auto px-6 md:px-12 space-y-24">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                <div className="space-y-6">
<div className="flex items-center gap-3">
                       <div className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                       <span className="text-xs font-black text-brand-blue uppercase tracking-[0.3em] font-sans">{dict.about.core_leadership}</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
                       Our Team <br />
                       <span className="italic font-serif font-normal text-brand-blue">{isBn ? dict.about.mis_unit : dict.about.mis_unit}</span>
                    </h2>
                </div>
                <Link href={`/${lang}/contact`}>
                   <Button variant="outline" size="lg" className="rounded-2xl h-14 md:h-18 px-12 gap-3 border-white/10 text-white hover:bg-white hover:text-black transition-all group">
                      Connect with the Unit <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                   </Button>
                </Link>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20">
                {employees.map((emp) => (
                  <div key={emp.id} className="group space-y-8 h-full flex flex-col items-center text-center">
                     <div className="h-64 w-64 rounded-[3.5rem] bg-white/5 border border-white/10 shadow-2xl overflow-hidden relative group-hover:scale-105 transition-transform duration-700">
                        {emp.image ? (
                          <img src={emp.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={isBn ? emp.nameBn : emp.nameEn} />
                        ) : (
                          <div className="h-full w-full bg-brand-blue/10 flex items-center justify-center text-brand-blue/30 group-hover:scale-110 transition-transform duration-[2s]">
                             <User className="h-24 w-24" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                           <div className="flex justify-center gap-4 translate-y-8 group-hover:translate-y-0 transition-transform">
                              {emp.email && (
                                <Link href={`mailto:${emp.email}`}>
                                  <div className="h-10 w-10 bg-brand-blue rounded-xl flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform shadow-brand-blue/20">
                                     <Mail className="h-4 w-4" />
                                  </div>
                                </Link>
                              )}
                              {emp.phone && (
                                <Link href={`tel:${emp.phone}`}>
                                  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-black shadow-xl hover:scale-110 transition-transform shadow-white/20">
                                     <Phone className="h-4 w-4" />
                                  </div>
                                </Link>
                              )}
                           </div>
                        </div>
                     </div>
                     <div className="space-y-3 px-4 flex-1 flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-blue leading-none">{isBn ? emp.designationBn : emp.designationEn}</span>
                        <h4 className="text-2xl font-black text-white tracking-tight leading-none group-hover:text-brand-blue transition-colors">{isBn ? emp.nameBn : emp.nameEn}</h4>
                        <p className="text-white/40 text-xs font-bold leading-relaxed line-clamp-3 italic opacity-0 group-hover:opacity-100 transition-opacity mt-4 uppercase tracking-widest leading-none">
                           {isBn ? emp.responsibilitiesBn : emp.responsibilitiesEn}
                        </p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
       </section>

       <section className="py-24 relative overflow-hidden h-fit">
          <div className="container mx-auto px-6 md:px-12">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                <div className="space-y-4">
                   <div className="flex items-center gap-3 justify-center md:justify-start">
                      <ShieldCheck className="h-6 w-6 text-brand-blue" />
                      <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{dict.about.compliance}</h4>
                   </div>
                   <p className="text-muted-foreground text-sm font-medium leading-relaxed mt-2">{dict.about.compliance_desc}</p>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center gap-3 justify-center md:justify-start">
                      <Database className="h-6 w-6 text-brand-purple" />
                      <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{dict.about.ecosystem}</h4>
                   </div>
                   <p className="text-muted-foreground text-sm font-medium leading-relaxed mt-2">{dict.about.ecosystem_desc}</p>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center gap-3 justify-center md:justify-start">
                      <TrendingUp className="h-6 w-6 text-brand-green" />
                      <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{dict.about.governance}</h4>
                   </div>
                   <p className="text-muted-foreground text-sm font-medium leading-relaxed mt-2">{dict.about.governance_desc}</p>
                </div>
             </div>
          </div>
       </section>
    </div>
  )
}
