"use client"

import { PenTool, Eraser, Square, Circle, Type, Trash2, Undo2 } from "lucide-react"
import { useState } from "react"

export function MarkupToolbar() {
  const [activeTool, setActiveTool] = useState<string>("pen")
  const [color, setColor] = useState("#ef4444")

  const tools = [
    { id: "pen", icon: PenTool, label: "Pen" },
    { id: "square", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "text", icon: Type, label: "Text" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
  ]

  const colors = ["#ef4444", "#f97316", "#fbbf24", "#4ade80", "#06b6d4", "#3b82f6", "#8b5cf6", "#000000"]

  return (
    <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4 overflow-x-auto">
      <div className="flex items-center gap-2 border-r border-border pr-4">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`p-2 rounded-lg transition-colors ${
                activeTool === tool.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
              title={tool.label}
            >
              <Icon className="w-5 h-5" />
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-2 border-r border-border pr-4">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
              color === c ? "border-foreground" : "border-transparent"
            }`}
            style={{ backgroundColor: c }}
            title={c}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Undo">
          <Undo2 className="w-5 h-5 text-muted-foreground hover:text-foreground" />
        </button>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Clear all">
          <Trash2 className="w-5 h-5 text-muted-foreground hover:text-foreground" />
        </button>
      </div>
    </div>
  )
}
