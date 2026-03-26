"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { 
  User, 
  Save, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  Key,
  Mail
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Locale } from "@/i18n-config"
import { cn } from "@/lib/utils"

const userSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["ADMIN", "EDITOR"]),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
})

type UserFormValues = z.infer<typeof userSchema>

interface UserFormProps {
  lang: Locale
  initialData?: any
  id?: string
  isModal?: boolean
  onSuccess?: () => void
}

export function UserForm({ lang, initialData, id, isModal, onSuccess }: UserFormProps) {
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      email: initialData.email,
      role: initialData.role,
      password: "",
    } : {
      name: "",
      email: "",
      role: "EDITOR",
      password: "",
    },
  })

  async function onSubmit(values: UserFormValues) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/admin/users${id ? `/${id}` : ""}`, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        setSuccess(true)
        router.refresh()
        if (onSuccess) {
           setTimeout(() => onSuccess(), 1500)
        } else if (!id) {
           setTimeout(() => router.push(`/${lang}/admin/users`), 2000)
        }
      } else {
        const data = await response.json()
        setError(data.error || "Failed to save user account")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const containerClass = isModal ? "" : "max-w-4xl mx-auto space-y-12"
  const formGridClass = isModal ? "grid grid-cols-1 gap-6 pt-4" : "grid grid-cols-1 md:grid-cols-2 gap-10 pt-8"

  return (
    <div className={containerClass}>
      {!isModal && (
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-4">
             <Link href={`/${lang}/admin/users`} className="flex items-center text-sm font-bold text-primary hover:underline group">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Governance
             </Link>
             <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
               {id ? "Sync Profile" : "Create New Access"}
             </h1>
             <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest pl-1">IAM (Identity & Access Management)</p>
          </div>
          {!loading && !success && (
             <Button onClick={form.handleSubmit(onSubmit)} size="lg" className="rounded-full shadow-xl shadow-primary/20 font-bold px-10 h-14 transition-all hover:scale-[1.05] group">
                <Save className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform" /> Commit Changes
             </Button>
          )}
        </div>
      )}

      {success && (
         <div className={cn(
           "p-8 text-center space-y-4 bg-emerald-50 border border-emerald-100 rounded-[2rem] shadow-xl shadow-emerald-500/10 animate-in fade-in slide-in-from-top-10",
           isModal && "p-6"
         )}>
            <div className="h-12 w-12 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/30">
               <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
               <h3 className="text-xl font-bold text-slate-900">Credentials Updated!</h3>
               <p className="text-muted-foreground text-xs font-medium">System permissions synchronized.</p>
            </div>
         </div>
      )}

      {error && (
         <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-bold">{error}</span>
         </div>
      )}

      <form className={formGridClass} onSubmit={form.handleSubmit(onSubmit)}>
         <div className="space-y-10">
            <div className={cn(
              "rounded-[2.5rem] bg-white border shadow-xl p-8 space-y-8 relative overflow-hidden group",
              isModal && "p-6 rounded-3xl"
            )}>
               <div className="absolute top-0 right-0 p-8 opacity-5 group-focus-within:opacity-10 transition-opacity">
                  <User className="h-16 w-16" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">Personal Data</h3>
               </div>
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                        <User className="h-3 w-3" /> Full Name
                     </label>
                     <input 
                       {...form.register("name")}
                       placeholder="Enter employee name..."
                       className="w-full h-11 rounded-xl bg-slate-50 border border-slate-100 px-4 font-bold text-slate-900 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                     />
                     {form.formState.errors.name && <p className="text-[9px] text-destructive font-bold">{form.formState.errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                        <Mail className="h-3 w-3" /> Email Address
                     </label>
                     <input 
                       {...form.register("email")}
                       placeholder="gov.email@dghs.gov.bd"
                       className="w-full h-11 rounded-xl bg-slate-50 border border-slate-100 px-4 font-bold text-slate-900 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                     />
                     {form.formState.errors.email && <p className="text-[9px] text-destructive font-bold">{form.formState.errors.email.message}</p>}
                  </div>
               </div>
            </div>

            <div className={cn(
              "rounded-[2.5rem] bg-slate-900 text-white p-8 space-y-6 shadow-2xl relative overflow-hidden group",
              isModal && "p-6 rounded-3xl"
            )}>
               <div className="space-y-1">
                  <h3 className="text-lg font-bold text-primary">Security Access</h3>
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-1 flex items-center gap-2">
                     <Key className="h-3 w-3" /> {id ? "Update Key" : "Access Key"}
                  </label>
                  <input 
                    {...form.register("password")}
                    type="password"
                    placeholder={id ? "•••••••• (Leave blank to keep)" : "Enter password..."}
                    className="w-full h-11 rounded-xl bg-slate-800 border-none px-4 font-bold text-white focus:ring-2 focus:ring-primary transition-all outline-none"
                  />
                  {form.formState.errors.password && <p className="text-[9px] text-destructive font-bold">{form.formState.errors.password.message}</p>}
               </div>
            </div>
         </div>

         <div className="space-y-10">
            <div className={cn(
              "rounded-[2.5rem] bg-white border border-primary/10 shadow-xl p-8 space-y-6 relative overflow-hidden group",
              isModal && "p-6 rounded-3xl"
            )}>
               <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">Governance Level</h3>
               </div>
               
               <div className="grid grid-cols-1 gap-3">
                  <label className={cn(
                    "p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 group/box",
                    form.watch("role") === "EDITOR" ? "bg-blue-50 border-blue-200" : "bg-white border-slate-100 opacity-60 hover:opacity-100"
                  )}>
                     <input type="radio" {...form.register("role")} value="EDITOR" className="hidden" />
                     <div className={cn(
                       "h-9 w-9 rounded-lg flex items-center justify-center transition-all",
                       form.watch("role") === "EDITOR" ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-110" : "bg-slate-100 text-slate-400"
                     )}>
                        <ShieldAlert className="h-5 w-5" />
                     </div>
                     <div className="flex flex-col">
                        <span className="font-black text-[10px] uppercase tracking-widest text-slate-900">Content Editor</span>
                        <span className="text-[9px] font-bold text-slate-500 tracking-tight">Can publish/edit resources</span>
                     </div>
                  </label>

                  <label className={cn(
                    "p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 group/box",
                    form.watch("role") === "ADMIN" ? "bg-amber-50 border-amber-200" : "bg-white border-slate-100 opacity-60 hover:opacity-100"
                  )}>
                     <input type="radio" {...form.register("role")} value="ADMIN" className="hidden" />
                     <div className={cn(
                       "h-9 w-9 rounded-lg flex items-center justify-center transition-all",
                       form.watch("role") === "ADMIN" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-110" : "bg-slate-100 text-slate-400"
                     )}>
                        <ShieldCheck className="h-5 w-5" />
                     </div>
                     <div className="flex flex-col">
                        <span className="font-black text-[10px] uppercase tracking-widest text-slate-900">System Admin</span>
                        <span className="text-[9px] font-bold text-slate-500 tracking-tight">Full administrative control</span>
                     </div>
                  </label>
               </div>
            </div>

            {loading ? (
               <div className="flex flex-col items-center gap-2 text-primary animate-pulse py-2">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="font-black text-[9px] uppercase tracking-[0.3em]">Synchronizing...</span>
               </div>
            ) : (
               isModal && (
                 <Button onClick={form.handleSubmit(onSubmit)} className="w-full h-12 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 gap-3">
                    <Save className="h-4 w-4" /> Commit Configuration
                 </Button>
               )
            )}
         </div>
      </form>
    </div>
  )
}
