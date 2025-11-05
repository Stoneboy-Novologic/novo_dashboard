"use client"

import type { Document } from "../pages/document-viewer"
import { Maximize2, ZoomIn, ZoomOut } from "lucide-react"
import { useState } from "react"

interface DocumentPreviewProps {
  document: Document
  markupMode: boolean
}

export function DocumentPreview({ document, markupMode }: DocumentPreviewProps) {
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <div
      className={`bg-card border border-border rounded-lg overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""
      }`}
    >
      {/* Preview Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Zoom: {zoom}%</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={() => setZoom(100)} className="px-2 py-1 text-xs hover:bg-muted rounded transition-colors">
            100%
          </button>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="h-4 border-l border-border mx-2" />
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        className={`overflow-auto ${isFullscreen ? "h-screen" : "h-96"} bg-neutral-900 flex items-center justify-center`}
      >
        <div
          className={`bg-white transition-transform duration-200 ${markupMode ? "cursor-crosshair" : "cursor-default"}`}
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}
        >
          <div className="w-[600px] h-[800px] bg-white p-12 border-4 border-gray-200 relative">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
                <div className="h-4 bg-gray-100 rounded w-4/5" />
              </div>
              <div className="pt-6 space-y-2">
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 rounded" />
              </div>
            </div>

            {markupMode && (
              <>
                <div className="absolute top-20 left-20 w-32 h-32 border-2 border-primary/50 rounded opacity-60 hover:opacity-100 transition-opacity" />
                <div className="absolute top-40 right-16 text-primary text-sm font-bold bg-yellow-200/50 px-2 py-1">
                  Review
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
