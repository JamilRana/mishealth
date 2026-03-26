import * as React from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Locale } from "@/i18n-config"
import { CloudImage } from "@/components/public/image-props"

interface ProjectCardProps {
  id: string
  lang: Locale
  title: string
  category: string
  status: string
  imageUrl?: string
  className?: string
  aspect?: "square" | "video" | "portrait" | "wide"
  dict: any
}

export function ProjectCard({ id, lang, title, category, status, imageUrl, className, aspect = "portrait", dict }: ProjectCardProps) {
  const aspectMap = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[4/5]",
    wide: "aspect-[21/9]"
  }

  const isOngoing = status === "ONGOING"

  return (
    <Link href={`/${lang}/projects/${id}`} className={cn("block group", className)}>
      <div className={cn(
        "relative rounded-[2.5rem] overflow-hidden bg-muted dark:bg-black border border-border/20 dark:border-white/10 transition-all duration-700 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] dark:group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)]",
        aspectMap[aspect]
      )}>
        {/* Project Thumbnail */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted group-hover:scale-105 transition-transform duration-1000 ease-out-expo">
           {imageUrl ? (
             <CloudImage 
               src={imageUrl} 
               alt={title} 
               className="w-full h-full object-cover"
             />
           ) : (
             <div className="w-full h-full flex items-center justify-center">
               <div className="text-foreground/5 font-black text-[10vw] md:text-[6vw] uppercase tracking-tighter leading-none text-center px-8 blur-[1px] group-hover:blur-0 transition-all duration-1000">
                 {title.split(' ').slice(0, 2).join('\u00A0')}
               </div>
             </div>
           )}
        </div>
        
        {/* Floating Tags */}
        <div className="absolute top-6 left-6 flex flex-wrap gap-2 z-10">
            <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-xl">
              {category}
            </span>
            {isOngoing && (
              <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-brand-green/20 backdrop-blur-xl border border-brand-green/30 text-brand-green shadow-xl">
                {dict.projects.active_ops}
              </span>
            )}
        </div>

        {/* Action Button */}
        <div className="absolute bottom-8 right-8 h-12 w-12 rounded-full bg-white text-black flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out-expo shadow-2xl z-10">
          <ArrowUpRight className="w-5 h-5" />
        </div>

        {/* View Project Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-brand-blue/60 to-purple-600/70">
          <span className="text-white font-bold text-base">{dict.home.view_more}</span>
          <ArrowUpRight className="w-5 h-5 text-white" />
        </div>
      </div>
      
      <div className="mt-8 space-y-2 px-2">
        <h3 className="text-2xl md:text-3xl font-black leading-tight tracking-tight text-foreground dark:text-white group-hover:text-brand-blue transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground font-medium flex items-center gap-2 dark:text-white/60">
           MIS Infrastructure <span className="w-1 h-1 rounded-full bg-border" /> {category}
        </p>
      </div>
    </Link>
  )
}
