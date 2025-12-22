"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, CheckCircle, Home, Briefcase, FileText, Download, Search, Filter, MoreVertical, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { AdminNavbar } from "@/components/admin/admin-navbar"
import { AdminOverview } from "@/components/admin/admin-overview"
import { ApprovalPanel } from "@/components/admin/approval-panel"
import { UserManagement } from "@/components/admin/user-management"
import { ReportsAnalytics } from "@/components/admin/reports-analytics"

// Mock backend data types
interface User {
  id: string
  name: string
  email: string
  role: "student" | "recruiter" | "admin"
  status: "active" | "pending" | "suspended"
  dateJoined: string
  avatar?: string
}

interface Job {
  id: string
  title: string
  company: string
  status: "pending" | "approved" | "rejected"
  postedBy: string
  postedDate: string
  salary: string
  type: "full-time" | "part-time" | "internship"
}

interface Report {
  id: string
  title: string
  type: "user" | "job" | "application" | "system"
  generatedDate: string
  downloads: number
  size: string
}

interface DashboardStats {
  totalUsers: number
  pendingApprovals: number
  activeJobs: number
  totalApplications: number
  userGrowth: number
  approvalRate: number
}

// Mock backend service
const mockBackendService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      totalUsers: 1248,
      pendingApprovals: 23,
      activeJobs: 156,
      totalApplications: 892,
      userGrowth: 12.5,
      approvalRate: 85.3
    }
  },

  getUsers: async (page = 1, limit = 10): Promise<{ users: User[]; total: number }> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const mockUsers: User[] = [
      { id: "1", name: "John Doe", email: "john@example.com", role: "student", status: "active", dateJoined: "2024-01-15" },
      { id: "2", name: "Jane Smith", email: "jane@example.com", role: "recruiter", status: "pending", dateJoined: "2024-01-16" },
      { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "admin", status: "active", dateJoined: "2024-01-10" },
      { id: "4", name: "Alice Brown", email: "alice@example.com", role: "student", status: "suspended", dateJoined: "2024-01-14" },
      { id: "5", name: "Charlie Wilson", email: "charlie@example.com", role: "recruiter", status: "active", dateJoined: "2024-01-13" },
      { id: "6", name: "Diana Prince", email: "diana@example.com", role: "student", status: "active", dateJoined: "2024-01-12" },
      { id: "7", name: "Ethan Hunt", email: "ethan@example.com", role: "recruiter", status: "pending", dateJoined: "2024-01-11" },
      { id: "8", name: "Fiona Gallagher", email: "fiona@example.com", role: "student", status: "active", dateJoined: "2024-01-10" },
      { id: "9", name: "George Miller", email: "george@example.com", role: "recruiter", status: "suspended", dateJoined: "2024-01-09" },
      { id: "10", name: "Hannah Baker", email: "hannah@example.com", role: "student", status: "active", dateJoined: "2024-01-08" },
    ]
    
    return {
      users: mockUsers.slice((page - 1) * limit, page * limit),
      total: mockUsers.length
    }
  },

  getPendingJobs: async (): Promise<Job[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return [
      { id: "1", title: "Frontend Developer", company: "Tech Corp", status: "pending", postedBy: "Jane Smith", postedDate: "2024-01-15", salary: "$80k - $120k", type: "full-time" },
      { id: "2", title: "Data Scientist", company: "Data Inc", status: "pending", postedBy: "Bob Johnson", postedDate: "2024-01-14", salary: "$90k - $130k", type: "full-time" },
      { id: "3", title: "UX Designer", company: "Design Studio", status: "pending", postedBy: "Alice Brown", postedDate: "2024-01-13", salary: "$70k - $100k", type: "full-time" },
      { id: "4", title: "Backend Engineer", company: "Cloud Systems", status: "pending", postedBy: "Charlie Wilson", postedDate: "2024-01-12", salary: "$85k - $125k", type: "full-time" },
      { id: "5", title: "Marketing Intern", company: "Growth Agency", status: "pending", postedBy: "Diana Prince", postedDate: "2024-01-11", salary: "$20k - $30k", type: "internship" },
    ]
  },

  getReports: async (): Promise<Report[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return [
      { id: "1", title: "Monthly User Report", type: "user", generatedDate: "2024-01-01", downloads: 145, size: "2.4 MB" },
      { id: "2", title: "Job Applications Q4", type: "application", generatedDate: "2023-12-15", downloads: 89, size: "1.8 MB" },
      { id: "3", title: "System Performance Logs", type: "system", generatedDate: "2024-01-10", downloads: 42, size: "3.2 MB" },
      { id: "4", title: "Recruiter Activity", type: "job", generatedDate: "2024-01-05", downloads: 67, size: "1.5 MB" },
      { id: "5", title: "Student Placement Stats", type: "user", generatedDate: "2023-12-30", downloads: 112, size: "2.1 MB" },
    ]
  },

  approveJob: async (jobId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    console.log(`Job ${jobId} approved`)
  },

  rejectJob: async (jobId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    console.log(`Job ${jobId} rejected`)
  },

  updateUserStatus: async (userId: string, status: User['status']): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    console.log(`User ${userId} status updated to ${status}`)
  },

  deleteUser: async (userId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    console.log(`User ${userId} deleted`)
  },

  downloadReport: async (reportId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    console.log(`Report ${reportId} downloaded`)
  }
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [pendingJobs, setPendingJobs] = useState<Job[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const usersPerPage = 10

  useEffect(() => {
    fetchDashboardData()
  }, [activeTab, currentPage])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      if (activeTab === "overview") {
        const stats = await mockBackendService.getDashboardStats()
        setDashboardStats(stats)
      } else if (activeTab === "users") {
        const { users, total } = await mockBackendService.getUsers(currentPage, usersPerPage)
        setUsers(users)
        setTotalUsers(total)
      } else if (activeTab === "approvals") {
        const jobs = await mockBackendService.getPendingJobs()
        setPendingJobs(jobs)
      } else if (activeTab === "reports") {
        const reportsData = await mockBackendService.getReports()
        setReports(reportsData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveJob = async (jobId: string) => {
    try {
      await mockBackendService.approveJob(jobId)
      setPendingJobs(pendingJobs.filter(job => job.id !== jobId))
      fetchDashboardData() // Refresh stats
    } catch (error) {
      console.error("Error approving job:", error)
    }
  }

  const handleRejectJob = async (jobId: string) => {
    try {
      await mockBackendService.rejectJob(jobId)
      setPendingJobs(pendingJobs.filter(job => job.id !== jobId))
    } catch (error) {
      console.error("Error rejecting job:", error)
    }
  }

  const handleUpdateUserStatus = async (userId: string, status: User['status']) => {
    try {
      await mockBackendService.updateUserStatus(userId, status)
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status } : user
      ))
    } catch (error) {
      console.error("Error updating user status:", error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await mockBackendService.deleteUser(userId)
        setUsers(users.filter(user => user.id !== userId))
        setTotalUsers(totalUsers - 1)
      } catch (error) {
        console.error("Error deleting user:", error)
      }
    }
  }

  const handleDownloadReport = async (reportId: string) => {
    try {
      await mockBackendService.downloadReport(reportId)
      // In a real app, this would trigger a file download
      alert("Report download started!")
    } catch (error) {
      console.error("Error downloading report:", error)
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(totalUsers / usersPerPage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/10">
      <AdminNavbar />

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Mobile Header */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <p className="text-muted-foreground text-sm">Manage the placement portal and oversee all activities</p>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage the placement portal and oversee all activities</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Responsive Tabs */}
          <TabsList className="glass p-1 h-auto flex flex-wrap gap-1 sm:gap-2">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base flex-1 sm:flex-none"
            >
              <BarChart3 className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="approvals"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base flex-1 sm:flex-none"
            >
              <CheckCircle className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">Approvals</span>
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base flex-1 sm:flex-none"
            >
              <Users className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">Users</span>
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base flex-1 sm:flex-none"
            >
              <FileText className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">Reports</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {loading ? (
              <div className="text-center py-12">Loading dashboard data...</div>
            ) : dashboardStats && (
              <>
                {/* Stats Grid - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="glass rounded-xl p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Users</p>
                        <p className="text-2xl sm:text-3xl font-bold mt-2">{dashboardStats.totalUsers.toLocaleString()}</p>
                      </div>
                      <Users className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                    </div>
                    <div className="mt-3 sm:mt-4 flex items-center text-sm text-green-500">
                      <span>↑ {dashboardStats.userGrowth}%</span>
                      <span className="text-muted-foreground ml-2">from last month</span>
                    </div>
                  </div>

                  <div className="glass rounded-xl p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending Approvals</p>
                        <p className="text-2xl sm:text-3xl font-bold mt-2">{dashboardStats.pendingApprovals}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                    </div>
                    <div className="mt-3 sm:mt-4">
                      <button 
                        onClick={() => setActiveTab("approvals")}
                        className="text-sm text-primary hover:underline"
                      >
                        Review now →
                      </button>
                    </div>
                  </div>

                  <div className="glass rounded-xl p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Active Jobs</p>
                        <p className="text-2xl sm:text-3xl font-bold mt-2">{dashboardStats.activeJobs}</p>
                      </div>
                      <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                    </div>
                    <div className="mt-3 sm:mt-4 text-sm text-muted-foreground">
                      <span className="text-green-500">{dashboardStats.approvalRate}%</span> approval rate
                    </div>
                  </div>

                  <div className="glass rounded-xl p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Applications</p>
                        <p className="text-2xl sm:text-3xl font-bold mt-2">{dashboardStats.totalApplications.toLocaleString()}</p>
                      </div>
                      <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                    </div>
                    <div className="mt-3 sm:mt-4 text-sm text-muted-foreground">
                      Total submitted
                    </div>
                  </div>
                </div>

                {/* Recent Activity - Responsive */}
                <div className="glass rounded-xl p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { action: "New job posting approved", user: "Tech Corp", time: "2 minutes ago" },
                      { action: "User account suspended", user: "John Smith", time: "1 hour ago" },
                      { action: "Monthly report generated", user: "System", time: "3 hours ago" },
                      { action: "New recruiter registered", user: "Jane Doe", time: "5 hours ago" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-blue-500'}`} />
                          <div>
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">by {activity.user}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals">
            <div className="glass rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <h2 className="text-xl font-bold mb-2 sm:mb-0">Pending Approvals</h2>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                    Approve All
                  </button>
                  <button className="px-3 py-2 text-sm bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90">
                    Reject All
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">Loading pending jobs...</div>
              ) : pendingJobs.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                  <p className="text-muted-foreground">No pending approvals</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 sm:px-4">Job Title</th>
                        <th className="text-left py-3 px-2 sm:px-4 hidden sm:table-cell">Company</th>
                        <th className="text-left py-3 px-2 sm:px-4">Posted By</th>
                        <th className="text-left py-3 px-2 sm:px-4 hidden md:table-cell">Date</th>
                        <th className="text-left py-3 px-2 sm:px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingJobs.map((job) => (
                        <tr key={job.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-2 sm:px-4">
                            <div>
                              <p className="font-medium">{job.title}</p>
                              <p className="text-sm text-muted-foreground sm:hidden">{job.company}</p>
                            </div>
                          </td>
                          <td className="py-3 px-2 sm:px-4 hidden sm:table-cell">{job.company}</td>
                          <td className="py-3 px-2 sm:px-4">{job.postedBy}</td>
                          <td className="py-3 px-2 sm:px-4 hidden md:table-cell">{job.postedDate}</td>
                          <td className="py-3 px-2 sm:px-4">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => handleApproveJob(job.id)}
                                className="px-3 py-1 text-xs sm:text-sm bg-green-500 text-white rounded hover:bg-green-600"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectJob(job.id)}
                                className="px-3 py-1 text-xs sm:text-sm bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
                              >
                                Reject
                              </button>
                              <button className="px-3 py-1 text-xs sm:text-sm bg-muted text-muted-foreground rounded hover:bg-muted/80 sm:hidden">
                                <Eye className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="glass rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-bold">User Management</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full sm:w-64 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                    Add User
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">Loading users...</div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 sm:px-4">User</th>
                          <th className="text-left py-3 px-2 sm:px-4 hidden sm:table-cell">Email</th>
                          <th className="text-left py-3 px-2 sm:px-4">Role</th>
                          <th className="text-left py-3 px-2 sm:px-4">Status</th>
                          <th className="text-left py-3 px-2 sm:px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-2 sm:px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="font-medium">{user.name.charAt(0)}</span>
                                </div>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-muted-foreground sm:hidden">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-2 sm:px-4 hidden sm:table-cell">{user.email}</td>
                            <td className="py-3 px-2 sm:px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === 'admin' ? 'bg-purple-500/20 text-purple-700' :
                                user.role === 'recruiter' ? 'bg-blue-500/20 text-blue-700' :
                                'bg-green-500/20 text-green-700'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="py-3 px-2 sm:px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.status === 'active' ? 'bg-green-500/20 text-green-700' :
                                user.status === 'pending' ? 'bg-amber-500/20 text-amber-700' :
                                'bg-red-500/20 text-red-700'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="py-3 px-2 sm:px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleUpdateUserStatus(user.id, user.status === 'active' ? 'suspended' : 'active')}
                                  className="p-1 hover:bg-muted rounded"
                                  title={user.status === 'active' ? 'Suspend' : 'Activate'}
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="p-1 hover:bg-destructive/10 text-destructive rounded"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <button className="p-1 hover:bg-muted rounded hidden sm:inline-block">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t gap-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {(currentPage - 1) * usersPerPage + 1} to {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} users
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 rounded-lg ${
                              currentPage === pageNum
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="glass rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <h2 className="text-xl font-bold mb-2 sm:mb-0">Reports & Analytics</h2>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">Loading reports...</div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {reports.map((report) => (
                    <div key={report.id} className="border rounded-xl p-4 hover:border-primary transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold mb-1">{report.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className={`px-2 py-1 rounded-full ${
                              report.type === 'user' ? 'bg-blue-500/20 text-blue-700' :
                              report.type === 'job' ? 'bg-green-500/20 text-green-700' :
                              report.type === 'application' ? 'bg-purple-500/20 text-purple-700' :
                              'bg-amber-500/20 text-amber-700'
                            }`}>
                              {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                            </span>
                            <span>{report.size}</span>
                            <span>{report.downloads} downloads</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownloadReport(report.id)}
                          className="mt-3 sm:mt-0 px-3 py-1 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 flex items-center"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Generated on {report.generatedDate}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Analytics Chart (Placeholder) */}
              <div className="mt-8 border rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-bold mb-4">User Growth Analytics</h3>
                <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Chart visualization would appear here</p>
                    <p className="text-sm text-muted-foreground mt-1">(Integration with charting library needed)</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t lg:hidden z-50">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex flex-col items-center p-2 ${activeTab === "overview" ? "text-primary" : "text-muted-foreground"}`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs mt-1">Overview</span>
          </button>
          <button
            onClick={() => setActiveTab("approvals")}
            className={`flex flex-col items-center p-2 ${activeTab === "approvals" ? "text-primary" : "text-muted-foreground"}`}
          >
            <CheckCircle className="w-5 h-5" />
            <span className="text-xs mt-1">Approvals</span>
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex flex-col items-center p-2 ${activeTab === "users" ? "text-primary" : "text-muted-foreground"}`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs mt-1">Users</span>
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex flex-col items-center p-2 ${activeTab === "reports" ? "text-primary" : "text-muted-foreground"}`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs mt-1">Reports</span>
          </button>
        </div>
      </div>
    </div>
  )
}