import * as React from "react"
import prisma from "@/lib/prisma"
import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"
import { ContactForm } from "@/components/public/contact-form"
import { Mail, MapPin, Phone, Send, Globe } from "lucide-react"
import Link from "next/link"

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: langParam } = await params
  const lang = langParam as Locale
  const dict = await getDictionary(lang)
  const isBn = lang === "bn"

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
                <span className="text-xs md:text-sm font-black text-brand-blue uppercase tracking-[0.4em]">
                  Get in Touch
                </span>
              </div>
              <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-black leading-[0.98] tracking-tighter text-white">
                Contact <br />
                <span className="text-brand-blue italic font-serif font-normal">MIS Portal</span>
              </h1>
              <p className="max-w-xl text-lg md:text-xl text-white/50 font-medium leading-relaxed">
                Have questions about the Management Information System? Our team is here to help.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="py-32 bg-background relative overflow-hidden flex items-center min-h-[50vh]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div className="space-y-12">
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="h-14 w-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue shrink-0">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-foreground">Office Address</h3>
                    <p className="text-muted-foreground font-medium">
                      {isBn ? "৬৮-৬৯ মহাখালী বা/এ, ঢাকা ১২১২" : "68-69 Mohakhali C/A, Dhaka 1212"}
                      <br />
                      {isBn ? "স্বাস্থ্য অধিদপ্তর (ডিজিএইচএস)" : "Directorate General of Health Services (DGHS)"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="h-14 w-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue shrink-0">
                    <Mail className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-foreground">Email</h3>
                    <p className="text-muted-foreground font-medium">mis@dghs.gov.bd</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="h-14 w-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue shrink-0">
                    <Phone className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-foreground">Phone</h3>
                    <p className="text-muted-foreground font-medium">+880 2 222 222 222</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="h-14 w-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue shrink-0">
                    <Globe className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-foreground">Website</h3>
                    <p className="text-muted-foreground font-medium">www.dghs.gov.bd</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <ContactForm lang={lang} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
