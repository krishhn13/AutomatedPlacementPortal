"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  Building2, 
  GraduationCap, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export function AdminOverview() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    pendingApprovals: 0,
    activeJobs: 0,
    placementRate: 0,
    avgSalary: 0
  })

  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    // Mock data fetch
    setStats({
      totalStudents: 1245,
      totalCompanies: 89,
      pendingApprovals: 23,
      activeJobs: 156,
      placementRate: 78.5,
      avgSalary: 8.2
    })

    setRecentActivity([
      { id: 1, user: "John Doe", action: "Registered as Student", time: "5 min ago", status: "pending" },
      { id: 2, user: "Tech Corp", action: "Posted new job", time: "15 min ago", status: "approved" },
      { id: 3, user: "Jane Smith", action: "Applied for internship", time: "30 min ago", status: "pending" },
      { id: 4, user: "Innovate Inc", action: "Company verification", time: "1 hour ago", status: "rejected" },
      { id: 5, user: "Mike Johnson", action: "Profile updated", time: "2 hours ago", status: "approved" },
    ])

    setChartData([
      { month: 'Jan', students: 65, jobs: 45, placements: 32 },
      { month: 'Feb', students: 78, jobs: 52, placements: 40 },
      { month: 'Mar', students: 92, jobs: 67, placements: 55 },
      { month: 'Apr', students: 105, jobs: 78, placements: 65 },
      { month: 'May', students: 124, jobs: 89, placements: 78 },
      { month: 'Jun', students: 145, jobs: 102, placements: 94 },
    ])
  }, [])

  const pieData = [
    { name: 'Placed', value: 78, color: '#10B981' },
    { name: 'In Process', value: 15, color: '#FBBF24' },
    { name: 'Not Placed', value: 7, color: '#EF4444' }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span>+5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <Button variant="link" className="p-0 h-auto text-xs">Review now</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>42 applications today</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.placementRate}%</div>
            <Progress value={stats.placementRate} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Salary (LPA)</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">₹</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgSalary}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span>+1.2L from last year</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="students" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="jobs" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="placements" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    activity.status === 'approved' ? 'bg-green-100' :
                    activity.status === 'rejected' ? 'bg-red-100' :
                    'bg-yellow-100'
                  }`}>
                    {activity.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {activity.status === 'rejected' && <XCircle className="h-4 w-4 text-red-600" />}
                    {activity.status === 'pending' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                    <Badge variant="outline" className="mt-1">
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Bar Chart and Placement Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Applications by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { department: 'CSE', applications: 320 },
                  { department: 'ECE', applications: 280 },
                  { department: 'ME', applications: 180 },
                  { department: 'CE', applications: 160 },
                  { department: 'EE', applications: 140 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applications" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Placement Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Placement Distribution</CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="text-center">
                  <div className="text-2xl font-bold">{item.value}%</div>
                  <div className="text-sm text-muted-foreground">{item.name}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}