import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, XCircle, AlertCircle, Building2, Calendar } from "lucide-react"

interface Application {
  id: string
  jobId: string
  role: string
  company: string
  appliedDate: string
  status: "applied" | "shortlisted" | "selected" | "rejected"
}

interface ApplicationStatusProps {
  application: Application
}

export function ApplicationStatus({ application }: ApplicationStatusProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <Clock className="h-4 w-4" />
      case "shortlisted":
        return <AlertCircle className="h-4 w-4" />
      case "selected":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
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

  return (
    <Card className="border-primary-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="font-serif font-semibold text-primary-900">{application.role}</h3>
            <div className="flex items-center gap-4 text-sm text-text-default">
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                <span>{application.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(application.status)}>
            {getStatusIcon(application.status)}
            <span className="ml-1 capitalize">{application.status}</span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
