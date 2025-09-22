"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface FloatingActionButtonProps {
  onClick: () => void
  className?: string
  children?: React.ReactNode
}

export function FloatingActionButton({ onClick, className, children }: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50",
        "bg-primary hover:bg-primary/90 text-primary-foreground",
        className,
      )}
      size="icon"
    >
      {children || <Plus className="h-6 w-6" />}
    </Button>
  )
}
