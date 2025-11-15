"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Eye, Download, Mail, Phone, GraduationCap, MapPin, Calendar, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Applicant {
  _id: string
  name: string
  email: string
  phone: string
  location?: string
  education?: string
  branch?: string
  cgpa?: number
  rollNo?: string
  skills: string[]
  resume?: {
    filename: string
    url: string
    uploadedAt: string
    size: number
  }
  appliedJobs: Array<{
    jobId: string
    jobTitle: string
    companyId: string
    companyName: string
    appliedDate: string
    status: "applied" | "shortlisted" | "interview" | "selected" | "rejected"
    resume: string
  }>
  avatar?: string
}

interface Job {
  _id: string
  title: string
  company: string
}

const statusConfig = {
  applied: {
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    label: "Applied",
  },
  shortlisted: {
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    label: "Shortlisted",
  },
  interview: {
    color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    label: "Interview",
  },
  selected: {
    color: "bg-green-500/10 text-green-600 border-green-500/20",
    label: "Selected",
  },
  rejected: {
    color: "bg-red-500/10 text-red-600 border-red-500/20",
    label: "Rejected",
  },
}

export function ApplicantManagement() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [jobFilter, setJobFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchApplicants()
    fetchCompanyJobs()
  }, [])

  const fetchApplicants = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/company/applicants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error("Failed to fetch applicants")
      }

      const data = await res.json()
      setApplicants(data.applicants || data)
    } catch (error) {
      console.error("Error fetching applicants:", error)
      toast({
        title: "Error",
        description: "Failed to load applicants",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanyJobs = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/company/jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setJobs(data.jobs || data)
      }
    } catch (error) {
      console.error("Error fetching jobs:", error)
    }
  }

  const updateApplicationStatus = async (applicationId: string, jobId: string, newStatus: string) => {
    try {
      setUpdatingStatus(applicationId)
      const token = localStorage.getItem("token")
      
      const res = await fetch(`http://localhost:5000/api/company/applications/${applicationId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          jobId: jobId
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to update status")
      }

      // Update local state
      setApplicants(prev => prev.map(applicant => ({
        ...applicant,
        appliedJobs: applicant.appliedJobs.map(jobApp => 
          jobApp.jobId === jobId ? { ...jobApp, status: newStatus as any } : jobApp
        )
      })))

      toast({
        title: "Success",
        description: `Application status updated to ${newStatus}`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      })
    } finally {
      setUpdatingStatus(null)
    }
  }

  const downloadResume = async (applicant: Applicant) => {
    try {
      if (!applicant.resume?.url) {
        toast({
          title: "No Resume",
          description: "This applicant hasn't uploaded a resume yet",
          variant: "destructive",
        })
        return
      }

      // If resume URL is a direct file URL, create download link
      const link = document.createElement('a')
      link.href = applicant.resume.url
      link.download = applicant.resume.filename || `resume-${applicant.name}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Download Started",
        description: "Resume download has started",
        variant: "default",
      })
    } catch (error) {
      console.error("Error downloading resume:", error)
      toast({
        title: "Download Failed",
        description: "Failed to download resume",
        variant: "destructive",
      })
    }
  }

  // Flatten applicants with their job applications
  const flattenedApplications = applicants.flatMap(applicant =>
    applicant.appliedJobs.map(jobApp => ({
      applicant,
      application: jobApp,
      id: `${applicant._id}-${jobApp.jobId}`
    }))
  )

  const filteredApplications = flattenedApplications.filter(({ applicant, application }) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || application.status === statusFilter
    const matchesJob = jobFilter === "all" || application.jobId === jobFilter
    return matchesSearch && matchesStatus && matchesJob
  })

  // Get unique job titles for filter
  const uniqueJobTitles = Array.from(new Set(flattenedApplications.map(app => app.application.jobTitle)))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading applicants...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applicants by name, email, or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 glass">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="glass-card">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="selected">Selected</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={jobFilter} onValueChange={setJobFilter}>
          <SelectTrigger className="w-full sm:w-48 glass">
            <SelectValue placeholder="Filter by job" />
          </SelectTrigger>
          <SelectContent className="glass-card">
            <SelectItem value="all">All Jobs</SelectItem>
            {uniqueJobTitles.map(jobTitle => (
              <SelectItem key={jobTitle} value={jobTitle}>{jobTitle}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredApplications.map(({ applicant, application, id }) => {
          const status = statusConfig[application.status]

          return (
            <Card key={id} className="glass-card hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={applicant.avatar || "/placeholder.svg"} alt={applicant.name} />
                      <AvatarFallback>
                        {applicant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{applicant.name}</CardTitle>
                      <CardDescription>Applied for {application.jobTitle}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={status.color}>{status.label}</Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                      {applicant.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                      {applicant.phone}
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      {applicant.location || "Location not specified"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" />
                      {applicant.education || applicant.branch || "Education not specified"}
                    </div>
                    {applicant.cgpa && (
                      <div className="flex items-center text-sm">
                        <span className="w-4 h-4 mr-2 text-muted-foreground font-bold">GPA</span>
                        <Badge variant="outline" className="bg-accent/10 text-accent">
                          {applicant.cgpa}/10
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      Applied {new Date(application.appliedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {applicant.skills && applicant.skills.length > 0 ? (
                      applicant.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No skills listed</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadResume(applicant)}
                    disabled={!applicant.resume?.url}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                  <Select 
                    onValueChange={(value) => updateApplicationStatus(applicant._id, application.jobId, value)}
                    disabled={updatingStatus === applicant._id}
                  >
                    <SelectTrigger className="w-40 h-8">
                      {updatingStatus === applicant._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <SelectValue placeholder="Update Status" />
                      )}
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      <SelectItem value="shortlisted">Shortlist</SelectItem>
                      <SelectItem value="interview">Schedule Interview</SelectItem>
                      <SelectItem value="selected">Select</SelectItem>
                      <SelectItem value="rejected">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredApplications.length === 0 && (
        <Card className="glass-card">
          <CardContent className="text-center py-12">
            <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">No applicants found</h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm || statusFilter !== "all" || jobFilter !== "all"
                ? "Try adjusting your search or filters"
                : "No applications received yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}