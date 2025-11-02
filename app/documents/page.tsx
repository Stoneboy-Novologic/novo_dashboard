"use client"

import { DocumentViewer } from "@/components/dashboard/pages/document-viewer"
import { DashboardLayout } from "@/components/dashboard/layout"

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <DocumentViewer />
    </DashboardLayout>
  )
}
