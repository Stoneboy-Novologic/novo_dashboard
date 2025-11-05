"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { RFIWorkflow } from "@/components/dashboard/pages/rfi-workflow"

export default function RFIPage() {
  return (
    <DashboardLayout>
      <RFIWorkflow />
    </DashboardLayout>
  )
}
