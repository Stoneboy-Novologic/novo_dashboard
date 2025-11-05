"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { ArrowRight, Folder, TrendingUp, FileText } from "lucide-react"

export function Modules() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [selectedModule, setSelectedModule] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const modules = [
    {
      id: "project-directory",
      title: "Project Directory",
      description: "Manage all project information, stakeholders, documents, and site specifications",
      icon: Folder,
      color: "from-blue-600 to-blue-400",
      features: ["Project Details", "Team Members", "Documents", "Site Specs"],
      href: "/project-directory",
    },
    {
      id: "vet",
      title: "VET (Variance Events Tracker)",
      description: "Track project variations, change orders, and significant events in real-time",
      icon: TrendingUp,
      color: "from-orange-600 to-orange-400",
      features: ["Variations", "Change Orders", "Events", "Impact Analysis"],
      href: "/vet",
    },
    {
      id: "project-report",
      title: "Project Report Register",
      description: "Generate, manage, and archive comprehensive project reports and documentation",
      icon: FileText,
      color: "from-green-600 to-green-400",
      features: ["Reports", "Analytics", "Archives", "Export"],
      href: "/project-report",
    },
  ]

  const handleModuleSelect = (href: string) => {
    setSelectedModule(href)
    setTimeout(() => router.push(href), 300)
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="mb-2 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold font-heading">N</span>
          </div>
          <span className="text-sm font-medium text-primary font-heading">NvLogic</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 font-heading">Project Modules</h1>
        <p className="text-lg text-muted-foreground">Select a module to manage your construction project</p>
      </div>

      {/* Modules Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {modules.map((module) => {
          const Icon = module.icon
          const isSelected = selectedModule === module.href

          return (
            <button
              key={module.id}
              onClick={() => handleModuleSelect(module.href)}
              className={`relative group text-left transition-all duration-300 transform ${
                isSelected ? "scale-95 opacity-50" : "hover:scale-105"
              }`}
            >
              {/* Card Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
              />

              {/* Blueprint Grid Pattern */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 rounded-2xl overflow-hidden">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(#0F4C81 1px, transparent 1px), linear-gradient(90deg, #0F4C81 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
              </div>

              {/* Card Content */}
              <div className="relative p-8 bg-card border-2 border-border rounded-2xl h-full backdrop-blur-sm hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-2xl">
                {/* Icon Background */}
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${module.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Title & Description */}
                <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">{module.title}</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">{module.description}</p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {module.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all duration-300">
                  <span>Enter Module</span>
                  <ArrowRight className="w-5 h-5" />
                </div>

                {/* Loading Indicator */}
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-2xl backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm font-medium text-foreground">Loading...</p>
                    </div>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Footer Info */}
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-border">
        <p className="text-sm text-muted-foreground text-center">
          Each module provides specialized tools for comprehensive project management
        </p>
      </div>
    </div>
  )
}
