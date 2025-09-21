"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { User, FileText, Briefcase, TrendingUp } from "lucide-react"
import { StudentProfile } from "@/components/student/student-profile"
import { JobCard } from "@/components/student/job-card"
import { ApplicationStatus } from "@/components/student/application-status"
import { ApplicationTracker } from "@/components/placement/application-tracker"
import { NotificationCenter } from "@/components/placement/notification-center"
import { PlacementCalendar } from "@/components/placement/placement-calendar"
import { Header } from "@/components/layout/header"

// Mock data
const mockStudent = {
  id: "1",
  name: "John Doe",
  email: "john.doe@university.edu",
  rollNo: "CS2021001",
  branch: "Computer Science",
  cgpa: 8.5,
  skills: ["React", "Node.js", "Python", "Java", "SQL"],
  resumeUrl: null,
}

const mockJobs = [
  {
    id: "1",
    role: "Software Engineer",
    company: "TechCorp",
    location: "Bangalore",
    eligibleBranches: ["Computer Science", "Information Technology"],
    minCGPA: 7.0,
    deadline: "2024-02-15",
    description: "Join our team as a Software Engineer and work on cutting-edge technologies.",
    package: "12-15 LPA",
    applied: false,
  },
  {
    id: "2",
    role: "Frontend Developer",
    company: "WebSolutions",
    location: "Mumbai",
    eligibleBranches: ["Computer Science", "Information Technology", "Electronics"],
    minCGPA: 7.5,
    deadline: "2024-02-20",
    description: "Looking for passionate frontend developers to build amazing user experiences.",
    package: "10-12 LPA",
    applied: true,
  },
  {
    id: "3",
    role: "Data Analyst",
    company: "DataInsights",
    location: "Hyderabad",
    eligibleBranches: ["Computer Science", "Information Technology"],
    minCGPA: 8.0,
    deadline: "2024-02-10",
    description: "Analyze complex datasets and provide actionable business insights.",
    package: "8-10 LPA",
    applied: false,
  },
]

const mockApplications = [
  {
    id: "1",
    jobId: "2",
    role: "Frontend Developer",
    company: "WebSolutions",
    appliedDate: "2024-01-15",
    status: "shortlisted" as const,
  },
  {
    id: "2",
    jobId: "4",
    role: "Backend Developer",
    company: "ServerTech",
    appliedDate: "2024-01-10",
    status: "applied" as const,
  },
  {
    id: "3",
    jobId: "5",
    role: "Full Stack Developer",
    company: "FullStackCorp",
    appliedDate: "2024-01-05",
    status: "rejected" as const,
  },
]

const mockNotifications = [
  {
    id: "1",
    type: "success" as const,
    title: "Application Shortlisted",
    message: "Congratulations! You've been shortlisted for Frontend Developer at WebSolutions.",
    timestamp: "2024-01-25T10:30:00Z",
    read: false,
  },
  {
    id: "2",
    type: "info" as const,
    title: "New Job Posted",
    message: "TechCorp has posted a new Software Engineer position. Check it out!",
    timestamp: "2024-01-24T14:15:00Z",
    read: false,
  },
  {
    id: "3",
    type: "warning" as const,
    title: "Application Deadline Approaching",
    message: "Only 2 days left to apply for Data Analyst position at DataInsights.",
    timestamp: "2024-01-23T09:00:00Z",
    read: true,
  },
]

const mockCalendarEvents = [
  {
    id: "1",
    title: "Technical Interview",
    type: "interview" as const,
    company: "WebSolutions",
    date: "2024-02-01",
    time: "10:00 AM",
    location: "Virtual Meeting",
    description: "Technical round for Frontend Developer position",
  },
  {
    id: "2",
    title: "Application Deadline",
    type: "deadline" as const,
    company: "DataInsights",
    date: "2024-02-05",
    description: "Last date to apply for Data Analyst position",
  },
  {
    id: "3",
    title: "Campus Placement Drive",
    type: "drive" as const,
    company: "TechCorp",
    date: "2024-02-10",
    time: "9:00 AM",
    location: "Main Auditorium",
    description: "On-campus recruitment drive for multiple positions",
  },
]

const mockApplicationTracker = {
  id: "1",
  jobId: "2",
  studentId: "1",
  companyName: "WebSolutions",
  role: "Frontend Developer",
  appliedDate: "2024-01-15",
  currentStatus: "shortlisted" as const,
  steps: [
    {
      id: "1",
      title: "Application Submitted",
      status: "completed" as const,
      date: "2024-01-15",
      description: "Your application has been successfully submitted",
    },
    {
      id: "2",
      title: "Application Under Review",
      status: "completed" as const,
      date: "2024-01-18",
      description: "HR team is reviewing your application",
    },
    {
      id: "3",
      title: "Shortlisted for Interview",
      status: "current" as const,
      date: "2024-01-25",
      description: "Congratulations! You've been shortlisted for the next round",
    },
    {
      id: "4",
      title: "Technical Interview",
      status: "pending" as const,
      description: "Scheduled for February 1st, 2024",
    },
    {
      id: "5",
      title: "Final Decision",
      status: "pending" as const,
      description: "Final selection results will be announced",
    },
  ],
}

export default function StudentDashboard() {
  const [student, setStudent] = useState(mockStudent)
  const [jobs, setJobs] = useState(mockJobs)
  const [applications, setApplications] = useState(mockApplications)
  const [notifications, setNotifications] = useState(mockNotifications)
  const [calendarEvents] = useState(mockCalendarEvents)

  const handleApplyJob = (jobId: string) => {
    setJobs(jobs.map((job) => (job.id === jobId ? { ...job, applied: true } : job)))

    const job = jobs.find((j) => j.id === jobId)
    if (job) {
      const newApplication = {
        id: Date.now().toString(),
        jobId,
        role: job.role,
        company: job.company,
        appliedDate: new Date().toISOString().split("T")[0],
        status: "applied" as const,
      }
      setApplications([newApplication, ...applications])
    }
  }

  const eligibleJobs = jobs.filter(
    (job) => job.eligibleBranches.includes(student.branch) && student.cgpa >= job.minCGPA,
  )

  const profileCompletion = () => {
    let completed = 0
    const total = 6

    if (student.name) completed++
    if (student.email) completed++
    if (student.rollNo) completed++
    if (student.branch) completed++
    if (student.cgpa) completed++
    if (student.resumeUrl) completed++

    return Math.round((completed / total) * 100)
  }

  const handleMarkNotificationAsRead = (notificationId: string) => {
    setNotifications(notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
  }

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const handleDismissNotification = (notificationId: string) => {
    setNotifications(notifications.filter((n) => n.id !== notificationId))
  }

  const unreadNotifications = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <Header
        title="Student Dashboard"
        subtitle={`Welcome back, ${student.name}`}
        userRole="student"
        userName={student.name}
        notificationCount={unreadNotifications}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-primary-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Profile Completion</p>
                  <p className="text-2xl font-bold text-primary-900">{profileCompletion()}%</p>
                </div>
                <User className="h-8 w-8 text-primary-900" />
              </div>
              <Progress value={profileCompletion()} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-primary-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Eligible Jobs</p>
                  <p className="text-2xl font-bold text-primary-900">{eligibleJobs.length}</p>
                </div>
                <Briefcase className="h-8 w-8 text-primary-900" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Applications</p>
                  <p className="text-2xl font-bold text-primary-900">{applications.length}</p>
                </div>
                <FileText className="h-8 w-8 text-primary-900" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current CGPA</p>
                  <p className="text-2xl font-bold text-primary-900">{student.cgpa}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary-900" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="jobs">Available Jobs</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="tracker">Application Tracker</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-semibold text-primary-900">Available Opportunities</h2>
              <Badge variant="secondary" className="bg-primary-50 text-primary-900">
                {eligibleJobs.length} eligible jobs
              </Badge>
            </div>

            <div className="grid gap-6">
              {eligibleJobs.map((job) => (
                <JobCard key={job.id} job={job} student={student} onApply={() => handleApplyJob(job.id)} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <h2 className="text-xl font-serif font-semibold text-primary-900">Application Status</h2>

            <div className="grid gap-4">
              {applications.map((application) => (
                <ApplicationStatus key={application.id} application={application} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tracker" className="space-y-6">
            <h2 className="text-xl font-serif font-semibold text-primary-900">Application Tracker</h2>
            <ApplicationTracker application={mockApplicationTracker} />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <h2 className="text-xl font-serif font-semibold text-primary-900">Placement Calendar</h2>
            <PlacementCalendar events={calendarEvents} />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <h2 className="text-xl font-serif font-semibold text-primary-900">Notifications</h2>
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={handleMarkNotificationAsRead}
              onMarkAllAsRead={handleMarkAllNotificationsAsRead}
              onDismiss={handleDismissNotification}
            />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <StudentProfile student={student} onUpdate={setStudent} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
