"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, FileText, Briefcase } from "lucide-react"
import { StudentNavbar } from "@/components/student/student-navbar"
import { ProfileCard } from "@/components/student/profile-card"
import { ResumeUploader } from "@/components/student/resume-uploader"
import { JobListings } from "@/components/student/job-listings"
import { ApplicationTracker } from "@/components/student/application-tracker"

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:5000/api/student/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch profile")
        const data = await res.json()
        setStudent(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) return <p className="p-6 sm:p-8">Loading dashboard...</p>
  if (!student)
    return <p className="p-6 sm:p-8 text-red-500">Error loading student data</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/10">
      <StudentNavbar />

      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
            Welcome back, {student.name}!
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track your applications and discover new opportunities
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass p-1 h-auto flex flex-wrap sm:flex-nowrap gap-1">
            <TabsTrigger
              value="overview"
              className="flex items-center px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            >
              <User className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>

            <TabsTrigger
              value="jobs"
              className="flex items-center px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Job Listings
            </TabsTrigger>

            <TabsTrigger
              value="applications"
              className="flex items-center px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            >
              <FileText className="w-4 h-4 mr-2" />
              My Applications
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-1 space-y-6">
                <ProfileCard student={student} />
              </div>

              <div className="lg:col-span-2 space-y-6">
                <ResumeUploader student={student} setStudent={setStudent} />
                <ApplicationTracker />
              </div>
            </div>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <JobListings />
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <ApplicationTracker detailed />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
