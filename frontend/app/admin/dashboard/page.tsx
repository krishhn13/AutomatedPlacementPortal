"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Building2, TrendingUp, Clock, BarChart3 } from "lucide-react"
import { PendingCompanies } from "@/components/admin/pending-companies"
import { UserManagement } from "@/components/admin/user-management"
import { PlacementReports } from "@/components/admin/placement-reports"
import { Header } from "@/components/layout/header"

// Mock data
const mockPendingCompanies = [
  {
    id: "1",
    companyName: "TechStart Solutions",
    email: "hr@techstart.com",
    contactPerson: "Sarah Johnson",
    description: "Innovative startup focused on AI and machine learning solutions.",
    website: "https://techstart.com",
    location: "Pune, India",
    registeredDate: "2024-01-20",
    status: "pending" as const,
  },
  {
    id: "2",
    companyName: "DataFlow Analytics",
    email: "recruitment@dataflow.com",
    contactPerson: "Michael Chen",
    description: "Leading data analytics company serving Fortune 500 clients.",
    website: "https://dataflow.com",
    location: "Hyderabad, India",
    registeredDate: "2024-01-18",
    status: "pending" as const,
  },
]

const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@university.edu",
    role: "student" as const,
    rollNo: "CS2021001",
    branch: "Computer Science",
    cgpa: 8.5,
    registeredDate: "2024-01-15",
    status: "active" as const,
  },
  {
    id: "2",
    name: "TechCorp Solutions",
    email: "hr@techcorp.com",
    role: "company" as const,
    contactPerson: "Jane Smith",
    isApproved: true,
    registeredDate: "2024-01-10",
    status: "active" as const,
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice.johnson@university.edu",
    role: "student" as const,
    rollNo: "IT2021002",
    branch: "Information Technology",
    cgpa: 9.0,
    registeredDate: "2024-01-12",
    status: "active" as const,
  },
]

const mockPlacementStats = {
  totalStudents: 150,
  totalPlaced: 89,
  totalCompanies: 25,
  averagePackage: 12.5,
  branchWiseStats: [
    { branch: "Computer Science", total: 60, placed: 45, percentage: 75 },
    { branch: "Information Technology", total: 45, placed: 28, percentage: 62 },
    { branch: "Electronics", total: 30, placed: 12, percentage: 40 },
    { branch: "Mechanical", total: 15, placed: 4, percentage: 27 },
  ],
  monthlyPlacements: [
    { month: "Jan", placements: 15 },
    { month: "Feb", placements: 23 },
    { month: "Mar", placements: 18 },
    { month: "Apr", placements: 33 },
  ],
}

export default function AdminDashboard() {
  const [pendingCompanies, setPendingCompanies] = useState(mockPendingCompanies)
  const [users, setUsers] = useState(mockUsers)
  const [placementStats] = useState(mockPlacementStats)

  const handleApproveCompany = (companyId: string) => {
    setPendingCompanies((companies) =>
      companies.map((company) => (company.id === companyId ? { ...company, status: "approved" as const } : company)),
    )
  }

  const handleRejectCompany = (companyId: string) => {
    setPendingCompanies((companies) =>
      companies.map((company) => (company.id === companyId ? { ...company, status: "rejected" as const } : company)),
    )
  }

  const handleToggleUserStatus = (userId: string) => {
    setUsers((users) =>
      users.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "active" ? ("inactive" as const) : ("active" as const) }
          : user,
      ),
    )
  }

  const pendingCount = pendingCompanies.filter((c) => c.status === "pending").length
  const activeUsers = users.filter((u) => u.status === "active").length
  const placementRate = Math.round((placementStats.totalPlaced / placementStats.totalStudents) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <Header title="Admin Dashboard" subtitle="Training & Placement Cell" userRole="admin" userName="Administrator" />

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-primary-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approvals</p>
                  <p className="text-2xl font-bold text-primary-900">{pendingCount}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-primary-900">{activeUsers}</p>
                </div>
                <Users className="h-8 w-8 text-primary-900" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Placement Rate</p>
                  <p className="text-2xl font-bold text-primary-900">{placementRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Companies</p>
                  <p className="text-2xl font-bold text-primary-900">{placementStats.totalCompanies}</p>
                </div>
                <Building2 className="h-8 w-8 text-primary-900" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals Alert */}
        {pendingCount > 0 && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-200 rounded-full">
                  <Clock className="h-5 w-5 text-yellow-800" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-800">Pending Company Approvals</h3>
                  <p className="text-yellow-700">
                    You have {pendingCount} company registration{pendingCount > 1 ? "s" : ""} waiting for approval.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs defaultValue="companies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="companies">Company Approvals</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="reports">Placement Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="companies" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-semibold text-primary-900">Company Registration Approvals</h2>
              <Badge variant="secondary" className="bg-primary-50 text-primary-900">
                {pendingCount} pending
              </Badge>
            </div>
            <PendingCompanies
              companies={pendingCompanies}
              onApprove={handleApproveCompany}
              onReject={handleRejectCompany}
            />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <h2 className="text-xl font-serif font-semibold text-primary-900">User Management</h2>
            <UserManagement users={users} onToggleStatus={handleToggleUserStatus} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <h2 className="text-xl font-serif font-semibold text-primary-900">Placement Reports</h2>
            <PlacementReports stats={placementStats} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl font-serif font-semibold text-primary-900">Analytics Dashboard</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-primary-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary-900">
                    <BarChart3 className="h-5 w-5" />
                    Placement Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary-50 rounded-lg">
                      <p className="text-2xl font-bold text-primary-900">{placementStats.totalPlaced}</p>
                      <p className="text-sm text-text-default">Students Placed</p>
                    </div>
                    <div className="text-center p-4 bg-gold/10 rounded-lg">
                      <p className="text-2xl font-bold text-primary-900">{placementStats.averagePackage} LPA</p>
                      <p className="text-sm text-text-default">Average Package</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary-200">
                <CardHeader>
                  <CardTitle className="text-primary-900">Branch-wise Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {placementStats.branchWiseStats.map((branch) => (
                      <div key={branch.branch} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{branch.branch}</span>
                          <span>
                            {branch.placed}/{branch.total} ({branch.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-900 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${branch.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
