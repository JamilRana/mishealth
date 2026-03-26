"use client"

import * as React from "react"
import { i18n, type Locale } from "@/i18n-config"
import { 
  Plus, 
  Trash2, 
  User, 
  Edit,
  Phone,
  Mail,
  Loader2,
  AlertCircle,
  Database,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog"
import { EmployeeForm } from "@/components/admin/employee-form"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function AdminEmployeesPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = React.use(params)
  const [employees, setEmployees] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingEmployee, setEditingEmployee] = React.useState<any>(null)

  const fetchEmployees = React.useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/employees")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setEmployees(data)
    } catch (error) {
      toast.error("Cloud synchronisation failed")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  function handleAdd() {
    setEditingEmployee(null)
    setIsModalOpen(true)
  }

  function handleEdit(employee: any) {
    setEditingEmployee(employee)
    setIsModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure? This action is permanent across the national registry.")) return
    
    try {
      const res = await fetch(`/api/admin/employees/${id}`, {
        method: "DELETE"
      })
      if (!res.ok) throw new Error("Delete failed")
      toast.success("Profile decommissioned successfully")
      fetchEmployees()
    } catch (error) {
      toast.error("System override failed during deletion")
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 bg-slate-50/40 p-10 rounded-[4rem] border border-slate-100 min-h-[85vh] shadow-2xl shadow-slate-200/50">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-200 pb-10">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Staff Registry</h1>
          <div className="flex items-center gap-3">
             <div className="h-1.5 w-1.5 rounded-full bg-brand-blue animate-pulse" />
             <p className="text-muted-foreground font-black text-[11px] uppercase tracking-[0.3em] opacity-50">Enterprise Resource Administration</p>
          </div>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="rounded-full shadow-2xl shadow-primary/30 font-black h-16 px-10 gap-3 text-sm hover:scale-105 transition-all active:scale-95">
              <Plus className="h-6 w-6" /> Onboard Talent
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl rounded-[3rem] p-10 bg-white border shadow-2xl">
            <DialogHeader className="space-y-3 pb-6 border-b border-slate-100 mb-8">
              <DialogTitle className="text-3xl font-black tracking-tight flex items-center gap-4">
                 <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                    <Database className="w-6 h-6" />
                 </div>
                 {editingEmployee ? "Refine Talent Profile" : "Register National Staff"}
              </DialogTitle>
              <DialogDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                Secure database entry for health systems personnel
              </DialogDescription>
            </DialogHeader>
            <EmployeeForm 
              initialData={editingEmployee} 
              lang={lang} 
              onSuccess={() => {
                setIsModalOpen(false)
                fetchEmployees()
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="py-48 flex flex-col items-center justify-center space-y-6">
           <div className="relative h-20 w-20">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
              <div className="absolute inset-0 border-4 border-brand-blue rounded-full border-t-transparent animate-spin" />
           </div>
           <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Synchronising Registry...</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-200 group hover:border-brand-blue/30 transition-colors">
           <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-8 group-hover:scale-110 transition-transform duration-700">
              <AlertCircle className="w-12 h-12" />
           </div>
           <h3 className="text-2xl font-black text-slate-400 tracking-tight">System Registry Empty</h3>
           <p className="text-slate-300 font-bold text-xs uppercase tracking-widest mt-2">Initialize directory via the onboard trigger</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {employees.map((emp) => (
            <div key={emp.id} className="group relative bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] transition-all duration-700 overflow-hidden flex flex-col items-start gap-12">
               <div className="absolute top-8 right-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <Button 
                    onClick={() => handleEdit(emp)}
                    variant="outline" 
                    size="icon" 
                    className="h-12 w-12 rounded-2xl bg-white shadow-xl border-slate-200 hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all"
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button 
                    onClick={() => handleDelete(emp.id)}
                    variant="outline" 
                    size="icon" 
                    className="h-12 w-12 rounded-2xl bg-white shadow-xl border-slate-200 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
               </div>

               <div className="flex items-start gap-8">
                  <div className="h-28 w-28 rounded-[2rem] bg-slate-50 overflow-hidden shadow-inner flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-all duration-1000">
                    {emp.image ? (
                      <img src={emp.image} className="h-full w-full object-cover" alt={emp.nameEn} />
                    ) : (
                      <div className="h-full w-full bg-gradient-brand opacity-10 flex items-center justify-center">
                        <User className="h-10 w-10 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col pt-2">
                    <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em] mb-2">{emp.designationEn}</span>
                    <h3 className="text-2xl font-black tracking-tighter text-slate-900 group-hover:text-brand-blue transition-colors leading-tight">{emp.nameEn}</h3>
                  </div>
               </div>

               <div className="w-full space-y-6 pt-8 border-t border-slate-50 flex-1">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 text-slate-400 group/item">
                       <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center transition-all group-hover/item:text-brand-blue group-hover/item:bg-brand-blue/10 group-hover/item:scale-110">
                          <Phone className="h-4 w-4" />
                       </div>
                       <span className="text-sm font-black font-mono tracking-tight">{emp.phone || "---"}</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400 group/item">
                       <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center transition-all group-hover/item:text-brand-purple group-hover/item:bg-brand-purple/10 group-hover/item:scale-110">
                          <Mail className="h-4 w-4" />
                       </div>
                       <span className="text-sm font-black lowercase tracking-tight">{emp.email || "---"}</span>
                    </div>
                  </div>
               </div>

               <div className="w-full flex items-center justify-between mt-auto pt-8">
                  <div className="px-6 py-2.5 bg-slate-50 rounded-full inline-flex items-center gap-3 border border-slate-100 group-hover:bg-slate-100 transition-colors">
                     <div className="h-2 w-2 rounded-full bg-brand-blue" />
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">Order: {emp.order}</span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 opacity-20 group-hover:opacity-100 transition-opacity">
                     <ArrowRight className="h-5 w-5" />
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
