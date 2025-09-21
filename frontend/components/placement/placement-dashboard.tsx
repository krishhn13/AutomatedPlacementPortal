"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, Building2, Calendar, Award, Target } from "lucide-react"

interface PlacementDashboardProps {
  stats: {
    totalStudents: number
    totalPlaced: number
    totalCompanies: number
    averagePackage: number
    placementRate: number
    activeJobs: number
  }
}

export function PlacementDashboard({ stats }: PlacementDashboardProps) {
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
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
              <p className="text-2xl font-bold text-primary-900">{stats.placementRate}%</p>
            </div>
            <Target className="h-8 w-8 text-primary-900" />
          </div>
          <Progress value={stats.placementRate} className="mt-2 h-2" />
        </CardContent>
      </Card>

      <Card className="border-primary-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Companies</p>
              <p className="text-2xl font-bold text-primary-900">{stats.totalCompanies}</p>
            </div>
            <Building2 className="h-8 w-8 text-primary-900" />
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
            <TrendingUp className="h-8 w-8 text-gold" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Jobs</p>
              <p className="text-2xl font-bold text-primary-900">{stats.activeJobs}</p>
            </div>
            <Calendar className="h-8 w-8 text-primary-900" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
