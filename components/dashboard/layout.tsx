"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"
import { ChatListPanel } from "./chat/chat-list-panel"
import { ChatThreadPanel } from "./chat/chat-thread-panel"
import { useChat } from "@/lib/chat-context"

interface DashboardLayoutProps {
  children: React.ReactNode
  forceChatOpen?: boolean
}

export function DashboardLayout({ children, forceChatOpen }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const { isChatOpen, setChatOpen, selectedChat } = useChat()
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const showChatPanel = forceChatOpen || isChatOpen
  // On mobile, if chat is open, hide main content
  const showMainContent = !isSmallScreen || !showChatPanel

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar - Always persistent on desktop, collapsible */}
      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onToggle={setIsSidebarOpen}
        onCollapse={setIsSidebarCollapsed}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onToggleChat={() => setChatOpen(!showChatPanel)}
        />

        {/* Content Area - 2-3 column layout */}
        <div className="flex-1 flex overflow-hidden gap-0">
          {/* Chat List Panel - visible when chat is open */}
          {showChatPanel && !isSmallScreen && (
            <ChatListPanel
              onChatSelect={() => {
                // Chat selection handled in context
              }}
            />
          )}

          {/* Main Panel */}
          {showMainContent && (
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-background">
              <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">{children}</div>
            </div>
          )}

          {/* Chat Thread Panel - replaces main on mobile, side-by-side on desktop */}
          {showChatPanel && selectedChat && (
            <ChatThreadPanel
              onClose={() => setChatOpen(false)}
              onBackMobile={() => {
                if (isSmallScreen) setChatOpen(false)
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
