"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
      router.push("/select-project")
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Blueprint grid background */}
      <div className="absolute inset-0 blueprint-grid opacity-5"></div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
          {/* Header with brand */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg font-heading">NV</span>
              </div>
              <h1 className="text-white text-2xl font-bold font-heading">NvLogic</h1>
            </div>
            <p className="text-blue-100 text-sm">Construction Project Manager</p>
          </div>

          {/* Form content */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Welcome Back</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">Sign in to your account</p>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="john@constructionco.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-2">Demo Credentials:</p>
              <p className="text-xs text-blue-700 dark:text-blue-400">Email: demo@construction.com</p>
              <p className="text-xs text-blue-700 dark:text-blue-400">Password: demo123</p>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700 text-center">
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Features highlight */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-white">
          <div className="text-center">
            <div className="text-2xl mb-2">📍</div>
            <p className="text-sm">Site Mapping</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">💼</div>
            <p className="text-sm">Budget Tracking</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm">Real-time Reports</p>
          </div>
        </div>
      </div>
    </div>
  )
}
