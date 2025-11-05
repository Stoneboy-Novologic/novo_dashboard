"use client"

import { CheckCircle2, Circle, Calendar, User } from "lucide-react"

interface Task {
  id: string
  title: string
  assignee: string
  dueDate: string
  priority: "high" | "medium" | "low"
  completed: boolean
}

export function TasksList() {
  const tasks: Task[] = [
    {
      id: "1",
      title: "Foundation inspection and approval",
      assignee: "Mike Chen",
      dueDate: "Today",
      priority: "high",
      completed: false,
    },
    {
      id: "2",
      title: "Steel reinforcement delivery",
      assignee: "Sarah Johnson",
      dueDate: "Tomorrow",
      priority: "high",
      completed: false,
    },
    {
      id: "3",
      title: "Concrete supplier coordination",
      assignee: "James Wilson",
      dueDate: "Dec 15",
      priority: "medium",
      completed: true,
    },
    {
      id: "4",
      title: "Weather contingency planning",
      assignee: "Emma Davis",
      dueDate: "Dec 18",
      priority: "medium",
      completed: false,
    },
    {
      id: "5",
      title: "Safety training session",
      assignee: "You",
      dueDate: "Dec 20",
      priority: "low",
      completed: false,
    },
  ]

  const priorityColor = {
    high: "text-destructive",
    medium: "text-secondary",
    low: "text-accent",
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground font-heading">Recent Tasks</h2>
          <p className="text-xs text-muted-foreground mt-1">5 active tasks</p>
        </div>
        <button className="text-xs px-3 py-1 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start gap-4 p-3 rounded-lg border transition-all duration-300 cursor-pointer group hover:bg-muted/50 ${
              task.completed ? "border-border opacity-60" : "border-border hover:border-primary/50"
            }`}
          >
            <button className="mt-1 flex-shrink-0 hover:scale-110 transition-transform">
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-accent" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium ${task.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
              >
                {task.title}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{task.assignee}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{task.dueDate}</span>
                </div>
              </div>
            </div>

            <div className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${priorityColor[task.priority]}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
