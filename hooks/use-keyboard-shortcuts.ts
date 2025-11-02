"use client"

import { useEffect } from "react"

interface KeyboardShortcuts {
  onSearchOpen?: () => void
  onChatOpen?: () => void
  onProjectsOpen?: () => void
  onNewMessage?: () => void
}

export function useKeyboardShortcuts({ onSearchOpen, onChatOpen, onProjectsOpen, onNewMessage }: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger on keyboard, not when typing in input fields
      const isInputFocused = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement

      // / - Open search
      if (e.key === "/" && !isInputFocused) {
        e.preventDefault()
        onSearchOpen?.()
      }

      // g then c - Go to Chat
      if (e.key === "g") {
        // Store that 'g' was pressed, wait for next key
        const handleNextKey = (e2: KeyboardEvent) => {
          if (e2.key === "c") {
            e2.preventDefault()
            onChatOpen?.()
          } else if (e2.key === "p") {
            e2.preventDefault()
            onProjectsOpen?.()
          }
          document.removeEventListener("keydown", handleNextKey)
        }

        document.addEventListener("keydown", handleNextKey)
        setTimeout(() => {
          document.removeEventListener("keydown", handleNextKey)
        }, 1500)
      }

      // Ctrl/Cmd + Shift + M - New Message
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "m") {
        e.preventDefault()
        onNewMessage?.()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onSearchOpen, onChatOpen, onProjectsOpen, onNewMessage])
}
