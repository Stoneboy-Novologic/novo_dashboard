"use client"

import { Card } from "@/components/ui/card"
import { AlertTriangle, CheckCircle2, TrendingDown } from "lucide-react"

interface SafetyReportProps {
  dateRange: string
}

export function SafetyReport({ dateRange }: SafetyReportProps) {
  return (
    <div className="space-y-6">
      {/* Safety Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">
                Incidents This Period
              </p>
              <h3 className="text-3xl font-bold text-foreground font-heading">0</h3>
              <p className="text-xs text-accent mt-2">Great performance</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
        </Card>
        <Card className="p-6 border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">
                Days Without Incident
              </p>
              <h3 className="text-3xl font-bold text-foreground font-heading">45</h3>
              <p className="text-xs text-primary mt-2">Safety record strong</p>
            </div>
            <TrendingDown className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6 border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Near Misses</p>
              <h3 className="text-3xl font-bold text-foreground font-heading">2</h3>
              <p className="text-xs text-secondary mt-2">Review recommended</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-secondary" />
          </div>
        </Card>
      </div>

      <Card className="p-6 border-border">
        <h3 className="text-lg font-bold text-foreground font-heading mb-4">Safety Trainings</h3>
        <div className="space-y-3">
          {[
            { title: "Site Safety Orientation", date: "Dec 1", attendees: 24, status: "completed" },
            { title: "Fall Protection Training", date: "Dec 8", attendees: 22, status: "completed" },
            { title: "Emergency Response Drill", date: "Dec 15", attendees: 20, status: "pending" },
          ].map((training, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border"
            >
              <div>
                <p className="font-semibold text-foreground text-sm">{training.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{training.attendees} attendees</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{training.date}</p>
                <p
                  className={`text-xs font-medium mt-1 ${training.status === "completed" ? "text-accent" : "text-secondary"}`}
                >
                  {training.status === "completed" ? "Completed" : "Pending"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
