"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { SiteDiary } from "@/components/dashboard/pages/site-diary"

export default function SiteDiaryPage() {
  return (
    <DashboardLayout>
      <SiteDiary />
    </DashboardLayout>
  )
}
