"use client"

import { MoreVertical, Download } from "lucide-react"

interface ReportCardProps {
  title: string
  description: string
  generatedDate: string
  size: string
  onClick?: () => void
}

export function ReportCard({ title, description, generatedDate, size, onClick }: ReportCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 hover:shadow-lg transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{title}</h4>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <button className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-all">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p>{generatedDate}</p>
          <p className="text-muted-foreground/60">{size}</p>
        </div>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <Download className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        </button>
      </div>
    </div>
  )
}
