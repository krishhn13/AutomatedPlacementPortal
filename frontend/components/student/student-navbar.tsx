"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Settings, LogOut, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react" // Add these imports

export function StudentNavbar() {
  const router = useRouter()
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null) // Add state
  const [avatarKey, setAvatarKey] = useState(Date.now()) // Cache-busting key

  // 🔑 Sign Out function
  const handleSignOut = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  // Fetch user profile photo
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        const res = await fetch(`${API_BASE_URL}/api/student/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store' // Prevent caching
        })

        if (res.ok) {
          const data = await res.json()
          if (data.profilePhotoUrl) {
            // Add timestamp to force refresh
            setProfilePhoto(`${data.profilePhotoUrl}?t=${Date.now()}`)
            setAvatarKey(Date.now()) // Update key to force component remount
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile photo:", error)
      }
    }

    fetchUserProfile()
    
    // Set up an interval to refresh the photo periodically
    const intervalId = setInterval(() => {
      setAvatarKey(Date.now()) // Update key every 10 seconds
    }, 10000) // 10 seconds

    return () => clearInterval(intervalId) // Cleanup on unmount
  }, [])

  return (
    <nav className="sticky top-0 z-50 glass-card border-b backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Badge */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PlacementPro
            </h1>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Student Portal
            </Badge>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative transition-all duration-200 hover:scale-110"
            >
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-accent animate-pulse">
                3
              </Badge>
            </Button>

            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <Avatar className="h-8 w-8" key={avatarKey}> {/* Add key prop */}
                    <AvatarImage 
                      src={profilePhoto || ""} 
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-card w-56" align="end">
                <DropdownMenuItem 
                  className="transition-colors duration-200 cursor-pointer"
                  onClick={() => router.push("/student/profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="transition-colors duration-200">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut} 
                  className="transition-colors duration-200 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}