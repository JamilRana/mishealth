// components/navbar.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Globe, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import type { Locale } from "@/i18n-config"

interface NavbarProps {
  lang: Locale
  dict: any
}

// components/navbar.tsx

export function Navbar({ lang, dict }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const [useGlass, setUseGlass] = React.useState(true)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const highContrast = window.matchMedia('(prefers-contrast: more)').matches
    setUseGlass(!reducedMotion && !highContrast)
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: `/${lang}/about`, label: dict.nav.about },
    { href: `/${lang}/projects`, label: dict.nav.projects },
    { href: `/${lang}/statistics`, label: dict.nav.stats },
    { href: `/${lang}/reports`, label: dict.nav.reports },
    { href: `/${lang}/documents`, label: dict.nav.docs },
    { href: `/${lang}/news`, label: dict.nav.news },
  ]

  const toggleLocale = () => {
    const newLocale = lang === "en" ? "bn" : "en"
    const segments = pathname.split("/")
    segments[1] = newLocale
    return segments.join("/")
  }

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-[1000] px-6 md:px-12 transition-all duration-500 ease-out-expo",
        scrolled ? "py-3" : "py-6"
      )}>
        {/* ✅ Transparent Container - No Background Box */}
        <div className={cn(
          "mx-auto flex items-center justify-between transition-all duration-500",
          scrolled 
            ? cn(
                "max-w-6xl px-5 py-2.5 rounded-full",
                // Optional: Add subtle background only when scrolled
                useGlass ? "glass glass-depth" : "bg-background/50 backdrop-blur-md"
              ) 
            : "max-w-full" // ✅ No background when at top
        )}>
          
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center space-x-3 group">
            <div className="h-10 w-10 bg-gradient-brand rounded-full flex items-center justify-center text-white font-black text-xl transition-transform duration-500 group-hover:rotate-12 shadow-lg group-hover:shadow-brand-blue/20">
              M
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "text-xl font-black leading-none tracking-tighter transition-colors",
                scrolled ? "text-foreground" : "text-white drop-shadow-sm"
              )}>
                MIS <span className="font-serif italic font-normal text-brand-blue/90">Office</span>
              </span>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5 opacity-40",
                scrolled ? "text-muted-foreground" : "text-white/60"
              )}>
                DGHS Bangladesh
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-300 group/link",
                    isActive
                      ? "text-brand-blue"
                      : scrolled 
                        ? "text-muted-foreground hover:text-foreground" 
                        : "text-white/70 hover:text-white"
                  )}
                >
                  {link.label}
                  <span className={cn(
                    "absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-brand-blue transition-all duration-300",
                    isActive ? "w-4" : "w-0 group-hover/link:w-3"
                  )} />
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Locale Toggle */}
            <Link href={toggleLocale()} prefetch={false} className="hidden sm:block">
              <Button variant="ghost" size="sm" className={cn(
                "rounded-full font-bold text-[10px] uppercase tracking-widest transition-colors",
                scrolled 
                  ? "text-muted-foreground hover:text-foreground hover:bg-muted" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}>
                <Globe className="h-4 w-4 mr-2" />
                {lang.toUpperCase()}
              </Button>
            </Link>

            {/* Theme Toggle */}
            {mounted && (
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "rounded-full transition-colors",
                  scrolled 
                    ? "text-muted-foreground hover:text-foreground hover:bg-muted" 
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </motion.div>
              </Button>
            )}

            {/* Admin Button */}
            <Link href={`/${lang}/admin`} className="hidden md:block">
              <Button size="sm" className={cn(
                "rounded-full px-6 font-bold text-[10px] uppercase tracking-widest shadow-xl transition-all duration-500 hover:-translate-y-0.5",
                scrolled 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-white text-black hover:bg-white/90"
              )}>
                {dict.nav.admin}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "lg:hidden rounded-full transition-colors",
                scrolled 
                  ? "text-foreground hover:bg-muted" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[2000] glass-overlay overflow-hidden"
          >
            {/* Background Glows */}
            {useGlass && (
              <>
                <div className="absolute top-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-[radial-gradient(circle,rgba(8,117,233,0.1)_0%,transparent_70%)] rounded-full animate-pulse-slow" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-[radial-gradient(circle,rgba(131,9,238,0.08)_0%,transparent_70%)] rounded-full animate-pulse-slow delay-1000" />
              </>
            )}
            
            <div className="relative h-full flex flex-col p-6 md:p-10 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-brand rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">M</div>
                  <span className="text-xl font-black tracking-tighter text-white">
                    MIS <span className="font-serif italic text-brand-blue">Office</span>
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full text-white/80 hover:text-white hover:bg-white/10 glass-hover"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-7 w-7" strokeWidth={2.5} />
                </Button>
              </div>

              {/* Nav Links */}
              <nav className="mt-16 flex flex-col space-y-4">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "block px-4 py-3 rounded-2xl text-3xl md:text-4xl font-black tracking-tighter transition-all duration-200 glass-hover",
                        pathname === link.href 
                          ? "text-brand-blue bg-brand-blue/5" 
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Footer Actions */}
              <div className="mt-auto pt-10 flex flex-col md:flex-row gap-6 justify-between border-t border-white/10 items-baseline">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Official Gateway</span>
                  <Link 
                    href={`/${lang}/admin`} 
                    className="text-xl font-black tracking-tight text-white/80 hover:text-brand-blue transition-colors glass-hover px-3 py-2 rounded-xl"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Console
                  </Link>
                </div>
                
                <div className="flex gap-3">
                  <Link href={toggleLocale()} onClick={() => setIsOpen(false)}>
                    <Button className="glass-btn !bg-white/10 !border-white/20 !text-white hover:!bg-white/20 px-6 py-3 text-xs">
                      <Globe className="h-4 w-4 mr-2" />
                      {lang === "en" ? "বাংলা" : "EN"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}