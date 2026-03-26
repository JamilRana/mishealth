import * as React from "react"
import { NewsForm } from "@/components/admin/news-form"
import type { Locale } from "@/i18n-config"

export default async function NewNewsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
      <NewsForm lang={lang} />
    </div>
  )
}
