"use client"

import {
  X,
  Home,
  BarChart3,
  MessageSquare,
  CheckSquare,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  AlertTriangle,
  FileCheck,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

interface SidebarProps {
  isOpen: boolean
  isCollapsed: boolean
  onToggle: (open: boolean) => void
  onCollapse: (collapsed: boolean) => void
}

export function Sidebar({ isOpen, isCollapsed, onToggle, onCollapse }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: BarChart3, label: "Projects", href: "/projects" },
    { icon: MessageSquare, label: "Chat", href: "/chat" },
    { icon: CheckSquare, label: "Tasks", href: "/tasks" },
    { icon: FileText, label: "Reports", href: "/reports" },
    { icon: Calendar, label: "Site Diary", href: "/site-diary" },
    { icon: DollarSign, label: "Budget", href: "/budget" },
    { icon: FileCheck, label: "RFI & Submittals", href: "/rfi" },
    { icon: AlertTriangle, label: "Risk", href: "/risk" },
    { icon: DollarSign, label: "Invoicing", href: "/invoicing" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => onToggle(false)} role="presentation" />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:static lg:translate-x-0 z-40 h-screen transition-all duration-300 ease-in-out flex flex-col shadow-lg border-r border-border bg-card ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Header with Logo */}
        <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
          {!isCollapsed && (
            <div className="flex items-center gap-3 flex-1">
              <div className="relative w-full h-10 overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Novologic%20Logo_Grayscale%20on%20Transparent_Wix%20v3-U2e4bIcqPbFLisxOpSN4HyrsYxndTZ.png"
                  alt="App Logo"
                  fill
                  sizes="256px"
                  className="object-contain"
                  priority
                  onError={(e) => {
                    console.error("Sidebar logo failed to load:", e)
                    ;(e.currentTarget as HTMLImageElement).src = "/placeholder-logo.png"
                  }}
                />
              </div>
            </div>
          )}
          <button
            onClick={() => onCollapse(!isCollapsed)}
            className="hidden lg:flex p-1.5 hover:bg-muted rounded-lg transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
          <button
            onClick={() => onToggle(false)}
            className="lg:hidden p-1 hover:bg-muted rounded"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Switcher - hidden when collapsed */}
        {!isCollapsed && (
          <div className="p-4 border-b border-border">
            <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">Current Project</p>
            <button className="w-full px-3 py-2.5 bg-primary/10 border border-primary/30 rounded-lg text-sm text-foreground font-medium hover:bg-primary/20 transition-colors flex items-center justify-between group">
              <span className="truncate group-hover:text-primary transition-colors">Downtown Tower Phase 2</span>
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            </button>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.label : undefined}
                onClick={() => {
                  // Close mobile sidebar after navigation
                  if (isOpen) onToggle(false)
                }}
              >
                <item.icon className="w-5 h-5 flex-shrink-0 transition-colors" />
                {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-border">
          <button
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-destructive/10 hover:text-destructive transition-all font-medium ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
