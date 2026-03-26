import * as React from "react"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { DocumentForm } from "@/components/admin/document-form"
import type { Locale } from "@/i18n-config"

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string; lang: Locale }>
}) {
  const { id, lang } = await params

  const document = await prisma.document.findUnique({
    where: { id },
  })

  if (!document) {
    notFound()
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
      <DocumentForm lang={lang} initialData={document} id={id} />
    </div>
  )
}
