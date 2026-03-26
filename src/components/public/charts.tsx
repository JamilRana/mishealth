"use client"

import * as React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"

interface ProjectChartProps {
  data: { year: string | number; count: number }[]
}

export function ProjectByYearChart({ data }: ProjectChartProps) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis 
            dataKey="year" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: 700 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: 700 }}
          />
          <Tooltip 
            cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
            contentStyle={{ 
              backgroundColor: "hsl(var(--card))",
              borderRadius: "16px", 
              border: "1px solid hsl(var(--border))", 
              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)", 
              padding: "12px 16px" 
            }}
            itemStyle={{ fontWeight: 700, fontSize: "12px", color: "#0ea5e9" }}
            labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 800, marginBottom: "4px" }}
          />
          <Bar 
            dataKey="count" 
            fill="#0ea5e9" 
            radius={[6, 6, 0, 0]} 
            barSize={32}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

interface CategoryChartProps {
  data: { name: string; value: number }[]
}

const COLORS = ["#0ea5e9", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899"]

export function CategoryPieChart({ data }: CategoryChartProps) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={90}
            paddingAngle={5}
            cornerRadius={6}
            dataKey="value"
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ 
                backgroundColor: "hsl(var(--card))",
                borderRadius: "16px", 
                border: "1px solid hsl(var(--border))", 
                color: "hsl(var(--foreground))", 
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)", 
                padding: "12px 16px" 
             }}
             itemStyle={{ fontWeight: 700, fontSize: "12px" }}
             labelStyle={{ display: "none" }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-default ml-2">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
