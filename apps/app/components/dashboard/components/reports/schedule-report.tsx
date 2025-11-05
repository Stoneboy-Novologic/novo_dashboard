"use client"

import { Card } from "@/components/ui/card"
import { Calendar, CheckCircle2, AlertCircle, Clock } from "lucide-react"

interface ScheduleReportProps {
  dateRange: string
}

export function ScheduleReport({ dateRange }: ScheduleReportProps) {
  const milestones = [
    { id: 1, name: "Site Mobilization", plannedDate: "Dec 1", actualDate: "Dec 1", status: "completed" },
    { id: 2, name: "Foundation Work", plannedDate: "Dec 5", actualDate: "Dec 7", status: "at-risk" },
    { id: 3, name: "Structural Steel", plannedDate: "Dec 15", actualDate: null, status: "in-progress" },
    { id: 4, name: "Concrete Pour", plannedDate: "Dec 22", actualDate: null, status: "on-track" },
    { id: 5, name: "MEP Installation", plannedDate: "Jan 10", actualDate: null, status: "pending" },
  ]

  const statusConfig = {
    completed: { icon: CheckCircle2, color: "text-accent", bg: "bg-accent/10", label: "Completed" },
    "at-risk": { icon: AlertCircle, color: "text-secondary", bg: "bg-secondary/10", label: "At Risk" },
    "in-progress": { icon: Clock, color: "text-primary", bg: "bg-primary/10", label: "In Progress" },
    "on-track": { icon: CheckCircle2, color: "text-accent", bg: "bg-accent/10", label: "On Track" },
    pending: { icon: Calendar, color: "text-muted-foreground", bg: "bg-muted", label: "Pending" },
  }

  const onTimePercentage = Math.round((2 / 5) * 100)

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-border">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Total Milestones</p>
          <h3 className="text-3xl font-bold text-foreground font-heading">5</h3>
          <p className="text-xs text-muted-foreground mt-2">On current timeline</p>
        </Card>
        <Card className="p-6 border-border">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Completed</p>
          <h3 className="text-3xl font-bold text-accent font-heading">1</h3>
          <p className="text-xs text-accent mt-2">20% complete</p>
        </Card>
        <Card className="p-6 border-border">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">On Time</p>
          <h3 className="text-3xl font-bold text-primary font-heading">{onTimePercentage}%</h3>
          <p className="text-xs text-primary mt-2">{onTimePercentage > 80 ? "Good performance" : "Review needed"}</p>
        </Card>
      </div>

      <Card className="p-6 border-border">
        <h3 className="text-lg font-bold text-foreground font-heading mb-6">Project Milestones</h3>
        <div className="space-y-4">
          {milestones.map((milestone) => {
            const config = statusConfig[milestone.status as keyof typeof statusConfig]
            const Icon = config.icon
            const isDelayed = milestone.actualDate && new Date(milestone.actualDate) > new Date(milestone.plannedDate)

            return (
              <div
                key={milestone.id}
                className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border border-border"
              >
                <div className={`p-3 rounded-lg ${config.bg} flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{milestone.name}</h4>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Planned</p>
                      <p className="text-foreground">{milestone.plannedDate}</p>
                    </div>
                    {milestone.actualDate && (
                      <div>
                        <p className="text-xs text-muted-foreground">Actual</p>
                        <p className={`${isDelayed ? "text-secondary" : "text-foreground"}`}>{milestone.actualDate}</p>
                      </div>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                  {config.label}
                </span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
