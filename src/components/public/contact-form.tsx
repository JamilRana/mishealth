"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import type { Locale } from "@/i18n-config"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactFormValues = z.infer<typeof contactSchema>

interface ContactFormProps {
  lang: Locale
}

export function ContactForm({ lang }: ContactFormProps) {
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle")

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  async function onSubmit(values: ContactFormValues) {
    setStatus("loading")
    try {
      const response = await fetch(`/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        setStatus("success")
        form.reset()
      } else {
        setStatus("error")
      }
    } catch (error) {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="p-12 text-center space-y-6 bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/50 rounded-3xl transition-all duration-500 shadow-xl shadow-green-500/10">
        <div className="h-20 w-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-green-500/30">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-2">
           <h3 className="text-2xl font-bold text-slate-900 dark:text-green-100">Message Sent!</h3>
           <p className="text-muted-foreground font-medium">Thank you for contacting the MIS DGHS. We will get back to you soon.</p>
        </div>
        <Button onClick={() => setStatus("idle")} variant="outline" className="rounded-full shadow-sm">
           Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900/50 rounded-3xl p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-xl">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
             <input 
               {...form.register("name")}
               placeholder="Enter your name"
               className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 px-6 font-medium text-foreground dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-slate-800 outline-none transition-all shadow-sm"
             />
             {form.formState.errors.name && (
               <p className="text-xs font-bold text-destructive pl-1 animate-in fade-in slide-in-from-top-1">{form.formState.errors.name.message}</p>
             )}
          </div>

          <div className="space-y-3">
             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
             <input 
               {...form.register("email")}
               placeholder="name@example.com"
               className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 px-6 font-medium text-foreground dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-slate-800 outline-none transition-all shadow-sm"
             />
             {form.formState.errors.email && (
               <p className="text-xs font-bold text-destructive pl-1 animate-in fade-in slide-in-from-top-1">{form.formState.errors.email.message}</p>
             )}
          </div>
        </div>

        <div className="space-y-3">
           <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Inquiry Subject</label>
           <input 
             {...form.register("subject")}
             placeholder="How can we help you?"
             className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 px-6 font-medium text-foreground dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-slate-800 outline-none transition-all shadow-sm"
           />
           {form.formState.errors.subject && (
             <p className="text-xs font-bold text-destructive pl-1 animate-in fade-in slide-in-from-top-1">{form.formState.errors.subject.message}</p>
           )}
        </div>

        <div className="space-y-3">
           <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Message Content</label>
           <textarea 
             {...form.register("message")}
             placeholder="Describe your inquiry in detail..."
             rows={6}
             className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 p-6 font-medium text-foreground dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-slate-800 outline-none transition-all shadow-sm resize-none"
           />
           {form.formState.errors.message && (
             <p className="text-xs font-bold text-destructive pl-1 animate-in fade-in slide-in-from-top-1">{form.formState.errors.message.message}</p>
           )}
        </div>

        {status === "error" && (
           <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm font-bold">Failed to send message. Please try again later.</span>
           </div>
        )}

        <Button 
          type="submit" 
          size="lg" 
          disabled={status === "loading"}
          className="w-full md:w-auto rounded-full h-14 px-12 font-bold text-lg shadow-xl shadow-primary/20 gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {status === "loading" ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
          Send Message
        </Button>
      </form>
    </div>
  )
}
