"use client"

import { useState } from "react"
import { Download, Filter, MoreVertical, TrendingUp, BarChart3, Calendar, Users } from "lucide-react"
import { BudgetReport } from "../components/reports/budget-report"
import { ScheduleReport } from "../components/reports/schedule-report"
import { SafetyReport } from "../components/reports/safety-report"
import { ResourceReport } from "../components/reports/resource-report"

export type ReportType = "budget" | "schedule" | "safety" | "resources"

export function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType>("budget")
  const [dateRange, setDateRange] = useState<"week" | "month" | "quarter" | "year">("month")

  const reportTypes = [
    {
      id: "budget" as ReportType,
      title: "Budget Report",
      description: "Track spending vs. budget allocation",
      icon: BarChart3,
      color: "primary",
    },
    {
      id: "schedule" as ReportType,
      title: "Schedule Report",
      description: "Monitor project timeline and milestones",
      icon: Calendar,
      color: "accent",
    },
    {
      id: "safety" as ReportType,
      title: "Safety Report",
      description: "Review safety incidents and metrics",
      icon: TrendingUp,
      color: "secondary",
    },
    {
      id: "resources" as ReportType,
      title: "Resource Report",
      description: "Analyze resource utilization",
      icon: Users,
      color: "primary",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground font-heading mb-2">Reports & Analytics</h1>
        <p className="text-muted-foreground">Generate and export comprehensive project reports</p>
      </div>

      {/* Report Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={`p-4 rounded-lg border transition-all duration-200 text-left ${
              selectedReport === report.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 bg-card"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <report.icon
                className={`w-6 h-6 ${selectedReport === report.id ? "text-primary" : "text-muted-foreground"}`}
              />
            </div>
            <h3 className="font-semibold text-foreground text-sm mb-1">{report.title}</h3>
            <p className="text-xs text-muted-foreground">{report.description}</p>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground outline-none focus:border-primary transition-colors cursor-pointer"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
            <Download className="w-4 h-4" />
            Export as PDF
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {selectedReport === "budget" && <BudgetReport dateRange={dateRange} />}
        {selectedReport === "schedule" && <ScheduleReport dateRange={dateRange} />}
        {selectedReport === "safety" && <SafetyReport dateRange={dateRange} />}
        {selectedReport === "resources" && <ResourceReport dateRange={dateRange} />}
      </div>
    </div>
  )
}
