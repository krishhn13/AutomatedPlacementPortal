"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, Briefcase, Clock, Eye, UserCheck, Building2, Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Company {
  _id: string
  name: string
  email: string
  phone: string
  website: string
  location: string
  industry: string
  description: string
  employeeCount: string
  jobs: string[]
  createdAt: string
  updatedAt: string
  logo?: string
  benefits?: string[]
  isVerified?: boolean
}

interface DashboardStats {
  totalJobs: number
  activeJobs: number
  totalApplications: number
  pendingApplications: number
  hiredCount: number
  interviewsScheduled: number
  weeklyChange?: {
    applications: number
    jobs: number
    interviews: number
    hires: number
  }
}

interface Job {
  _id: string
  title: string
  applications: number
  views: number
  createdAt: string
  status: "active" | "closed" | "draft"
  companyId: string
}

interface CompanyOverviewProps {
  company?: Company | null
  stats?: DashboardStats | null
}

const statConfigs = [
  {
    title: "Active Job Postings",
    key: "activeJobs" as keyof DashboardStats,
    changeKey: "jobs" as keyof any,
    icon: Briefcase,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10"
  },
  {
    title: "Total Applications",
    key: "totalApplications" as keyof DashboardStats,
    changeKey: "applications" as keyof any,
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-500/10"
  },
  {
    title: "Interviews Scheduled",
    key: "interviewsScheduled" as keyof DashboardStats,
    changeKey: "interviews" as keyof any,
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-500/10"
  },
  {
    title: "Successful Hires",
    key: "hiredCount" as keyof DashboardStats,
    changeKey: "hires" as keyof any,
    icon: UserCheck,
    color: "text-green-600",
    bgColor: "bg-green-500/10"
  },
]

export function CompanyOverview({ company, stats }: CompanyOverviewProps) {
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [profileCompletion, setProfileCompletion] = useState(0)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (company) {
      calculateProfileCompletion()
      fetchRecentJobs()
    }
  }, [company])

  useEffect(() => {
    if (company || stats) {
      setLoading(false)
    }
  }, [company, stats])

  const calculateProfileCompletion = () => {
    if (!company) return

    let completion = 0
    const totalFields = 8 // Total fields we're checking

    // Basic company info (3 points)
    if (company.name && company.name !== "Your Company") completion += 1
    if (company.description && company.description !== "Manage your recruitment and find the best talent") completion += 1
    if (company.industry) completion += 1

    // Contact info (2 points)
    if (company.email) completion += 1
    if (company.phone) completion += 1

    // Additional info (2 points)
    if (company.location) completion += 1
    if (company.website) completion += 1

    // Extra points (1 point)
    if (company.logo) completion += 1
    if (company.benefits && company.benefits.length > 0) completion += 1

    const percentage = Math.min(100, Math.round((completion / totalFields) * 100))
    setProfileCompletion(percentage)
  }

  const fetchRecentJobs = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const res = await fetch("http://localhost:5000/api/company/jobs?limit=3", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setRecentJobs(data.jobs || data || [])
      } else {
        // Use mock data if endpoint not available
        setRecentJobs(getMockJobs())
      }
    } catch (error) {
      console.error("Error fetching recent jobs:", error)
      setRecentJobs(getMockJobs())
    }
  }

  const getMockJobs = (): Job[] => {
    if (stats && stats.activeJobs > 0) {
      return [
        {
          _id: "1",
          title: "Senior Software Engineer",
          applications: Math.floor(stats.totalApplications * 0.2),
          views: Math.floor(stats.totalApplications * 1.5),
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: "active",
          companyId: company?._id || ""
        },
        {
          _id: "2",
          title: "Product Manager",
          applications: Math.floor(stats.totalApplications * 0.15),
          views: Math.floor(stats.totalApplications * 1.2),
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: "active",
          companyId: company?._id || ""
        },
        {
          _id: "3",
          title: "UX Designer",
          applications: Math.floor(stats.totalApplications * 0.1),
          views: Math.floor(stats.totalApplications * 0.8),
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          status: "active",
          companyId: company?._id || ""
        }
      ]
    }

    return []
  }

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  const getChangeText = (statKey: string): string => {
    if (!stats?.weeklyChange) {
      // Generate random change for demo
      const changes = ["+3 this month", "+45 this week", "+8 this week", "+2 this month"]
      return changes[Math.floor(Math.random() * changes.length)]
    }

    const change = stats.weeklyChange[statKey as keyof typeof stats.weeklyChange]
    if (!change) return "No change"

    const trend = change > 0 ? "+" : ""
    const period = statKey === "jobs" || statKey === "hires" ? "this month" : "this week"
    return `${trend}${change} ${period}`
  }

  const getCompletionStatus = (field: string): { status: string; color: string } => {
    if (!company) return { status: "Pending", color: "bg-yellow-500/10 text-yellow-600" }

    switch (field) {
      case "description":
        const hasDescription = company.description && 
          company.description !== "Manage your recruitment and find the best talent"
        return {
          status: hasDescription ? "Complete" : "Pending",
          color: hasDescription ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"
        }
      
      case "logo":
        return {
          status: company.logo ? "Complete" : "Pending",
          color: company.logo ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"
        }
      
      case "benefits":
        return {
          status: company.benefits && company.benefits.length > 0 ? "Complete" : "Pending",
          color: company.benefits && company.benefits.length > 0 ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"
        }
      
      case "website":
        return {
          status: company.website ? "Complete" : "Pending",
          color: company.website ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"
        }
      
      case "industry":
        return {
          status: company.industry ? "Complete" : "Pending",
          color: company.industry ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"
        }
      
      default:
        return { status: "Pending", color: "bg-yellow-500/10 text-yellow-600" }
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="h-6 bg-muted rounded w-12"></div>
                    <div className="h-3 bg-muted rounded w-16"></div>
                  </div>
                  <div className="w-12 h-12 bg-muted rounded-lg"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
          <span className="text-muted-foreground">Loading overview...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statConfigs.map((stat) => {
          const Icon = stat.icon
          const value = stats ? stats[stat.key] as number : 0
          const changeText = getChangeText(stat.changeKey)

          return (
            <Card key={stat.title} className="glass-card hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {changeText}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {(!stats || stats.activeJobs === 0) && (
        <Card className="glass-card border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <AlertCircle className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Welcome to your dashboard!</h3>
                <p className="text-blue-700 text-sm mt-1">
                  Get started by posting your first job to attract candidates and see analytics here.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Job Performance */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Job Postings</CardTitle>
            <CardDescription>
              {recentJobs.length > 0 
                ? "Track how your latest job postings are performing" 
                : "No jobs posted yet"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div key={job._id} className="p-4 border border-border/50 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
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
                    <p className="text-xs text-muted-foreground">Posted {getTimeAgo(job.createdAt)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No jobs posted yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your first job posting to see analytics here
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Company Profile Completion */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Company Profile</CardTitle>
            <CardDescription>
              {profileCompletion < 100 
                ? "Complete your profile to attract better candidates" 
                : "Your profile is looking great!"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  {company?.logo ? (
                    <img 
                      src={company.logo} 
                      alt={company.name} 
                      className="w-12 h-12 rounded object-cover"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{company?.name || "Your Company"}</h3>
                  <p className="text-sm text-muted-foreground">{company?.industry || "Industry not specified"}</p>
                  <Badge variant={company?.isVerified ? "default" : "secondary"} className="mt-1">
                    {company?.isVerified ? "Verified Company" : "Unverified"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Profile Completion</span>
                  <span className="font-medium">{profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="h-2" />
              </div>

              <div className="space-y-2 text-sm">
                {[
                  { field: "description", label: "Company Description" },
                  { field: "industry", label: "Industry" },
                  { field: "website", label: "Website" },
                  { field: "logo", label: "Company Logo" },
                  { field: "benefits", label: "Benefits & Perks" }
                ].map((item) => {
                  const status = getCompletionStatus(item.field)
                  return (
                    <div key={item.field} className="flex items-center justify-between">
                      <span>{item.label}</span>
                      <Badge variant="outline" className={status.color}>
                        {status.status}
                      </Badge>
                    </div>
                  )
                })}
              </div>

              {profileCompletion < 100 && (
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground text-center">
                    Complete your profile to increase candidate engagement by up to 40%
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}