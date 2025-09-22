"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, Briefcase, Clock, Eye, UserCheck, Building2 } from "lucide-react"

const stats = [
  {
    title: "Active Job Postings",
    value: "12",
    change: "+3 this month",
    icon: Briefcase,
    color: "text-primary",
  },
  {
    title: "Total Applications",
    value: "247",
    change: "+45 this week",
    icon: Users,
    color: "text-secondary",
  },
  {
    title: "Interviews Scheduled",
    value: "18",
    change: "+8 this week",
    icon: Clock,
    color: "text-accent",
  },
  {
    title: "Successful Hires",
    value: "6",
    change: "+2 this month",
    icon: UserCheck,
    color: "text-green-600",
  },
]

const recentJobs = [
  {
    title: "Senior Software Engineer",
    applications: 45,
    views: 234,
    posted: "3 days ago",
    status: "active",
  },
  {
    title: "Product Manager",
    applications: 32,
    views: 189,
    posted: "1 week ago",
    status: "active",
  },
  {
    title: "UX Designer",
    applications: 28,
    views: 156,
    posted: "2 weeks ago",
    status: "closed",
  },
]

export function CompanyOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-muted/30 ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Job Performance */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Job Performance</CardTitle>
            <CardDescription>Track how your latest job postings are performing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.map((job, index) => (
                <div key={index} className="p-4 border border-border/50 rounded-lg bg-muted/20">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{job.title}</h4>
                    <Badge variant={job.status === "active" ? "default" : "secondary"}>
                      {job.status === "active" ? "Active" : "Closed"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {job.applications} applications
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {job.views} views
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Posted {job.posted}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Company Profile Completion */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Company Profile</CardTitle>
            <CardDescription>Complete your profile to attract better candidates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">TechCorp Inc.</h3>
                  <p className="text-sm text-muted-foreground">Technology & Software</p>
                  <Badge variant="secondary" className="mt-1">
                    Verified Company
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Profile Completion</span>
                  <span className="font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Company Description</span>
                  <Badge variant="outline" className="bg-accent/10 text-accent">
                    Complete
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Company Logo</span>
                  <Badge variant="outline" className="bg-accent/10 text-accent">
                    Complete
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Benefits & Perks</span>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">
                    Pending
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
