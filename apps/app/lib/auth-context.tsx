"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "supervisor" | "contractor"
  avatar?: string
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, role: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string) => {
    // Mock authentication - replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 800))
    setUser({
      id: "1",
      name: "John Contractor",
      email,
      role: "manager",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    })
  }

  const signup = async (name: string, email: string, password: string, role: string) => {
    // Mock signup - replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 800))
    setUser({
      id: "2",
      name,
      email,
      role: role as any,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    })
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
