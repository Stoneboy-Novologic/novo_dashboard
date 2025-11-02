"use client"

import { useState } from "react"
import { FileText, Plus, MoreVertical, Download, Share2 } from "lucide-react"
import { DocumentPreview } from "../components/document-preview"
import { MarkupToolbar } from "../components/markup-toolbar"

export interface Document {
  id: string
  name: string
  type: "pdf" | "image" | "drawing"
  size: string
  uploadedBy: string
  uploadedDate: string
  lastModified: string
  tags: string[]
  isStarred: boolean
  annotations?: number
}

export function DocumentViewer() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Structural Plans - Phase 2",
      type: "pdf",
      size: "4.2 MB",
      uploadedBy: "John Doe",
      uploadedDate: "Dec 1, 2024",
      lastModified: "Dec 5, 2024",
      tags: ["Structural", "Phase 2", "Approved"],
      isStarred: true,
      annotations: 5,
    },
    {
      id: "2",
      name: "Site Survey - Downtown Tower",
      type: "image",
      size: "2.8 MB",
      uploadedBy: "Sarah Johnson",
      uploadedDate: "Nov 28, 2024",
      lastModified: "Dec 2, 2024",
      tags: ["Survey", "Site Plan"],
      isStarred: false,
      annotations: 3,
    },
    {
      id: "3",
      name: "Foundation Details",
      type: "drawing",
      size: "1.5 MB",
      uploadedBy: "Mike Chen",
      uploadedDate: "Nov 25, 2024",
      lastModified: "Dec 4, 2024",
      tags: ["Foundation", "Technical"],
      isStarred: true,
      annotations: 8,
    },
    {
      id: "4",
      name: "Safety Procedures Document",
      type: "pdf",
      size: "3.1 MB",
      uploadedBy: "Emma Davis",
      uploadedDate: "Nov 20, 2024",
      lastModified: "Dec 1, 2024",
      tags: ["Safety", "Procedures"],
      isStarred: false,
      annotations: 2,
    },
  ])

  const [selectedDoc, setSelectedDoc] = useState<Document | null>(documents[0])
  const [markupMode, setMarkupMode] = useState(false)
  const [showAnnotations, setShowAnnotations] = useState(true)

  const toggleStarred = (docId: string) => {
    setDocuments(documents.map((doc) => (doc.id === docId ? { ...doc, isStarred: !doc.isStarred } : doc)))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground font-heading mb-2">Documents & Markup</h1>
        <p className="text-muted-foreground">View, annotate, and manage project documents</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Documents List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground font-heading">Documents</h2>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Plus className="w-4 h-4 text-primary" />
            </button>
          </div>

          <div className="space-y-2 bg-muted/30 rounded-lg border border-border p-2">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  selectedDoc?.id === doc.id
                    ? "bg-primary/10 border border-primary/50"
                    : "hover:bg-muted border border-transparent"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText
                      className={`w-4 h-4 flex-shrink-0 ${
                        selectedDoc?.id === doc.id ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <h4 className="font-medium text-sm text-foreground truncate">{doc.name}</h4>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleStarred(doc.id)
                    }}
                    className="flex-shrink-0 text-muted-foreground hover:text-secondary transition-colors"
                  >
                    {doc.isStarred ? "⭐" : "☆"}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">{doc.size}</p>
                {doc.annotations && <p className="text-xs text-primary mt-1">{doc.annotations} annotations</p>}
              </button>
            ))}
          </div>
        </div>

        {/* Document Viewer */}
        <div className="lg:col-span-3 space-y-4">
          {selectedDoc ? (
            <>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground font-heading">{selectedDoc.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedDoc.type.toUpperCase()} • {selectedDoc.size}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMarkupMode(!markupMode)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        markupMode ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      {markupMode ? "Exit Markup" : "Markup"}
                    </button>
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <Download className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                    </button>
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <Share2 className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                    </button>
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedDoc.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {markupMode && <MarkupToolbar />}

              {/* Document Preview */}
              <DocumentPreview document={selectedDoc} markupMode={markupMode} />

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-semibold">Uploaded By</p>
                    <p className="text-sm text-foreground">{selectedDoc.uploadedBy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-semibold">Uploaded Date</p>
                    <p className="text-sm text-foreground">{selectedDoc.uploadedDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-semibold">Last Modified</p>
                    <p className="text-sm text-foreground">{selectedDoc.lastModified}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-semibold">Annotations</p>
                    <p className="text-sm text-primary">{selectedDoc.annotations || 0} total</p>
                  </div>
                </div>

                {/* Annotations Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-foreground text-sm font-heading">Recent Annotations</h4>
                    <button
                      onClick={() => setShowAnnotations(!showAnnotations)}
                      className="text-xs px-2 py-1 hover:bg-muted rounded transition-colors"
                    >
                      {showAnnotations ? "Hide" : "Show"}
                    </button>
                  </div>

                  {showAnnotations && (
                    <div className="space-y-3">
                      {[
                        {
                          author: "Sarah Johnson",
                          text: "Please review foundation depth",
                          color: "primary",
                          time: "2 hours ago",
                        },
                        {
                          author: "Mike Chen",
                          text: "Structural calculations approved",
                          color: "accent",
                          time: "1 day ago",
                        },
                        {
                          author: "You",
                          text: "Need clarification on rebar placement",
                          color: "secondary",
                          time: "2 days ago",
                        },
                      ].map((annotation, idx) => (
                        <div key={idx} className="p-3 bg-muted/30 rounded-lg border border-border">
                          <div className="flex items-start justify-between mb-1">
                            <p className="text-sm font-medium text-foreground">{annotation.author}</p>
                            <span className="text-xs text-muted-foreground">{annotation.time}</span>
                          </div>
                          <p className="text-sm text-foreground">{annotation.text}</p>
                          <div
                            className={`inline-flex mt-2 px-2 py-1 rounded text-xs font-medium ${
                              annotation.color === "primary"
                                ? "bg-primary/10 text-primary"
                                : annotation.color === "accent"
                                  ? "bg-accent/10 text-accent"
                                  : "bg-secondary/10 text-secondary"
                            }`}
                          >
                            {annotation.color.charAt(0).toUpperCase() + annotation.color.slice(1)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Select a document to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
