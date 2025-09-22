"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Plus, Users, BarChart3 } from "lucide-react"
import { CompanyNavbar } from "@/components/company/company-navbar"
import { CompanyOverview } from "@/components/company/company-overview"
import { JobPostingForm } from "@/components/company/job-posting-form"
import { JobManagement } from "@/components/company/job-management"
import { ApplicantManagement } from "@/components/company/applicant-management"
import { Button } from "@/components/ui/button"

export function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showJobForm, setShowJobForm] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/10">
      <CompanyNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">TechCorp Inc. Dashboard</h1>
            <p className="text-muted-foreground text-pretty">Manage your recruitment and find the best talent</p>
          </div>
          <Button onClick={() => setShowJobForm(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass p-1 h-auto">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="jobs"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Job Listings
            </TabsTrigger>
            <TabsTrigger
              value="applicants"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3"
            >
              <Users className="w-4 h-4 mr-2" />
              Applicants
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <CompanyOverview />
          </TabsContent>

          <TabsContent value="jobs">
            <JobManagement onCreateJob={() => setShowJobForm(true)} />
          </TabsContent>

          <TabsContent value="applicants">
            <ApplicantManagement />
          </TabsContent>
        </Tabs>

        {showJobForm && <JobPostingForm onClose={() => setShowJobForm(false)} />}
      </div>
    </div>
  )
}
