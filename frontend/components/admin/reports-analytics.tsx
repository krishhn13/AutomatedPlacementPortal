"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, TrendingUp, Users, Building2, Briefcase, Target } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"

const placementTrends = [
  { month: "Jan", placements: 45, applications: 234 },
  { month: "Feb", placements: 52, applications: 267 },
  { month: "Mar", placements: 48, applications: 298 },
  { month: "Apr", placements: 61, applications: 312 },
  { month: "May", placements: 55, applications: 289 },
  { month: "Jun", placements: 67, applications: 345 },
  { month: "Jul", placements: 72, applications: 378 },
  { month: "Aug", placements: 68, applications: 356 },
  { month: "Sep", placements: 75, applications: 389 },
  { month: "Oct", placements: 82, applications: 412 },
  { month: "Nov", placements: 78, applications: 398 },
  { month: "Dec", placements: 85, applications: 445 },
]

const branchWiseData = [
  { branch: "Computer Science", students: 450, placed: 342, percentage: 76 },
  { branch: "Electronics", students: 320, placed: 234, percentage: 73 },
  { branch: "Mechanical", students: 280, placed: 189, percentage: 68 },
  { branch: "Civil", students: 200, placed: 123, percentage: 62 },
  { branch: "Chemical", students: 150, placed: 89, percentage: 59 },
]

const companyWiseData = [
  { name: "TechCorp Inc.", hires: 45, color: "#3b82f6" },
  { name: "StartupXYZ", hires: 32, color: "#10b981" },
  { name: "InnovateCorp", hires: 28, color: "#f59e0b" },
  { name: "DataFlow", hires: 24, color: "#ef4444" },
  { name: "Others", hires: 67, color: "#8b5cf6" },
]

const salaryRanges = [
  { range: "0-3 LPA", count: 45 },
  { range: "3-6 LPA", count: 123 },
  { range: "6-10 LPA", count: 89 },
  { range: "10-15 LPA", count: 56 },
  { range: "15+ LPA", count: 23 },
]

export function ReportsAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-muted-foreground">Comprehensive insights into placement activities</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="2024">
            <SelectTrigger className="w-32 glass">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-card">
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Placements</p>
                <p className="text-2xl font-bold">782</p>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15% from last year
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Target className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Placement Rate</p>
                <p className="text-2xl font-bold">68.5%</p>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +3.2% from last year
                </p>
              </div>
              <div className="p-3 rounded-lg bg-accent/10">
                <Users className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Package</p>
                <p className="text-2xl font-bold">₹6.8L</p>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% from last year
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/10">
                <Briefcase className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Partner Companies</p>
                <p className="text-2xl font-bold">89</p>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8 new this year
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placement Trends */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Placement Trends</CardTitle>
            <CardDescription>Monthly placement and application statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={placementTrends}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stackId="1"
                  stroke="hsl(var(--secondary))"
                  fill="hsl(var(--secondary))"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="placements"
                  stackId="2"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.8}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Company-wise Hiring */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Top Hiring Companies</CardTitle>
            <CardDescription>Companies with highest number of hires</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={companyWiseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="hires"
                  >
                    {companyWiseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {companyWiseData.map((company) => (
                <div key={company.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: company.color }}></div>
                  <span className="text-sm">{company.name}</span>
                  <span className="text-sm text-muted-foreground">({company.hires})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Branch-wise Performance */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Branch-wise Placement Performance</CardTitle>
          <CardDescription>Detailed breakdown of placements by academic branch</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {branchWiseData.map((branch) => (
              <div key={branch.branch} className="p-4 border border-border/50 rounded-lg bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{branch.branch}</h4>
                  <Badge className="bg-accent/10 text-accent border-accent/20">{branch.percentage}% placed</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                  <div>
                    <span className="text-muted-foreground">Total Students:</span>
                    <span className="font-medium ml-2">{branch.students}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Placed:</span>
                    <span className="font-medium ml-2">{branch.placed}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Remaining:</span>
                    <span className="font-medium ml-2">{branch.students - branch.placed}</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${branch.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Salary Distribution */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Salary Distribution</CardTitle>
          <CardDescription>Distribution of placement packages across different salary ranges</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salaryRanges} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis type="number" />
              <YAxis dataKey="range" type="category" width={80} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
