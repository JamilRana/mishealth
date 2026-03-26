"use client"

import * as React from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts"

interface AdminChartsProps {
  activityData: any[]
  distributionData: any[]
}

const COLORS = ["#2563eb", "#10b981", "#3b82f6", "#f59e0b", "#ef4444"]

export function AdminCharts({ activityData, distributionData }: AdminChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Activity Trend */}
      <div className="lg:col-span-2 p-10 rounded-[2.5rem] bg-white border shadow-xl space-y-8 animate-in fade-in slide-in-from-left-5 duration-700">
         <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">System Activity Trend</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly content updates & interactions</p>
         </div>
         <div className="h-[300px] w-full mt-10">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={activityData}>
                  <defs>
                     <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)", padding: "12px" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#2563eb" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorActivity)" 
                    animationDuration={2000}
                  />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Distribution Pie */}
      <div className="p-10 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl space-y-8 overflow-hidden relative group animate-in fade-in slide-in-from-right-5 duration-700">
         <div className="space-y-1 relative z-10">
            <h3 className="text-xl font-bold text-primary tracking-tight">Content Mix</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Resource distribution</p>
         </div>
         <div className="h-[260px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    cornerRadius={8}
                    dataKey="value"
                    animationDuration={2000}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: "16px", background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{value}</span>}
                  />
               </PieChart>
            </ResponsiveContainer>
         </div>
         <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-primary/10 rounded-full blur-3xl" />
      </div>
    </div>
  )
}
