"use client"

import { useState } from "react"
import { FileText, CheckCircle2, Clock, AlertCircle, Plus, Search, Download, Eye, Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface Invoice {
  id: string
  invoiceNumber: string
  date: string
  dueDate: string
  vendor: string
  description: string
  amount: number
  status: "draft" | "sent" | "viewed" | "paid" | "overdue" | "disputed"
  paymentTerms: string
  lineItems: Array<{
    description: string
    quantity: number
    rate: number
  }>
  notes?: string
  attachments?: string[]
}

const invoiceData: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-1089",
    date: "2024-10-28",
    dueDate: "2024-11-27",
    vendor: "Premier Concrete Services",
    description: "Concrete supply and placement - Floor 3 slab",
    amount: 124500,
    status: "paid",
    paymentTerms: "Net 30",
    lineItems: [
      { description: "Ready-mix concrete (680 m³) @ $180/m³", quantity: 680, rate: 180 },
      { description: "Concrete pumping services", quantity: 1, rate: 8500 },
      { description: "Vibration & finishing labor", quantity: 120, rate: 45 },
    ],
    notes: "Payment received on 2024-11-15",
    attachments: ["Invoice_Original.pdf", "Delivery_Ticket.pdf"],
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-1090",
    date: "2024-10-30",
    dueDate: "2024-11-29",
    vendor: "Apex Structural Steel",
    description: "Structural steel columns and beams - Building B",
    amount: 245300,
    status: "viewed",
    paymentTerms: "Net 30",
    lineItems: [
      { description: "Structural steel (85 tons) @ $2800/ton", quantity: 85, rate: 2800 },
      { description: "Fabrication and welding", quantity: 1, rate: 18000 },
      { description: "Delivery and installation labor", quantity: 80, rate: 65 },
    ],
    attachments: ["Fabrication_Drawings.pdf", "Test_Certificates.pdf"],
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-1091",
    date: "2024-11-01",
    dueDate: "2024-12-01",
    vendor: "ElectroWire Installations",
    description: "Electrical wiring and conduit installation",
    amount: 87400,
    status: "sent",
    paymentTerms: "Net 30",
    lineItems: [
      { description: "Electrical wire (PVC 25mm) - 4.5km @ $12/m", quantity: 4500, rate: 12 },
      { description: "Conduit installation labor", quantity: 180, rate: 85 },
      { description: "Testing and certification", quantity: 1, rate: 2400 },
    ],
    attachments: ["Material_List.pdf", "Labor_Report.pdf"],
  },
  {
    id: "4",
    invoiceNumber: "INV-2024-1092",
    date: "2024-11-02",
    dueDate: "2024-12-02",
    vendor: "Complete HVAC Solutions",
    description: "HVAC system installation and ducting",
    amount: 156800,
    status: "draft",
    paymentTerms: "Net 45",
    lineItems: [
      { description: "HVAC equipment (3x AHU units)", quantity: 3, rate: 28000 },
      { description: "Ductwork fabrication and installation", quantity: 850, rate: 120 },
      { description: "Commissioning and testing", quantity: 1, rate: 8800 },
    ],
    attachments: ["Equipment_Specs.pdf"],
  },
  {
    id: "5",
    invoiceNumber: "INV-2024-1093",
    date: "2024-10-25",
    dueDate: "2024-11-24",
    vendor: "Steel & Stone Ltd",
    description: "Rebar supply and installation services",
    amount: 95600,
    status: "overdue",
    paymentTerms: "Net 30",
    lineItems: [
      { description: "Rebar (Grade 500) 25mm - 450 tons @ $180/ton", quantity: 450, rate: 180 },
      { description: "Bending and placement labor", quantity: 200, rate: 65 },
      { description: "Inspection and documentation", quantity: 1, rate: 2600 },
    ],
    notes: "Payment due 9 days ago - contact vendor",
    attachments: ["Delivery_Challan.pdf", "Test_Report.pdf"],
  },
  {
    id: "6",
    invoiceNumber: "INV-2024-1088",
    date: "2024-10-20",
    dueDate: "2024-11-19",
    vendor: "SafetyFirst PPE Supply",
    description: "Personal protective equipment - monthly supply",
    amount: 12500,
    status: "paid",
    paymentTerms: "Net 30",
    lineItems: [
      { description: "Safety helmets (100 units)", quantity: 100, rate: 35 },
      { description: "High-visibility vests (150 units)", quantity: 150, rate: 28 },
      { description: "Safety boots and gloves bundle", quantity: 120, rate: 55 },
    ],
    notes: "Paid on 2024-11-05",
    attachments: ["Inventory_Receipt.pdf"],
  },
]

const monthlyData = [
  { month: "Aug", invoiced: 245000, paid: 200000, pending: 45000 },
  { month: "Sep", invoiced: 380000, paid: 310000, pending: 70000 },
  { month: "Oct", invoiced: 520000, paid: 350000, pending: 170000 },
  { month: "Nov", invoiced: 260000, paid: 125000, pending: 135000 },
]

const agingData = [
  {
    name: "0-30 days",
    value: invoiceData
      .filter((i) => {
        const daysOverdue = Math.floor((new Date().getTime() - new Date(i.dueDate).getTime()) / (1000 * 60 * 60 * 24))
        return daysOverdue <= 0
      })
      .reduce((sum, i) => sum + i.amount, 0),
  },
  {
    name: "31-60 days",
    value: invoiceData
      .filter((i) => {
        const daysOverdue = Math.floor((new Date().getTime() - new Date(i.dueDate).getTime()) / (1000 * 60 * 60 * 24))
        return daysOverdue > 0 && daysOverdue <= 30
      })
      .reduce((sum, i) => sum + i.amount, 0),
  },
  {
    name: "61-90 days",
    value: invoiceData
      .filter((i) => {
        const daysOverdue = Math.floor((new Date().getTime() - new Date(i.dueDate).getTime()) / (1000 * 60 * 60 * 24))
        return daysOverdue > 30 && daysOverdue <= 60
      })
      .reduce((sum, i) => sum + i.amount, 0),
  },
  {
    name: "90+ days",
    value: invoiceData
      .filter((i) => {
        const daysOverdue = Math.floor((new Date().getTime() - new Date(i.dueDate).getTime()) / (1000 * 60 * 60 * 24))
        return daysOverdue > 60
      })
      .reduce((sum, i) => sum + i.amount, 0),
  },
]

const colorPalette = ["#2ECC71", "#FFC107", "#FF9800", "#E74C3C"]

export function InvoicingModule() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(invoiceData[0])
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredInvoices = invoiceData.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || inv.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const invoiceStats = {
    total: invoiceData.length,
    draft: invoiceData.filter((i) => i.status === "draft").length,
    sent: invoiceData.filter((i) => i.status === "sent").length,
    viewed: invoiceData.filter((i) => i.status === "viewed").length,
    paid: invoiceData.filter((i) => i.status === "paid").length,
    overdue: invoiceData.filter((i) => i.status === "overdue").length,
  }

  const totalInvoiced = invoiceData.reduce((sum, i) => sum + i.amount, 0)
  const totalPaid = invoiceData.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0)
  const totalPending = totalInvoiced - totalPaid

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoicing & Billing</h1>
          <p className="text-muted-foreground mt-1">Invoice tracking, aging analysis & payment management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Total Invoiced</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">${(totalInvoiced / 1000).toFixed(0)}K</p>
            </div>
            <FileText className="w-8 h-8 text-blue-300" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-900">Total Paid</p>
              <p className="text-2xl font-bold text-green-600 mt-1">${(totalPaid / 1000).toFixed(0)}K</p>
              <p className="text-xs text-green-700 mt-2">{((totalPaid / totalInvoiced) * 100).toFixed(1)}% paid</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-300" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-900">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">${(totalPending / 1000).toFixed(0)}K</p>
              <p className="text-xs text-yellow-700 mt-2">
                {((totalPending / totalInvoiced) * 100).toFixed(1)}% outstanding
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-300" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-900">Overdue</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{invoiceStats.overdue}</p>
              <p className="text-xs text-red-700 mt-2">Requires attention</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-300" />
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Invoice Trend */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Monthly Invoice Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Legend />
              <Line type="monotone" dataKey="invoiced" stroke="#0F4C81" strokeWidth={2} name="Invoiced" />
              <Line type="monotone" dataKey="paid" stroke="#2ECC71" strokeWidth={2} name="Paid" />
              <Line type="monotone" dataKey="pending" stroke="#FFC107" strokeWidth={2} name="Pending" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Invoice Aging Analysis */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Invoice Aging (Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={agingData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, value }) => `${name}: $${(value / 1000).toFixed(0)}K`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {colorPalette.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Invoice Status Distribution */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Invoice Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold text-foreground">{invoiceStats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="text-center p-3 bg-gray-100 rounded-lg">
            <p className="text-2xl font-bold text-gray-700">{invoiceStats.draft}</p>
            <p className="text-xs text-gray-600">Draft</p>
          </div>
          <div className="text-center p-3 bg-blue-100 rounded-lg">
            <p className="text-2xl font-bold text-blue-700">{invoiceStats.sent}</p>
            <p className="text-xs text-blue-600">Sent</p>
          </div>
          <div className="text-center p-3 bg-purple-100 rounded-lg">
            <p className="text-2xl font-bold text-purple-700">{invoiceStats.viewed}</p>
            <p className="text-xs text-purple-600">Viewed</p>
          </div>
          <div className="text-center p-3 bg-green-100 rounded-lg">
            <p className="text-2xl font-bold text-green-700">{invoiceStats.paid}</p>
            <p className="text-xs text-green-600">Paid</p>
          </div>
          <div className="text-center p-3 bg-red-100 rounded-lg">
            <p className="text-2xl font-bold text-red-700">{invoiceStats.overdue}</p>
            <p className="text-xs text-red-600">Overdue</p>
          </div>
        </div>
      </Card>

      {/* Main Invoice List & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice List */}
        <div className="lg:col-span-1 space-y-3 max-h-[700px] overflow-y-auto">
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 bg-muted rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="viewed">Viewed</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>

          {filteredInvoices.map((invoice) => {
            const statusColors: Record<string, string> = {
              draft: "bg-gray-100 text-gray-700",
              sent: "bg-blue-100 text-blue-700",
              viewed: "bg-purple-100 text-purple-700",
              paid: "bg-green-100 text-green-700",
              overdue: "bg-red-100 text-red-700",
              disputed: "bg-orange-100 text-orange-700",
            }

            return (
              <Card
                key={invoice.id}
                onClick={() => setSelectedInvoice(invoice)}
                className={`p-4 cursor-pointer transition-all border-2 ${
                  selectedInvoice?.id === invoice.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-muted-foreground truncate">{invoice.vendor}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap capitalize ${statusColors[invoice.status]}`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">${(invoice.amount / 1000).toFixed(0)}K</span>
                    <span className="text-xs text-muted-foreground">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Invoice Details */}
        {selectedInvoice && (
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Header */}
            <Card className="p-6 border-2">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{selectedInvoice.invoiceNumber}</h2>
                    <p className="text-muted-foreground mt-1">{selectedInvoice.vendor}</p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${
                      selectedInvoice.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : selectedInvoice.status === "overdue"
                          ? "bg-red-100 text-red-700"
                          : selectedInvoice.status === "viewed"
                            ? "bg-purple-100 text-purple-700"
                            : selectedInvoice.status === "sent"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedInvoice.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Invoice Date</p>
                    <p className="font-medium text-foreground">{new Date(selectedInvoice.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedInvoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Terms</p>
                    <p className="font-medium text-foreground">{selectedInvoice.paymentTerms}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Amount</p>
                    <p className="text-xl font-bold text-primary">${(selectedInvoice.amount / 1000).toFixed(1)}K</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Line Items */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Line Items</h3>
              <div className="space-y-3">
                {selectedInvoice.lineItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{item.description}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">${((item.quantity * item.rate) / 1000).toFixed(1)}K</p>
                      <p className="text-xs text-muted-foreground">@${item.rate}/unit</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Amount Due</p>
                  <p className="text-2xl font-bold text-primary">${(selectedInvoice.amount / 1000).toFixed(1)}K</p>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button className="flex-1 gap-2">
                <Eye className="w-4 h-4" />
                View Full Invoice
              </Button>
              <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                <Mail className="w-4 h-4" />
                Send Reminder
              </Button>
              <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                <Send className="w-4 h-4" />
                Mark as Paid
              </Button>
            </div>

            {/* Notes */}
            {selectedInvoice.notes && (
              <Card className="p-6 bg-blue-50 border-blue-200">
                <p className="text-xs text-blue-900 font-medium">NOTES</p>
                <p className="text-sm text-blue-700 mt-2">{selectedInvoice.notes}</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
