import * as React from "react"
import prisma from "@/lib/prisma"
import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"
import { 
  BarChart3, TrendingUp, Users, Activity, ShieldCheck, Database, 
  Calendar, Download, Zap, LayoutDashboard, Globe, ExternalLink,
  FileText, Building2, Stethoscope, Pill, Heart, Baby, Eye, 
  TestTube, ActivitySquare, Bus, UsersRound, ClipboardList
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BarChart3, TrendingUp, Users, Activity, ShieldCheck, Database,
  Calendar, Download, Zap, LayoutDashboard, Globe, ExternalLink,
  FileText, Building2, Stethoscope, Pill, Heart, Baby, Eye,
  TestTube, ActivitySquare, Bus, UsersRound, ClipboardList
}

export default async function LinksPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const isBn = lang === "bn"

  const usefulLinks = await prisma.usefulLink.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" }
  })

  const linksByCategory = usefulLinks.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = []
    }
    acc[link.category].push(link)
    return acc
  }, {} as Record<string, typeof usefulLinks>)

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
                      <span className="text-xs md:text-sm font-black text-brand-blue uppercase tracking-[0.4em]">{dict.links.governance_oversight}</span>
                   </div>
                   <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-black leading-[0.98] tracking-tighter text-white">
                      <span className="text-brand-blue italic font-serif font-normal">{isBn ? dict.links.health_sector : dict.links.health_sector}</span>
                   </h1>
                   <p className="max-w-xl text-lg md:text-xl text-white/50 font-medium leading-relaxed">
                      {dict.links.useful_links_subtitle || "Access key health information systems, dashboards, and national health portals."}
                   </p>
                </div>
             </div>
          </div>
       </header>

       <section className="py-32 bg-background relative overflow-hidden min-h-[60vh] flex items-center">
          <div className="container mx-auto px-6 md:px-12">
             {Object.entries(linksByCategory).length === 0 ? (
               <div className="text-center py-20">
                  <Database className="h-16 w-16 mx-auto text-muted-foreground/20 mb-6" />
                  <h3 className="text-2xl font-black text-foreground mb-2">{dict.links.no_links || "No Links Available"}</h3>
                  <p className="text-muted-foreground">{dict.links.no_links_desc || "Links will be available soon."}</p>
               </div>
             ) : (
               <div className="space-y-20">
                  {Object.entries(linksByCategory).map(([category, links]) => (
                    <div key={category} className="space-y-10">
                       <div className="flex items-center gap-4">
                          <div className="h-1 w-12 bg-brand-blue rounded-full" />
                          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                            {isBn ? category : category}
                          </h2>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {links.map((link) => {
                            const IconComponent = link.icon ? iconMap[link.icon] || ExternalLink : ExternalLink
                            return (
                              <a 
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group p-8 rounded-[2.5rem] bg-card border border-border shadow-sm dark:shadow-none hover:shadow-2xl hover:border-brand-blue/30 hover:-translate-y-2 transition-all duration-500 flex flex-col items-start gap-6"
                              >
                                 <div className="h-14 w-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                                    <IconComponent className="w-7 h-7" />
                                 </div>
                                 <div className="space-y-3">
                                    <h3 className="text-xl font-black text-foreground tracking-tight group-hover:text-brand-blue transition-colors">
                                       {isBn ? link.titleBn : link.titleEn}
                                    </h3>
                                    {link.descriptionEn && (
                                      <p className="text-sm font-medium text-muted-foreground dark:text-gray-400 leading-relaxed">
                                         {isBn ? (link.descriptionBn || link.descriptionEn) : link.descriptionEn}
                                      </p>
                                    )}
                                 </div>
                                 <div className="mt-auto pt-4 flex items-center gap-2 text-brand-blue opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                                    <span className="text-xs font-black uppercase tracking-widest">{dict.links.visit || "Visit"}</span>
                                    <ExternalLink className="h-4 w-4" />
                                 </div>
                              </a>
                            )
                          })}
                       </div>
                    </div>
                  ))}
               </div>
             )}
          </div>
       </section>

       <section className="py-32 bg-muted relative overflow-hidden flex items-center">
          <div className="container mx-auto px-6 md:px-12 p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden bg-surface rounded-[3rem] border border-border-strong">
             <div className="absolute inset-0 bg-brand-blue/5 opacity-40 animate-pulse" />
             <div className="absolute bottom-[-20%] right-[-10%] opacity-10">
                <TrendingUp className="h-96 w-96 text-brand-blue" />
             </div>
             
             <div className="relative z-10 space-y-6 text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">{dict.links.secure_access}</h2>
                <p className="text-muted-foreground text-xl font-medium max-w-xl">{dict.links.secure_access_desc}</p>
             </div>
          </div>
       </section>
    </div>
  )
}
