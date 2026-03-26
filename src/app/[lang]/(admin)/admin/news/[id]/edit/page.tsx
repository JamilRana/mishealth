import * as React from "react"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { NewsForm } from "@/components/admin/news-form"
import type { Locale } from "@/i18n-config"

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string; lang: Locale }>
}) {
  const { id, lang } = await params

  const news = await prisma.news.findUnique({
    where: { id },
  })

  if (!news) {
    notFound()
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
      <NewsForm lang={lang} initialData={news} id={id} />
    </div>
  )
}
