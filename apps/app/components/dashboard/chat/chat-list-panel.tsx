"use client"

import type React from "react"

import { Search, Plus, MoreVertical, Pin, PinOff, Phone, Video, Bell } from "lucide-react"
import { useState } from "react"
import { useChat } from "@/lib/chat-context"

interface ChatListPanelProps {
  onChatSelect?: () => void
}

export function ChatListPanel({ onChatSelect }: ChatListPanelProps) {
  const { chats, selectChat, togglePinChat, selectedChat } = useChat()
  const [searchQuery, setSearchQuery] = useState("")
  const [showMenu, setShowMenu] = useState<string | null>(null)

  const pinnedChats = chats.filter((c) => c.isPinned)
  const unpinnedChats = chats.filter((c) => !c.isPinned)
  const filteredChats = [...pinnedChats, ...unpinnedChats]

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      action()
    }
  }

  return (
    <div className="w-80 border-r border-border bg-card flex flex-col shadow-md">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground font-heading">Messages</h2>
          <button
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Start new chat"
            title="Start new chat"
          >
            <Plus className="w-5 h-5 text-primary" aria-hidden="true" />
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg border border-border focus-within:border-primary transition-colors">
          <Search className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1 text-foreground placeholder:text-muted-foreground"
            aria-label="Search chats"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2" role="tablist">
          {["All", "Teams", "Contractors", "Site"].map((filter) => (
            <button
              key={filter}
              className="px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap bg-muted text-foreground hover:bg-primary/20 hover:text-primary transition-colors"
              role="tab"
              aria-selected={filter === "All"}
              aria-label={`Filter by ${filter}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto space-y-1 p-2" role="list">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <MessageSquare className="w-12 h-12 text-muted-foreground mb-2 opacity-50" aria-hidden="true" />
            <p className="text-muted-foreground text-sm">No chats yet</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div key={chat.id} className="relative group" role="listitem">
              <button
                onClick={() => {
                  selectChat(chat)
                  onChatSelect?.()
                }}
                onKeyDown={(e) =>
                  handleKeyDown(e, () => {
                    selectChat(chat)
                    onChatSelect?.()
                  })
                }
                className={`w-full px-3 py-3 rounded-lg text-left transition-all hover:bg-muted group focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  selectedChat?.id === chat.id ? "bg-primary/10 border border-primary/30" : ""
                }`}
                aria-label={`${chat.name}${chat.unreadCount > 0 ? `, ${chat.unreadCount} unread` : ""}`}
                aria-current={selectedChat?.id === chat.id ? "true" : "false"}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar + Status */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${
                        chat.type === "direct" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      }`}
                      aria-hidden="true"
                    >
                      {chat.name.substring(0, 2).toUpperCase()}
                    </div>
                    {chat.isOnline && (
                      <span
                        className="absolute bottom-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-card"
                        aria-label="Online"
                      />
                    )}
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-semibold text-foreground truncate text-sm">{chat.name}</h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {chat.lastMessageTime
                          ? new Date(chat.lastMessageTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                    {chat.tags.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {chat.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded"
                            aria-label={tag}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Unread Badge */}
                  {chat.unreadCount > 0 && (
                    <div
                      className="w-5 h-5 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      aria-label={`${chat.unreadCount} unread`}
                    >
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              </button>

              {/* Hover Menu */}
              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePinChat(chat.id)
                  }}
                  className="p-1.5 bg-card border border-border rounded hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label={chat.isPinned ? "Unpin chat" : "Pin chat"}
                  title={chat.isPinned ? "Unpin" : "Pin"}
                >
                  {chat.isPinned ? (
                    <PinOff className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  ) : (
                    <Pin className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(showMenu === chat.id ? null : chat.id)
                  }}
                  className="p-1.5 bg-card border border-border rounded hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label="More options"
                  aria-expanded={showMenu === chat.id}
                  aria-haspopup="menu"
                >
                  <MoreVertical className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                </button>
              </div>

              {/* Dropdown Menu */}
              {showMenu === chat.id && (
                <div
                  className="absolute right-0 top-12 w-40 bg-card border border-border rounded-lg shadow-lg z-50"
                  role="menu"
                >
                  <button
                    className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left flex items-center gap-2 focus:outline-none focus:bg-muted"
                    role="menuitem"
                  >
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    Call
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left flex items-center gap-2 focus:outline-none focus:bg-muted"
                    role="menuitem"
                  >
                    <Video className="w-4 h-4" aria-hidden="true" />
                    Video Call
                  </button>
                  <hr className="border-border my-2" />
                  <button
                    className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left flex items-center gap-2 focus:outline-none focus:bg-muted"
                    role="menuitem"
                  >
                    <Bell className="w-4 h-4" aria-hidden="true" />
                    Mute
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors text-left focus:outline-none focus:bg-muted"
                    role="menuitem"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

import { MessageSquare } from "lucide-react"
