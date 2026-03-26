"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnimatedStatCardProps {
  icon: LucideIcon
  label: string
  value: string
  note: string
  delay?: number
}

export function AnimatedStatCard({ icon: Icon, label, value, note, delay = 0 }: AnimatedStatCardProps) {
  const [inView, setInView] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.disconnect()
      }
    })
    
    if (ref.current) {
      observer.observe(ref.current)
    }
    
    return () => observer.disconnect()
  }, [])

  return (
    <div 
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "p-12 rounded-[3.5rem] border border-slate-100 dark:border-white/5 bg-white dark:bg-black/20 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-1000 group relative overflow-hidden",
        inView ? "animate-in fade-in slide-in-from-bottom-5 duration-1000" : "opacity-0"
      )}
    >
       {/* Ambient Glow */}
       <div className="absolute top-0 right-0 h-32 w-32 bg-brand-blue/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
       
       <div className="space-y-8 relative z-10">
          <div className="h-14 w-14 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-brand-blue group-hover:bg-brand-blue/10 transition-all duration-700">
             <Icon className="h-6 w-6" />
          </div>
          <div className="space-y-2">
             <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{value}</p>
             <div className="space-y-1">
                <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">{label}</p>
                <p className="text-[10px] font-bold text-brand-blue uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{note}</p>
             </div>
          </div>
       </div>

       <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-10 transition-all duration-1000 rotate-12 group-hover:rotate-0">
          <Icon className="h-40 w-40" />
       </div>
    </div>
  )
}
