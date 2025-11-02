"use client"

import { Shield, Archive, AlertTriangle, Plus } from "lucide-react"
import { useState } from "react"

interface GroupMember {
  id: string
  name: string
  role: "admin" | "member"
  joinedAt: Date
  isMuted?: boolean
}

interface ModerationPanelProps {
  chatId: string
  chatType: "direct" | "group" | "channel"
  participants: string[]
}

export function ModerationPanel({ chatId, chatType, participants }: ModerationPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [members, setMembers] = useState<GroupMember[]>([
    {
      id: "1",
      name: "You",
      role: "admin",
      joinedAt: new Date(Date.now() - 86400000 * 30),
    },
    {
      id: "2",
      name: "Sarah Johnson",
      role: "member",
      joinedAt: new Date(Date.now() - 86400000 * 20),
    },
    {
      id: "3",
      name: "Mike Chen",
      role: "member",
      joinedAt: new Date(Date.now() - 86400000 * 15),
    },
  ])
  const [showInviteModal, setShowInviteModal] = useState(false)

  const toggleMemberRole = (memberId: string) => {
    setMembers(
      members.map((m) =>
        m.id === memberId && m.id !== "1" ? { ...m, role: m.role === "admin" ? "member" : "admin" } : m,
      ),
    )
  }

  const removeMember = (memberId: string) => {
    if (memberId !== "1") {
      setMembers(members.filter((m) => m.id !== memberId))
    }
  }

  if (chatType === "direct") {
    return null
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
          <h3 className="font-semibold text-foreground text-sm">Group Settings</h3>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-muted rounded transition-colors"
          aria-expanded={isOpen}
          aria-label="Toggle group settings"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4">
          {/* Members */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Members ({members.length})
              </p>
              <button
                onClick={() => setShowInviteModal(true)}
                className="p-1 hover:bg-muted rounded transition-colors"
                aria-label="Invite member"
              >
                <Plus className="w-4 h-4 text-primary" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg group">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {member.name.substring(0, 1)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role === "admin" ? "Admin" : "Member"}</p>
                    </div>
                  </div>

                  {member.id !== "1" && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={() => toggleMemberRole(member.id)}
                        className="px-2 py-1 text-xs bg-muted rounded hover:bg-primary/20 transition-colors"
                        aria-label={`Make ${member.name} ${member.role === "admin" ? "member" : "admin"}`}
                      >
                        {member.role === "admin" ? "Demote" : "Promote"}
                      </button>
                      <button
                        onClick={() => removeMember(member.id)}
                        className="px-2 py-1 text-xs bg-destructive/10 text-destructive rounded hover:bg-destructive/20 transition-colors"
                        aria-label={`Remove ${member.name}`}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="border-t border-border pt-3 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Privacy</p>
            <label className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer group">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-border accent-primary"
                aria-label="Allow members to invite others"
              />
              <span className="text-sm text-foreground">Members can invite others</span>
            </label>
            <label className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-border accent-primary"
                aria-label="Message history visible to new members"
              />
              <span className="text-sm text-foreground">Show message history to new members</span>
            </label>
          </div>

          {/* Group Actions */}
          <div className="border-t border-border pt-3 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</p>
            <button className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors text-left flex items-center gap-2">
              <Archive className="w-4 h-4" aria-hidden="true" />
              Archive Chat
            </button>
            <button className="w-full px-3 py-2 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive hover:bg-destructive/20 transition-colors text-left flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
              Report Group
            </button>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card border border-border rounded-lg p-6 w-96 shadow-lg space-y-4">
            <h2 className="text-lg font-bold text-foreground">Invite Members</h2>

            <div className="space-y-2">
              <label htmlFor="invite-email" className="text-sm font-medium text-foreground">
                Email or Name
              </label>
              <input
                id="invite-email"
                type="text"
                placeholder="Enter email or select from contacts..."
                className="w-full px-3 py-2 bg-muted rounded-lg border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                aria-label="Invite email or name"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2 bg-muted rounded-lg text-foreground hover:bg-muted/80 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-primary rounded-lg text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { ChevronDown } from "lucide-react"
