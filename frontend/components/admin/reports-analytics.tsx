"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Calendar,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  DollarSign,
  Clock,
  PieChart,
  BarChart3,
  LineChart,
  FileText
} from "lucide-react"

import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts"
import { DateRange } from "react-day-picker"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"

export function ReportsAnalytics() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31),
  })
  const [reportType, setReportType] = useState("overview")

  const monthlyData = [
    { month: 'Jan', placements: 45, applications: 320, revenue: 45000 },
    { month: 'Feb', placements: 52, applications: 380, revenue: 52000 },
    { month: 'Mar', placements: 60, applications: 420, revenue: 60000 },
    { month: 'Apr', placements: 65, applications: 450, revenue: 65000 },
    { month: 'May', placements: 70, applications: 500, revenue: 70000 },
    { month: 'Jun', placements: 78, applications: 520, revenue: 78000 },
    { month: 'Jul', placements: 85, applications: 580, revenue: 85000 },
    { month: 'Aug', placements: 90, applications: 620, revenue: 90000 },
    { month: 'Sep', placements: 95, applications: 680, revenue: 95000 },
    { month: 'Oct', placements: 100, applications: 720, revenue: 100000 },
    { month: 'Nov', placements: 110, applications: 780, revenue: 110000 },
    { month: 'Dec', placements: 120, applications: 850, revenue: 120000 },
  ]

  const companyPlacements = [
    { company: 'Google', placements: 45, avgSalary: 15.5 },
    { company: 'Microsoft', placements: 38, avgSalary: 14.2 },
    { company: 'Amazon', placements: 32, avgSalary: 13.8 },
    { company: 'Apple', placements: 28, avgSalary: 16.0 },
    { company: 'Meta', placements: 25, avgSalary: 15.2 },
    { company: 'Netflix', placements: 20, avgSalary: 17.5 },
  ]

  const departmentData = [
    { department: 'CSE', placements: 120, avgSalary: 12.5 },
    { department: 'ECE', placements: 95, avgSalary: 10.8 },
    { department: 'ME', placements: 75, avgSalary: 9.5 },
    { department: 'CE', placements: 60, avgSalary: 8.8 },
    { department: 'EE', placements: 50, avgSalary: 9.2 },
  ]

  const pieData = [
    { name: 'Full Time', value: 65, color: '#0088FE' },
    { name: 'Internship', value: 25, color: '#00C49F' },
    { name: 'Part Time', value: 10, color: '#FFBB28' },
  ]

  const reports = [
    { id: 1, name: 'Monthly Placement Report', type: 'PDF', date: '2024-01-15', size: '2.4 MB' },
    { id: 2, name: 'Student Performance Analysis', type: 'Excel', date: '2024-01-10', size: '1.8 MB' },
    { id: 3, name: 'Company Engagement Report', type: 'PDF', date: '2024-01-05', size: '3.2 MB' },
    { id: 4, name: 'Yearly Placement Summary', type: 'PDF', date: '2023-12-30', size: '4.5 MB' },
    { id: 5, name: 'Department-wise Analysis', type: 'Excel', date: '2023-12-25', size: '1.2 MB' },
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  const handleDownloadReport = (reportId: number) => {
    console.log("Downloading report:", reportId)
    // API call to download report
  }

  const handleGenerateReport = () => {
    console.log("Generating new report")
    // API call to generate report
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-muted-foreground">Generate and analyze placement reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleGenerateReport}>
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        {[
          { id: 'overview', label: 'Overview', icon: PieChart },
          { id: 'placements', label: 'Placements', icon: Users },
          // { id: 'companies', label: 'Companies', icon: Building2 },
          { id: 'revenue', label: 'Revenue', icon: DollarSign },
          { id: 'trends', label: 'Trends', icon: TrendingUp },
          { id: 'reports', label: 'Reports', icon: FileText },
        ].map((type) => (
          <Button
            key={type.id}
            variant={reportType === type.id ? "default" : "outline"}
            onClick={() => setReportType(type.id)}
            className="justify-start"
          >
            <type.icon className="h-4 w-4 mr-2" />
            {type.label}
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Placements</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">850</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+12.5% from last year</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Salary (LPA)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.8</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+8.2% from last year</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+15 new this quarter</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.5%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+5.2% from last year</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      {reportType === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Placements Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Placements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="placements" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Placement Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Placement Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
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
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department-wise Placements */}
          <Card>
            <CardHeader>
              <CardTitle>Department-wise Placements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="placements" fill="#8884d8" name="Placements" />
                    <Bar dataKey="avgSalary" fill="#82ca9d" name="Avg Salary (LPA)" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {reportType === 'companies' && (
        <Card>
          <CardHeader>
            <CardTitle>Top Companies by Placements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={companyPlacements} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="company" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="placements" fill="#8884d8" name="Placements" />
                  <Bar dataKey="avgSalary" fill="#82ca9d" name="Avg Salary (LPA)" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {reportType === 'trends' && (
        <Card>
          <CardHeader>
            <CardTitle>Yearly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="placements" stroke="#8884d8" strokeWidth={2} name="Placements" />
                  <Line type="monotone" dataKey="applications" stroke="#82ca9d" strokeWidth={2} name="Applications" />
                  <Line type="monotone" dataKey="revenue" stroke="#ffc658" strokeWidth={2} name="Revenue (₹)" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {reportType === 'reports' && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{report.type}</span>
                        <span>•</span>
                        <span>{report.date}</span>
                        <span>•</span>
                        <span>{report.size}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadReport(report.id)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select defaultValue="monthly">
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly Report</SelectItem>
                  <SelectItem value="quarterly">Quarterly Report</SelectItem>
                  <SelectItem value="yearly">Yearly Report</SelectItem>
                  <SelectItem value="custom">Custom Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Include Data</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select data to include" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Data</SelectItem>
                  <SelectItem value="placements">Placements Only</SelectItem>
                  <SelectItem value="companies">Companies Only</SelectItem>
                  <SelectItem value="students">Students Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline">
              Preview
            </Button>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}