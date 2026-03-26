// app/[lang]/(public)/page.tsx
import * as React from "react"
import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"
import prisma from "@/lib/prisma"
import { ClientPage } from "./components/ClientPage"

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  const [projects, news, stats] = await Promise.all([
    prisma.project.findMany({ take: 3, orderBy: { year: 'desc' }, include: { images: true } }),
    prisma.news.findMany({ take: 3, where: { published: true }, orderBy: { createdAt: 'desc' } }),
    prisma.project.groupBy({ by: ['categoryEn'], _count: true })
  ])

  return (
    <ClientPage 
      lang={lang} 
      dict={dict} 
      initialProjects={projects} 
      initialNews={news}
    />
  )
}
