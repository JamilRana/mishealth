import * as React from "react"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { ProjectForm } from "@/components/admin/project-form"
import type { Locale } from "@/i18n-config"

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string; lang: Locale }>
}) {
  const { id, lang } = await params

  const project = await prisma.project.findUnique({
    where: { id },
  })

  if (!project) {
    notFound()
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
      <ProjectForm lang={lang} initialData={project} id={id} />
    </div>
  )
}
