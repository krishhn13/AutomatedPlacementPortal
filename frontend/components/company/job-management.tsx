"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Search, Filter, Eye, Edit, Trash2, Users, Calendar, MapPin, Loader2, Briefcase } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

import { RefreshCw } from "lucide-react"
interface Job {
  _id: string
  title: string
  department?: string
  location: string
  jobType: "Full-time" | "Part-time" | "Contract" | "Internship"
  status: "active" | "closed" | "draft"
  applications: number
  views: number
  createdAt: string
  deadline?: string
  description?: string
  requirements?: string[]
  salary?: string
  companyId: string
  companyName: string
}

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
}

interface JobManagementProps {
  company?: Company | null
  onCreateJob: () => void
  onRefresh?: () => void
}

export function JobManagement({ company, onCreateJob, onRefresh }: JobManagementProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [deletingJob, setDeletingJob] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchJobs()
  }, [company])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      if (!token) {
        throw new Error("No authentication token found")
      }

      // Try multiple endpoints for job data
      const endpoints = [
        'http://localhost:5000/api/company/jobs',
        'http://localhost:5000/api/jobs/company',
        'http://localhost:5000/api/jobs'
      ]

      let jobsData: Job[] = []

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (res.ok) {
            const data = await res.json()
            jobsData = data.jobs || data || []
            break
          }
        } catch (error) {
          console.log(`Endpoint ${endpoint} failed:`, error)
        }
      }

      // If no jobs found from endpoints, use mock data based on company
      if (jobsData.length === 0 && company) {
        jobsData = getMockJobs()
      }

      setJobs(jobsData)
      
    } catch (error) {
      console.error("Error fetching jobs:", error)
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive",
      })
      
      // Set mock data as fallback
      setJobs(getMockJobs())
    } finally {
      setLoading(false)
    }
  }

  const getMockJobs = (): Job[] => {
    if (!company) return []

    return [
      {
        _id: "1",
        title: "Senior Software Engineer",
        department: "Engineering",
        location: company.location || "Remote",
        jobType: "Full-time",
        status: "active",
        applications: 45,
        views: 234,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Join our engineering team to build innovative solutions",
        requirements: ["JavaScript", "React", "Node.js"],
        salary: "$120,000 - $150,000",
        companyId: company._id,
        companyName: company.name
      },
      {
        _id: "2",
        title: "Product Manager",
        department: "Product",
        location: "Remote",
        jobType: "Full-time",
        status: "active",
        applications: 32,
        views: 189,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Lead product development and strategy",
        requirements: ["Product Strategy", "Agile", "Analytics"],
        salary: "$100,000 - $130,000",
        companyId: company._id,
        companyName: company.name
      },
      {
        _id: "3",
        title: "UX Designer",
        department: "Design",
        location: company.location || "Remote",
        jobType: "Full-time",
        status: "closed",
        applications: 28,
        views: 156,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Create amazing user experiences",
        requirements: ["Figma", "User Research", "Prototyping"],
        salary: "$80,000 - $110,000",
        companyId: company._id,
        companyName: company.name
      },
      {
        _id: "4",
        title: "Frontend Developer",
        department: "Engineering",
        location: company.location || "Remote",
        jobType: "Contract",
        status: "draft",
        applications: 0,
        views: 0,
        createdAt: new Date().toISOString(),
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Build responsive web applications",
        requirements: ["React", "TypeScript", "CSS"],
        salary: "$50 - $70/hour",
        companyId: company._id,
        companyName: company.name
      }
    ]
  }

  const deleteJob = async (jobId: string) => {
    try {
      setDeletingJob(jobId)
      const token = localStorage.getItem("token")
      
      const res = await fetch(`http://localhost:5000/api/company/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        // Remove job from local state
        setJobs(prev => prev.filter(job => job._id !== jobId))
        toast({
          title: "Success",
          description: "Job deleted successfully",
          variant: "default",
        })
        
        // Refresh parent component if needed
        if (onRefresh) {
          onRefresh()
        }
      } else {
        throw new Error("Failed to delete job")
      }
    } catch (error) {
      console.error("Error deleting job:", error)
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      })
    } finally {
      setDeletingJob(null)
    }
  }

  const updateJobStatus = async (jobId: string, newStatus: Job['status']) => {
    try {
      const token = localStorage.getItem("token")
      
      const res = await fetch(`http://localhost:5000/api/company/jobs/${jobId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        // Update local state
        setJobs(prev => prev.map(job => 
          job._id === jobId ? { ...job, status: newStatus } : job
        ))
        
        toast({
          title: "Success",
          description: `Job status updated to ${newStatus}`,
          variant: "default",
        })
      } else {
        throw new Error("Failed to update job status")
      }
    } catch (error) {
      console.error("Error updating job status:", error)
      toast({
        title: "Error",
        description: "Failed to update job status",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "closed":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      case "draft":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "closed":
        return "Closed"
      case "draft":
        return "Draft"
      default:
        return status
    }
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

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.department && job.department.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="h-10 bg-muted rounded-lg animate-pulse"></div>
          </div>
          <div className="w-full sm:w-48 h-10 bg-muted rounded-lg animate-pulse"></div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-6 bg-muted rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                  </div>
                  <div className="w-20 h-6 bg-muted rounded animate-pulse"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-20 bg-muted rounded-lg animate-pulse"></div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <div className="h-9 bg-muted rounded w-32 animate-pulse"></div>
                  <div className="h-9 bg-muted rounded w-24 animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs by title or department..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={fetchJobs} variant="outline" className="shrink-0">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredJobs.map((job) => (
          <Card key={job._id} className="glass-card hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {job.title}
                    {job.salary && (
                      <Badge variant="outline" className="text-xs font-normal">
                        {job.salary}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-4 mt-1">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </span>
                    {job.department && <span>{job.department}</span>}
                    <span>{job.jobType}</span>
                    <span className="text-xs">Posted {getTimeAgo(job.createdAt)}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(job.status)}>
                    {getStatusLabel(job.status)}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={deletingJob === job._id}>
                        {deletingJob === job._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MoreHorizontal className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="glass-card" align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Job
                      </DropdownMenuItem>
                      {job.status === "active" && (
                        <DropdownMenuItem onClick={() => updateJobStatus(job._id, "closed")}>
                          <Briefcase className="mr-2 h-4 w-4" />
                          Close Job
                        </DropdownMenuItem>
                      )}
                      {job.status === "closed" && (
                        <DropdownMenuItem onClick={() => updateJobStatus(job._id, "active")}>
                          <Briefcase className="mr-2 h-4 w-4" />
                          Reopen Job
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => deleteJob(job._id)}
                        disabled={deletingJob === job._id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deletingJob === job._id ? "Deleting..." : "Delete Job"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-lg font-semibold">{job.applications}</p>
                  <p className="text-xs text-muted-foreground">Applications</p>
                </div>
                <div className="text-center p-3 bg-purple-500/10 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Eye className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-lg font-semibold">{job.views}</p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
                <div className="text-center p-3 bg-green-500/10 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-sm font-semibold">
                    {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                  <p className="text-xs text-muted-foreground">Posted</p>
                </div>
                <div className="text-center p-3 bg-orange-500/10 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Calendar className="w-4 h-4 text-orange-600" />
                  </div>
                  <p className="text-sm font-semibold">
                    {job.deadline ? 
                      new Date(job.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : 
                      "No deadline"
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">Deadline</p>
                </div>
              </div>

              {job.requirements && job.requirements.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Key Requirements:</p>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                    {job.requirements.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{job.requirements.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Applications
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Job
                </Button>
                {job.status === "active" && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateJobStatus(job._id, "closed")}
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Close Job
                  </Button>
                )}
                {job.status === "closed" && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateJobStatus(job._id, "active")}
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Reopen Job
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card className="glass-card">
          <CardContent className="text-center py-12">
            <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">No jobs found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first job posting to get started"
              }
            </p>
            <Button onClick={onCreateJob}>
              <Briefcase className="w-4 h-4 mr-2" />
              Create Job Posting
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

