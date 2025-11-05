"use client"

import type { LucideIcon } from "lucide-react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface KPICardProps {
  label: string
  value: string
  change: string
  icon: LucideIcon
  color: "primary" | "accent" | "secondary"
  warning?: boolean
  trend?: "up" | "down" | "neutral"
}

export function KPICard({ label, value, change, icon: Icon, color, warning, trend }: KPICardProps) {
  const colorMap = {
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground",
  }

  const trendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null
  const trendColor = trend === "up" ? "text-accent" : trend === "down" ? "text-destructive" : "text-muted-foreground"

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 blueprint-grid group cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">{label}</p>
          <h3 className="text-3xl font-bold text-foreground mb-3 font-heading">{value}</h3>
          <div className="flex items-center gap-2">
            {trendIcon && <trendIcon className={`w-4 h-4 ${trendColor}`} />}
            <p className={`text-xs font-medium ${warning ? "text-secondary" : trendColor}`}>{change}</p>
          </div>
        </div>
        <div
          className={`p-3 rounded-lg ${colorMap[color]} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}
