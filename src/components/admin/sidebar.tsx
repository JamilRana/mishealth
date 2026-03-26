"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { 
  LayoutDashboard, 
  Database, 
  FileText, 
  Newspaper, 
  Users, 
  MessageSquare, 
  Settings, 
  ChevronLeft, 
  LogOut,
  Files
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Locale } from "@/i18n-config"
import { signOut } from "next-auth/react"

interface AdminSidebarProps {
  lang: Locale
}

export function AdminSidebar({ lang }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = React.useState(false)
  const pathname = usePathname()

  const links = [
    { href: `/${lang}/admin`, label: "Dashboard", icon: LayoutDashboard },
    { href: `/${lang}/admin/projects`, label: "Projects", icon: Database },
    { href: `/${lang}/admin/employees`, label: "Staff Registry", icon: Users },
    { href: `/${lang}/admin/documents`, label: "Documents", icon: Files },
    { href: `/${lang}/admin/reports`, label: "Reports", icon: FileText },
    { href: `/${lang}/admin/news`, label: "News & Alerts", icon: Newspaper },
    { href: `/${lang}/admin/messages`, label: "Messages", icon: MessageSquare },
    { href: `/${lang}/admin/users`, label: "User Management", icon: Settings },
  ]

  return (
    <div 
      className={cn(
        "h-screen sticky top-0 bg-[#050f1e] text-white flex flex-col transition-all duration-300 border-r border-white/10",
        collapsed ? "w-20" : "w-72"
      )}
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
         <div className={cn("flex items-center gap-3 overflow-hidden", collapsed && "opacity-0")}>
            <div className="h-8 w-8 bg-gradient-brand rounded-lg flex items-center justify-center font-bold text-lg shrink-0">M</div>
            <span className="font-extrabold tracking-tighter whitespace-nowrap">MIS ADMIN</span>
         </div>
         <Button 
           variant="ghost" 
           size="icon" 
           onClick={() => setCollapsed(!collapsed)}
           className="text-white/50 hover:text-white"
         >
           <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
         </Button>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link key={link.href} href={link.href} className="block group">
               <div className={cn(
                 "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200",
                 isActive ? "bg-brand-blue text-white shadow-lg" : "text-white/50 hover:bg-white/10 hover:text-white"
               )}>
                 <link.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "group-hover:scale-110 transition-transform")} />
                 {!collapsed && <span className="font-bold text-sm tracking-wide">{link.label}</span>}
               </div>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
         {!collapsed && (
           <div className="px-4 py-2">
              <p className="text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em] mb-4">SYSTEM SETTINGS</p>
              <Link href={`/${lang}/admin/settings`} className="flex items-center gap-4 text-white/50 hover:text-white transition-colors py-2 group">
                 <Settings className="h-5 w-5 group-hover:rotate-45 transition-transform" />
                 <span className="font-bold text-sm">General Settings</span>
              </Link>
           </div>
         )}
         <Button 
           variant="ghost" 
           onClick={() => signOut()}
           className={cn(
             "w-full justify-start gap-4 text-white/50 hover:bg-destructive/20 hover:text-destructive transition-all rounded-xl h-12 px-4 group",
             collapsed && "justify-center"
           )}
         >
           <LogOut className="h-5 w-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
           {!collapsed && <span className="font-bold text-sm">Logout Session</span>}
         </Button>
      </div>
    </div>
  )
}
