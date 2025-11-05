"use client"

import {
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  ChevronLeft,
  CheckCheck,
  Reply,
  Edit2,
  Trash2,
  FileText,
  ImageIcon,
} from "lucide-react"
import { useState } from "react"
import { useChat } from "@/lib/chat-context"
import { AIAssistant } from "./ai-assistant"
import { ModerationPanel } from "./moderation-panel"

interface ChatThreadPanelProps {
  onClose: () => void
  onBackMobile: () => void
}

export function ChatThreadPanel({ onClose, onBackMobile }: ChatThreadPanelProps) {
  const { selectedChat, messages, sendMessage } = useChat()
  const [input, setInput] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null)
  const [showMessageMenu, setShowMessageMenu] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)

  if (!selectedChat) {
    return null
  }

  const handleSendMessage = () => {
    if (input.trim()) {
      sendMessage(selectedChat.id, input)
      setInput("")
    }
  }

  const chatMessages = messages.filter((m) => m.chatId === selectedChat.id)

  const getAttachmentIcon = (type?: string) => {
    switch (type) {
      case "pdf":
      case "dwg":
        return <FileText className="w-4 h-4" />
      case "image":
      case "photo":
        return <ImageIcon className="w-4 h-4" />
      default:
        return <Paperclip className="w-4 h-4" />
    }
  }

  return (
    <div className="flex-1 border-l border-border bg-card flex flex-col hidden lg:flex shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-card flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
              selectedChat.type === "direct" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
            }`}
          >
            {selectedChat.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-foreground truncate">{selectedChat.name}</h3>
            <p className="text-xs text-muted-foreground">
              {selectedChat.type === "direct"
                ? selectedChat.isOnline
                  ? "Online"
                  : `Last seen ${new Date(selectedChat.lastSeen || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                : `${selectedChat.participants.length} members`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-primary"
            aria-label="Start voice call"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-primary"
            aria-label="Start video call"
          >
            <Video className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle chat sidebar"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors lg:hidden"
            aria-label="Close chat"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-background">
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageSquare className="w-16 h-16 text-muted-foreground mb-4 opacity-30" />
                <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 group ${msg.senderId === "user-1" ? "flex-row-reverse" : ""}`}
                  onMouseEnter={() => setHoveredMessageId(msg.id)}
                  onMouseLeave={() => setHoveredMessageId(null)}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      msg.senderId === "user-1"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {msg.sender.substring(0, 2).toUpperCase()}
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 max-w-xs ${msg.senderId === "user-1" ? "items-end" : ""}`}>
                    <div className="flex items-baseline gap-2 px-1">
                      {msg.senderId !== "user-1" && (
                        <span className="text-xs font-semibold text-foreground">{msg.sender}</span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`mt-1 px-4 py-2 rounded-lg ${
                        msg.senderId === "user-1" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm break-words">{msg.text}</p>
                    </div>

                    {/* Attachment */}
                    {msg.attachment && (
                      <div className="mt-2 px-3 py-2 bg-muted rounded-lg border border-border flex items-center gap-2 max-w-xs">
                        <Paperclip className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-foreground truncate">{msg.attachment.name}</span>
                      </div>
                    )}

                    {/* Reactions */}
                    {Object.keys(msg.reactions).length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {Object.entries(msg.reactions).map(([emoji, users]) => (
                          <button
                            key={emoji}
                            className="px-2 py-1 bg-muted rounded text-xs hover:bg-primary/20 transition-colors"
                            title={users.join(", ")}
                          >
                            {emoji} {users.length}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Hover Actions */}
                    {hoveredMessageId === msg.id && (
                      <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-1.5 bg-muted rounded hover:bg-primary/20 transition-colors"
                          title="Add reaction"
                        >
                          <Smile className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 bg-muted rounded hover:bg-primary/20 transition-colors" title="Reply">
                          <Reply className="w-4 h-4 text-muted-foreground" />
                        </button>
                        {msg.senderId === "user-1" && (
                          <>
                            <button
                              className="p-1.5 bg-muted rounded hover:bg-primary/20 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button
                              className="p-1.5 bg-muted rounded hover:bg-destructive/20 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Read Receipt */}
                  {msg.senderId === "user-1" && msg.isRead && (
                    <div className="pt-1">
                      <CheckCheck className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border space-y-3 bg-card flex-shrink-0">
            <div className="flex gap-2 items-end">
              <button
                className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className="w-full bg-muted px-3 py-2 rounded-lg text-sm outline-none text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>

              <button
                className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Add emoji"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="w-4 h-4" />
              </button>

              <button
                onClick={handleSendMessage}
                disabled={!input.trim()}
                className="p-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-primary-foreground transition-all"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {showEmojiPicker && (
              <div className="flex gap-2 pb-2 border-t border-border pt-2">
                {["👍", "❤️", "😂", "🎉", "🚀", "👏"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setInput(input + " " + emoji)
                      setShowEmojiPicker(false)
                    }}
                    className="text-lg hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - AI & Moderation */}
        {showSidebar && (
          <div className="w-80 border-l border-border bg-muted/30 overflow-y-auto space-y-4 p-4 flex-shrink-0">
            <AIAssistant chatId={selectedChat.id} messageCount={chatMessages.length} />
            <ModerationPanel
              chatId={selectedChat.id}
              chatType={selectedChat.type}
              participants={selectedChat.participants}
            />
          </div>
        )}
      </div>
    </div>
  )
}

import { MessageSquare } from "lucide-react"
