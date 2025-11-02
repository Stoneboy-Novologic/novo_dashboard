"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { TrendingUp, DollarSign, AlertCircle } from "lucide-react"

interface BudgetReportProps {
  dateRange: string
}

export function BudgetReport({ dateRange }: BudgetReportProps) {
  const budgetData = [
    { month: "Jan", budgeted: 100000, spent: 95000, remaining: 5000 },
    { month: "Feb", budgeted: 120000, spent: 118000, remaining: 2000 },
    { month: "Mar", budgeted: 110000, spent: 115000, remaining: -5000 },
    { month: "Apr", budgeted: 130000, spent: 125000, remaining: 5000 },
    { month: "May", budgeted: 125000, spent: 120000, remaining: 5000 },
    { month: "Jun", budgeted: 140000, spent: 135000, remaining: 5000 },
  ]

  const summaryMetrics = [
    { label: "Total Budgeted", value: "$760,000", change: "+2.1%", icon: DollarSign, color: "primary" },
    { label: "Total Spent", value: "$708,000", change: "-1.5%", icon: TrendingUp, color: "accent" },
    { label: "Variance", value: "$52,000", change: "6.8% under", icon: AlertCircle, color: "secondary" },
  ]

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryMetrics.map((metric, idx) => {
          const Icon = metric.icon
          return (
            <Card key={idx} className="p-6 border-border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">
                    {metric.label}
                  </p>
                  <h3 className="text-2xl font-bold text-foreground font-heading mb-2">{metric.value}</h3>
                  <p className="text-xs text-accent">{metric.change}</p>
                </div>
                <div
                  className={`p-3 rounded-lg ${metric.color === "primary" ? "bg-primary/10 text-primary" : metric.color === "accent" ? "bg-accent/10 text-accent" : "bg-secondary/10 text-secondary"}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="p-6 border-border">
        <h3 className="text-lg font-bold text-foreground font-heading mb-4">Budget Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={budgetData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" stroke="var(--muted-foreground)" style={{ fontSize: "12px" }} />
            <YAxis stroke="var(--muted-foreground)" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--foreground)",
              }}
            />
            <Legend />
            <Area type="monotone" dataKey="budgeted" stroke="var(--chart-1)" fillOpacity={1} fill="url(#colorBudget)" />
            <Area type="monotone" dataKey="spent" stroke="var(--chart-2)" fillOpacity={1} fill="url(#colorSpent)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 border-border overflow-x-auto">
        <h3 className="text-lg font-bold text-foreground font-heading mb-4">Monthly Breakdown</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Month
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Budgeted
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Spent
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Variance
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                % Utilized
              </th>
            </tr>
          </thead>
          <tbody>
            {budgetData.map((row, idx) => {
              const utilized = Math.round((row.spent / row.budgeted) * 100)
              const overBudget = row.remaining < 0
              return (
                <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-foreground font-medium">{row.month}</td>
                  <td className="py-3 px-4 text-right text-foreground">${row.budgeted.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-foreground">${row.spent.toLocaleString()}</td>
                  <td className={`py-3 px-4 text-right font-medium ${overBudget ? "text-destructive" : "text-accent"}`}>
                    ${Math.abs(row.remaining).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-foreground">{utilized}%</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
