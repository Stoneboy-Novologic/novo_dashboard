"use client"

import { X, Send, Paperclip, Smile, Plus, MoreVertical } from "lucide-react"
import { useState } from "react"

interface Message {
  id: number
  user: string
  text: string
  time: string
  avatar: string
  isOwn: boolean
  attachment?: {
    type: "file" | "image"
    name: string
  }
}

interface ChatPanelProps {
  onClose: () => void
}

export function ChatPanel({ onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      user: "Sarah Johnson",
      text: "Concrete pour scheduled for tomorrow at 8 AM",
      time: "2:15 PM",
      avatar: "SJ",
      isOwn: false,
    },
    {
      id: 2,
      user: "You",
      text: "Confirmed. Weather looks good.",
      time: "2:16 PM",
      avatar: "JD",
      isOwn: true,
    },
    {
      id: 3,
      user: "Mike Chen",
      text: "I'll have the team ready by 7:45 AM",
      time: "2:18 PM",
      avatar: "MC",
      isOwn: false,
    },
    {
      id: 4,
      user: "Sarah Johnson",
      text: "Thanks! I just uploaded the updated site plan.",
      time: "2:20 PM",
      avatar: "SJ",
      isOwn: false,
      attachment: {
        type: "file",
        name: "site-plan-v2.pdf",
      },
    },
  ])
  const [input, setInput] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleSendMessage = () => {
    if (input.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        user: "You",
        text: input,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        avatar: "JD",
        isOwn: true,
      }
      setMessages([...messages, newMessage])
      setInput("")
    }
  }

  const onlineUsers = ["Sarah Johnson", "Mike Chen"]

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col hidden lg:flex shadow-xl">
      {/* Header with Actions */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-card to-card">
        <div>
          <h3 className="font-bold text-foreground font-heading">Team Chat</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Downtown Tower Phase 2</p>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" aria-label="Add channel">
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" aria-label="More options">
            <MoreVertical className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-background">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.isOwn ? "flex-row-reverse" : ""}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 relative ${
                msg.isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {msg.avatar}
              {onlineUsers.includes(msg.user) && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-accent rounded-full border border-card" />
              )}
            </div>
            <div className={`flex-1 ${msg.isOwn ? "items-end" : ""}`}>
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-semibold text-foreground">{msg.user}</span>
                <span className="text-xs text-muted-foreground">{msg.time}</span>
              </div>
              <div
                className={`mt-1 px-3 py-2 rounded-lg max-w-xs ${
                  msg.isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm break-words">{msg.text}</p>
              </div>
              {msg.attachment && (
                <div className="mt-2 px-3 py-2 bg-muted rounded-lg border border-border flex items-center gap-2 max-w-xs">
                  <Paperclip className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-foreground truncate">{msg.attachment.name}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border space-y-3 bg-card">
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
            {["👍", "❤️", "😂", "🎉", "🚀"].map((emoji) => (
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
  )
}
