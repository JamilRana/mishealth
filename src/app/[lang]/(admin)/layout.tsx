import * as React from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/sidebar"
import type { Locale } from "@/i18n-config"

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const session = await auth()

  if (!session) {
    redirect(`/${lang}/login`)
  }

  return (
    <div className="flex min-h-screen bg-background dark:bg-[#050f1e]">
      <AdminSidebar lang={lang as Locale} />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-background dark:bg-black/20 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Administrator Portal</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
                {session.user?.name?.[0] || "A"}
             </div>
             <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground dark:text-white leading-none">{session.user?.name}</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">System Admin</span>
             </div>
          </div>
        </header>
        <main className="flex-1 p-8 md:p-12 overflow-y-auto bg-background dark:bg-[#050f1e]">
          {children}
        </main>
      </div>
    </div>
  )
}
