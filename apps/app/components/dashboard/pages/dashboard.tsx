"use client"

import { KPICard } from "../components/kpi-card"
import { ProjectCard } from "../components/project-card"
import { TasksList } from "../components/tasks-list"
import { TrendChart } from "../components/trend-chart"
import { AlertTriangle, TrendingUp, Calendar, AlertCircle } from "lucide-react"

export function Dashboard() {
  const kpis = [
    {
      label: "Active Projects",
      value: "12",
      change: "+2",
      icon: Calendar,
      color: "primary",
    },
    {
      label: "Budget vs Actual",
      value: "94%",
      change: "+3%",
      icon: TrendingUp,
      color: "accent",
    },
    {
      label: "Schedule Variance",
      value: "-2 days",
      change: "On Track",
      icon: AlertTriangle,
      color: "secondary",
      warning: true,
    },
    {
      label: "Safety Incidents",
      value: "0",
      change: "0 This Month",
      icon: AlertCircle,
      color: "accent",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, John. Here's your project overview.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <KPICard key={idx} {...kpi} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2">
          <TrendChart />
        </div>

        {/* Active Projects */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Active Projects</h2>
          <div className="space-y-3">
            <ProjectCard title="Downtown Tower Phase 2" progress={72} team={3} />
            <ProjectCard title="Metro Station Renovation" progress={45} team={5} />
            <ProjectCard title="Office Complex Expansion" progress={88} team={4} />
          </div>
        </div>
      </div>

      {/* Tasks & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <TasksList />
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-bold text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-left">
              + New RFI
            </button>
            <button className="w-full px-4 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors text-left">
              + Safety Report
            </button>
            <button className="w-full px-4 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors text-left">
              + New Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
