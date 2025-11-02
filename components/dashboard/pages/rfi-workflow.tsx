"use client"

import { useState } from "react"
import { MessageSquare, Plus, Search, Download, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface RFI {
  id: string
  number: string
  title: string
  description: string
  status: "draft" | "submitted" | "pending-review" | "approved" | "rejected" | "closed"
  priority: "low" | "medium" | "high" | "critical"
  submittedBy: string
  submittedDate: string
  dueDate: string
  reviewer: string
  responses: Array<{
    author: string
    date: string
    comment: string
    attachments?: string[]
  }>
  attachments: string[]
  linkedDocuments: string[]
}

const rfiData: RFI[] = [
  {
    id: "1",
    number: "RFI-2024-045",
    title: "Concrete Mix Design Confirmation - Floor 3",
    description:
      "Need clarification on concrete mix design specifications for Floor 3 slab. Current specification calls for 28-day strength of 30 MPa, but structural engineer notes indicate 35 MPa may be required for load conditions.",
    status: "pending-review",
    priority: "high",
    submittedBy: "John Martinez",
    submittedDate: "2024-11-01",
    dueDate: "2024-11-05",
    reviewer: "Sarah Chen (Architect)",
    responses: [
      {
        author: "Sarah Chen (Architect)",
        date: "2024-11-02",
        comment:
          "Based on revised structural analysis, 35 MPa mix is required. Updated specification attached. Please confirm receipt and adjust procurement accordingly.",
        attachments: ["Revised_Concrete_Specs_v2.pdf", "Structural_Analysis_Update.pdf"],
      },
      {
        author: "John Martinez",
        date: "2024-11-02",
        comment:
          "Confirmed. Supplier has been notified. Mix will be adjusted and tested before deployment. Quality report will be submitted after first batch test.",
      },
    ],
    attachments: ["Floor_3_Specification.pdf", "Initial_Concrete_Report.pdf"],
    linkedDocuments: ["PO-2024-1542", "Material_Approval_Form"],
  },
  {
    id: "2",
    number: "RFI-2024-044",
    title: "Electrical Conduit Routing - Basement Level",
    description:
      "Conflict identified between structural columns and proposed electrical conduit routing in basement. Requesting guidance on alternative routing paths that comply with code and maintain accessibility.",
    status: "approved",
    priority: "high",
    submittedBy: "Mike Johnson",
    submittedDate: "2024-10-31",
    dueDate: "2024-11-03",
    reviewer: "Alex Rodriguez (MEP Eng)",
    responses: [
      {
        author: "Alex Rodriguez (MEP Eng)",
        date: "2024-11-01",
        comment:
          "Alternative routing approved - Route conduit along east wall as shown in attached revised plan. This maintains 18-inch separation from structural elements and improves maintenance access.",
        attachments: ["Revised_Electrical_Plan_Basement_v3.pdf", "Code_Compliance_Check.pdf"],
      },
    ],
    attachments: ["Original_Conduit_Plan.pdf"],
    linkedDocuments: ["NEC-Code-Compliance-Matrix.xlsx", "Structural-Layout-Plan.pdf"],
  },
  {
    id: "3",
    number: "RFI-2024-043",
    title: "HVAC Capacity Increase for Server Room",
    description:
      "IT department has increased cooling requirements for new server room. Original specifications may not be adequate. Requesting confirmation if existing HVAC system can support additional load or if upgrade is needed.",
    status: "submitted",
    priority: "medium",
    submittedBy: "Sarah Chen",
    submittedDate: "2024-10-30",
    dueDate: "2024-11-06",
    reviewer: "HVAC Consultant",
    responses: [],
    attachments: ["Server_Room_Load_Analysis.pdf", "Updated_IT_Requirements.pdf"],
    linkedDocuments: ["HVAC-Design-Basis.pdf"],
  },
  {
    id: "4",
    number: "RFI-2024-042",
    title: "Door Schedule Revision - West Wing",
    description:
      "Client requests to change door types in west wing from standard aluminum frames to high-performance frames for enhanced security. Impacts budget and schedule.",
    status: "draft",
    priority: "medium",
    submittedBy: "John Martinez",
    submittedDate: "2024-10-29",
    dueDate: "2024-11-10",
    reviewer: "Project Manager",
    responses: [],
    attachments: [],
    linkedDocuments: ["Door_Schedule_v1.0.xlsx", "Security_Requirements.pdf"],
  },
  {
    id: "5",
    number: "RFI-2024-041",
    title: "Foundation Settlement Analysis - Building A",
    description:
      "Pre-pour settlement analysis indicates potential for differential settlement. Need structural engineer review and recommendations for mitigation.",
    status: "rejected",
    priority: "critical",
    submittedBy: "Mike Johnson",
    submittedDate: "2024-10-28",
    dueDate: "2024-11-01",
    reviewer: "Structural Engineer",
    responses: [
      {
        author: "Dr. James Wilson (Structural Eng)",
        date: "2024-10-29",
        comment:
          "Analysis requires additional bore data from locations B4, B5, and B6. Please conduct soil investigation at these points before resubmitting. Do not proceed with foundation work until additional data is reviewed.",
        attachments: ["Soil_Investigation_Locations.pdf"],
      },
    ],
    attachments: ["Initial_Settlement_Analysis.pdf", "Geotechnical_Report.pdf"],
    linkedDocuments: ["Boring_Log_Data.pdf"],
  },
  {
    id: "6",
    number: "RFI-2024-040",
    title: "Window Glazing Specification Upgrade",
    description:
      "Energy performance analysis suggests triple-glazed units would improve building efficiency. Requesting approval to upgrade from double-glazed specification.",
    status: "closed",
    priority: "low",
    submittedBy: "Sarah Chen",
    submittedDate: "2024-10-27",
    dueDate: "2024-10-30",
    reviewer: "Energy Consultant",
    responses: [
      {
        author: "Energy Consultant",
        date: "2024-10-28",
        comment:
          "Triple-glazing recommended. Cost increase of approximately 12% will be offset by 18% energy savings over 10 years.",
        attachments: ["Energy_Analysis_Comparison.pdf"],
      },
      {
        author: "Project Manager",
        date: "2024-10-29",
        comment: "Approved. Update specifications and notify supplier. Cost variance approved for budget adjustment.",
      },
    ],
    attachments: ["Original_Window_Spec.pdf"],
    linkedDocuments: ["Approved_Change_Order_CO-2024-08.pdf"],
  },
]

const statusColors: Record<RFI["status"], { bg: string; text: string; icon: string }> = {
  draft: { bg: "bg-gray-100", text: "text-gray-700", icon: "📝" },
  submitted: { bg: "bg-blue-100", text: "text-blue-700", icon: "📤" },
  "pending-review": { bg: "bg-yellow-100", text: "text-yellow-700", icon: "⏳" },
  approved: { bg: "bg-green-100", text: "text-green-700", icon: "✅" },
  rejected: { bg: "bg-red-100", text: "text-red-700", icon: "❌" },
  closed: { bg: "bg-purple-100", text: "text-purple-700", icon: "🔒" },
}

export function RFIWorkflow() {
  const [selectedRFI, setSelectedRFI] = useState<RFI | null>(rfiData[0])
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredRFIs = rfiData.filter((rfi) => {
    const matchesSearch =
      rfi.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfi.number.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = !filterStatus || rfi.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const rfiStats = {
    total: rfiData.length,
    draft: rfiData.filter((r) => r.status === "draft").length,
    submitted: rfiData.filter((r) => r.status === "submitted").length,
    pending: rfiData.filter((r) => r.status === "pending-review").length,
    approved: rfiData.filter((r) => r.status === "approved").length,
    rejected: rfiData.filter((r) => r.status === "rejected").length,
  }

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">RFI & Submittals</h1>
          <p className="text-muted-foreground mt-1">Request for Information & Document Approvals Workflow</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            New RFI
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Card className="p-4 text-center hover:bg-muted cursor-pointer transition-colors">
          <p className="text-2xl font-bold text-foreground">{rfiStats.total}</p>
          <p className="text-xs text-muted-foreground">Total RFIs</p>
        </Card>
        <Card className="p-4 text-center hover:bg-muted cursor-pointer transition-colors">
          <p className="text-2xl font-bold text-gray-600">{rfiStats.draft}</p>
          <p className="text-xs text-muted-foreground">Draft</p>
        </Card>
        <Card className="p-4 text-center hover:bg-muted cursor-pointer transition-colors">
          <p className="text-2xl font-bold text-blue-600">{rfiStats.submitted}</p>
          <p className="text-xs text-muted-foreground">Submitted</p>
        </Card>
        <Card className="p-4 text-center hover:bg-muted cursor-pointer transition-colors">
          <p className="text-2xl font-bold text-yellow-600">{rfiStats.pending}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </Card>
        <Card className="p-4 text-center hover:bg-muted cursor-pointer transition-colors">
          <p className="text-2xl font-bold text-green-600">{rfiStats.approved}</p>
          <p className="text-xs text-muted-foreground">Approved</p>
        </Card>
        <Card className="p-4 text-center hover:bg-muted cursor-pointer transition-colors">
          <p className="text-2xl font-bold text-red-600">{rfiStats.rejected}</p>
          <p className="text-xs text-muted-foreground">Rejected</p>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search RFIs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={filterStatus || ""}
          onChange={(e) => setFilterStatus(e.target.value || null)}
          className="px-4 py-2 bg-muted rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="pending-review">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RFI List */}
        <div className="lg:col-span-1 space-y-3 max-h-[700px] overflow-y-auto">
          {filteredRFIs.map((rfi) => {
            const statusInfo = statusColors[rfi.status]
            return (
              <Card
                key={rfi.id}
                onClick={() => setSelectedRFI(rfi)}
                className={`p-4 cursor-pointer transition-all border-2 ${
                  selectedRFI?.id === rfi.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{rfi.number}</p>
                      <p className="text-xs text-muted-foreground truncate">{rfi.title}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                        rfi.priority === "critical"
                          ? "bg-red-100 text-red-700"
                          : rfi.priority === "high"
                            ? "bg-orange-100 text-orange-700"
                            : rfi.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {rfi.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium w-fit ${statusInfo.bg} ${statusInfo.text}`}>
                    {rfi.status.replace("-", " ").toUpperCase()}
                  </div>
                  <p className="text-xs text-muted-foreground">Due: {new Date(rfi.dueDate).toLocaleDateString()}</p>
                </div>
              </Card>
            )
          })}
        </div>

        {/* RFI Details */}
        {selectedRFI && (
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedRFI.number}</h2>
                  <p className="text-muted-foreground mt-1">{selectedRFI.title}</p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedRFI.status].bg} ${statusColors[selectedRFI.status].text}`}
                >
                  {selectedRFI.status.replace("-", " ").toUpperCase()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Submitted By</p>
                  <p className="font-medium text-foreground">{selectedRFI.submittedBy}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(selectedRFI.submittedDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Reviewer</p>
                  <p className="font-medium text-foreground">{selectedRFI.reviewer}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Due: {new Date(selectedRFI.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{selectedRFI.description}</p>
            </Card>

            {/* Attachments */}
            {selectedRFI.attachments.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-3">Attachments</h3>
                <div className="space-y-2">
                  {selectedRFI.attachments.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 hover:bg-muted rounded transition-colors cursor-pointer"
                    >
                      <Paperclip className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground flex-1">{file}</span>
                      <Button size="sm" variant="ghost">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Responses/Comments */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Responses ({selectedRFI.responses.length})
              </h3>
              <div className="space-y-4">
                {selectedRFI.responses.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No responses yet</p>
                ) : (
                  selectedRFI.responses.map((response, i) => (
                    <div key={i} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-foreground">{response.author}</p>
                        <p className="text-xs text-muted-foreground">{new Date(response.date).toLocaleDateString()}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{response.comment}</p>
                      {response.attachments && response.attachments.length > 0 && (
                        <div className="space-y-1 pt-3 border-t border-border">
                          {response.attachments.map((file, j) => (
                            <div
                              key={j}
                              className="flex items-center gap-2 text-xs text-primary cursor-pointer hover:underline"
                            >
                              <Paperclip className="w-3 h-3" />
                              {file}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <Button className="w-full mt-4 gap-2">
                <MessageSquare className="w-4 h-4" />
                Add Response
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
