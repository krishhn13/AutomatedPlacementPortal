"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users, Briefcase, TrendingUp, Plus, Eye, Calendar, MapPin } from "lucide-react"
import { PostJobForm } from "@/components/company/post-job-form"
import { ApplicantsList } from "@/components/company/applicants-list"
import { CompanyProfile } from "@/components/company/company-profile"
import { Header } from "@/components/layout/header"
import { JobManagement } from "@/components/company/job-management"

// Mock data
const mockCompany = {
  id: "1",
  companyName: "TechCorp Solutions",
  email: "hr@techcorp.com",
  contactPerson: "Jane Smith",
  description: "Leading technology company specializing in innovative software solutions.",
  website: "https://techcorp.com",
  location: "Bangalore, India",
  isApproved: true,
}

const mockJobs = [
  {
    id: "1",
    role: "Software Engineer",
    description: "Join our team as a Software Engineer and work on cutting-edge technologies.",
    eligibleBranches: ["Computer Science", "Information Technology"],
    minCGPA: 7.0,
    deadline: "2024-02-15",
    package: "12-15 LPA",
    location: "Bangalore",
    postedDate: "2024-01-10",
    applicants: 25,
    shortlisted: 8,
    status: "active" as const,
  },
  {
    id: "2",
    role: "Frontend Developer",
    description: "Looking for passionate frontend developers to build amazing user experiences.",
    eligibleBranches: ["Computer Science", "Information Technology", "Electronics"],
    minCGPA: 7.5,
    deadline: "2024-02-20",
    package: "10-12 LPA",
    location: "Mumbai",
    postedDate: "2024-01-15",
    applicants: 18,
    shortlisted: 5,
    status: "active" as const,
  },
]

const mockApplicants = [
  {
    id: "1",
    jobId: "1",
    studentId: "s1",
    name: "John Doe",
    rollNo: "CS2021001",
    branch: "Computer Science",
    cgpa: 8.5,
    skills: ["React", "Node.js", "Python"],
    resumeUrl: "/resumes/john_doe.pdf",
    appliedDate: "2024-01-20",
    status: "applied" as const,
  },
  {
    id: "2",
    jobId: "1",
    studentId: "s2",
    name: "Alice Johnson",
    rollNo: "IT2021002",
    branch: "Information Technology",
    cgpa: 9.0,
    skills: ["Java", "Spring", "MySQL"],
    resumeUrl: "/resumes/alice_johnson.pdf",
    appliedDate: "2024-01-18",
    status: "shortlisted" as const,
  },
  {
    id: "3",
    jobId: "2",
    studentId: "s3",
    name: "Bob Wilson",
    rollNo: "CS2021003",
    branch: "Computer Science",
    cgpa: 7.8,
    skills: ["React", "TypeScript", "CSS"],
    resumeUrl: "/resumes/bob_wilson.pdf",
    appliedDate: "2024-01-22",
    status: "applied" as const,
  },
]

export default function CompanyDashboard() {
  const [company, setCompany] = useState(mockCompany)
  const [jobs, setJobs] = useState(mockJobs)
  const [applicants, setApplicants] = useState(mockApplicants)
  const [showPostJob, setShowPostJob] = useState(false)

  const handlePostJob = (jobData: any) => {
    const newJob = {
      id: Date.now().toString(),
      ...jobData,
      postedDate: new Date().toISOString().split("T")[0],
      applicants: 0,
      shortlisted: 0,
      status: "active" as const,
    }
    setJobs([newJob, ...jobs])
    setShowPostJob(false)
  }

  const handleShortlistApplicant = (applicantId: string) => {
    setApplicants(
      applicants.map((applicant) =>
        applicant.id === applicantId ? { ...applicant, status: "shortlisted" as const } : applicant,
      ),
    )
  }

  const handleUpdateJob = (jobId: string, updates: Partial<any>) => {
    setJobs(jobs.map((job) => (job.id === jobId ? { ...job, ...updates } : job)))
  }

  const handleDeleteJob = (jobId: string) => {
    setJobs(jobs.filter((job) => job.id !== jobId))
  }

  const totalApplicants = applicants.length
  const totalShortlisted = applicants.filter((a) => a.status === "shortlisted").length
  const activeJobs = jobs.filter((j) => j.status === "active").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <Header
        title="Company Dashboard"
        subtitle={`Welcome back, ${company.companyName}`}
        userRole="company"
        userName={company.companyName}
        isApproved={company.isApproved}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Approval Notice */}
        {!company.isApproved && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-200 rounded-full">
                  <Building2 className="h-5 w-5 text-yellow-800" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-800">Account Pending Approval</h3>
                  <p className="text-yellow-700">
                    Your company registration is under review by the admin. You'll be able to post jobs once approved.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-primary-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                  <p className="text-2xl font-bold text-primary-900">{activeJobs}</p>
                </div>
                <Briefcase className="h-8 w-8 text-primary-900" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Applicants</p>
                  <p className="text-2xl font-bold text-primary-900">{totalApplicants}</p>
                </div>
                <Users className="h-8 w-8 text-primary-900" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Shortlisted</p>
                  <p className="text-2xl font-bold text-primary-900">{totalShortlisted}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary-900" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold text-primary-900">
                    {totalApplicants > 0 ? Math.round((totalShortlisted / totalApplicants) * 100) : 0}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary-900" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="manage-jobs">Manage Jobs</TabsTrigger>
            <TabsTrigger value="applicants">Applicants</TabsTrigger>
            <TabsTrigger value="post-job">Post Job</TabsTrigger>
            <TabsTrigger value="profile">Company Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-semibold text-primary-900">Posted Jobs</h2>
              <Button
                onClick={() => setShowPostJob(true)}
                disabled={!company.isApproved}
                className="bg-primary-900 hover:bg-primary-800"
              >
                <Plus className="mr-2 h-4 w-4" />
                Post New Job
              </Button>
            </div>

            <div className="grid gap-6">
              {jobs.map((job) => (
                <Card key={job.id} className="border-primary-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-xl font-serif text-primary-900">{job.role}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-text-default">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={job.status === "active" ? "default" : "secondary"}
                        className={job.status === "active" ? "bg-green-100 text-green-800" : ""}
                      >
                        {job.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-text-default">{job.description}</p>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-sm">
                        <span className="font-medium">Package:</span> {job.package}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Min CGPA:</span> {job.minCGPA}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Posted:</span> {new Date(job.postedDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-6 text-sm text-text-default">
                        <span>{job.applicants} applicants</span>
                        <span>{job.shortlisted} shortlisted</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="manage-jobs" className="space-y-6">
            <JobManagement
              jobs={jobs}
              onUpdateJob={handleUpdateJob}
              onDeleteJob={handleDeleteJob}
              disabled={!company.isApproved}
            />
          </TabsContent>

          <TabsContent value="applicants" className="space-y-6">
            <h2 className="text-xl font-serif font-semibold text-primary-900">Job Applicants</h2>
            <ApplicantsList applicants={applicants} jobs={jobs} onShortlist={handleShortlistApplicant} />
          </TabsContent>

          <TabsContent value="post-job" className="space-y-6">
            <PostJobForm onSubmit={handlePostJob} disabled={!company.isApproved} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <CompanyProfile company={company} onUpdate={setCompany} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
