"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { Dashboard } from "@/components/dashboard/pages/dashboard"

export default function Home() {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  )
}
