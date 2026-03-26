import * as React from "react"
import { LoginForm } from "@/components/auth/login-form"
import type { Locale } from "@/i18n-config"
import { ShieldCheck, Database, Zap } from "lucide-react"

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params

  return (
    <div className="min-h-screen bg-[#050f1e] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
       {/* Ambient Background */}
       <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:40px_40px]" />
       <div className="absolute top-[20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-brand-blue/10 blur-[120px] animate-pulse-slow" />
       
       <div className="w-full max-w-xl space-y-12 relative z-10 animate-in fade-in zoom-in-95 duration-1000">
          <div className="text-center space-y-6">
             <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-brand-blue shadow-2xl">
                <ShieldCheck className="w-5 h-5 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Encrypted Command Center</span>
             </div>
             <h1 className="text-5xl font-black tracking-tighter text-white">
                DGHS <span className="text-brand-blue italic font-serif font-normal">Vault.</span>
             </h1>
             <p className="text-white/40 font-bold text-xs uppercase tracking-widest px-10">Access restricted to authorized personnel. Secure identity verification required.</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
             <LoginForm lang={lang} />
          </div>

          <div className="flex items-center justify-center gap-10 pt-8 opacity-40">
             <div className="flex items-center gap-3">
                <Database className="h-4 w-4 text-brand-blue" />
                <span className="text-[10px] font-black uppercase tracking-widest">National DB Access</span>
             </div>
             <div className="h-4 w-[1px] bg-white/10" />
             <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">SLA: 99.9% Up</span>
             </div>
          </div>
       </div>
    </div>
  )
}
