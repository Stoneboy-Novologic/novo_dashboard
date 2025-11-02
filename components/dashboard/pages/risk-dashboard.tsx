"use client"

import { useState } from "react"
import { Target, Plus, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

interface Risk {
  id: string
  title: string
  category: string
  description: string
  likelihood: 1 | 2 | 3 | 4 | 5 // 1-5 scale
  impact: 1 | 2 | 3 | 4 | 5 // 1-5 scale
  riskScore: number // likelihood * impact
  status: "active" | "mitigating" | "resolved"
  owner: string
  mitigation: string
  timeline: string
  mitigationResponsible: string
}

const riskData: Risk[] = [
  {
    id: "1",
    title: "Weather Delays - Heavy Monsoon Forecast",
    category: "External",
    description:
      "Heavy monsoon season predicted for November-December. Outdoor concrete curing and steel erection may be delayed.",
    likelihood: 4,
    impact: 4,
    riskScore: 16,
    status: "active",
    owner: "John Martinez",
    mitigation: "Implement temporary weather protection, accelerate indoor work, maintain flexible scheduling",
    timeline: "Ongoing through Dec 2024",
    mitigationResponsible: "Site Manager",
  },
  {
    id: "2",
    title: "Material Supply Chain Disruption",
    category: "Supply Chain",
    description: "Potential delays in delivery of structural steel from international supplier due to port congestion.",
    likelihood: 3,
    impact: 5,
    riskScore: 15,
    status: "mitigating",
    owner: "Procurement Team",
    mitigation:
      "Identify alternate suppliers, increase inventory buffers, establish direct relationships with expediting services",
    timeline: "Through Q4 2024",
    mitigationResponsible: "Procurement Manager",
  },
  {
    id: "3",
    title: "Labor Shortage - Skilled Trades",
    category: "Resource",
    description: "Difficulty sourcing specialized welders and concrete finishers in current market conditions.",
    likelihood: 4,
    impact: 3,
    riskScore: 12,
    status: "active",
    owner: "HR Manager",
    mitigation: "Partner with trade unions, increase wages 5-8%, develop apprenticeship program, cross-train workers",
    timeline: "Immediate implementation",
    mitigationResponsible: "HR & Recruitment",
  },
  {
    id: "4",
    title: "Design Changes - Client Scope Creep",
    category: "Client",
    description:
      "Risk of mid-project design changes impacting schedule and budget. Client has requested 3 major modifications.",
    likelihood: 3,
    impact: 4,
    riskScore: 12,
    status: "active",
    owner: "Project Manager",
    mitigation: "Implement change control process, require written approvals, establish impact assessment protocol",
    timeline: "Throughout project",
    mitigationResponsible: "Project Manager",
  },
  {
    id: "5",
    title: "Safety Incident - High-Risk Activities",
    category: "Safety",
    description: "Multiple high-altitude and heavy lifting operations underway. Potential for worker injuries.",
    likelihood: 2,
    impact: 5,
    riskScore: 10,
    status: "mitigating",
    owner: "Safety Officer",
    mitigation:
      "Daily safety audits, mandatory PPE enforcement, worker training updates, hazard assessments before each phase",
    timeline: "Continuous",
    mitigationResponsible: "Safety Officer",
  },
  {
    id: "6",
    title: "Budget Overrun - Material Cost Inflation",
    category: "Financial",
    description:
      "Steel and concrete prices rising 0.8-1.2% monthly. Potential budget impact of 3-5% if trend continues.",
    likelihood: 3,
    impact: 3,
    riskScore: 9,
    status: "mitigating",
    owner: "Finance Manager",
    mitigation:
      "Lock in long-term supplier contracts, use contingency fund strategically, explore material substitutes",
    timeline: "Monitor through Q1 2025",
    mitigationResponsible: "Finance & Procurement",
  },
  {
    id: "7",
    title: "Foundation Settlement Issues",
    category: "Technical",
    description:
      "Soil testing indicates potential differential settlement. May require redesign of foundation approach.",
    likelihood: 2,
    impact: 4,
    riskScore: 8,
    status: "resolved",
    owner: "Structural Engineer",
    mitigation:
      "Additional bore sampling completed, geotechnical report updated, foundation design revised, client approved",
    timeline: "Resolved - Oct 2024",
    mitigationResponsible: "Structural Engineer",
  },
  {
    id: "8",
    title: "Utility Relocation Delay",
    category: "External",
    description: "Electric and water utility relocation needed for Phase 2. Utility company delays possible.",
    likelihood: 2,
    impact: 3,
    riskScore: 6,
    status: "active",
    owner: "Government Relations",
    mitigation:
      "Early coordination with utility companies, submit requests 6 months in advance, maintain communication",
    timeline: "Engage now for Q1 2025",
    mitigationResponsible: "Government Relations",
  },
]

const riskHeatmapData = riskData.map((r) => ({
  name: r.title.substring(0, 20),
  likelihood: r.likelihood,
  impact: r.impact,
  score: r.riskScore,
  status: r.status,
}))

const categoryBreakdown = [
  { name: "External", risks: riskData.filter((r) => r.category === "External").length },
  { name: "Supply Chain", risks: riskData.filter((r) => r.category === "Supply Chain").length },
  { name: "Resource", risks: riskData.filter((r) => r.category === "Resource").length },
  { name: "Client", risks: riskData.filter((r) => r.category === "Client").length },
  { name: "Safety", risks: riskData.filter((r) => r.category === "Safety").length },
  { name: "Financial", risks: riskData.filter((r) => r.category === "Financial").length },
  { name: "Technical", risks: riskData.filter((r) => r.category === "Technical").length },
]

export function RiskDashboard() {
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(riskData[0])
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredRisks = filterStatus === "all" ? riskData : riskData.filter((r) => r.status === filterStatus)

  const riskStats = {
    total: riskData.length,
    critical: riskData.filter((r) => r.riskScore >= 15).length,
    high: riskData.filter((r) => r.riskScore >= 10 && r.riskScore < 15).length,
    medium: riskData.filter((r) => r.riskScore >= 5 && r.riskScore < 10).length,
    low: riskData.filter((r) => r.riskScore < 5).length,
    active: riskData.filter((r) => r.status === "active").length,
  }

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Risk Management</h1>
          <p className="text-muted-foreground mt-1">Risk heatmap, mitigation strategies & impact analysis</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            New Risk
          </Button>
        </div>
      </div>

      {/* Risk Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-4 text-center hover:bg-muted cursor-pointer transition-colors">
          <p className="text-2xl font-bold text-foreground">{riskStats.total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </Card>
        <Card className="p-4 text-center hover:bg-muted cursor-pointer transition-colors bg-red-50 border-red-200">
          <p className="text-2xl font-bold text-red-600">{riskStats.critical}</p>
          <p className="text-xs text-red-700">Critical</p>
        </Card>
        <Card className="p-4 text-center hover:bg-muted cursor-pointer transition-colors bg-orange-50 border-orange-200">
          <p className="text-2xl font-bold text-orange-600">{riskStats.high}</p>
          <p className="text-xs text-orange-700">High</p>
        </Card>
        <Card className="p-4 text-center hover:bg-muted cursor-pointer transition-colors bg-yellow-50 border-yellow-200">
          <p className="text-2xl font-bold text-yellow-600">{riskStats.medium}</p>
          <p className="text-xs text-yellow-700">Medium</p>
        </Card>
        <Card className="p-4 text-center hover:bg-muted cursor-pointer transition-colors bg-green-50 border-green-200">
          <p className="text-2xl font-bold text-green-600">{riskStats.low}</p>
          <p className="text-xs text-green-700">Low</p>
        </Card>
        <Card className="p-4 text-center hover:bg-muted cursor-pointer transition-colors">
          <p className="text-2xl font-bold text-primary">{riskStats.active}</p>
          <p className="text-xs text-muted-foreground">Active</p>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk List */}
        <div className="lg:col-span-1 space-y-3 max-h-[700px] overflow-y-auto">
          <div className="flex gap-2 mb-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-3 py-2 bg-muted rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Risks</option>
              <option value="active">Active</option>
              <option value="mitigating">Mitigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {filteredRisks.map((risk) => {
            const severity =
              risk.riskScore >= 15 ? "critical" : risk.riskScore >= 10 ? "high" : risk.riskScore >= 5 ? "medium" : "low"
            const severityColor = {
              critical: "border-red-300 bg-red-50",
              high: "border-orange-300 bg-orange-50",
              medium: "border-yellow-300 bg-yellow-50",
              low: "border-green-300 bg-green-50",
            }
            const statusIcon = {
              active: "🔴",
              mitigating: "🟡",
              resolved: "🟢",
            }

            return (
              <Card
                key={risk.id}
                onClick={() => setSelectedRisk(risk)}
                className={`p-4 cursor-pointer transition-all border-2 ${
                  selectedRisk?.id === risk.id ? "border-primary bg-primary/5" : severityColor[severity]
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">
                        {statusIcon[risk.status]} {risk.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{risk.category}</p>
                    </div>
                    <span className="text-lg font-bold">{risk.riskScore}</span>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Risk Details & Heatmap */}
        <div className="lg:col-span-2 space-y-6">
          {/* Risk Heatmap */}
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Risk Heatmap (Likelihood vs Impact)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  type="number"
                  dataKey="likelihood"
                  name="Likelihood"
                  domain={[0, 5]}
                  label={{ value: "Likelihood", position: "insideBottomRight", offset: -10 }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  type="number"
                  dataKey="impact"
                  name="Impact"
                  domain={[0, 5]}
                  label={{ value: "Impact", angle: -90, position: "insideLeft" }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ payload }) => {
                    if (payload?.[0]) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white p-2 border border-border rounded shadow-lg text-xs">
                          <p className="font-medium">{data.name}</p>
                          <p>Score: {data.score}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Scatter name="Risks" data={riskHeatmapData} fill="#0F4C81" fillOpacity={0.6} shape="circle" />
              </ScatterChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>Critical (15+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span>High (10-14)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>Medium (5-9)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Low (1-4)</span>
              </div>
            </div>
          </Card>

          {/* Category Breakdown */}
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Risks by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="risks" fill="#0F4C81" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Selected Risk Details */}
          {selectedRisk && (
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{selectedRisk.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedRisk.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Risk Score</p>
                    <p className="text-2xl font-bold text-foreground">{selectedRisk.riskScore}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Likelihood: {selectedRisk.likelihood} | Impact: {selectedRisk.impact}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedRisk.status === "active" && <span className="text-2xl">🔴</span>}
                      {selectedRisk.status === "mitigating" && <span className="text-2xl">🟡</span>}
                      {selectedRisk.status === "resolved" && <span className="text-2xl">🟢</span>}
                      <span className="font-semibold text-foreground">{selectedRisk.status.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Mitigation Strategy
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">{selectedRisk.mitigation}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Responsible</p>
                      <p className="font-medium text-foreground">{selectedRisk.mitigationResponsible}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Timeline</p>
                      <p className="font-medium text-foreground">{selectedRisk.timeline}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Owner</p>
                  <p className="font-medium text-foreground">{selectedRisk.owner}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
