"use client"

import * as React from "react"
import { Megaphone, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface NewsTickerProps {
  news: any[]
  lang: string
}

export function NewsTicker({ news, lang }: NewsTickerProps) {
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    if (news.length <= 1) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % news.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [news])

  if (news.length === 0) return null

  const current = news[index]

  return (
    <div className="bg-primary text-white py-3 sticky top-0 z-[100] shadow-2xl overflow-hidden border-b border-primary-foreground/10">
      <div className="container mx-auto px-6 flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 whitespace-nowrap">
           <Megaphone className="h-4 w-4 animate-bounce" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Latest Update</span>
        </div>
        
        <div className="flex-1 relative h-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 flex items-center"
            >
               <Link 
                 href={`/${lang}/news/${current.slug}`} 
                 className="text-sm font-bold tracking-tight hover:underline flex items-center gap-3 truncate max-w-full"
               >
                 <span className="flex-1 truncate">{lang === "en" ? current.titleEn : current.titleBn}</span>
                 <ArrowRight className="h-4 w-4 shrink-0 opacity-50" />
               </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 pl-6 border-l border-white/10">
           {news.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/30'}`} 
              />
           ))}
        </div>
      </div>
    </div>
  )
}
