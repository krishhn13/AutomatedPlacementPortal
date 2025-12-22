"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Building2, MapPin, DollarSign, Calendar, Clock, Search, Filter, CheckCircle, XCircle, Eye, Loader2, ExternalLink, Check, AlertCircle, Briefcase } from "lucide-react"

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  type: string
  posted: string
  deadline: string
  eligible: boolean
  applied: boolean
  applicationId?: string
  applicationStatus?: string
  description: string
  requirements: string[]
  responsibilities?: string[]
  benefits?: string[]
  logo?: string
  companyWebsite?: string
}

export function JobListings() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [coverLetter, setCoverLetter] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      
      // Get token from localStorage
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Please login to view jobs")
        setJobs([])
        return
      }

      // Fetch jobs from backend
      const response = await fetch("http://localhost:5000/api/student/jobs", {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Handle different response formats
      if (Array.isArray(data)) {
        setJobs(data)
      } else if (data.data && Array.isArray(data.data)) {
        setJobs(data.data)
      } else if (data.jobs && Array.isArray(data.jobs)) {
        setJobs(data.jobs)
      } else {
        console.warn("Unexpected response format:", data)
        setJobs([])
      }
      
    } catch (error) {
      console.error("Error fetching jobs:", error)
      toast.error("Failed to load jobs. Please try again.")
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter =
      filterType === "all" || 
      (filterType === "eligible" && job.eligible) || 
      (filterType === "applied" && job.applied) ||
      (filterType === "full-time" && job.type?.toLowerCase() === "full-time") ||
      (filterType === "part-time" && job.type?.toLowerCase() === "part-time") ||
      (filterType === "internship" && job.type?.toLowerCase() === "internship") ||
      (filterType === "remote" && job.location.toLowerCase().includes("remote"))

    return matchesSearch && matchesFilter
  })

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job)
    setIsDialogOpen(true)
  }

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job)
    setIsApplying(true)
  }

  const handleSubmitApplication = async () => {
    if (!selectedJob || !resumeFile) {
      toast.error("Please upload your resume")
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Please login to apply")
        return
      }

      // Create FormData for file upload
      const formData = new FormData()
      formData.append("jobId", selectedJob.id)
      formData.append("resume", resumeFile)
      if (coverLetter) formData.append("coverLetter", coverLetter)
      if (additionalInfo) formData.append("additionalInfo", additionalInfo)

      const response = await fetch("http://localhost:5000/api/student/apply", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Application failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.success) {
        toast.success("Application submitted successfully!")
        
        // Update job status
        setJobs(prevJobs =>
          prevJobs.map(job =>
            job.id === selectedJob.id
              ? { ...job, applied: true, applicationStatus: "Pending" }
              : job
          )
        )
        
        // Reset form
        setResumeFile(null)
        setCoverLetter("")
        setAdditionalInfo("")
        setIsApplying(false)
        
      } else {
        toast.error(result.message || "Application failed")
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      toast.error("Failed to submit application")
    }
  }

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0])
      toast.success("Resume uploaded successfully")
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
        </div>
        {[1, 2, 3].map(i => (
          <Card key={i} className="glass-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {[1, 2, 3, 4].map(j => (
                  <Skeleton key={j} className="h-4 w-32" />
                ))}
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs or companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-48 glass">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter jobs" />
          </SelectTrigger>
          <SelectContent className="glass-card">
            <SelectItem value="all">All Jobs</SelectItem>
            <SelectItem value="eligible">Eligible Only</SelectItem>
            <SelectItem value="applied">Applied Jobs</SelectItem>
            <SelectItem value="full-time">Full-time</SelectItem>
            <SelectItem value="part-time">Part-time</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredJobs.length === 0 && !loading ? (
        <div className="text-center py-12 space-y-4">
          <Briefcase className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-medium">No jobs found</h3>
          <p className="text-muted-foreground">
            {searchTerm || filterType !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "No jobs available at the moment"}
          </p>
          {(searchTerm || filterType !== "all") && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setFilterType("all")
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="glass-card hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      {job.logo ? (
                        <img 
                          src={job.logo} 
                          alt={job.company}
                          className="w-10 h-10 object-contain rounded"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription className="flex items-center">
                        <Building2 className="w-4 h-4 mr-1" />
                        {job.company}
                        {job.companyWebsite && (
                          <a
                            href={job.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-primary hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {job.eligible ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Eligible
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                        <XCircle className="w-3 h-3 mr-1" />
                        Not Eligible
                      </Badge>
                    )}
                    {job.applied && (
                      <Badge variant="outline">
                        {job.applicationStatus || "Applied"}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {job.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Posted {job.posted}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Deadline: {job.deadline}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.requirements.slice(0, 4).map((req, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                  {job.requirements.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{job.requirements.length - 4} more
                    </Badge>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(job)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {job.eligible && !job.applied && (
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => handleApplyClick(job)}
                    >
                      Apply Now
                    </Button>
                  )}
                  {job.applied && (
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      disabled
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Applied
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Job Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    {selectedJob.logo ? (
                      <img 
                        src={selectedJob.logo} 
                        alt={selectedJob.company}
                        className="w-14 h-14 object-contain rounded"
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <DialogTitle>{selectedJob.title}</DialogTitle>
                    <DialogDescription className="flex items-center">
                      {selectedJob.company}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="text-sm">{selectedJob.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Salary</p>
                    <p className="text-sm">{selectedJob.salary}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Job Type</p>
                    <p className="text-sm">{selectedJob.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Deadline</p>
                    <p className="text-sm">{selectedJob.deadline}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Job Description</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {selectedJob.description}
                  </p>
                </div>

                {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Requirements</h4>
                    <ul className="space-y-1">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium">Eligibility Status</p>
                    <div className="flex items-center mt-1">
                      {selectedJob.eligible ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          You are eligible
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="w-3 h-3 mr-1" />
                          Not eligible
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Close
                    </Button>
                    {selectedJob.eligible && !selectedJob.applied && (
                      <Button onClick={() => {
                        setIsDialogOpen(false)
                        handleApplyClick(selectedJob)
                      }}>
                        Apply Now
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Application Dialog */}
      <Dialog open={isApplying} onOpenChange={setIsApplying}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              Submit your application to {selectedJob?.company}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resume">Resume *</Label>
              <Input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
              />
              {resumeFile && (
                <p className="text-sm text-green-600">
                  ✓ {resumeFile.name} uploaded
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <Textarea
                id="coverLetter"
                placeholder="Write your cover letter here..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                placeholder="Any additional information you'd like to share..."
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsApplying(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitApplication}
              disabled={!resumeFile}
            >
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}