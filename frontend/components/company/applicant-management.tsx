"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Eye, Download, Mail, Phone, GraduationCap, MapPin, Calendar, Loader2, User } from "lucide-react"
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

// Mock data for development
const mockApplicants: Applicant[] = [
  {
    _id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    education: "Computer Science",
    branch: "Computer Science",
    cgpa: 8.7,
    rollNo: "CS2023001",
    skills: ["React", "Node.js", "TypeScript", "MongoDB"],
    resume: {
      filename: "alex_johnson_resume.pdf",
      url: "/resumes/sample.pdf",
      uploadedAt: "2024-01-15",
      size: 1024000
    },
    appliedJobs: [{
      jobId: "job1",
      jobTitle: "Frontend Developer",
      companyId: "company1",
      companyName: "Tech Corp",
      appliedDate: "2024-01-20",
      status: "applied",
      resume: "alex_johnson_resume.pdf"
    }]
  },
  {
    _id: "2",
    name: "Sarah Williams",
    email: "sarah.w@college.edu",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    education: "Software Engineering",
    branch: "Software Engineering",
    cgpa: 9.1,
    rollNo: "SE2023002",
    skills: ["React", "CSS", "JavaScript", "UI/UX"],
    resume: {
      filename: "sarah_williams_resume.pdf",
      url: "/resumes/sample.pdf",
      uploadedAt: "2024-01-18",
      size: 980000
    },
    appliedJobs: [{
      jobId: "job1",
      jobTitle: "Frontend Developer",
      companyId: "company1",
      companyName: "Tech Corp",
      appliedDate: "2024-01-19",
      status: "shortlisted",
      resume: "sarah_williams_resume.pdf"
    }]
  }
]

export function ApplicantManagement() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [jobFilter, setJobFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchApplicants()
    fetchCompanyJobs()
  }, [])

  const fetchApplicants = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      if (!token) {
        throw new Error("No authentication token found")
      }

      const res = await fetch("http://localhost:5000/api/company/applicants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // If endpoint doesn't exist yet (404), use mock data
      if (res.status === 404) {
        console.log("Applicants endpoint not implemented, using mock data")
        setApplicants(mockApplicants)
        setUsingMockData(true)
        toast({
          title: "Development Mode",
          description: "Using sample data - backend integration in progress",
          variant: "default",
        })
        return
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch applicants: ${res.status} ${res.statusText}`)
      }

      const data = await res.json()
      setApplicants(data.applicants || data || [])
      setUsingMockData(false)
      
    } catch (error) {
      console.error("Error fetching applicants:", error)
      
      // Use mock data as fallback
      setApplicants(mockApplicants)
      setUsingMockData(true)
      
      toast({
        title: "Using Sample Data",
        description: "Real applicant data will appear when backend is fully configured",
        variant: "default",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanyJobs = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const res = await fetch("http://localhost:5000/api/company/jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setJobs(data.jobs || data || [])
      }
    } catch (error) {
      console.error("Error fetching jobs:", error)
      // Continue without jobs data
    }
  }

  const updateApplicationStatus = async (applicantId: string, jobId: string, newStatus: string) => {
    try {
      setUpdatingStatus(applicantId)
      
      if (usingMockData) {
        // Update mock data locally
        setApplicants(prev => prev.map(applicant => ({
          ...applicant,
          appliedJobs: applicant.appliedJobs.map(jobApp => 
            jobApp.jobId === jobId ? { ...jobApp, status: newStatus as any } : jobApp
          )
        })))
        
        toast({
          title: "Status Updated (Demo)",
          description: `Application status changed to ${newStatus}`,
          variant: "default",
        })
        return
      }

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token")
      }
      
      const res = await fetch(`http://localhost:5000/api/company/applications/${applicantId}/status`, {
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

      if (res.status === 404) {
        throw new Error("Endpoint not implemented yet")
      }

      if (!res.ok) {
        throw new Error(`Failed to update status: ${res.status}`)
      }

      // Update local state for real data
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
        title: "Update Failed",
        description: usingMockData 
          ? "This is a demo - changes are local only"
          : "Failed to update application status",
        variant: usingMockData ? "default" : "destructive",
      })
    } finally {
      setUpdatingStatus(null)
    }
  }

  const downloadResume = async (applicant: Applicant) => {
    try {
      if (!applicant.resume?.url) {
        toast({
          title: "No Resume Available",
          description: "This applicant hasn't uploaded a resume yet",
          variant: "destructive",
        })
        return
      }

      // For mock data or actual file URLs
      if (applicant.resume.url.startsWith('http') || applicant.resume.url.startsWith('/')) {
        const link = document.createElement('a')
        link.href = applicant.resume.url
        link.download = applicant.resume.filename || `resume-${applicant.name.replace(/\s+/g, '-')}.pdf`
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        // Handle base64 or other formats if needed
        window.open(applicant.resume.url, '_blank')
      }

      toast({
        title: "Download Started",
        description: `Downloading ${applicant.name}'s resume`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error downloading resume:", error)
      toast({
        title: "Download Failed",
        description: "Could not download the resume file",
        variant: "destructive",
      })
    }
  }

  const viewStudentProfile = (applicant: Applicant) => {
    // Navigate to student profile or show modal
    toast({
      title: "View Profile",
      description: `Viewing ${applicant.name}'s profile`,
      variant: "default",
    })
    // In a real app: router.push(`/company/student-profile/${applicant._id}`)
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
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-muted-foreground">Loading applicants...</span>
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

      {usingMockData && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center text-yellow-800">
              <span className="text-sm">💡 Using sample data. Real applicant data will appear when backend is configured.</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {filteredApplications.map(({ applicant, application, id }) => {
          const status = statusConfig[application.status]

          return (
            <Card key={id} className="glass-card hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage src={applicant.avatar} alt={applicant.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {applicant.name}
                        {applicant.rollNo && (
                          <Badge variant="outline" className="text-xs font-normal">
                            {applicant.rollNo}
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        Applied for <Badge variant="secondary" className="text-xs">{application.jobTitle}</Badge>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={status.color}>{status.label}</Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="truncate">{applicant.email}</span>
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
                  <div className="space-y-3">
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

                {applicant.skills && applicant.skills.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Skills & Technologies:</p>
                    <div className="flex flex-wrap gap-2">
                      {applicant.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => viewStudentProfile(applicant)}
                  >
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
                    {applicant.resume?.url ? "Download Resume" : "No Resume"}
                  </Button>
                  <Select 
                    value={application.status}
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
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="shortlisted">Shortlist</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
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
            {usingMockData && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={fetchApplicants}
              >
                <Loader2 className="w-4 h-4 mr-2" />
                Retry Connection
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}