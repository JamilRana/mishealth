import * as React from "react"
import Link from "next/link"
import { Phone, Mail, MapPin, ArrowUpRight, Facebook, Twitter, Youtube, ChevronRight } from "lucide-react"
import type { Locale } from "@/i18n-config"
import { cn } from "@/lib/utils"

interface FooterProps {
  lang: Locale
  dict: any
}

export function Footer({ lang, dict }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#050f1e] text-white py-20 lg:py-32 relative overflow-hidden text-white/60 border-t border-white/10">
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
      {/* Background Accent */}
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(8,117,233,0.05)_0%,transparent_70%)] rounded-full blur-[80px]" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32">
          {/* Brand Vision */}
          <div className="lg:col-span-6 space-y-12">
            <Link href={`/${lang}`} className="flex items-center space-x-4 group">
              <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center text-black font-black text-2xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-2xl">
                M
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black leading-none tracking-tighter uppercase">{dict.footer.title}</span>
                <span className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">
                  MIS DGHS Bangladesh
                </span>
              </div>
            </Link>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] max-w-xl">
              Digitising <span className="font-serif italic font-normal text-brand-blue">Ecosystems.</span><br />
              Monitoring <span className="font-serif italic font-normal text-brand-purple">Transformations.</span>
            </h2>

            <div className="flex items-center space-x-4">
              {[Facebook, Twitter, Youtube].map((Icon, i) => (
                <Link key={i} href="#" className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 group/soc">
                  <Icon className="h-5 w-5 transition-transform group-hover/soc:-translate-y-0.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Detailed Navigation */}
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-8">
              <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-white/30">Intelligence</h3>
              <ul className="space-y-4">
                {[
                  { href: `/${lang}/projects`, label: dict.nav.projects },
                  { href: `/${lang}/news`, label: dict.nav.news },
                  { href: `/${lang}/reports`, label: dict.nav.reports },
                  { href: `/${lang}/documents`, label: dict.nav.docs },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-base font-bold text-white/60 hover:text-white transition-colors tracking-tight flex items-center group/item">
                      <ChevronRight className="w-4 h-4 text-brand-blue opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-white/30">Infrastructure</h3>
              <ul className="space-y-4">
                {[
                  { href: "https://dghs.gov.bd", label: "DGHS Portal" },
                  { href: "https://mohfw.gov.bd", label: "MOHFW Site" },
                  { href: "https://bangladesh.gov.bd", label: "National Portal" },
                ].map((link) => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-base font-bold text-white/60 hover:text-white transition-colors tracking-tight flex items-center group/ext">
                       {link.label} <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8 col-span-2 md:col-span-1">
              <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-white/30">Connect</h3>
              <div className="space-y-8">
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">Inquiries</p>
                  <a href="mailto:info@mis.dghs.gov.bd" className="text-base font-bold text-white/60 hover:text-white transition-colors break-words">
                    info@mis.dghs.gov.bd
                  </a>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">Presence</p>
                  <p className="text-sm font-medium text-white/50 leading-relaxed">
                    {dict.footer.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Closing Bar */}
        <div className="mt-24 lg:mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white/20">
            <span>&copy; {currentYear} MIS DGHS</span>
            <Link href={`/${lang}/privacy`} className="hover:text-white transition-colors">Compliance</Link>
            <Link href={`/${lang}/terms`} className="hover:text-white transition-colors">Legal</Link>
          </div>
          
          <Link href={`/${lang}/login`} className="group relative px-10 py-5 bg-white rounded-full overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl">
             <span className="relative z-10 text-black font-black text-[12px] uppercase tracking-widest leading-none">Management Access</span>
             <div className="absolute inset-0 bg-brand-blue translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
             <span className="absolute inset-0 z-10 flex items-center justify-center text-white font-black text-[12px] uppercase tracking-widest leading-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
               Authenticate Portal
             </span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
