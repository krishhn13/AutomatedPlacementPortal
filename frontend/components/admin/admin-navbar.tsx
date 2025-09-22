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
import { Bell, Settings, LogOut, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"

export function AdminNavbar() {
  return (
    <nav className="sticky top-0 z-50 glass-card border-b backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PlacementPro
            </h1>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Admin Portal
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            <Button variant="ghost" size="icon" className="relative transition-all duration-200 hover:scale-110">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-accent animate-pulse">
                7
              </Badge>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/admin-avatar.png" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-card w-56" align="end">
                <DropdownMenuItem className="transition-colors duration-200">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="transition-colors duration-200">
                  <Settings className="mr-2 h-4 w-4" />
                  System Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="transition-colors duration-200">
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
