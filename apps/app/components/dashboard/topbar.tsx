"use client"

import { Menu, Bell, Search, User, LogOut, MessageSquare } from "lucide-react"
import { useState } from "react"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useChat } from "@/lib/chat-context"

interface TopbarProps {
  onToggleSidebar: () => void
  onToggleChat: () => void
}

export function Topbar({ onToggleSidebar, onToggleChat }: TopbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSearchHint, setShowSearchHint] = useState(false)
  const { setChatOpen } = useChat()

  useKeyboardShortcuts({
    onSearchOpen: () => setShowSearchHint(true),
    onChatOpen: () => {
      setChatOpen(true)
      onToggleChat()
    },
  })

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card backdrop-blur-md bg-opacity-95">
      <div className="flex items-center justify-between px-6 py-4 h-16 gap-4">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-foreground font-heading">Dashboard</h2>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Search - Hidden on mobile */}
          <div
            className="hidden md:flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border border-border focus-within:border-primary transition-colors group cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label="Search projects and tasks (press / to focus)"
            onClick={() => setShowSearchHint(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setShowSearchHint(true)
            }}
          >
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects, tasks..."
              className="bg-transparent text-sm outline-none w-48 text-foreground placeholder:text-muted-foreground"
              aria-label="Search"
            />
            <kbd className="hidden sm:inline text-xs text-muted-foreground ml-auto px-2 py-1 rounded bg-card border border-border">
              /
            </kbd>
          </div>

          {/* Chat Toggle */}
          <button
            onClick={onToggleChat}
            className="p-2 hover:bg-muted rounded-lg transition-colors hover:text-primary"
            aria-label="Toggle chat"
            title="Open chat (press g then c)"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button
            className="relative p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Notifications"
            aria-describedby="notification-count"
          >
            <Bell className="w-5 h-5" />
            <span
              className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"
              id="notification-count"
              aria-live="polite"
            />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 pl-3 pr-2 py-2 rounded-lg hover:bg-muted transition-colors border border-border"
              aria-label="User menu"
              aria-expanded={showUserMenu}
              aria-haspopup="menu"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-primary-foreground" aria-hidden="true" />
              </div>
              <span className="hidden sm:inline text-sm font-medium text-foreground">John Doe</span>
            </button>

            {showUserMenu && (
              <div
                className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50"
                role="menu"
              >
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">John Doe</p>
                  <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                </div>
                <div className="py-2">
                  <button
                    className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                    role="menuitem"
                  >
                    Profile Settings
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                    role="menuitem"
                  >
                    Preferences
                  </button>
                  <hr className="border-border my-2" />
                  <button
                    className="w-full px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors text-left flex items-center gap-2"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
