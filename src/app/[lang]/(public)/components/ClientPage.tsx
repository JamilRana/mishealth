"use client"

import * as React from "react"
import { i18n, type Locale } from "@/i18n-config"
import { Button } from "@/components/ui/button"
import { 
  ArrowUpRight, ArrowRight, Database, Files, FileText, Activity,
  Calendar, ChevronRight, TrendingUp, Zap
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { AnimatedStatCard } from "./AnimatedStatCard"
import { ProjectCard } from "@/components/public/project-card"
import { CloudImage } from "@/components/public/image-props"

interface ClientPageProps {
  lang: Locale
  dict: any
  initialProjects: any[]
  initialNews: any[]
  initialReports?: any[]  // ✅ Added
}

export function ClientPage({ 
  lang, 
  dict, 
  initialProjects, 
  initialNews,
  initialReports = []  // ✅ Default value
}: ClientPageProps) {
  const isBn = lang === "bn"
  
  // ✅ Reduced motion support
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)
  
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return (
    <div className="flex flex-col bg-background selection:bg-brand-blue/30 overflow-x-hidden">
      {/* ✅ Skip Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 
          focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground 
          focus:rounded-lg focus:font-bold"
      >
        Skip to main content
      </a>

      <main id="main-content">
        {/* Hero Section */}
        <section 
          className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#050f1e] text-white pt-20"
          aria-label="Hero section"
        >
          {/* Ambient Glows */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute rounded-full w-[900px] h-[900px] -top-[15%] -left-[15%] 
              bg-[radial-gradient(circle,rgba(8,117,233,0.2)_0%,transparent_70%)] 
              animate-pulse-slow" 
            />
            <div className="absolute rounded-full w-[700px] h-[700px] bottom-[5%] -right-[10%] 
              bg-[radial-gradient(circle,rgba(131,9,238,0.15)_0%,transparent_70%)] 
              animate-pulse-slow delay-1000" 
            />
          </div>
          
          <div className="container mx-auto px-6 md:px-12 relative z-20">
            <div className="max-w-5xl space-y-10">
              {/* Status Badge */}
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 
                bg-white/5 border border-white/10 rounded-full 
                text-[11px] font-bold uppercase tracking-[0.15em] text-brand-blue/90"
                role="status"
              >
                <span className="relative flex h-2.5 w-2.5 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full 
                    rounded-full bg-brand-blue opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 
                    bg-brand-blue shadow-lg shadow-brand-blue/50"></span>
                </span>
                <span className="hidden sm:inline">{dict.home.system_status}:</span> 
                <span className="text-brand-blue font-black">{dict.home.active}</span>
              </div>
              
              {/* Hero Title */}
<h1 
  className={cn(
    "max-w-4xl text-balance text-[clamp(3rem,8vw,4.5rem)] font-black tracking-tight",
    isBn 
      ? "leading-[1.5] py-4 font-[300]"  // More breathing room for Bengali
      : "leading-[1.05] font-black",
    "overflow-visible"
  )}
  lang={isBn ? "bn" : "en"}  // ✅ Proper language attribute
>
  {dict.home.hero_title.split(' ').map((word: string, i: number) => {
    const isEmphasized = i % 2 === 1
    return (
      <span 
        key={i}
        className={cn(
          "inline-block mr-2 transition-transform duration-300 hover:scale-105",
          isEmphasized && "font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple pr-4",
          prefersReducedMotion && "transition-none"
        )}
      >
        {word}
      </span>
    )
  })}
</h1>
              
              {/* Subtitle */}
              <p className={cn(
                "text-[clamp(1.1rem,2vw,1.35rem)] text-white/70 font-medium leading-relaxed max-w-2xl",
                prefersReducedMotion ? "opacity-100" : "animate-fade-in-up"
              )}>
                {dict.home.hero_subtitle}
              </p>
              
              {/* CTA Buttons */}
              <div className={cn(
                "flex flex-wrap items-center gap-5 pt-4",
                prefersReducedMotion ? "" : "animate-fade-in-up"
              )}>
                <Link href={`/${lang}/projects`}>
                  <Button 
                    size="lg" 
                    className="rounded-full h-14 px-10 bg-white text-black 
                      hover:bg-brand-blue hover:text-white font-bold text-base 
                      transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {isBn ? "প্রকল্পসমূহ দেখুন" : "Explore Projects"}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Quick Stats Preview */}
              <div className={cn(
                "grid grid-cols-3 gap-4 pt-2 max-w-md pb-6",
                prefersReducedMotion ? "" : "animate-fade-in-up"
              )}>
                {[
                  { label: "Projects", value: initialProjects.length, icon: Database },
                  { label: "Documents", value: initialNews.length, icon: FileText },
                  { label: "Reports", value: initialReports.length, icon: TrendingUp },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                    <stat.icon className="h-4 w-4 mx-auto mb-1 text-brand-blue/80" />
                    <div className="text-lg font-black text-white">{stat.value}</div>
                    <div className="text-[10px] text-white/50 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative Watermark */}
          <div className="absolute -bottom-10 right-0 text-[25vw] font-black 
            text-white/[0.02] select-none pointer-events-none leading-none tracking-tighter
            hidden lg:block"
            aria-hidden="true"
          >
            MIS
          </div>
        </section>

        {/* Marquee Section */}
<section className="bg-[#050f1e] border-y border-white/10 py-4 overflow-hidden">
  <div className="flex animate-marquee whitespace-nowrap gap-20 items-center marquee-mask pause-on-hover">
    {initialProjects.slice(0, 5).map((project, i) => (
      <React.Fragment key={project.id}>
        {/* Project Card in Marquee */}
        <Link 
          href={`/${lang}/projects/${project.id}`}
          className="group flex items-center gap-3"
        >
          <span className="text-2xl md:text-3xl font-black text-white/25 uppercase tracking-tighter 
            group-hover:text-brand-blue/80 transition-colors">
            {isBn ? project.titleBn : project.titleEn}
          </span>
          {/* Category Badge */}
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
            i % 3 === 0 ? "bg-brand-blue/20 text-brand-blue" : 
            i % 3 === 1 ? "bg-brand-purple/20 text-brand-purple" : 
            "bg-brand-green/20 text-brand-green"
          )}>
            {isBn ? project.categoryBn : project.categoryEn}
          </span>
        </Link>
        
        {/* Colored Dot */}
        <span 
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            i % 3 === 0 ? "bg-brand-blue/50" : 
            i % 3 === 1 ? "bg-brand-purple/50" : 
            "bg-brand-green/50"
          )} 
          aria-hidden="true" 
        />
      </React.Fragment>
    ))}
    
    {/* Fallback for empty state */}
    {initialProjects.length === 0 && (
      <>
        {[...Array(6)].map((_, i) => (
          <React.Fragment key={i}>
            <span className="text-2xl md:text-3xl font-black text-white/25 uppercase tracking-tighter">
              {i % 3 === 0 ? "Real-time Intelligence" : 
               i % 3 === 1 ? "National Transformation" : 
               "Data-Driven Health"}
            </span>
            <span 
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                i % 3 === 0 ? "bg-brand-blue/50" : 
                i % 3 === 1 ? "bg-brand-purple/50" : 
                "bg-brand-green/50"
              )} 
              aria-hidden="true" 
            />
          </React.Fragment>
        ))}
      </>
    )}
  </div>
</section>
        {/* Core Operational Pillar Stats */}
        <section className="py-24 relative bg-background">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {/* ✅ Fixed: String icon names + actual data */}
              <AnimatedStatCard icon={Database} label={dict.home.kpi_projects} value={initialProjects.length.toString()} note="National Integration" delay={0} />
              <AnimatedStatCard icon={Files} label={dict.home.kpi_docs} value={initialNews.length.toString()} note="Manuals & Resources" delay={200} />
              <AnimatedStatCard icon={FileText} label={dict.home.kpi_reports} value={initialReports.length.toString()} note="Official Audit Stream" delay={400} />
              <AnimatedStatCard icon={Activity} label={dict.home.kpi_events} value="9M+" note={dict.home.kpi_events_note} delay={600} />
            </div>
          </div>
        </section>

        {/* Portfolio Showcase Section */}
        <section className="py-24 md:py-32 bg-secondary/30 dark:bg-secondary/20">
          <div className="container mx-auto px-6 md:px-12 space-y-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                  <span className="text-xs font-black text-brand-blue uppercase tracking-[0.3em] font-sans">{dict.home.strategic_solutions}</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground dark:text-white leading-tight max-w-2xl">
                  Defining national <br />
                  <span className="italic font-serif font-normal text-brand-blue">{isBn ? dict.home.digital_innovation : dict.home.digital_innovation}</span>
                </h2>
              </div>
              <Link href={`/${lang}/projects`}>
                <Button variant="outline" size="lg" className="rounded-2xl h-14 md:h-16 px-10 gap-3 border-2 border-slate-200 dark:border-white/10 hover:bg-brand-blue hover:text-white group transition-all duration-500">
                  Explore Portfolio <ArrowRight className="h-5 w-5 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* ✅ Fixed: Empty state */}
            {initialProjects.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <Database className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
                <h3 className="text-2xl font-black text-foreground mb-2">{dict.home.no_projects}</h3>
                <p className="text-muted-foreground">{dict.home.no_projects_desc}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16">
                {initialProjects.slice(0, 3).map((project, i) => (
                  <ProjectCard 
                    key={project.id} 
                    id={project.id} 
                    lang={lang} 
                    title={isBn ? project.titleBn : project.titleEn} 
                    category={isBn ? project.categoryBn : project.categoryEn} 
                    status={project.status} 
                    imageUrl={project.images?.[0]?.url} 
                    dict={dict} 
                    aspect={i === 1 ? "portrait" : "square"} 
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Communication Feed Section */}
        <section className="py-24 relative overflow-hidden bg-background">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-20">
              <div className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-5xl font-black text-foreground dark:text-white tracking-tight leading-tight">
                    {dict.home.latest_bulletins}
                  </h2>
                  <p className="text-lg font-medium text-muted-foreground dark:text-gray-400">
                    {dict.home.bulletin_archive}
                  </p>
                </div>
                <Link href={`/${lang}/news`} className="block" aria-label="View all news bulletins and announcements">
                  <div className="p-10 rounded-[3rem] bg-brand-blue text-white group cursor-pointer shadow-2xl shadow-brand-blue/20 hover:scale-[1.02] transition-all duration-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-all rotate-12 group-hover:rotate-0" aria-hidden="true">
                      <Zap className="h-32 w-32" />
                    </div>
                    <div className="relative z-10 space-y-6">
                      <h4 className="text-2xl font-black tracking-tight">{isBn ? dict.home.complete_bulletin_board : dict.home.complete_bulletin_board}</h4>
                      <p className="text-white/60 font-medium">{dict.home.bulletin_archive}</p>
                      <ChevronRight className="h-8 w-8 text-white transition-transform group-hover:translate-x-4" />
                    </div>
                  </div>
                </Link>
              </div>

              {/* ✅ Fixed: Empty state */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {initialNews.length === 0 ? (
                  <div className="col-span-full py-20 text-center">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
                    <h3 className="text-2xl font-black text-foreground mb-2">{dict.home.no_bulletins}</h3>
                    <p className="text-muted-foreground">{dict.home.no_bulletins_desc}</p>
                  </div>
                ) : (
                  initialNews.slice(0, 4).map((n) => (
                    <Link key={n.id} href={`/${lang}/news/${n.id}`} className="group block h-full">
                      <div className="bg-white dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-10 hover:shadow-2xl transition-all duration-500 h-full flex flex-col space-y-6 group-hover:-translate-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest bg-brand-blue/10 px-3 py-1 rounded-full">
                            {isBn ? dict.home.official_update : dict.home.official_update}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                            <Calendar className="h-3 w-3" /> {new Date(n.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <h3 className="text-2xl font-black tracking-tight leading-snug dark:text-white group-hover:text-brand-blue transition-colors">
                          {isBn ? n.titleBn : n.titleEn}
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground dark:text-gray-400 line-clamp-3 leading-relaxed flex-1">
                          {isBn ? n.excerptBn : n.excerptEn}
                        </p>
                        <div className="pt-6 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-widest text-brand-blue group-hover:gap-2 transition-all">{dict.home.read_disclosure}</span>
                          <ArrowRight className="h-4 w-4 text-brand-blue opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Global Action Footer */}
        <section className="py-24 relative overflow-hidden bg-secondary/30 dark:bg-secondary/20">
          <div className="container mx-auto px-6 md:px-12">
            <div className="p-16 rounded-[4rem] bg-[#050f1e] text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-brand-blue/5 opacity-40 animate-pulse" aria-hidden="true" />
              <div className="absolute -bottom-10 -left-10 opacity-5" aria-hidden="true">
                <Activity className="h-64 w-64" />
              </div>
              
              <div className="relative z-10 space-y-6 text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter">{dict.home.ready_to_deploy}</h2>
                <p className="text-white/50 text-xl font-medium max-w-xl">{dict.home.ready_to_deploy_subtitle}</p>
              </div>
              
              <div className="relative z-10">
                <Link href={`/${lang}/contact`}>
                  <Button size="lg" className="rounded-full h-20 px-16 bg-white text-black hover:bg-brand-blue hover:text-white font-black text-lg transition-all duration-700 shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95">
                    {dict.home.initiate_connection}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}