"use client"

import { useState } from "react"
import { Calendar, MapPin, Users, AlertCircle, CheckCircle2, Plus, Search, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface DiaryEntry {
  id: string
  date: string
  weather: string
  temperature: string
  siteManager: string
  workers: number
  location: string
  description: string
  highlights: string[]
  issues: { title: string; severity: "high" | "medium" | "low" }[]
  photos: string[]
  inspections: { name: string; status: "passed" | "failed" | "pending"; notes: string }[]
}

const sampleEntries: DiaryEntry[] = [
  {
    id: "1",
    date: "2024-11-02",
    weather: "Partly Cloudy",
    temperature: "22°C",
    siteManager: "John Martinez",
    workers: 24,
    location: "Building A, Floor 3",
    description: "Concrete pouring completed for Floor 3 slab. All formwork in place. Quality checks passed.",
    highlights: [
      "Concrete strength test: 28 MPa (passed)",
      "Formwork alignment verified",
      "Electrical conduit installation ongoing",
      "Safety briefing completed - 0 incidents",
    ],
    issues: [
      { title: "Minor water seepage in corner joint", severity: "low" },
      { title: "Delayed material delivery - crane availability", severity: "medium" },
    ],
    photos: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    inspections: [
      { name: "Concrete Quality Check", status: "passed", notes: "Slump test passed. Mix design verified." },
      { name: "Safety Audit", status: "passed", notes: "All PPE in place. No violations noted." },
      { name: "Structural Alignment", status: "passed", notes: "Level verified within 5mm tolerance." },
    ],
  },
  {
    id: "2",
    date: "2024-11-01",
    weather: "Sunny",
    temperature: "24°C",
    siteManager: "Sarah Chen",
    workers: 20,
    location: "Foundation & Basement",
    description: "Waterproofing application on basement walls. Drainage system installation in progress.",
    highlights: [
      "Waterproof membrane applied to 85% of walls",
      "Drainage pipes laid on north and east sections",
      "Damp-proof course installation complete",
      "Material testing completed",
    ],
    issues: [
      { title: "Membrane wrinkles in section C - rework required", severity: "high" },
      { title: "Drainage slope adjustment needed", severity: "medium" },
    ],
    photos: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    inspections: [
      {
        name: "Membrane Application",
        status: "failed",
        notes: "Wrinkles in section C need rework. Reschedule inspection.",
      },
      { name: "Drainage System", status: "pending", notes: "Awaiting final inspection before covering." },
      { name: "Damp-proof Course", status: "passed", notes: "Correctly applied per specifications." },
    ],
  },
  {
    id: "3",
    date: "2024-10-31",
    weather: "Overcast",
    temperature: "19°C",
    siteManager: "Mike Johnson",
    workers: 18,
    location: "Structural Steel Erection",
    description: "Column placement and beam welding for Building B commenced. Steel delivery completed.",
    highlights: [
      "12 columns erected and welded",
      "Primary beams installed and bolted",
      "Welding certification verified for all workers",
      "Zero safety incidents",
    ],
    issues: [{ title: "Two bolts found loose during inspection", severity: "low" }],
    photos: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    inspections: [
      { name: "Weld Quality Check", status: "passed", notes: "All welds meet AWS D1.1 specifications." },
      { name: "Bolt Tightness", status: "pending", notes: "Follow-up inspection scheduled for tomorrow." },
      { name: "Structural Alignment", status: "passed", notes: "Plumb and level within acceptable tolerances." },
    ],
  },
]

export function SiteDiary() {
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(sampleEntries[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDate, setFilterDate] = useState("all")

  const filteredEntries = sampleEntries.filter((entry) => {
    const matchesSearch =
      entry.siteManager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Site Diary</h1>
          <p className="text-muted-foreground mt-1">Daily field logs, inspections & progress tracking</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            New Entry
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entry List */}
        <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto">
          {filteredEntries.map((entry) => (
            <Card
              key={entry.id}
              onClick={() => setSelectedEntry(entry)}
              className={`p-4 cursor-pointer transition-all border-2 ${
                selectedEntry?.id === entry.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{new Date(entry.date).toLocaleDateString()}</span>
                  {entry.issues.some((i) => i.severity === "high") && <AlertCircle className="w-4 h-4 text-red-500" />}
                </div>
                <p className="text-sm text-muted-foreground">{entry.siteManager}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {entry.location}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Entry Details */}
        {selectedEntry && (
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Workers</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{selectedEntry.workers}</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-900">Weather</span>
                </div>
                <p className="text-lg font-bold text-yellow-600">{selectedEntry.weather}</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Passed</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {selectedEntry.inspections.filter((i) => i.status === "passed").length}
                </p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-900">Issues</span>
                </div>
                <p className="text-2xl font-bold text-red-600">{selectedEntry.issues.length}</p>
              </Card>
            </div>

            {/* Description */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-3">Daily Summary</h3>
              <p className="text-muted-foreground leading-relaxed">{selectedEntry.description}</p>
            </Card>

            {/* Highlights */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Key Highlights</h3>
              <ul className="space-y-2">
                {selectedEntry.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Photo Gallery */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Site Photos</h3>
              <div className="grid grid-cols-3 gap-4">
                {selectedEntry.photos.map((photo, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Site photo ${i + 1}`}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button className="px-3 py-1 bg-white text-black rounded text-xs font-medium">View</button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Issues */}
            {selectedEntry.issues.length > 0 && (
              <Card className="p-6 border-red-200 bg-red-50">
                <h3 className="font-semibold text-red-900 mb-4">Issues & Concerns</h3>
                <div className="space-y-3">
                  {selectedEntry.issues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-white rounded border border-red-200">
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          issue.severity === "high"
                            ? "bg-red-100 text-red-700"
                            : issue.severity === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {issue.severity.toUpperCase()}
                      </div>
                      <span className="text-sm text-red-900 flex-1">{issue.title}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Inspections */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Inspections & QA</h3>
              <div className="space-y-3">
                {selectedEntry.inspections.map((inspection, i) => (
                  <div key={i} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{inspection.name}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          inspection.status === "passed"
                            ? "bg-green-100 text-green-700"
                            : inspection.status === "failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {inspection.status.charAt(0).toUpperCase() + inspection.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{inspection.notes}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
