"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Shield,
  Building2,
  GraduationCap,
  User,
  CheckCircle,
  XCircle,
  MoreVertical,
  AlertCircle,
  RefreshCw,
  Loader2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Backend API configuration
const API_BASE_URL = "http://localhost:5000/api"

// Types
interface User {
  _id: string
  id?: string
  name: string
  email: string
  role: "student" | "company" | "admin" | "recruiter"
  phone?: string
  status: string
  location?: string
  registered: string
  createdkt?: string
  createdAt?: string
  lastActive?: string
  // Student specific fields
  branch?: string
  year?: string
  years?: string
  cgpa?: number
  totalApplications?: number
  applications?: any[]
  skills?: string[]
  backlog?: number
  // Company specific fields
  industry?: string
  employeeCount?: number
  jobsPosted?: number
  isVerified?: boolean
  // Profile
  profilephoto?: {
    filename: string;
    path: string;
    size: number;
    amsetype: string;
    uploadedkt: string;
  };
  profilephotourl?: string;
}

interface UserStats {
  totalUsers: number
  students: number
  companies: number
  activeUsers: number
  pendingUsers: number
}

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "student" as "student" | "company" | "admin",
    phone: "",
    location: ""
  })

// Update the fetchUsers function with this exact implementation:
const fetchUsers = async () => {
  console.log("🔄 Starting fetchUsers...");
  setLoading(true);
  setError(null);
  
  try {
    console.log("🔍 Fetching from:", `${API_BASE_URL}/users`);
    
    const response = await fetch(`${API_BASE_URL}/users`);
    console.log("📡 Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const usersArray = await response.json();
    console.log("📊 API returned array with", usersArray.length, "users");
    console.log("📊 First user:", usersArray[0]);
    
    if (Array.isArray(usersArray)) {
      // Transform API data to match component format
      const transformedUsers = usersArray.map(user => ({
        _id: user._id,
        id: user._id, // Use _id as id for compatibility
        name: user.name || 'Unknown User',
        email: user.email || '',
        role: user.role || 'student',
        phone: user.phone || '',
        status: user.status && typeof user.status === 'object' && Object.keys(user.status).length > 0 
          ? 'active' 
          : (user.status || 'active'),
        location: user.location || '',
        registered: user.createdAt || new Date().toISOString(),
        createdAt: user.createdAt,
        // Student fields
        branch: user.branch,
        year: user.year,
        cgpa: user.cgpa,
        totalApplications: user.appliedJobs?.length || 0,
        applications: user.appliedJobs || [],
        skills: user.skills || [],
        backlogs: user.backlogs,
        // Profile
        profilePhoto: user.profilePhoto,
        profilePhotoUrl: user.profilePhotoUrl
      }));
      
      console.log(`✅ Setting ${transformedUsers.length} users to state`);
      setUsers(transformedUsers);
      calculateUserStats(transformedUsers);
    } else {
      console.error("❌ API did not return an array:", usersArray);
      throw new Error("Invalid response format: expected array");
    }
    
  } catch (err) {
    console.error("❌ Error in fetchUsers:", err);
    setError(err instanceof Error ? err.message : "Failed to fetch users");
    
    // Use fallback data
    const fallbackData = getFallbackUsers();
    console.log("🔄 Using fallback data, count:", fallbackData.length);
    setUsers(fallbackData);
    calculateUserStats(fallbackData);
    
  } finally {
    setLoading(false);
    console.log("🏁 fetchUsers completed");
  }
};

  const calculateUserStats = (userList: User[]) => {
    console.log("📊 Calculating stats for", userList.length, "users")
    
    const stats = {
      totalUsers: userList.length,
      students: userList.filter(u => u.role === "student" ).length,
      companies: userList.filter(u => u.role === "company"|| u.role === "recruiter").length,
      activeUsers: userList.filter(u => u.status === "active" || u.status === "Active").length,
      pendingUsers: userList.filter(u => u.status === "pending" || u.status === "Pending").length
    }
    
    console.log("📊 Stats calculated:", stats)
    setUserStats(stats)
  }

  // Create new user
  const handleCreateUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })
      
      if (!response.ok) throw new Error("Failed to create user")
      
      const createdUser = await response.json()
      
      // Transform and add new user to the list
      const transformedUser: User = {
        _id: createdUser._id || createdUser.id,
        id: createdUser.id || createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        phone: createdUser.phone || '',
        status: createdUser.status || 'active',
        location: createdUser.location || '',
        registered: createdUser.createdAt || new Date().toISOString(),
      }
      
      setUsers(prev => [...prev, transformedUser])
      setIsCreateDialogOpen(false)
      setNewUser({ name: "", email: "", role: "student", phone: "", location: "" })
      
      alert("User created successfully!")
      
      // Refresh the list
      fetchUsers()
    } catch (err) {
      console.error("Error creating user:", err)
      alert("Failed to create user. Please try again.")
    }
  }

  // Update user status
  const handleUpdateStatus = async (userId: string, status: string) => {
    setActionLoading(userId)
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })
      
      if (!response.ok) throw new Error("Failed to update user status")
      
      // Update local state
      setUsers(prev => 
        prev.map(user => 
          user._id === userId || user.id === userId ? { ...user, status } : user
        )
      )
      
      // Update selected user if open
      if (selectedUser && (selectedUser._id === userId || selectedUser.id === userId)) {
        setSelectedUser(prev => prev ? { ...prev, status } : null)
      }
    } catch (err) {
      console.error("Error updating user status:", err)
      alert("Failed to update user status")
    } finally {
      setActionLoading(null)
    }
  }

  // Delete user
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return
    
    setActionLoading(id)
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) throw new Error("Failed to delete user")
      
      // Remove user from local state
      setUsers(prev => prev.filter(user => user._id !== id && user.id !== id))
      
      // Close dialog if deleted user is selected
      if (selectedUser && (selectedUser._id === id || selectedUser.id === id)) {
        setIsDialogOpen(false)
        setSelectedUser(null)
      }
    } catch (err) {
      console.error("Error deleting user:", err)
      alert("Failed to delete user")
    } finally {
      setActionLoading(null)
    }
  }

  // Send email to user
  const handleSendEmail = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: "Welcome to Placement Portal",
          message: "Thank you for joining our platform!"
        }),
      })
      
      if (!response.ok) throw new Error("Failed to send email")
      
      alert("Email sent successfully!")
    } catch (err) {
      console.error("Error sending email:", err)
      alert("Failed to send email")
    }
  }

  // View user details
  const handleViewUser = async (user: User) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
    
    // Optionally fetch more detailed user data
    try {
      const userId = user._id || user.id
      if (userId) {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`)
        if (response.ok) {
          const detailedUser = await response.json()
          setSelectedUser(detailedUser)
        }
      }
    } catch (err) {
      console.error("Error fetching user details:", err)
    }
  }

  // Initialize
  useEffect(() => {
    console.log("🚀 UserManagement component mounted")
    fetchUsers()
  }, [])

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    
    const matchesRole = filterRole === "all" || 
      (user.role?.toLowerCase() === filterRole.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || 
      (user.status?.toLowerCase() === filterStatus.toLowerCase())
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // Badge helper functions
  const getRoleBadge = (role: string) => {
    const roleLower = role.toLowerCase()
    switch (roleLower) {
      case "student":
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
          <GraduationCap className="h-3 w-3 mr-1" /> Student
        </Badge>
      case "company":
      case "recruiter":
        return <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50">
          <Building2 className="h-3 w-3 mr-1" /> Company
        </Badge>
      case "admin":
        return <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
          <Shield className="h-3 w-3 mr-1" /> Admin
        </Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="h-3 w-3 mr-1" /> Active
        </Badge>
      case "inactive":
        return <Badge variant="outline" className="text-gray-500">Inactive</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Pending
        </Badge>
      case "suspended":
      case "blocked":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="h-3 w-3 mr-1" /> {status}
        </Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRoleIcon = (role: string) => {
    const roleLower = role.toLowerCase()
    switch (roleLower) {
      case "student":
        return <GraduationCap className="h-4 w-4" />
      case "company":
      case "recruiter":
        return <Building2 className="h-4 w-4" />
      case "admin":
        return <Shield className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  // Debug button to test API
  const handleTestAPI = async () => {
    console.log("🧪 Testing API connection...")
    try {
      const response = await fetch(`${API_BASE_URL}/users`)
      console.log("API Response:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      })
      
      const text = await response.text()
      console.log("Raw response text:", text)
      
      try {
        const parsed = JSON.parse(text)
        console.log("Parsed JSON:", parsed)
      } catch (e) {
        console.error("Failed to parse JSON:", e)
      }
    } catch (error) {
      console.error("API test failed:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage all users in the system</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleTestAPI}
            variant="outline" 
            size="sm"
            className="gap-2"
          >
            🧪 Test API
          </Button>
          <Button 
            onClick={fetchUsers} 
            variant="outline" 
            className="gap-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
        <div>Users loaded: {users.length} | Filtered: {filteredUsers.length}</div>
        <div>API: {API_BASE_URL}/users</div>
        <Button 
          variant="link" 
          size="sm" 
          className="p-0 h-auto text-xs"
          onClick={() => console.log("Current users:", users)}
        >
          👁️ View console logs
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error} <Button variant="link" onClick={fetchUsers} className="p-0 h-auto">Retry</Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="company">Companies</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : userStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold">{userStats.totalUsers}</p>
                </div>
                <User className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Students</p>
                  <p className="text-3xl font-bold">{userStats.students}</p>
                </div>
                <GraduationCap className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Companies</p>
                  <p className="text-3xl font-bold">{userStats.companies}</p>
                </div>
                <Building2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-3xl font-bold">{userStats.activeUsers}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[150px]" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <User className="h-12 w-12 mb-2 opacity-20" />
                        <p>No users found</p>
                        {searchQuery && (
                          <Button 
                            variant="link" 
                            onClick={() => setSearchQuery("")}
                            className="mt-2"
                          >
                            Clear search
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user._id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {getRoleIcon(user.role)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{user.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="space-y-1">
                          {user.phone && (
                            <p className="text-sm flex items-center gap-1">
                              <Phone className="h-3 w-3" /> 
                              <span className="truncate">{user.phone}</span>
                            </p>
                          )}
                          {user.location && (
                            <p className="text-sm flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> 
                              <span className="truncate">{user.location}</span>
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(user.status)}
                          {actionLoading === user._id && (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {user.registered ? new Date(user.registered).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewUser(user)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => user._id && handleSendEmail(user._id)}>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => user._id && handleUpdateStatus(user._id, "active")}
                                disabled={user.status === "active"}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Activate
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => user._id && handleUpdateStatus(user._id, "suspended")}
                                disabled={user.status === "suspended"}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Suspend
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => user._id && handleDeleteUser(user._id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information about the user
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {getRoleIcon(selectedUser.role)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold truncate">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {getRoleBadge(selectedUser.role)}
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{selectedUser.email}</span>
                      </div>
                      {selectedUser.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span>{selectedUser.phone}</span>
                        </div>
                      )}
                      {selectedUser.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span>{selectedUser.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Account Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Registered On</span>
                        <span className="font-medium">
                          {selectedUser.registered ? new Date(selectedUser.registered).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      {selectedUser.lastActive && (
                        <div className="flex justify-between">
                          <span className="text-sm">Last Active</span>
                          <span className="font-medium">
                            {new Date(selectedUser.lastActive).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm">Account Type</span>
                        <span className="font-medium capitalize">{selectedUser.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedUser.role === "student" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Academic Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedUser.branch && (
                        <div>
                          <p className="text-sm text-muted-foreground">Branch</p>
                          <p className="font-medium">{selectedUser.branch}</p>
                        </div>
                      )}
                      {selectedUser.year && (
                        <div>
                          <p className="text-sm text-muted-foreground">Year</p>
                          <p className="font-medium">{selectedUser.year}</p>
                        </div>
                      )}
                      {selectedUser.cgpa && (
                        <div>
                          <p className="text-sm text-muted-foreground">CGPA</p>
                          <p className="font-medium">{selectedUser.cgpa}</p>
                        </div>
                      )}
                      {selectedUser.totalApplications !== undefined && (
                        <div>
                          <p className="text-sm text-muted-foreground">Applications</p>
                          <p className="font-medium">{selectedUser.totalApplications}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedUser.role === "company" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Company Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedUser.industry && (
                        <div>
                          <p className="text-sm text-muted-foreground">Industry</p>
                          <p className="font-medium">{selectedUser.industry}</p>
                        </div>
                      )}
                      {selectedUser.employeeCount && (
                        <div>
                          <p className="text-sm text-muted-foreground">Employees</p>
                          <p className="font-medium">{selectedUser.employeeCount}+</p>
                        </div>
                      )}
                      {selectedUser.jobsPosted && (
                        <div>
                          <p className="text-sm text-muted-foreground">Jobs Posted</p>
                          <p className="font-medium">{selectedUser.jobsPosted}</p>
                        </div>
                      )}
                      {selectedUser.isVerified !== undefined && (
                        <div>
                          <p className="text-sm text-muted-foreground">Verified</p>
                          {selectedUser.isVerified ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <CheckCircle className="h-3 w-3 mr-1" /> Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline">Not Verified</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="sm:order-1"
            >
              Close
            </Button>
            <div className="flex gap-2 sm:order-2">
              <Button 
                variant="outline" 
                onClick={() => selectedUser?._id && handleSendEmail(selectedUser._id)}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => selectedUser?._id && handleDeleteUser(selectedUser._id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete User
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input 
                placeholder="Enter full name" 
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email" 
                placeholder="Enter email address" 
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select 
                value={newUser.role} 
                onValueChange={(value: "student" | "company" | "admin") => 
                  setNewUser(prev => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input 
                  placeholder="Phone number" 
                  value={newUser.phone}
                  onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input 
                  placeholder="Location" 
                  value={newUser.location}
                  onChange={(e) => setNewUser(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser} disabled={!newUser.name || !newUser.email}>
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Fallback data for development/demo
function getFallbackUsers(): User[] {
  return [
    {
      _id: "1",
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "student",
      phone: "+1 234 567 890",
      status: "active",
      location: "New York",
      registered: "2024-01-15",
      branch: "Computer Science",
      year: "Final Year",
      cgpa: 8.5,
      totalApplications: 12
    },
    {
      _id: "2",
      id: "2",
      name: "Tech Innovations Inc.",
      email: "hr@techinnovations.com",
      role: "company",
      phone: "+1 987 654 321",
      status: "active",
      location: "San Francisco",
      registered: "2024-01-14",
      industry: "Technology",
      employeeCount: 1000,
      jobsPosted: 15,
      isVerified: true
    },
    {
      _id: "3",
      id: "3",
      name: "Admin User",
      email: "admin@portal.com",
      role: "admin",
      phone: "+1 555 123 456",
      status: "active",
      location: "HQ",
      registered: "2024-01-01"
    },
    {
      _id: "4",
      id: "4",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "student",
      phone: "+1 234 567 891",
      status: "inactive",
      location: "Boston",
      registered: "2024-01-10"
    },
    {
      _id: "5",
      id: "5",
      name: "Global Finance Corp",
      email: "info@globalfinance.com",
      role: "company",
      phone: "+1 987 654 322",
      status: "pending",
      location: "Chicago",
      registered: "2024-01-05",
      industry: "Finance",
      employeeCount: 500,
      jobsPosted: 8,
      isVerified: false
    }
  ]
}