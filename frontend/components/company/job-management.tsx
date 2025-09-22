"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Search, Filter, Eye, Edit, Trash2, Users, Calendar, MapPin } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const jobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    status: "active",
    applications: 45,
    views: 234,
    posted: "2024-11-28",
    deadline: "2024-12-15",
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    location: "Remote",
    type: "Full-time",
    status: "active",
    applications: 32,
    views: 189,
    posted: "2024-11-25",
    deadline: "2024-12-20",
  },
  {
    id: 3,
    title: "UX Designer",
    department: "Design",
    location: "New York, NY",
    type: "Full-time",
    status: "closed",
    applications: 28,
    views: 156,
    posted: "2024-11-15",
    deadline: "2024-11-30",
  },
  {
    id: 4,
    title: "Frontend Developer",
    department: "Engineering",
    location: "Austin, TX",
    type: "Contract",
    status: "draft",
    applications: 0,
    views: 0,
    posted: "2024-11-30",
    deadline: "2024-12-25",
  },
]

interface JobManagementProps {
  onCreateJob: () => void
}

export function JobManagement({ onCreateJob }: JobManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-accent/10 text-accent border-accent/20"
      case "closed":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "draft":
        return "bg-secondary/10 text-secondary border-secondary/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 glass">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass-card">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="glass-card hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <CardDescription className="flex items-center space-x-4 mt-1">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </span>
                    <span>{job.department}</span>
                    <span>{job.type}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
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
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Job
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-lg font-semibold">{job.applications}</p>
                  <p className="text-xs text-muted-foreground">Applications</p>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Eye className="w-4 h-4 text-secondary" />
                  </div>
                  <p className="text-lg font-semibold">{job.views}</p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Calendar className="w-4 h-4 text-accent" />
                  </div>
                  <p className="text-sm font-semibold">
                    {new Date(job.posted).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                  <p className="text-xs text-muted-foreground">Posted</p>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Calendar className="w-4 h-4 text-destructive" />
                  </div>
                  <p className="text-sm font-semibold">
                    {new Date(job.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                  <p className="text-xs text-muted-foreground">Deadline</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Applications
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Job
                </Button>
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
                : "Create your first job posting to get started"}
            </p>
            <Button onClick={onCreateJob}>Create Job Posting</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
