"use client"

import { Users, ChevronRight } from "lucide-react"

interface ProjectCardProps {
  title: string
  progress: number
  team: number
  status?: "on-track" | "at-risk" | "completed"
}

export function ProjectCard({ title, progress, team, status = "on-track" }: ProjectCardProps) {
  const statusColor = {
    "on-track": "bg-accent/10 text-accent",
    "at-risk": "bg-secondary/10 text-secondary",
    completed: "bg-primary/10 text-primary",
  }

  return (
    <div className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors flex-1">
          {title}
        </h4>
        <div className="flex items-center gap-2 ml-2">
          <span className={`text-xs px-2 py-1 rounded font-medium ${statusColor[status]}`}>
            {status === "on-track" ? "On Track" : status === "at-risk" ? "At Risk" : "Completed"}
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{progress}% Complete</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>
              {team} {team === 1 ? "member" : "members"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
