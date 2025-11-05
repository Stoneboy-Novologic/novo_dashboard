"use client"

import type React from "react"

import { Calendar, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import type { Task } from "../pages/kanban-board"
import { useState } from "react"

interface KanbanCardProps {
  task: Task
  columnId: string
  onTaskMove: (taskId: string, newStatus: string) => void
}

export function KanbanCard({ task, columnId, onTaskMove }: KanbanCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("taskId", task.id)
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const priorityConfig = {
    high: { bg: "bg-destructive/10", text: "text-destructive", icon: AlertCircle },
    medium: { bg: "bg-secondary/10", text: "text-secondary", icon: Clock },
    low: { bg: "bg-accent/10", text: "text-accent", icon: CheckCircle2 },
  }

  const prioritySettings = priorityConfig[task.priority]
  const PriorityIcon = prioritySettings.icon

  const subtasks = task.subtasks || []
  const completedSubtasks = subtasks.filter((st) => st.completed).length
  const subtaskProgress = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => setShowDetails(!showDetails)}
      className={`p-4 bg-card border border-border rounded-lg cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all duration-200 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-foreground text-sm line-clamp-2 flex-1">{task.title}</h4>
        <div className={`flex-shrink-0 p-1.5 rounded ${prioritySettings.bg}`}>
          <PriorityIcon className={`w-4 h-4 ${prioritySettings.text}`} />
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>

      {/* Subtasks Progress */}
      {subtasks.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground font-medium">Subtasks</span>
            <span className="text-xs text-muted-foreground">
              {completedSubtasks}/{subtasks.length}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div className="bg-accent h-full transition-all duration-300" style={{ width: `${subtaskProgress}%` }} />
          </div>
        </div>
      )}

      {/* Footer with Tags and Meta */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 flex-wrap">
          {task.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded">
              {tag}
            </span>
          ))}
        </div>
        <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
          {task.avatar}
        </div>
      </div>

      {/* Due Date */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{task.dueDate}</span>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-border space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1 font-semibold">Assigned to</p>
            <p className="text-sm text-foreground">{task.assignee}</p>
          </div>
          {subtasks.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-semibold">Checklist</p>
              <div className="space-y-1">
                {subtasks.map((st) => (
                  <div key={st.id} className="flex items-center gap-2">
                    <input type="checkbox" checked={st.completed} className="w-3 h-3 rounded cursor-pointer" />
                    <span
                      className={`text-xs ${st.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                    >
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
