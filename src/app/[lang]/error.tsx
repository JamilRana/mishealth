"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RotateCcw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050f1e] flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center space-y-12">
        <div className="relative inline-block">
          <div className="h-32 w-32 bg-destructive/10 rounded-[3rem] flex items-center justify-center text-destructive mx-auto animate-pulse">
            <AlertCircle className="h-16 w-16" />
          </div>
          <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center border border-slate-100 dark:border-slate-700">
             <span className="text-[10px] font-black text-slate-400">500</span>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">System Malfunction</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
            The requested operation encountered an internal error. Our engineers have been notified of the protocol breach.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={() => reset()}
            className="rounded-full h-14 px-8 gap-2 font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            <RotateCcw className="h-5 w-5" /> Retry Sync
          </Button>
          <Link href="/">
            <Button 
              variant="outline" 
              className="rounded-full h-14 px-8 gap-2 font-bold bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
            >
              <Home className="h-5 w-5" /> Return Base
            </Button>
          </Link>
        </div>

        <div className="pt-12">
           <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Network Status: Operational</span>
           </div>
        </div>
      </div>
    </div>
  )
}
