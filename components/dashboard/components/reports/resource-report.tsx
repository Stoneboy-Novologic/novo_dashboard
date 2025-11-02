"use client"

import { Card } from "@/components/ui/card"
import { Users, Briefcase, Clock } from "lucide-react"

interface ResourceReportProps {
  dateRange: string
}

export function ResourceReport({ dateRange }: ResourceReportProps) {
  const resourceData = [
    { name: "Engineers", allocated: 8, available: 2, utilization: 80 },
    { name: "Laborers", allocated: 24, available: 6, utilization: 80 },
    { name: "Equipment", allocated: 12, available: 3, utilization: 80 },
    { name: "Vehicles", allocated: 5, available: 1, utilization: 83 },
  ]

  return (
    <div className="space-y-6">
      {/* Resource Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Team Members</p>
              <h3 className="text-3xl font-bold text-foreground font-heading">32</h3>
              <p className="text-xs text-muted-foreground mt-2">Active on project</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6 border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">
                Equipment Units
              </p>
              <h3 className="text-3xl font-bold text-foreground font-heading">15</h3>
              <p className="text-xs text-muted-foreground mt-2">Deployed</p>
            </div>
            <Briefcase className="w-8 h-8 text-accent" />
          </div>
        </Card>
        <Card className="p-6 border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">
                Avg Utilization
              </p>
              <h3 className="text-3xl font-bold text-foreground font-heading">81%</h3>
              <p className="text-xs text-accent mt-2">Optimal level</p>
            </div>
            <Clock className="w-8 h-8 text-secondary" />
          </div>
        </Card>
      </div>

      <Card className="p-6 border-border overflow-x-auto">
        <h3 className="text-lg font-bold text-foreground font-heading mb-4">Resource Utilization</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Resource Type
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Allocated
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Available
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Utilization
              </th>
            </tr>
          </thead>
          <tbody>
            {resourceData.map((row, idx) => (
              <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4 text-foreground font-medium">{row.name}</td>
                <td className="py-3 px-4 text-center text-foreground">{row.allocated}</td>
                <td className="py-3 px-4 text-center text-foreground">{row.available}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${row.utilization}%` }} />
                    </div>
                    <span className="text-foreground font-medium w-12 text-right">{row.utilization}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
