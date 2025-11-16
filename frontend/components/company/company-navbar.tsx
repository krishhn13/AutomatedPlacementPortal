"use client"

import { Building2, LogOut, Settings, User, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Company {
  _id: string
  name: string
  email: string
  phone?: string
  website?: string
  location?: string
  industry?: string
}

interface CompanyNavbarProps {
  company?: Company | null
  onRefresh?: () => void
}

export function CompanyNavbar({ company, onRefresh }: CompanyNavbarProps) {
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userId")
    localStorage.removeItem("userData")
    window.location.href = "/"
  }

  const handleProfile = () => {
    // Navigate to company profile page
    console.log("Navigate to company profile")
  }

  const handleSettings = () => {
    // Navigate to company settings
    console.log("Navigate to company settings")
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Building2 className="h-8 w-8 text-primary" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold">Placement Portal</h1>
              <p className="text-sm text-muted-foreground">Company Dashboard</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="hidden sm:flex"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            )}
            
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">{company?.name || "Company"}</p>
              <p className="text-xs text-muted-foreground">{company?.industry || "Recruitment"}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={company?.name || "Company"} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Building2 className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={handleProfile}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Company Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}