"use client"

import { MessageCircle } from "lucide-react"

interface ThreadMessage {
  id: string
  author: string
  avatar: string
  timestamp: string
  content: string
  reactions?: { emoji: string; count: number }[]
}

interface MessageThreadProps {
  threadId: string
  title: string
  messages: ThreadMessage[]
}

export function MessageThread({ threadId, title, messages }: MessageThreadProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start gap-3 mb-6">
        <MessageCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-bold text-foreground font-heading">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{messages.length} messages</p>
        </div>
      </div>

      <div className="space-y-4">
        {messages.map((msg, idx) => (
          <div key={msg.id} className="pb-4 border-b border-border last:border-0">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                {msg.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-foreground">{msg.author}</span>
                  <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                </div>
                <p className="text-sm text-foreground mt-1">{msg.content}</p>
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {msg.reactions.map((reaction) => (
                      <div
                        key={reaction.emoji}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs hover:bg-muted/80 transition-colors cursor-pointer"
                      >
                        <span>{reaction.emoji}</span>
                        <span className="text-muted-foreground">{reaction.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
