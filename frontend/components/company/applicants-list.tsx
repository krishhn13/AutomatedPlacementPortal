"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, FileText, Calendar, Star, Download } from "lucide-react"

interface Applicant {
  id: string
  jobId: string
  studentId: string
  name: string
  rollNo: string
  branch: string
  cgpa: number
  skills: string[]
  resumeUrl: string
  appliedDate: string
  status: "applied" | "shortlisted" | "selected" | "rejected"
}

interface Job {
  id: string
  role: string
}

interface ApplicantsListProps {
  applicants: Applicant[]
  jobs: Job[]
  onShortlist: (applicantId: string) => void
}

export function ApplicantsList({ applicants, jobs, onShortlist }: ApplicantsListProps) {
  const [selectedJob, setSelectedJob] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredApplicants = applicants.filter((applicant) => {
    const jobMatch = selectedJob === "all" || applicant.jobId === selectedJob
    const statusMatch = statusFilter === "all" || applicant.status === statusFilter
    return jobMatch && statusMatch
  })

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

  const getJobTitle = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId)
    return job?.role || "Unknown Job"
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Filter by Job</label>
          <Select value={selectedJob} onValueChange={setSelectedJob}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Jobs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {jobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Filter by Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="selected">Selected</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Applicants List */}
      <div className="grid gap-6">
        {filteredApplicants.length === 0 ? (
          <Card className="border-primary-200">
            <CardContent className="p-8 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants found</h3>
              <p className="text-gray-500">
                {selectedJob !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "No students have applied to your jobs yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredApplicants.map((applicant) => (
            <Card key={applicant.id} className="border-primary-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg font-serif text-primary-900">{applicant.name}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-text-default">
                      <span>{applicant.rollNo}</span>
                      <span>{applicant.branch}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>CGPA: {applicant.cgpa}</span>
                      </div>
                    </div>
                    <p className="text-sm text-text-default">
                      Applied for: <span className="font-medium">{getJobTitle(applicant.jobId)}</span>
                    </p>
                  </div>
                  <Badge className={getStatusColor(applicant.status)}>{applicant.status}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-text-default">Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {applicant.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-text-default">
                    <Calendar className="h-4 w-4" />
                    <span>Applied: {new Date(applicant.appliedDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      View Resume
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    {applicant.status === "applied" && (
                      <Button
                        onClick={() => onShortlist(applicant.id)}
                        size="sm"
                        className="bg-primary-900 hover:bg-primary-800"
                      >
                        Shortlist
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
