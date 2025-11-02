"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface ChatMessage {
  id: string
  chatId: string
  sender: string
  senderId: string
  text: string
  timestamp: Date
  isRead: boolean
  attachment?: {
    type: "image" | "file" | "pdf" | "dwg" | "photo"
    name: string
    url: string
  }
  reactions: Record<string, string[]>
  replyTo?: string
}

interface Chat {
  id: string
  name: string
  avatar?: string
  type: "direct" | "group" | "channel"
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
  participants: string[]
  isPinned: boolean
  tags: string[]
  isOnline: boolean
  lastSeen?: Date
}

interface ChatContextType {
  chats: Chat[]
  selectedChat: Chat | null
  messages: ChatMessage[]
  setChatOpen: (open: boolean) => void
  isChatOpen: boolean
  selectChat: (chat: Chat) => void
  sendMessage: (chatId: string, text: string) => void
  togglePinChat: (chatId: string) => void
  markAsRead: (chatId: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setChatOpen] = useState(false)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      chatId: "chat-1",
      sender: "Sarah Johnson",
      senderId: "user-2",
      text: "Concrete pour scheduled for tomorrow at 8 AM. Weather forecast looks clear.",
      timestamp: new Date(Date.now() - 3600000),
      isRead: true,
      reactions: {},
    },
    {
      id: "2",
      chatId: "chat-1",
      sender: "Mike Chen",
      senderId: "user-3",
      text: "I'll have the formwork team ready. Equipment check done ✓",
      timestamp: new Date(Date.now() - 3300000),
      isRead: true,
      reactions: { "👍": ["user-2", "user-1"] },
    },
    {
      id: "3",
      chatId: "chat-1",
      sender: "You",
      senderId: "user-1",
      text: "Perfect! Confirmed with the concrete supplier. Trucks arrive at 7:45 AM",
      timestamp: new Date(Date.now() - 3000000),
      isRead: true,
      attachment: {
        type: "image",
        name: "site-plan.png",
        url: "/placeholder.svg?height=200&width=300",
      },
      reactions: { "🚀": ["user-3"] },
    },
    {
      id: "4",
      chatId: "chat-1",
      sender: "Sarah Johnson",
      senderId: "user-2",
      text: "Looks great! I'll notify the crew. Safety briefing scheduled for 7:30 AM",
      timestamp: new Date(Date.now() - 2700000),
      isRead: true,
      reactions: { "✅": ["user-1"] },
    },
    {
      id: "5",
      chatId: "chat-2",
      sender: "Marcus Rodriguez",
      senderId: "user-4",
      text: "Hi, I have the electrical drawings for the north wing. Should I send them over?",
      timestamp: new Date(Date.now() - 7200000),
      isRead: false,
      reactions: {},
    },
    {
      id: "6",
      chatId: "chat-2",
      sender: "You",
      senderId: "user-1",
      text: "Yes please! Review meeting is tomorrow at 2 PM",
      timestamp: new Date(Date.now() - 6900000),
      isRead: true,
      reactions: { "👍": ["user-4"] },
    },
    {
      id: "7",
      chatId: "chat-3",
      sender: "Project Updates Bot",
      senderId: "user-bot",
      text: "Daily Safety Report: 0 incidents. All zones inspected. 10 crew members on-site.",
      timestamp: new Date(Date.now() - 14400000),
      isRead: false,
      reactions: {},
    },
    {
      id: "8",
      chatId: "chat-4",
      sender: "James Wilson",
      senderId: "user-5",
      text: "Can we discuss the budget overrun for the structural modifications?",
      timestamp: new Date(Date.now() - 10800000),
      isRead: false,
      attachment: {
        type: "pdf",
        name: "budget-report-q4.pdf",
        url: "#",
      },
      reactions: {},
    },
    {
      id: "9",
      chatId: "chat-5",
      sender: "Site Safety Team",
      senderId: "user-6",
      text: "Reminder: OSHA compliance training completed by all staff. Certificates uploaded.",
      timestamp: new Date(Date.now() - 18000000),
      isRead: true,
      reactions: { "✅": ["user-1", "user-2"] },
    },
    {
      id: "10",
      chatId: "chat-6",
      sender: "Contractor Liaison",
      senderId: "user-7",
      text: "Weekly update: Framing 85% complete, mechanical rough-in ready to start",
      timestamp: new Date(Date.now() - 21600000),
      isRead: false,
      attachment: {
        type: "photo",
        name: "site-photo-week-12.jpg",
        url: "/placeholder.svg?height=250&width=350",
      },
      reactions: { "📸": ["user-1"] },
    },
  ])

  const [chats, setChats] = useState<Chat[]>([
    // Pinned Group Chats
    {
      id: "chat-1",
      name: "Downtown Tower - Site Coordination",
      type: "group",
      lastMessage: "Safety briefing scheduled for 7:30 AM",
      lastMessageTime: new Date(Date.now() - 2700000),
      unreadCount: 0,
      participants: ["Sarah Johnson", "Mike Chen", "You"],
      isPinned: true,
      tags: ["project", "urgent", "construction"],
      isOnline: true,
    },
    {
      id: "chat-5",
      name: "Safety & Compliance Task Force",
      type: "group",
      lastMessage: "Certificates uploaded.",
      lastMessageTime: new Date(Date.now() - 18000000),
      unreadCount: 0,
      participants: ["Site Safety Team", "You", "Project Manager"],
      isPinned: true,
      tags: ["safety", "compliance"],
      isOnline: true,
    },
    // Direct Chats - Contractors/Team
    {
      id: "chat-2",
      name: "Marcus Rodriguez",
      type: "direct",
      lastMessage: "Review meeting is tomorrow at 2 PM",
      lastMessageTime: new Date(Date.now() - 6900000),
      unreadCount: 1,
      participants: ["Marcus Rodriguez"],
      isPinned: false,
      tags: ["contractor", "electrical"],
      isOnline: true,
      lastSeen: new Date(Date.now() - 1800000),
    },
    {
      id: "chat-4",
      name: "James Wilson",
      type: "direct",
      lastMessage: "Can we discuss the budget overrun?",
      lastMessageTime: new Date(Date.now() - 10800000),
      unreadCount: 1,
      participants: ["James Wilson"],
      isPinned: false,
      tags: ["finance", "management"],
      isOnline: false,
      lastSeen: new Date(Date.now() - 7200000),
    },
    {
      id: "chat-6",
      name: "Contractor Liaison Team",
      type: "group",
      lastMessage: "Framing 85% complete, mechanical rough-in ready",
      lastMessageTime: new Date(Date.now() - 21600000),
      unreadCount: 1,
      participants: ["Contractor Liaison", "You", "Site Supervisor"],
      isPinned: false,
      tags: ["contractor", "progress"],
      isOnline: true,
    },
    // Channels
    {
      id: "chat-3",
      name: "#project-updates",
      type: "channel",
      lastMessage: "Daily Safety Report: 0 incidents.",
      lastMessageTime: new Date(Date.now() - 14400000),
      unreadCount: 1,
      participants: [],
      isPinned: false,
      tags: ["safety", "updates"],
      isOnline: true,
    },
    {
      id: "chat-7",
      name: "#announcements",
      type: "channel",
      lastMessage: "New site entry procedures effective tomorrow",
      lastMessageTime: new Date(Date.now() - 86400000),
      unreadCount: 3,
      participants: [],
      isPinned: false,
      tags: ["announcements"],
      isOnline: true,
    },
    {
      id: "chat-8",
      name: "#resource-requests",
      type: "channel",
      lastMessage: "Need 5 additional scaffolding units for north side",
      lastMessageTime: new Date(Date.now() - 172800000),
      unreadCount: 0,
      participants: [],
      isPinned: false,
      tags: ["resources"],
      isOnline: false,
    },
    // Additional Direct Chats
    {
      id: "chat-9",
      name: "Sarah Johnson",
      type: "direct",
      lastMessage: "Thanks for the update",
      lastMessageTime: new Date(Date.now() - 259200000),
      unreadCount: 0,
      participants: ["Sarah Johnson"],
      isPinned: false,
      tags: ["site-supervisor"],
      isOnline: true,
      lastSeen: new Date(Date.now() - 600000),
    },
    {
      id: "chat-10",
      name: "Mike Chen",
      type: "direct",
      lastMessage: "Formwork complete, ready for inspection",
      lastMessageTime: new Date(Date.now() - 345600000),
      unreadCount: 0,
      participants: ["Mike Chen"],
      isPinned: false,
      tags: ["contractor", "formwork"],
      isOnline: false,
      lastSeen: new Date(Date.now() - 3600000),
    },
  ])

  const selectChat = (chat: Chat) => {
    setSelectedChat(chat)
    markAsRead(chat.id)
  }

  const sendMessage = (chatId: string, text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      chatId,
      sender: "You",
      senderId: "user-1",
      text,
      timestamp: new Date(),
      isRead: true,
      reactions: {},
    }
    setMessages([...messages, newMessage])

    setChats(
      chats.map((chat) => (chat.id === chatId ? { ...chat, lastMessage: text, lastMessageTime: new Date() } : chat)),
    )
  }

  const togglePinChat = (chatId: string) => {
    setChats(chats.map((chat) => (chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat)))
  }

  const markAsRead = (chatId: string) => {
    setChats(chats.map((chat) => (chat.id === chatId ? { ...chat, unreadCount: 0 } : chat)))
  }

  return (
    <ChatContext.Provider
      value={{
        chats,
        selectedChat,
        messages,
        isChatOpen,
        setChatOpen,
        selectChat,
        sendMessage,
        togglePinChat,
        markAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within ChatProvider")
  }
  return context
}
