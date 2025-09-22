"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Eye, Download, Mail, Phone, GraduationCap, MapPin, Calendar } from "lucide-react"

const applicants = [
  {
    id: 1,
    name: "Alex Smith",
    email: "alex.smith@university.edu",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    education: "Computer Science, NYU",
    cgpa: "8.7/10",
    jobTitle: "Senior Software Engineer",
    appliedDate: "2024-11-28",
    status: "interview",
    avatar: "/student-profile.png",
    skills: ["React", "Node.js", "TypeScript"],
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@college.edu",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    education: "Software Engineering, Stanford",
    cgpa: "9.1/10",
    jobTitle: "Frontend Developer",
    appliedDate: "2024-11-27",
    status: "shortlisted",
    avatar: "/diverse-student-profiles.png",
    skills: ["React", "CSS", "JavaScript"],
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "m.chen@university.edu",
    phone: "+1 (555) 345-6789",
    location: "Austin, TX",
    education: "Computer Science, UT Austin",
    cgpa: "8.9/10",
    jobTitle: "Product Manager",
    appliedDate: "2024-11-26",
    status: "applied",
    avatar: "/student-profile.png",
    skills: ["Product Strategy", "Analytics", "Leadership"],
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@college.edu",
    phone: "+1 (555) 456-7890",
    location: "Seattle, WA",
    education: "Design, Art Institute",
    cgpa: "8.5/10",
    jobTitle: "UX Designer",
    appliedDate: "2024-11-25",
    status: "rejected",
    avatar: "/diverse-student-profiles.png",
    skills: ["Figma", "User Research", "Prototyping"],
  },
]

const statusConfig = {
  applied: {
    color: "bg-secondary/10 text-secondary border-secondary/20",
    label: "Applied",
  },
  shortlisted: {
    color: "bg-accent/10 text-accent border-accent/20",
    label: "Shortlisted",
  },
  interview: {
    color: "bg-primary/10 text-primary border-primary/20",
    label: "Interview",
  },
  selected: {
    color: "bg-green-500/10 text-green-600 border-green-500/20",
    label: "Selected",
  },
  rejected: {
    color: "bg-destructive/10 text-destructive border-destructive/20",
    label: "Rejected",
  },
}

export function ApplicantManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [jobFilter, setJobFilter] = useState("all")

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || applicant.status === statusFilter
    const matchesJob = jobFilter === "all" || applicant.jobTitle === jobFilter
    return matchesSearch && matchesStatus && matchesJob
  })

  const updateStatus = (applicantId: number, newStatus: string) => {
    // Handle status update
    console.log(`Updating applicant ${applicantId} to status: ${newStatus}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applicants..."
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
            <SelectItem value="Senior Software Engineer">Senior Software Engineer</SelectItem>
            <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
            <SelectItem value="Product Manager">Product Manager</SelectItem>
            <SelectItem value="UX Designer">UX Designer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredApplicants.map((applicant) => {
          const status = statusConfig[applicant.status as keyof typeof statusConfig]

          return (
            <Card key={applicant.id} className="glass-card hover:shadow-lg transition-all duration-200">
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
                      <CardDescription>Applied for {applicant.jobTitle}</CardDescription>
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
                      {applicant.location}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" />
                      {applicant.education}
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="w-4 h-4 mr-2 text-muted-foreground font-bold">GPA</span>
                      <Badge variant="outline" className="bg-accent/10 text-accent">
                        {applicant.cgpa}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      Applied {new Date(applicant.appliedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {applicant.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                  <Select onValueChange={(value) => updateStatus(applicant.id, value)}>
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue placeholder="Update Status" />
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

      {filteredApplicants.length === 0 && (
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
