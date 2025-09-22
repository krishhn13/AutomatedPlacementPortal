"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  id: string
  title: string
  description?: string
  type?: "success" | "error" | "warning" | "info"
  duration?: number
  onClose: (id: string) => void
}

export function Toast({ id, title, description, type = "info", duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(id), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const colors = {
    success: "border-green-500/20 bg-green-500/10 text-green-600",
    error: "border-red-500/20 bg-red-500/10 text-red-600",
    warning: "border-yellow-500/20 bg-yellow-500/10 text-yellow-600",
    info: "border-blue-500/20 bg-blue-500/10 text-blue-600",
  }

  const Icon = icons[type]

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 w-96 p-4 rounded-lg border backdrop-blur-md transition-all duration-300",
        colors[type],
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
      )}
    >
      <div className="flex items-start space-x-3">
        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium">{title}</p>
          {description && <p className="text-sm opacity-90 mt-1">{description}</p>}
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onClose(id), 300)
          }}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
