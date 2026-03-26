"use client"

import { Button } from "@/components/ui/button"
import { Printer, Mail, Download } from "lucide-react"
import { DownloadButton } from "@/components/public/image-props"

interface NewsActionsProps {
  lang: string
  title: string
  coverImage: string | null
  shareLabel: string
  printLabel: string
  emailLabel: string
}

export function NewsActions({ lang, title, coverImage, shareLabel, printLabel, emailLabel }: NewsActionsProps) {
  return (
    <div className="flex items-center space-x-4">
      <Button 
        variant="ghost" 
        size="sm" 
        className="font-bold text-muted-foreground gap-2 hover:bg-muted uppercase tracking-widest text-[10px]"
        onClick={() => {
          if (navigator.share) {
            navigator.share({ title, url: window.location.href })
          } else {
            navigator.clipboard.writeText(window.location.href)
          }
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
        {shareLabel}
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="font-bold text-muted-foreground gap-2 hover:bg-muted uppercase tracking-widest text-[10px] hidden sm:flex"
        onClick={() => window.print()}
      >
        <Printer className="h-4 w-4" /> {printLabel}
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="font-bold text-muted-foreground gap-2 hover:bg-muted uppercase tracking-widest text-[10px] hidden sm:flex"
        onClick={() => {
          const subject = encodeURIComponent(title)
          const body = encodeURIComponent(`Check out this news: ${window.location.href}`)
          window.location.href = `mailto:?subject=${subject}&body=${body}`
        }}
      >
        <Mail className="h-4 w-4" /> {emailLabel}
      </Button>
      {coverImage && (
        <DownloadButton 
          imageUrl={coverImage} 
          fileName={`${title}.jpg`}
        />
      )}
    </div>
  )
}