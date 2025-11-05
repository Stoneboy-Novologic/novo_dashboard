"use client"

import type React from "react"

import { Plus, Users } from "lucide-react"
import type { Task } from "../pages/kanban-board"
import { KanbanCard } from "./kanban-card"
import { useState } from "react"
import type { LucideIcon } from "lucide-react"

interface KanbanColumnProps {
  columnId: string
  title: string
  tasks: Task[]
  onTaskMove: (taskId: string, newStatus: string) => void
  icon?: LucideIcon
}

export function KanbanColumn({ columnId, title, tasks, onTaskMove, icon: Icon }: KanbanColumnProps) {
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add("bg-muted/50")
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-muted/50")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove("bg-muted/50")

    const taskId = e.dataTransfer.getData("taskId")
    if (taskId) {
      onTaskMove(taskId, columnId)
    }
  }

  return (
    <div className="flex flex-col bg-muted/30 rounded-lg border border-border overflow-hidden">
      {/* Column Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-primary" />}
            <h3 className="font-bold text-foreground font-heading">{title}</h3>
            <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full font-medium">
              {tasks.length}
            </span>
          </div>
          <button className="p-1 hover:bg-muted rounded transition-colors">
            <Plus className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-3 space-y-3 transition-colors duration-200"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {tasks.length > 0 ? (
          tasks.map((task) => <KanbanCard key={task.id} task={task} columnId={columnId} onTaskMove={onTaskMove} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Users className="w-8 h-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No tasks in {title.toLowerCase()}</p>
          </div>
        )}
      </div>
    </div>
  )
}
