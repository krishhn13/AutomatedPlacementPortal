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

interface Student {
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
  avatar?: string
}

interface Application {
  _id: string
  studentId: string | Student
  jobId: string
  appliedDate: string
  status: "applied" | "shortlisted" | "interview" | "selected" | "rejected"
  resume?: {
    filename: string
    url: string
    uploadedAt: string
    size: number
  }
  jobTitle?: string
  companyName?: string
}

interface Job {
  _id: string
  title: string
  company: string
  companyId: string
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
  const [applications, setApplications] = useState<Application[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [jobFilter, setJobFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchApplications()
    fetchCompanyJobs()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      if (!token) {
        throw new Error("No authentication token found")
      }

      const res = await fetch("http://localhost:5000/api/company/applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        if (res.status === 404) {
          // If endpoint doesn't exist, try the old endpoint
          await fetchApplicantsLegacy()
          return
        }
        throw new Error(`Failed to fetch applications: ${res.status} ${res.statusText}`)
      }

      const data = await res.json()
      setApplications(data.applications || data || [])
      
    } catch (error) {
      console.error("Error fetching applications:", error)
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fallback to old endpoint structure
  const fetchApplicantsLegacy = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/company/applicants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        // Transform legacy data format to applications format
        const transformedApplications = transformLegacyData(data)
        setApplications(transformedApplications)
      } else {
        throw new Error("No applications data available")
      }
    } catch (error) {
      console.error("Error fetching legacy applicants:", error)
      setApplications([])
    }
  }

  const transformLegacyData = (data: any): Application[] => {
    if (!data.applicants || !Array.isArray(data.applicants)) return []
    
    const applications: Application[] = []
    
    data.applicants.forEach((applicant: any) => {
      if (applicant.appliedJobs && Array.isArray(applicant.appliedJobs)) {
        applicant.appliedJobs.forEach((jobApp: any) => {
          applications.push({
            _id: `${applicant._id}-${jobApp.jobId}`,
            studentId: applicant,
            jobId: jobApp.jobId,
            appliedDate: jobApp.appliedDate,
            status: jobApp.status,
            resume: applicant.resume,
            jobTitle: jobApp.jobTitle,
            companyName: jobApp.companyName
          })
        })
      }
    })
    
    return applications
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
    }
  }

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      setUpdatingStatus(applicationId)
      const token = localStorage.getItem("token")
      
      if (!token) {
        throw new Error("No authentication token")
      }
      
      const res = await fetch(`http://localhost:5000/api/company/applications/${applicationId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus
        }),
      })

      if (!res.ok) {
        throw new Error(`Failed to update status: ${res.status}`)
      }

      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId ? { ...app, status: newStatus as any } : app
        )
      )

      toast({
        title: "Success",
        description: `Application status updated to ${newStatus}`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update application status",
        variant: "destructive",
      })
    } finally {
      setUpdatingStatus(null)
    }
  }

  const downloadResume = async (application: Application) => {
    try {
      const resume = typeof application.studentId === 'object' ? 
        application.studentId.resume : application.resume
      
      if (!resume?.url) {
        toast({
          title: "No Resume Available",
          description: "This applicant hasn't uploaded a resume yet",
          variant: "destructive",
        })
        return
      }

      // Create download link
      const link = document.createElement('a')
      link.href = resume.url
      link.download = resume.filename || `resume-${getStudentName(application)}.pdf`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Download Started",
        description: `Downloading ${getStudentName(application)}'s resume`,
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

  const viewStudentProfile = (application: Application) => {
    const studentId = typeof application.studentId === 'object' ? 
      application.studentId._id : application.studentId
    
    toast({
      title: "View Profile",
      description: `Viewing ${getStudentName(application)}'s profile`,
      variant: "default",
    })
    
    // In a real app: router.push(`/company/student-profile/${studentId}`)
  }

  // Helper functions to handle both student object and student ID
  const getStudentName = (application: Application): string => {
    return typeof application.studentId === 'object' ? 
      application.studentId.name : "Student"
  }

  const getStudentEmail = (application: Application): string => {
    return typeof application.studentId === 'object' ? 
      application.studentId.email : "Email not available"
  }

  const getStudentPhone = (application: Application): string => {
    return typeof application.studentId === 'object' ? 
      application.studentId.phone : "Phone not available"
  }

  const getStudentLocation = (application: Application): string => {
    return typeof application.studentId === 'object' ? 
      (application.studentId.location || "Location not specified") : "Location not specified"
  }

  const getStudentEducation = (application: Application): string => {
    if (typeof application.studentId !== 'object') return "Education not specified"
    
    return application.studentId.education || 
           application.studentId.branch || 
           "Education not specified"
  }

  const getStudentCGPA = (application: Application): number | undefined => {
    return typeof application.studentId === 'object' ? 
      application.studentId.cgpa : undefined
  }

  const getStudentRollNo = (application: Application): string | undefined => {
    return typeof application.studentId === 'object' ? 
      application.studentId.rollNo : undefined
  }

  const getStudentSkills = (application: Application): string[] => {
    return typeof application.studentId === 'object' ? 
      (application.studentId.skills || []) : []
  }

  const getStudentAvatar = (application: Application): string | undefined => {
    return typeof application.studentId === 'object' ? 
      application.studentId.avatar : undefined
  }

  const getJobTitle = (application: Application): string => {
    return application.jobTitle || "Job Title not specified"
  }

  // Filter applications
  const filteredApplications = applications.filter(application => {
    const studentName = getStudentName(application).toLowerCase()
    const studentEmail = getStudentEmail(application).toLowerCase()
    const jobTitle = getJobTitle(application).toLowerCase()
    
    const matchesSearch =
      studentName.includes(searchTerm.toLowerCase()) ||
      studentEmail.includes(searchTerm.toLowerCase()) ||
      jobTitle.includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || application.status === statusFilter
    const matchesJob = jobFilter === "all" || application.jobId === jobFilter
    
    return matchesSearch && matchesStatus && matchesJob
  })

  // Get unique job titles for filter
  const uniqueJobTitles = Array.from(new Set(
    applications.map(app => getJobTitle(app))
  ))

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-muted-foreground">Loading applications...</span>
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
        {filteredApplications.map((application) => {
          const status = statusConfig[application.status]
          const studentName = getStudentName(application)
          const studentRollNo = getStudentRollNo(application)

          return (
            <Card key={application._id} className="glass-card hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage src={getStudentAvatar(application)} alt={studentName} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {studentName}
                        {studentRollNo && (
                          <Badge variant="outline" className="text-xs font-normal">
                            {studentRollNo}
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        Applied for <Badge variant="secondary" className="text-xs">{getJobTitle(application)}</Badge>
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
                      <span className="truncate">{getStudentEmail(application)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                      {getStudentPhone(application)}
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      {getStudentLocation(application)}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" />
                      {getStudentEducation(application)}
                    </div>
                    {getStudentCGPA(application) && (
                      <div className="flex items-center text-sm">
                        <span className="w-4 h-4 mr-2 text-muted-foreground font-bold">GPA</span>
                        <Badge variant="outline" className="bg-accent/10 text-accent">
                          {getStudentCGPA(application)}/10
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      Applied {new Date(application.appliedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {getStudentSkills(application).length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Skills & Technologies:</p>
                    <div className="flex flex-wrap gap-2">
                      {getStudentSkills(application).map((skill) => (
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
                    onClick={() => viewStudentProfile(application)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadResume(application)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                  <Select 
                    value={application.status}
                    onValueChange={(value) => updateApplicationStatus(application._id, value)}
                    disabled={updatingStatus === application._id}
                  >
                    <SelectTrigger className="w-40 h-8">
                      {updatingStatus === application._id ? (
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
            <h3 className="font-medium mb-2">No applications found</h3>
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