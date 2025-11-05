"use client"

import { KanbanBoard } from "@/components/dashboard/pages/kanban-board"
import { DashboardLayout } from "@/components/dashboard/layout"

export default function TasksPage() {
  return (
    <DashboardLayout>
      <KanbanBoard />
    </DashboardLayout>
  )
}
