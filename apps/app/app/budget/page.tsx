"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { BudgetDashboard } from "@/components/dashboard/pages/budget-dashboard"

export default function BudgetPage() {
  return (
    <DashboardLayout>
      <BudgetDashboard />
    </DashboardLayout>
  )
}
