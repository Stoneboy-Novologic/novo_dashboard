"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { RiskDashboard } from "@/components/dashboard/pages/risk-dashboard"

export default function RiskPage() {
  return (
    <DashboardLayout>
      <RiskDashboard />
    </DashboardLayout>
  )
}
