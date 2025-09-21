"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Download, TrendingUp, Users, Building2, Award } from "lucide-react"

interface PlacementStats {
  totalStudents: number
  totalPlaced: number
  totalCompanies: number
  averagePackage: number
  branchWiseStats: Array<{
    branch: string
    total: number
    placed: number
    percentage: number
  }>
  monthlyPlacements: Array<{
    month: string
    placements: number
  }>
}

interface PlacementReportsProps {
  stats: PlacementStats
}

export function PlacementReports({ stats }: PlacementReportsProps) {
  const placementRate = Math.round((stats.totalPlaced / stats.totalStudents) * 100)

  const handleDownloadReport = (type: string) => {
    // Simulate report download
    console.log(`Downloading ${type} report...`)
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-primary-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-primary-900">{stats.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-primary-900" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Students Placed</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalPlaced}</p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
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
              <TrendingUp className="h-8 w-8 text-primary-900" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Package</p>
                <p className="text-2xl font-bold text-gold">{stats.averagePackage} LPA</p>
              </div>
              <Building2 className="h-8 w-8 text-gold" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Branch-wise Statistics */}
      <Card className="border-primary-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-serif text-primary-900">Branch-wise Placement Statistics</CardTitle>
            <Button variant="outline" size="sm" onClick={() => handleDownloadReport("branch-wise")}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {stats.branchWiseStats.map((branch) => (
              <div key={branch.branch} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-primary-900">{branch.branch}</h3>
                    <p className="text-sm text-text-default">
                      {branch.placed} out of {branch.total} students placed
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={branch.percentage >= 70 ? "default" : branch.percentage >= 50 ? "secondary" : "outline"}
                      className={
                        branch.percentage >= 70
                          ? "bg-green-100 text-green-800"
                          : branch.percentage >= 50
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {branch.percentage}%
                    </Badge>
                  </div>
                </div>
                <Progress value={branch.percentage} className="h-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Placement Trends */}
      <Card className="border-primary-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-serif text-primary-900">Monthly Placement Trends</CardTitle>
            <Button variant="outline" size="sm" onClick={() => handleDownloadReport("monthly")}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.monthlyPlacements.map((month) => (
              <div key={month.month} className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-primary-900" />
                  <span className="font-medium text-primary-900">{month.month} 2024</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-900">{month.placements}</p>
                  <p className="text-sm text-text-default">placements</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Download All Reports */}
      <Card className="border-primary-200">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-primary-900">Export Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => handleDownloadReport("comprehensive")}
            >
              <Download className="h-6 w-6" />
              <span>Comprehensive Report</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => handleDownloadReport("student-list")}
            >
              <Users className="h-6 w-6" />
              <span>Student List</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => handleDownloadReport("company-list")}
            >
              <Building2 className="h-6 w-6" />
              <span>Company List</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
