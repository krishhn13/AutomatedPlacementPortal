"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, AlertCircle, XCircle, Calendar, Building2 } from "lucide-react"

interface ApplicationStep {
  id: string
  title: string
  status: "completed" | "current" | "pending" | "failed"
  date?: string
  description?: string
}

interface Application {
  id: string
  jobId: string
  studentId: string
  companyName: string
  role: string
  appliedDate: string
  currentStatus: "applied" | "shortlisted" | "selected" | "rejected"
  steps: ApplicationStep[]
}

interface ApplicationTrackerProps {
  application: Application
}

export function ApplicationTracker({ application }: ApplicationTrackerProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "current":
        return <Clock className="h-5 w-5 text-blue-600" />
      case "pending":
        return <AlertCircle className="h-5 w-5 text-gray-400" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800"
      case "shortlisted":
        return "bg-yellow-100 text-yellow-800"
      case "selected":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const completedSteps = application.steps.filter((step) => step.status === "completed").length
  const totalSteps = application.steps.length
  const progressPercentage = (completedSteps / totalSteps) * 100

  return (
    <Card className="border-primary-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl font-serif text-primary-900">{application.role}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-text-default">
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                <span>{application.companyName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(application.currentStatus)}>{application.currentStatus}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Application Progress</span>
            <span>
              {completedSteps}/{totalSteps} steps completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Application Steps */}
        <div className="space-y-4">
          <h4 className="font-medium text-primary-900">Application Timeline</h4>
          <div className="space-y-4">
            {application.steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  {getStatusIcon(step.status)}
                  {index < application.steps.length - 1 && <div className="w-px h-8 bg-gray-200 mt-2" />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-primary-900">{step.title}</h5>
                    {step.date && (
                      <span className="text-xs text-text-default">{new Date(step.date).toLocaleDateString()}</span>
                    )}
                  </div>
                  {step.description && <p className="text-sm text-text-default">{step.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
