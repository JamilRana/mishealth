"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2, ShieldCheck, Database, Zap, Activity } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({
    message: "Enter a valid mission-critical credential.",
  }),
  password: z.string().min(8, {
    message: "Access override requires min 8-character string.",
  }),
})

export function LoginForm({ lang }: { lang: string }) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      })

      if (res?.error) {
        toast.error("Security Breach Detected: Invalid authorization credentials.")
        return
      }

      toast.success("Identity Verified: Synchronizing administrative node.")
      router.push(`/${lang}/admin`)
      router.refresh()
    } catch (error) {
       toast.error("Protocol Error: Connection to auth node timed out.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
       <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
           <FormField
             control={form.control}
             name="email"
             render={({ field }) => (
               <FormItem className="space-y-3">
                 <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Service Entry ID</FormLabel>
                 <FormControl>
                   <Input 
                      placeholder="admin@dghs.gov.bd" 
                      className="h-14 bg-white/5 border-white/10 text-white rounded-2xl px-6 focus:ring-4 focus:ring-brand-blue/20 transition-all font-bold" 
                      {...field} 
                   />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />
           <FormField
             control={form.control}
             name="password"
             render={({ field }) => (
               <FormItem className="space-y-3">
                 <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Encryption Key</FormLabel>
                 <FormControl>
                   <Input 
                      type="password" 
                      placeholder="••••••••••••" 
                      className="h-14 bg-white/5 border-white/10 text-white rounded-2xl px-6 focus:ring-4 focus:ring-brand-blue/20 transition-all font-bold" 
                      {...field} 
                   />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />
           <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-16 rounded-[1.75rem] bg-brand-blue text-white hover:bg-white hover:text-black font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-brand-blue/20 group"
           >
             {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Initiate Authorization"}
           </Button>
         </form>
       </Form>
    </div>
  )
}
