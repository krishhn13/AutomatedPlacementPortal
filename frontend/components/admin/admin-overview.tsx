"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
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
  Eye,
  AlertTriangle,
  RefreshCw
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

// API endpoints - replace with your actual backend URLs
const API_ENDPOINTS = {
  DASHBOARD_STATS: '/api/admin/dashboard-stats',
  RECENT_ACTIVITY: '/api/admin/recent-activity',
  MONTHLY_STATS: '/api/admin/monthly-stats',
  DEPARTMENT_STATS: '/api/admin/department-applications'
}

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
  const [departmentData, setDepartmentData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Fetch all data in parallel for better performance
      const [statsRes, activityRes, chartRes, deptRes] = await Promise.allSettled([
        fetch(API_ENDPOINTS.DASHBOARD_STATS),
        fetch(API_ENDPOINTS.RECENT_ACTIVITY),
        fetch(API_ENDPOINTS.MONTHLY_STATS),
        fetch(API_ENDPOINTS.DEPARTMENT_STATS)
      ])

      // Handle stats response
      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        const statsData = await statsRes.value.json()
        setStats(statsData)
      } else {
        throw new Error('Failed to load dashboard statistics')
      }

      // Handle activity response
      if (activityRes.status === 'fulfilled' && activityRes.value.ok) {
        const activityData = await activityRes.value.json()
        setRecentActivity(activityData.slice(0, 5)) // Limit to 5 most recent
      }

      // Handle chart data response
      if (chartRes.status === 'fulfilled' && chartRes.value.ok) {
        const chartData = await chartRes.value.json()
        setChartData(chartData)
      }

      // Handle department data response
      if (deptRes.status === 'fulfilled' && deptRes.value.ok) {
        const deptData = await deptRes.value.json()
        setDepartmentData(deptData)
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      
      // Optional: Set fallback mock data for development
      if (process.env.NODE_ENV === 'development') {
        setFallbackData()
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Fallback data for development/offline mode
  const setFallbackData = () => {
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

    setDepartmentData([
      { department: 'CSE', applications: 320 },
      { department: 'ECE', applications: 280 },
      { department: 'ME', applications: 180 },
      { department: 'CE', applications: 160 },
      { department: 'EE', applications: 140 },
    ])
  }

  useEffect(() => {
    fetchDashboardData()
    
    // Optional: Set up polling for real-time updates
    const intervalId = setInterval(() => {
      fetchDashboardData()
    }, 300000) // Refresh every 5 minutes

    return () => clearInterval(intervalId)
  }, [])

  const pieData = [
    { name: 'Placed', value: stats.placementRate, color: '#10B981' },
    { name: 'In Process', value: 15, color: '#FBBF24' },
    { name: 'Not Placed', value: 7, color: '#EF4444' }
  ]

  // Loading skeleton component
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-3 mb-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-4">
              <AlertTriangle className="h-12 w-12 text-destructive" />
              <div>
                <h3 className="text-lg font-semibold text-destructive">Failed to Load Dashboard</h3>
                <p className="text-muted-foreground mt-1">{error}</p>
                <Button 
                  onClick={fetchDashboardData} 
                  variant="outline" 
                  className="mt-4"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Grid - Responsive from 1 to 6 columns */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Students */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 sm:p-6 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Companies */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 sm:p-6 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{stats.totalCompanies}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span>+5% from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 sm:p-6 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{stats.pendingApprovals}</div>
            <Button variant="link" className="p-0 h-auto text-xs mt-1">Review now</Button>
          </CardContent>
        </Card>

        {/* Active Jobs */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 sm:p-6 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Active Jobs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{stats.activeJobs}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span>42 applications today</span>
            </div>
          </CardContent>
        </Card>

        {/* Placement Rate */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 sm:p-6 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Placement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{stats.placementRate}%</div>
            <Progress value={stats.placementRate} className="h-2 mt-2" />
          </CardContent>
        </Card>

        {/* Avg Salary */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 sm:p-6 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Avg Salary (LPA)</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">₹</span>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{stats.avgSalary}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span>+1.2L from last year</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity - Mobile optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Line Chart */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Monthly Statistics</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-6 pt-0">
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={chartData} 
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      fontSize: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="students" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="jobs" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="placements" 
                    stroke="#ffc658" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity - Mobile optimized */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">View All</Button>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              {recentActivity.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2 rounded-full flex-shrink-0 ${
                    activity.status === 'approved' ? 'bg-green-100' :
                    activity.status === 'rejected' ? 'bg-red-100' :
                    'bg-yellow-100'
                  }`}>
                    {activity.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {activity.status === 'rejected' && <XCircle className="h-4 w-4 text-red-600" />}
                    {activity.status === 'pending' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <span className="font-medium text-sm truncate">{activity.user}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{activity.action}</p>
                    <Badge 
                      variant="outline" 
                      className="mt-2 text-xs"
                    >
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Bar Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Applications by Department</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-6 pt-0">
            <div className="h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={departmentData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="department" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      fontSize: '12px',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="applications" 
                    fill="#8884d8" 
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Placement Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Placement Distribution</CardTitle>
            <Button variant="outline" size="sm" className="gap-1 sm:gap-2 text-xs">
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
              Export
            </Button>
          </CardHeader>
          <CardContent className="p-2 sm:p-6 pt-0">
            <div className="h-64 sm:h-72">
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
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentage']}
                    contentStyle={{ 
                      fontSize: '12px',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="text-center">
                  <div className="text-lg sm:text-2xl font-bold">{item.value}%</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{item.name}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Refresh Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Button 
          onClick={fetchDashboardData}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}