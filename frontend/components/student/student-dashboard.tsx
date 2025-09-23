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
        console.error("Error fetching profile:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) return <p className="p-8">Loading dashboard...</p>
  if (!student) return <p className="p-8 text-red-500">Error loading student data</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/10">
      <StudentNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {student.name}!</h1>
          <p className="text-muted-foreground">
            Track your applications and discover new opportunities
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass p-1 h-auto">
            <TabsTrigger value="overview" className="px-6 py-3">
              <User className="w-4 h-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="jobs" className="px-6 py-3">
              <Briefcase className="w-4 h-4 mr-2" /> Job Listings
            </TabsTrigger>
            <TabsTrigger value="applications" className="px-6 py-3">
              <FileText className="w-4 h-4 mr-2" /> My Applications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ProfileCard student={student} />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <ResumeUploader student={student} />
                <ApplicationTracker />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="jobs">
            <JobListings />
          </TabsContent>

          <TabsContent value="applications">
            <ApplicationTracker detailed />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
