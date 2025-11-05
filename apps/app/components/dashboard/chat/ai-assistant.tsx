"use client"

import { Sparkles, Copy, ChevronDown } from "lucide-react"
import { useState } from "react"

interface AISummary {
  id: string
  summary: string
  actionItems: string[]
  generatedAt: Date
}

interface AIAssistantProps {
  chatId: string
  messageCount: number
}

export function AIAssistant({ chatId, messageCount }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [summary, setSummary] = useState<AISummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSummarize = async () => {
    setIsLoading(true)
    // Simulate AI call
    setTimeout(() => {
      setSummary({
        id: Date.now().toString(),
        summary:
          "Team discussed concrete pour scheduled for tomorrow at 8 AM with weather conditions confirmed as favorable. Site manager will have crew ready by 7:45 AM. Updated site plan has been uploaded for review.",
        actionItems: [
          "Confirm concrete delivery time with supplier",
          "Brief crew on updated safety protocols",
          "Verify equipment readiness by 7:30 AM",
        ],
        generatedAt: new Date(),
      })
      setIsLoading(false)
    }, 1500)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
          <h3 className="font-semibold text-foreground text-sm">AI Assistant</h3>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-muted rounded transition-colors"
          aria-expanded={isOpen}
          aria-label="Toggle AI assistant"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {isOpen && (
        <div className="space-y-3">
          {/* Summarize Button */}
          {!summary && (
            <button
              onClick={handleSummarize}
              disabled={isLoading || messageCount === 0}
              className="w-full px-3 py-2 bg-primary/10 text-primary border border-primary/30 rounded-lg text-sm font-medium hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Summarize chat conversation"
            >
              {isLoading ? "Summarizing..." : "Summarize Conversation"}
            </button>
          )}

          {/* Summary Display */}
          {summary && (
            <div className="space-y-3 bg-muted/50 border border-border rounded-lg p-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Summary</p>
                <p className="text-sm text-foreground leading-relaxed">{summary.summary}</p>
                <button
                  onClick={() => copyToClipboard(summary.summary)}
                  className="mt-2 p-1 text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                  title="Copy summary"
                >
                  <Copy className="w-3 h-3" aria-hidden="true" />
                  <span className="text-xs">Copy</span>
                </button>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Action Items
                </p>
                <ul className="space-y-1">
                  {summary.actionItems.map((item, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-foreground">
                      <span className="text-primary font-bold flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-border">
                <button
                  onClick={() => setSummary(null)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Generate New Summary
                </button>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Actions</p>
            <div className="flex flex-col gap-2">
              <button className="px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors text-left">
                Create RFI from Message
              </button>
              <button className="px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors text-left">
                Create Task from Message
              </button>
              <button className="px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors text-left">
                Extract Document Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
