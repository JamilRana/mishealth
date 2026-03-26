import * as React from "react"
import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { NewsTicker } from "@/components/public/news-ticker"
import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"
import prisma from "@/lib/prisma"

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang: langParam } = await params
  const lang = langParam as Locale
  const dict = await getDictionary(lang)

  // Fetch Published Alerts for the Ticker
  const alerts = await prisma.news.findMany({
    where: { published: true, isUrgent: true },
    orderBy: { createdAt: "desc" },
    take: 5
  })

  return (
    <div className="flex flex-col min-h-screen">
      <NewsTicker news={alerts} lang={lang} />
      <Navbar lang={lang} dict={dict} />
      <main className="flex-1 overflow-x-hidden">{children}</main>
      <Footer lang={lang} dict={dict} />
    </div>
  )
}
