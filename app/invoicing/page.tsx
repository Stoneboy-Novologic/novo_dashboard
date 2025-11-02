"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { InvoicingModule } from "@/components/dashboard/pages/invoicing-module"

export default function InvoicingPage() {
  return (
    <DashboardLayout>
      <InvoicingModule />
    </DashboardLayout>
  )
}
