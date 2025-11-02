"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { ChatThreadPanel } from "@/components/dashboard/chat/chat-thread-panel"
import { ChatListPanel } from "@/components/dashboard/chat/chat-list-panel"
import { useChat } from "@/lib/chat-context"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ChatPage() {
  const { selectedChat, setChatOpen } = useChat()
  const [isChatListCollapsed, setIsChatListCollapsed] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  return (
    <DashboardLayout forceChatOpen>
      <div className="flex h-full gap-0 bg-background overflow-hidden">
        {/* Chat List Sidebar - Collapsible */}
        <div
          className={`flex flex-col border-r border-border transition-all duration-300 ease-in-out ${
            isChatListCollapsed ? "w-0" : "w-80"
          }`}
        >
          {!isChatListCollapsed && <ChatListPanel onChatSelect={() => setIsSmallScreen(true)} />}
        </div>

        {/* Collapse/Expand Toggle Button */}
        <div className="flex flex-col items-center justify-center border-r border-border w-12 bg-card py-4">
          <button
            onClick={() => setIsChatListCollapsed(!isChatListCollapsed)}
            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-primary group"
            aria-label={isChatListCollapsed ? "Expand chat list" : "Collapse chat list"}
            title={isChatListCollapsed ? "Expand" : "Collapse"}
          >
            {isChatListCollapsed ? (
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            ) : (
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            )}
          </button>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedChat ? (
            <ChatThreadPanel onClose={() => setChatOpen(false)} onBackMobile={() => setIsSmallScreen(false)} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-br from-card to-background">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-muted/30 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-muted-foreground opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">Select a chat to begin</p>
                  <p className="text-sm">Choose from your conversations to start messaging</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
