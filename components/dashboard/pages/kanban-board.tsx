"use client"

import { useState } from "react"
import { Plus, Filter, AlertCircle, Clock, CheckCircle2 } from "lucide-react"
import { KanbanColumn } from "../components/kanban-column"

export interface Task {
  id: string
  title: string
  description: string
  assignee: string
  avatar: string
  priority: "high" | "medium" | "low"
  dueDate: string
  status: "todo" | "in-progress" | "review" | "completed"
  tags: string[]
  subtasks?: { id: string; title: string; completed: boolean }[]
}

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Foundation inspection and approval",
      description: "Complete structural inspection and get permits approved",
      assignee: "Mike Chen",
      avatar: "MC",
      priority: "high",
      dueDate: "Today",
      status: "in-progress",
      tags: ["Urgent", "Permits"],
      subtasks: [
        { id: "1-1", title: "Schedule inspector", completed: true },
        { id: "1-2", title: "Prepare documentation", completed: true },
        { id: "1-3", title: "Get approval", completed: false },
      ],
    },
    {
      id: "2",
      title: "Steel reinforcement delivery",
      description: "Coordinate delivery and storage of steel reinforcements",
      assignee: "Sarah Johnson",
      avatar: "SJ",
      priority: "high",
      dueDate: "Tomorrow",
      status: "todo",
      tags: ["Supply Chain"],
    },
    {
      id: "3",
      title: "Concrete supplier coordination",
      description: "Finalize concrete mix design and delivery schedule",
      assignee: "James Wilson",
      avatar: "JW",
      priority: "medium",
      dueDate: "Dec 15",
      status: "review",
      tags: ["Suppliers"],
    },
    {
      id: "4",
      title: "Weather contingency planning",
      description: "Develop backup plans for adverse weather conditions",
      assignee: "Emma Davis",
      avatar: "ED",
      priority: "medium",
      dueDate: "Dec 18",
      status: "todo",
      tags: ["Planning"],
    },
    {
      id: "5",
      title: "Safety training session",
      description: "Conduct mandatory safety training for all team members",
      assignee: "You",
      avatar: "JD",
      priority: "medium",
      dueDate: "Dec 20",
      status: "todo",
      tags: ["Safety", "Training"],
    },
    {
      id: "6",
      title: "Site cleanup and preparation",
      description: "Clear and prepare site for concrete foundation",
      assignee: "Robert Brown",
      avatar: "RB",
      priority: "low",
      dueDate: "Dec 22",
      status: "completed",
      tags: ["Site Prep"],
    },
  ])

  const [filterPriority, setFilterPriority] = useState<"all" | "high" | "medium" | "low">("all")

  const columns = [
    { id: "todo", title: "To Do", icon: null },
    { id: "in-progress", title: "In Progress", icon: Clock },
    { id: "review", title: "In Review", icon: AlertCircle },
    { id: "completed", title: "Done", icon: CheckCircle2 },
  ]

  const filteredTasks = filterPriority === "all" ? tasks : tasks.filter((task) => task.priority === filterPriority)

  const tasksByStatus = columns.reduce(
    (acc, col) => {
      acc[col.id] = filteredTasks.filter((task) => task.status === col.id)
      return acc
    },
    {} as Record<string, Task[]>,
  )

  const moveTask = (taskId: string, newStatus: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus as Task["status"] } : task)))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground font-heading mb-2">Tasks & Kanban Board</h1>
        <p className="text-muted-foreground">Manage project tasks and track progress</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground outline-none focus:border-primary transition-colors cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6 pb-8">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            columnId={column.id}
            title={column.title}
            tasks={tasksByStatus[column.id] || []}
            onTaskMove={moveTask}
            icon={column.icon}
          />
        ))}
      </div>
    </div>
  )
}
