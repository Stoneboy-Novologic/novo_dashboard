"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, AlertCircle, DollarSign, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface BudgetCategory {
  id: string
  name: string
  budget: number
  spent: number
  committed: number
  percentage: number
  trend: "up" | "down" | "stable"
}

interface WaterfallData {
  name: string
  value: number
  fill: string
}

const budgetCategories: BudgetCategory[] = [
  {
    id: "1",
    name: "Labor",
    budget: 450000,
    spent: 380000,
    committed: 50000,
    percentage: 84,
    trend: "up",
  },
  {
    id: "2",
    name: "Materials",
    budget: 320000,
    spent: 285000,
    committed: 30000,
    percentage: 89,
    trend: "down",
  },
  {
    id: "3",
    name: "Equipment & Machinery",
    budget: 180000,
    spent: 165000,
    committed: 10000,
    percentage: 92,
    trend: "up",
  },
  {
    id: "4",
    name: "Subcontractors",
    budget: 280000,
    spent: 210000,
    committed: 50000,
    percentage: 75,
    trend: "down",
  },
  {
    id: "5",
    name: "Permits & Insurance",
    budget: 95000,
    spent: 85000,
    committed: 5000,
    percentage: 89,
    trend: "stable",
  },
  {
    id: "6",
    name: "Contingency",
    budget: 150000,
    spent: 0,
    committed: 0,
    percentage: 0,
    trend: "stable",
  },
]

const projectTotal = budgetCategories.reduce((sum, cat) => sum + cat.budget, 0)
const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0)
const totalCommitted = budgetCategories.reduce((sum, cat) => sum + cat.committed, 0)
const totalRemaining = projectTotal - totalSpent - totalCommitted

const waterfallData = [
  { name: "Original Budget", value: projectTotal, fill: "#0F4C81" },
  { name: "Labor Spent", value: -budgetCategories[0].spent, fill: "#E74C3C" },
  { name: "Materials Spent", value: -budgetCategories[1].spent, fill: "#E74C3C" },
  { name: "Equipment Spent", value: -budgetCategories[2].spent, fill: "#E74C3C" },
  { name: "Subcontractors", value: -budgetCategories[3].spent, fill: "#E74C3C" },
  { name: "Permits & Insurance", value: -budgetCategories[4].spent, fill: "#E74C3C" },
  { name: "Remaining Budget", value: totalRemaining, fill: "#2ECC71" },
]

const spendByMonth = [
  { month: "July", spent: 85000, budget: 120000 },
  { month: "August", spent: 125000, budget: 140000 },
  { month: "September", spent: 110000, budget: 130000 },
  { month: "October", spent: 95000, budget: 125000 },
  { month: "Current", spent: 95000, budget: 110000 },
]

const categoryDistribution = budgetCategories.map((cat) => ({
  name: cat.name.split(" ")[0],
  value: cat.spent,
}))

export function BudgetDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null)

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Project Budget</h1>
          <p className="text-muted-foreground mt-1">Budget vs Actual cost tracking & variance analysis</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Total Budget</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">${(projectTotal / 1000000).toFixed(1)}M</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-300" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-900">Total Spent</p>
              <p className="text-2xl font-bold text-red-600 mt-1">${(totalSpent / 1000000).toFixed(2)}M</p>
              <p className="text-xs text-red-700 mt-2">{((totalSpent / projectTotal) * 100).toFixed(1)}% of budget</p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-300" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-900">Committed</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">${(totalCommitted / 1000).toFixed(0)}K</p>
              <p className="text-xs text-yellow-700 mt-2">
                {((totalCommitted / projectTotal) * 100).toFixed(1)}% of budget
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-300" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-900">Remaining</p>
              <p className="text-2xl font-bold text-green-600 mt-1">${(totalRemaining / 1000000).toFixed(2)}M</p>
              <p className="text-xs text-green-700 mt-2">
                {((totalRemaining / projectTotal) * 100).toFixed(1)}% of budget
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-green-300" />
          </div>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Waterfall Chart */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Budget Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={waterfallData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Bar dataKey="value" fill="#0F4C81" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Spending Over Time */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Monthly Spend Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={spendByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Legend />
              <Line type="monotone" dataKey="budget" stroke="#0F4C81" strokeWidth={2} name="Budget" />
              <Line type="monotone" dataKey="spent" stroke="#E74C3C" strokeWidth={2} name="Actual Spent" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Category Details */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Budget by Category</h3>
        <div className="space-y-4">
          {budgetCategories.map((category) => {
            const available = category.budget - category.spent - category.committed
            const available_pct = (available / category.budget) * 100
            const spent_pct = (category.spent / category.budget) * 100
            const committed_pct = (category.committed / category.budget) * 100

            return (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className="p-4 border border-border rounded-lg hover:bg-muted cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{category.name}</p>
                    <p className="text-xs text-muted-foreground">Budget: ${(category.budget / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">${(category.spent / 1000).toFixed(0)}K spent</p>
                    <div className="flex items-center gap-1 mt-1">
                      {category.trend === "up" ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-red-500" />
                          <span className="text-xs text-red-600 font-medium">Rising</span>
                        </>
                      ) : category.trend === "down" ? (
                        <>
                          <TrendingDown className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-600 font-medium">Declining</span>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">Stable</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="flex h-2 gap-0.5 rounded-full overflow-hidden bg-muted">
                  <div
                    className="bg-red-500"
                    style={{ width: `${spent_pct}%` }}
                    title={`Spent: ${spent_pct.toFixed(1)}%`}
                  />
                  <div
                    className="bg-yellow-500"
                    style={{ width: `${committed_pct}%` }}
                    title={`Committed: ${committed_pct.toFixed(1)}%`}
                  />
                  <div
                    className="bg-green-500"
                    style={{ width: `${available_pct}%` }}
                    title={`Available: ${available_pct.toFixed(1)}%`}
                  />
                </div>

                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Spent ${(category.spent / 1000).toFixed(0)}K</span>
                  <span>Committed ${(category.committed / 1000).toFixed(0)}K</span>
                  <span>Available ${(available / 1000).toFixed(0)}K</span>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Spending Distribution Pie Chart */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Cost Distribution</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, value }) => `${name}: $${(value / 1000).toFixed(0)}K`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#0F4C81" />
                <Cell fill="#1A6BA8" />
                <Cell fill="#E74C3C" />
                <Cell fill="#FFC107" />
                <Cell fill="#2ECC71" />
                <Cell fill="#9B59B6" />
              </Pie>
              <Tooltip formatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
            </RechartsChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
