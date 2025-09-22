"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, MoreHorizontal, Users, Building2, Shield, Edit, Trash2, Ban } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const students = [
  {
    id: 1,
    name: "Alex Smith",
    email: "alex.smith@university.edu",
    branch: "Computer Science",
    year: "Final Year",
    cgpa: "8.7/10",
    status: "active",
    joinDate: "2024-09-01",
    applications: 5,
    avatar: "/student-profile.png",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@college.edu",
    branch: "Electronics",
    year: "Third Year",
    cgpa: "9.1/10",
    status: "active",
    joinDate: "2024-09-15",
    applications: 3,
    avatar: "/diverse-student-profiles.png",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "m.chen@university.edu",
    branch: "Mechanical",
    year: "Final Year",
    cgpa: "8.9/10",
    status: "suspended",
    joinDate: "2024-08-20",
    applications: 0,
    avatar: "/student-profile.png",
  },
]

const companies = [
  {
    id: 1,
    name: "TechCorp Inc.",
    email: "hr@techcorp.com",
    industry: "Technology",
    location: "San Francisco, CA",
    status: "active",
    joinDate: "2024-10-01",
    jobPostings: 12,
    logo: "/abstract-tech-logo.png",
  },
  {
    id: 2,
    name: "StartupXYZ",
    email: "careers@startupxyz.com",
    industry: "Software",
    location: "Austin, TX",
    status: "active",
    joinDate: "2024-10-15",
    jobPostings: 8,
    logo: "/abstract-startup-logo.png",
  },
]

const admins = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@placementpro.com",
    role: "Super Admin",
    status: "active",
    joinDate: "2024-01-01",
    lastLogin: "2024-11-30",
    avatar: "/admin-avatar.png",
  },
  {
    id: 2,
    name: "John Manager",
    email: "john.manager@placementpro.com",
    role: "Manager",
    status: "active",
    joinDate: "2024-03-15",
    lastLogin: "2024-11-29",
    avatar: "/admin-avatar.png",
  },
]

export function UserManagement() {
  const [activeTab, setActiveTab] = useState("students")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-accent/10 text-accent border-accent/20"
      case "suspended":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "pending":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  const handleUserAction = (action: string, userId: number, userType: string) => {
    console.log(`${action} ${userType} with id: ${userId}`)
    // Handle user actions
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Companies</p>
                <p className="text-2xl font-bold">{companies.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/10">
                <Building2 className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admin Users</p>
                <p className="text-2xl font-bold">{admins.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-accent/10">
                <Shield className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 glass">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="glass-card">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="glass">
          <TabsTrigger
            value="students"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Users className="w-4 h-4 mr-2" />
            Students ({students.length})
          </TabsTrigger>
          <TabsTrigger
            value="companies"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Companies ({companies.length})
          </TabsTrigger>
          <TabsTrigger
            value="admins"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Shield className="w-4 h-4 mr-2" />
            Admins ({admins.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          {students.map((student) => (
            <Card key={student.id} className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                      <AvatarFallback>
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm">{student.branch}</span>
                        <span className="text-sm">{student.year}</span>
                        <Badge variant="outline" className="bg-accent/10 text-accent">
                          CGPA: {student.cgpa}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(student.status)}>{student.status}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="glass-card" align="end">
                        <DropdownMenuItem onClick={() => handleUserAction("view", student.id, "student")}>
                          <Edit className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction("suspend", student.id, "student")}>
                          <Ban className="mr-2 h-4 w-4" />
                          Suspend User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUserAction("delete", student.id, "student")}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Applications</p>
                    <p className="font-semibold">{student.applications}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Join Date</p>
                    <p className="font-semibold">{new Date(student.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="companies" className="space-y-4">
          {companies.map((company) => (
            <Card key={company.id} className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{company.name}</h3>
                      <p className="text-sm text-muted-foreground">{company.email}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm">{company.industry}</span>
                        <span className="text-sm">{company.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(company.status)}>{company.status}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="glass-card" align="end">
                        <DropdownMenuItem onClick={() => handleUserAction("view", company.id, "company")}>
                          <Edit className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction("suspend", company.id, "company")}>
                          <Ban className="mr-2 h-4 w-4" />
                          Suspend Company
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUserAction("delete", company.id, "company")}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Company
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Job Postings</p>
                    <p className="font-semibold">{company.jobPostings}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Join Date</p>
                    <p className="font-semibold">{new Date(company.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="admins" className="space-y-4">
          {admins.map((admin) => (
            <Card key={admin.id} className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={admin.avatar || "/placeholder.svg"} alt={admin.name} />
                      <AvatarFallback>
                        {admin.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{admin.name}</h3>
                      <p className="text-sm text-muted-foreground">{admin.email}</p>
                      <Badge variant="outline" className="mt-1">
                        {admin.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(admin.status)}>{admin.status}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="glass-card" align="end">
                        <DropdownMenuItem onClick={() => handleUserAction("edit", admin.id, "admin")}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction("permissions", admin.id, "admin")}>
                          <Shield className="mr-2 h-4 w-4" />
                          Manage Permissions
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Last Login</p>
                    <p className="font-semibold">{new Date(admin.lastLogin).toLocaleDateString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Join Date</p>
                    <p className="font-semibold">{new Date(admin.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
