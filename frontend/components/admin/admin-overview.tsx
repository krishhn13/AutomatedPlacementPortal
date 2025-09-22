"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, Building2, Briefcase, CheckCircle, AlertTriangle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { AnimatedCounter } from "@/components/ui/animated-counter"

const stats = [
  {
    title: "Total Students",
    value: 1247,
    change: "+12% this month",
    icon: Users,
    color: "text-primary",
  },
  {
    title: "Active Companies",
    value: 89,
    change: "+5 this week",
    icon: Building2,
    color: "text-secondary",
  },
  {
    title: "Job Postings",
    value: 156,
    change: "+23 this month",
    icon: Briefcase,
    color: "text-accent",
  },
  {
    title: "Successful Placements",
    value: 342,
    change: "+18 this month",
    icon: CheckCircle,
    color: "text-green-600",
  },
]

const placementData = [
  { month: "Jan", placements: 45 },
  { month: "Feb", placements: 52 },
  { month: "Mar", placements: 48 },
  { month: "Apr", placements: 61 },
  { month: "May", placements: 55 },
  { month: "Jun", placements: 67 },
]

const branchData = [
  { name: "Computer Science", value: 35, color: "#3b82f6" },
  { name: "Electronics", value: 25, color: "#10b981" },
  { name: "Mechanical", value: 20, color: "#f59e0b" },
  { name: "Civil", value: 12, color: "#ef4444" },
  { name: "Others", value: 8, color: "#8b5cf6" },
]

const pendingApprovals = [
  {
    type: "Company Registration",
    count: 5,
    icon: Building2,
    color: "text-secondary",
  },
  {
    type: "Job Postings",
    count: 12,
    icon: Briefcase,
    color: "text-accent",
  },
  {
    type: "Student Verifications",
    count: 8,
    icon: Users,
    color: "text-primary",
  },
]

export function AdminOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="glass-card hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">
                      <AnimatedCounter value={stat.value} />
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg bg-muted/30 ${stat.color} transition-all duration-300 hover:scale-110`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placement Trends */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Placement Trends</CardTitle>
            <CardDescription>Monthly placement statistics over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={placementData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Bar dataKey="placements" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Branch-wise Distribution */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Branch-wise Placements</CardTitle>
            <CardDescription>Distribution of placements across different branches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={branchData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {branchData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {branchData.map((branch) => (
                <div key={branch.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: branch.color }}></div>
                  <span className="text-sm">{branch.name}</span>
                  <span className="text-sm text-muted-foreground">({branch.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
            Pending Approvals
          </CardTitle>
          <CardDescription>Items requiring your immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pendingApprovals.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.type}
                  className="p-4 border border-border/50 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-muted/30 ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{item.type}</p>
                        <p className="text-sm text-muted-foreground">Pending approval</p>
                      </div>
                    </div>
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">{item.count}</Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Overall platform performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Server Uptime</span>
                <span className="font-medium">99.9%</span>
              </div>
              <Progress value={99.9} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Database Performance</span>
                <span className="font-medium">95%</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>API Response Time</span>
                <span className="font-medium">120ms avg</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/20">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New company registered</p>
                  <p className="text-xs text-muted-foreground">TechStart Inc. - 2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/20">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Job posting approved</p>
                  <p className="text-xs text-muted-foreground">Senior Developer role - 5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/20">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Student placement confirmed</p>
                  <p className="text-xs text-muted-foreground">Alex Smith at TechCorp - 10 minutes ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
