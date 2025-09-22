"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, XCircle, Eye, Building2, Calendar, ArrowRight } from "lucide-react"

const applications = [
  {
    id: 1,
    jobTitle: "Software Engineer",
    company: "TechCorp Inc.",
    appliedDate: "Nov 28, 2024",
    status: "interview",
    progress: 75,
    nextStep: "Technical Interview",
    nextDate: "Dec 5, 2024",
  },
  {
    id: 2,
    jobTitle: "Frontend Developer",
    company: "StartupXYZ",
    appliedDate: "Nov 25, 2024",
    status: "shortlisted",
    progress: 50,
    nextStep: "HR Interview",
    nextDate: "Dec 3, 2024",
  },
  {
    id: 3,
    jobTitle: "Full Stack Developer",
    company: "WebSolutions",
    appliedDate: "Nov 20, 2024",
    status: "selected",
    progress: 100,
    nextStep: "Offer Letter",
    nextDate: "Completed",
  },
  {
    id: 4,
    jobTitle: "Backend Developer",
    company: "CloudTech",
    appliedDate: "Nov 15, 2024",
    status: "rejected",
    progress: 25,
    nextStep: "Application Closed",
    nextDate: "Nov 30, 2024",
  },
]

const statusConfig = {
  applied: {
    color: "bg-secondary/10 text-secondary border-secondary/20",
    icon: Clock,
    label: "Applied",
  },
  shortlisted: {
    color: "bg-accent/10 text-accent border-accent/20",
    icon: CheckCircle,
    label: "Shortlisted",
  },
  interview: {
    color: "bg-primary/10 text-primary border-primary/20",
    icon: Clock,
    label: "Interview",
  },
  selected: {
    color: "bg-green-500/10 text-green-600 border-green-500/20",
    icon: CheckCircle,
    label: "Selected",
  },
  rejected: {
    color: "bg-destructive/10 text-destructive border-destructive/20",
    icon: XCircle,
    label: "Rejected",
  },
}

interface ApplicationTrackerProps {
  detailed?: boolean
}

export function ApplicationTracker({ detailed = false }: ApplicationTrackerProps) {
  const displayApplications = detailed ? applications : applications.slice(0, 3)

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Application Status
            </CardTitle>
            <CardDescription>Track your job application progress</CardDescription>
          </div>
          {!detailed && (
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {displayApplications.map((app) => {
            const status = statusConfig[app.status as keyof typeof statusConfig]
            const StatusIcon = status.icon

            return (
              <div
                key={app.id}
                className="p-4 border border-border/50 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{app.jobTitle}</h4>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Building2 className="w-3 h-3 mr-1" />
                      {app.company}
                    </p>
                  </div>
                  <Badge className={status.color}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{app.progress}%</span>
                  </div>
                  <Progress value={app.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    Applied: {app.appliedDate}
                  </div>
                  {detailed && (
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  )}
                </div>

                {app.status !== "rejected" && app.status !== "selected" && (
                  <div className="mt-3 p-2 bg-accent/5 rounded border border-accent/20">
                    <p className="text-sm font-medium text-accent">Next: {app.nextStep}</p>
                    <p className="text-xs text-muted-foreground">{app.nextDate}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {displayApplications.length === 0 && (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">No applications yet</h3>
            <p className="text-sm text-muted-foreground">Start applying to jobs to track your progress here</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
