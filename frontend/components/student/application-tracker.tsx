"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, XCircle, Eye, Building2, Calendar, ArrowRight, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

const statusConfig = {
  applied: { color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Clock, label: "Applied" },
  shortlisted: { color: "bg-purple-500/10 text-purple-600 border-purple-500/20", icon: CheckCircle, label: "Shortlisted" },
  interview: { color: "bg-orange-500/10 text-orange-600 border-orange-500/20", icon: Clock, label: "Interview" },
  selected: { color: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle, label: "Selected" },
  rejected: { color: "bg-red-500/10 text-red-600 border-red-500/20", icon: XCircle, label: "Rejected" },
} as const

interface Application {
  id: string
  jobTitle: string
  company: string
  appliedDate: string
  status: keyof typeof statusConfig
  progress: number
  nextStep?: string
  nextDate?: string
  jobId?: string
}

interface ApplicationTrackerProps {
  detailed?: boolean
  limit?: number
}

interface ApiError {
  message: string
  status?: number
}

export function ApplicationTracker({ detailed = false, limit }: ApplicationTrackerProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setError(null)
        const token = localStorage.getItem("token")
        
        if (!token) {
          throw new Error("Authentication required. Please log in again.")
        }

        const res = await fetch(`${API_BASE_URL}/api/student/status`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token")
            throw new Error("Session expired. Please log in again.")
          }
          throw new Error(`Failed to fetch applications: ${res.statusText}`)
        }

        const data = await res.json()
        
        // Validate and transform response data
        const validatedApplications = Array.isArray(data) 
          ? data.map((app: any) => ({
              id: app.id || app._id || Math.random().toString(36).substr(2, 9),
              jobTitle: app.jobTitle || app.title || "Unknown Position",
              company: app.company || app.companyName || "Unknown Company",
              appliedDate: app.appliedDate || app.createdAt || new Date().toISOString(),
              status: (app.status in statusConfig ? app.status : "applied") as keyof typeof statusConfig,
              progress: typeof app.progress === 'number' ? Math.min(100, Math.max(0, app.progress)) : 0,
              nextStep: app.nextStep,
              nextDate: app.nextDate,
              jobId: app.jobId,
            }))
          : []

        setApplications(validatedApplications)

      } catch (err) {
        const error = err as ApiError
        console.error("Error fetching applications:", error)
        setError(error.message || "Failed to load applications")
        
        toast({
          title: "Error",
          description: error.message || "Failed to load applications",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [API_BASE_URL, toast])

  const handleViewDetails = (application: Application) => {
    if (application.jobId) {
      router.push(`/student/applications/${application.jobId}`)
    } else {
      toast({
        title: "Details unavailable",
        description: "Detailed view not available for this application",
        variant: "default",
      })
    }
  }

  const handleViewAll = () => {
    router.push("/student/applications")
  }

  const displayApplications = detailed 
    ? applications 
    : applications.slice(0, limit || 3)

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return "Invalid date"
    }
  }

  const getProgressColor = (progress: number): string => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 50) return "bg-yellow-500"
    if (progress >= 30) return "bg-blue-500"
    return "bg-gray-500"
  }

  if (loading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Application Status
          </CardTitle>
          <CardDescription>Track your job application progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border border-border/50 rounded-lg bg-muted/20">
              <div className="flex items-start justify-between mb-3">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error && applications.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Application Status
          </CardTitle>
          <CardDescription>Track your job application progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="mx-auto w-12 h-12 text-destructive mb-4" />
            <h3 className="font-medium mb-2 text-destructive">Failed to load applications</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row justify-between items-start space-y-0">
        <div className="space-y-1">
          <CardTitle className="flex items-center text-xl">
            <CheckCircle className="w-5 h-5 mr-2" />
            Application Status
          </CardTitle>
          <CardDescription>
            {applications.length > 0 
              ? `Tracking ${applications.length} application${applications.length !== 1 ? 's' : ''}`
              : "Track your job application progress"
            }
          </CardDescription>
        </div>
        {!detailed && applications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleViewAll}>
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {displayApplications.length > 0 ? (
          <div className="space-y-4">
            {displayApplications.map((app) => {
              const status = statusConfig[app.status]
              const StatusIcon = status.icon
              
              return (
                <div
                  key={app.id}
                  className="p-4 border border-border/50 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate" title={app.jobTitle}>
                        {app.jobTitle}
                      </h4>
                      <p className="text-sm text-muted-foreground flex items-center truncate">
                        <Building2 className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{app.company}</span>
                      </p>
                    </div>
                    <Badge className={`${status.color} flex-shrink-0 ml-2`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{app.progress}%</span>
                    </div>
                    <Progress 
                      value={app.progress} 
                      className={`h-2 ${getProgressColor(app.progress)}`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">Applied: {formatDate(app.appliedDate)}</span>
                    </div>
                    {detailed && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewDetails(app)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    )}
                  </div>

                  {app.nextStep && (
                    <div className="mt-3 p-2 bg-accent/5 rounded border border-accent/20">
                      <p className="text-sm font-medium text-accent flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Next: {app.nextStep}
                      </p>
                      {app.nextDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Scheduled: {formatDate(app.nextDate)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="font-medium mb-2 text-muted-foreground">No applications yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start applying to jobs to track your progress here
            </p>
            <Button onClick={() => router.push("/jobs")} variant="outline">
              Browse Jobs
            </Button>
          </div>
        )}

        {/* Error message when there are some applications but also an error */}
        {error && applications.length > 0 && (
          <div className="mt-4 flex items-center gap-2 p-3 text-sm border border-destructive/50 bg-destructive/10 text-destructive rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Partial data loaded: {error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}