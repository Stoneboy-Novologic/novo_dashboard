"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Project {
  id: string
  name: string
  location: string
  progress: number
  status: "active" | "planning" | "completed" | "on-hold"
  value: string
  team: number
  image: string
}

const SAMPLE_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Downtown Office Complex",
    location: "Toronto, ON",
    progress: 65,
    status: "active",
    value: "$12.5M",
    team: 24,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop",
  },
  {
    id: "2",
    name: "Residential Tower",
    location: "Vancouver, BC",
    progress: 42,
    status: "active",
    value: "$18.3M",
    team: 31,
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&h=300&fit=crop",
  },
  {
    id: "3",
    name: "Shopping Mall Renovation",
    location: "Calgary, AB",
    progress: 28,
    status: "planning",
    value: "$8.7M",
    team: 18,
    image: "https://images.unsplash.com/photo-1581578731548-c64695b952952?w=500&h=300&fit=crop",
  },
  {
    id: "4",
    name: "Highway Infrastructure",
    location: "Montreal, QC",
    progress: 85,
    status: "active",
    value: "$25.1M",
    team: 42,
    image: "https://images.unsplash.com/photo-1503387762519-52582a831b83?w=500&h=300&fit=crop",
  },
  {
    id: "5",
    name: "Hospital Expansion",
    location: "Edmonton, AB",
    progress: 55,
    status: "active",
    value: "$14.9M",
    team: 28,
    image: "https://images.unsplash.com/photo-1576092160562-40f08a279491?w=500&h=300&fit=crop",
  },
  {
    id: "6",
    name: "University Campus",
    location: "Ottawa, ON",
    progress: 100,
    status: "completed",
    value: "$22.4M",
    team: 35,
    image: "https://images.unsplash.com/photo-1441070840590-cacbc8fb2ad9?w=500&h=300&fit=crop",
  },
]

export default function SelectProjectPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [loading, setLoading] = useState(false)

  if (!user) {
    router.push("/login")
    return null
  }

  const handleSelectProject = async (projectId: string) => {
    setSelectedProject(projectId)
    setLoading(true)

    // Simulate loading and redirect
    setTimeout(() => {
      localStorage.setItem("currentProject", projectId)
      router.push("/")
    }, 600)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "planning":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
      case "on-hold":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-neutral-900 dark:to-blue-900">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold font-heading">NV</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white font-heading">NvLogic</h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Select a Project</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">{user.name}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">{user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <Button
              variant="ghost"
              onClick={logout}
              className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2 font-heading">Your Projects</h2>
          <p className="text-neutral-600 dark:text-neutral-400">Select a project to continue</p>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_PROJECTS.map((project) => (
            <Card
              key={project.id}
              className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer border-2 ${
                selectedProject === project.id
                  ? "border-blue-600 ring-2 ring-blue-300 dark:ring-blue-700"
                  : "border-transparent hover:border-neutral-300 dark:hover:border-neutral-600"
              }`}
              onClick={() => handleSelectProject(project.id)}
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}
                >
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-1 font-heading">{project.name}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 flex items-center gap-1">
                  📍 {project.location}
                </p>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Progress</span>
                    <span className="text-xs font-bold text-blue-600">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 text-center">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Value</p>
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{project.value}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-center">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Team</p>
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">{project.team} members</p>
                  </div>
                </div>

                {/* Action button */}
                <Button
                  className={`w-full ${
                    selectedProject === project.id
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white"
                  }`}
                  disabled={loading && selectedProject !== project.id}
                >
                  {selectedProject === project.id && loading ? "Entering..." : "Enter Project"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty state message */}
        <div className="mt-12 text-center">
          <p className="text-neutral-600 dark:text-neutral-400">Need more projects? Contact your administrator.</p>
        </div>
      </div>
    </div>
  )
}
