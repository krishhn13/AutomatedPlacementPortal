"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Shield, User, Building2, LogOut, Settings, Bell } from "lucide-react"
import { logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface HeaderProps {
  title: string
  subtitle: string
  userRole: "student" | "company" | "admin"
  userName: string
  isApproved?: boolean
  notificationCount?: number
}

export function Header({ title, subtitle, userRole, userName, isApproved = true, notificationCount = 0 }: HeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      })
      router.push("/auth/login")
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getRoleIcon = () => {
    switch (userRole) {
      case "admin":
        return <Shield className="h-5 w-5" />
      case "company":
        return <Building2 className="h-5 w-5" />
      default:
        return <User className="h-5 w-5" />
    }
  }

  const getRoleColor = () => {
    switch (userRole) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "company":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  return (
    <header className="border-b border-primary-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${userRole === "admin" ? "bg-primary-900" : "bg-primary-100"}`}>
              {getRoleIcon()}
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-primary-900">{title}</h1>
              <p className="text-text-default">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Role Badge */}
            <Badge className={getRoleColor()}>{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</Badge>

            {/* Approval Status for Company */}
            {userRole === "company" && !isApproved && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Pending Approval
              </Badge>
            )}

            {/* Notifications */}
            {notificationCount > 0 && (
              <Button variant="outline" size="sm" className="relative bg-transparent">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500">
                  {notificationCount}
                </Badge>
              </Button>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-primary-900 text-primary-900 bg-transparent">
                  <User className="h-4 w-4 mr-2" />
                  {userName}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
