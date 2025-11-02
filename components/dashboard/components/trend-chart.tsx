"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"

export function TrendChart() {
  const data = [
    { month: "Jan", budget: 65000, actual: 61000, variance: 4000 },
    { month: "Feb", budget: 72000, actual: 70000, variance: 2000 },
    { month: "Mar", budget: 68000, actual: 72000, variance: -4000 },
    { month: "Apr", budget: 81000, actual: 79000, variance: 2000 },
    { month: "May", budget: 76000, actual: 75500, variance: 500 },
    { month: "Jun", budget: 88000, actual: 85000, variance: 3000 },
  ]

  return (
    <Card className="p-6 border-border">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground font-heading">Budget Tracking</h2>
          <p className="text-xs text-muted-foreground mt-1">6-month budget vs actual spending</p>
        </div>
        <button className="text-xs px-3 py-1 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
          Export
        </button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" stroke="var(--muted-foreground)" style={{ fontSize: "12px" }} />
          <YAxis stroke="var(--muted-foreground)" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--foreground)",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
            labelStyle={{ color: "var(--foreground)" }}
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          <Bar dataKey="budget" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
          <Bar dataKey="actual" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
