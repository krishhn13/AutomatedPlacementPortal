"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, Briefcase, Users, Check, X, Eye, Clock } from "lucide-react"

const pendingCompanies = [
  {
    id: 1,
    name: "TechStart Inc.",
    industry: "Technology",
    location: "San Francisco, CA",
    email: "hr@techstart.com",
    website: "www.techstart.com",
    submittedDate: "2024-11-30",
    documents: ["Registration Certificate", "Tax ID", "Company Profile"],
    logo: "/abstract-startup-logo.png",
  },
  {
    id: 2,
    name: "InnovateCorp",
    industry: "Software",
    location: "Austin, TX",
    email: "careers@innovatecorp.com",
    website: "www.innovatecorp.com",
    submittedDate: "2024-11-29",
    documents: ["Business License", "Company Profile"],
    logo: "/abstract-tech-logo.png",
  },
]

const pendingJobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechCorp Inc.",
    department: "Engineering",
    location: "Remote",
    salary: "$100,000 - $150,000",
    submittedDate: "2024-11-30",
    description: "We are looking for a senior software engineer to join our team...",
    requirements: ["5+ years experience", "React", "Node.js"],
  },
  {
    id: 2,
    title: "Product Manager",
    company: "StartupXYZ",
    department: "Product",
    location: "New York, NY",
    salary: "$90,000 - $130,000",
    submittedDate: "2024-11-29",
    description: "Join our product team to drive innovation and growth...",
    requirements: ["3+ years PM experience", "Analytics", "Leadership"],
  },
]

const pendingStudents = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@university.edu",
    branch: "Computer Science",
    year: "Final Year",
    cgpa: "8.9/10",
    submittedDate: "2024-11-30",
    documents: ["ID Card", "Transcript", "Resume"],
    avatar: "/student-profile.png",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@college.edu",
    branch: "Electronics",
    year: "Third Year",
    cgpa: "9.1/10",
    submittedDate: "2024-11-29",
    documents: ["ID Card", "Transcript"],
    avatar: "/diverse-student-profiles.png",
  },
]

export function ApprovalPanel() {
  const [activeTab, setActiveTab] = useState("companies")

  const handleApprove = (type: string, id: number) => {
    console.log(`Approving ${type} with id: ${id}`)
    // Handle approval logic
  }

  const handleReject = (type: string, id: number) => {
    console.log(`Rejecting ${type} with id: ${id}`)
    // Handle rejection logic
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Companies</p>
                <p className="text-2xl font-bold">{pendingCompanies.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/10">
                <Building2 className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Jobs</p>
                <p className="text-2xl font-bold">{pendingJobs.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-accent/10">
                <Briefcase className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Students</p>
                <p className="text-2xl font-bold">{pendingStudents.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="glass">
          <TabsTrigger
            value="companies"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Companies ({pendingCompanies.length})
          </TabsTrigger>
          <TabsTrigger
            value="jobs"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Job Postings ({pendingJobs.length})
          </TabsTrigger>
          <TabsTrigger
            value="students"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Users className="w-4 h-4 mr-2" />
            Students ({pendingStudents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="space-y-4">
          {pendingCompanies.map((company) => (
            <Card key={company.id} className="glass-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <CardDescription>
                        {company.industry} • {company.location}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Email:</span> {company.email}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Website:</span> {company.website}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Submitted:</span>{" "}
                      {new Date(company.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Documents Submitted:</p>
                    <div className="space-y-1">
                      {company.documents.map((doc) => (
                        <div key={doc} className="flex items-center text-sm">
                          <Check className="w-3 h-3 mr-2 text-accent" />
                          {doc}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove("company", company.id)}
                    className="bg-accent hover:bg-accent/90"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReject("company", company.id)}
                    className="text-destructive hover:text-destructive bg-transparent"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          {pendingJobs.map((job) => (
            <Card key={job.id} className="glass-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription>
                      {job.company} • {job.department} • {job.location}
                    </CardDescription>
                  </div>
                  <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Job Description:</p>
                    <p className="text-sm text-muted-foreground">{job.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Salary:</span> {job.salary}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Submitted:</span>{" "}
                        {new Date(job.submittedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Requirements:</p>
                      <div className="flex flex-wrap gap-1">
                        {job.requirements.map((req) => (
                          <Badge key={req} variant="secondary" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Details
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove("job", job.id)}
                      className="bg-accent hover:bg-accent/90"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject("job", job.id)}
                      className="text-destructive hover:text-destructive bg-transparent"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          {pendingStudents.map((student) => (
            <Card key={student.id} className="glass-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                      <AvatarFallback>
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <CardDescription>
                        {student.branch} • {student.year}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Email:</span> {student.email}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">CGPA:</span> {student.cgpa}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Submitted:</span>{" "}
                      {new Date(student.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Documents Submitted:</p>
                    <div className="space-y-1">
                      {student.documents.map((doc) => (
                        <div key={doc} className="flex items-center text-sm">
                          <Check className="w-3 h-3 mr-2 text-accent" />
                          {doc}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove("student", student.id)}
                    className="bg-accent hover:bg-accent/90"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReject("student", student.id)}
                    className="text-destructive hover:text-destructive bg-transparent"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
