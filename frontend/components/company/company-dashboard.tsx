"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Plus, Users, BarChart3, Loader2 } from "lucide-react"
import { CompanyNavbar } from "@/components/company/company-navbar"
import { CompanyOverview } from "@/components/company/company-overview"
import { JobPostingForm } from "@/components/company/job-posting-form"
import { JobManagement } from "@/components/company/job-management"
import { ApplicantManagement } from "@/components/company/applicant-management"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

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

export function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showJobForm, setShowJobForm] = useState(false)
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchCompanyData()
  }, [])

  const fetchCompanyData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      if (!token) {
        throw new Error("No authentication token found")
      }

      // First, get the company ID from the token or user info
      const userData = JSON.parse(localStorage.getItem("userData") || "{}")
      const companyId = userData.id || userData._id

      if (!companyId) {
        throw new Error("Company ID not found")
      }

      // Fetch company details
      const res = await fetch(`http://localhost:5000/api/company/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        // If endpoint doesn't exist, try to get company by name from user data
        if (res.status === 404) {
          await fetchCompanyByName(userData.name)
          return
        }
        throw new Error(`Failed to fetch company data: ${res.status}`)
      }

      const data = await res.json()
      setCompany(data.data || data)
      
    } catch (error) {
      console.error("Error fetching company data:", error)
      toast({
        title: "Error",
        description: "Failed to load company information",
        variant: "destructive",
      })
      
      // Set fallback company data from localStorage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}")
      setCompany({
        _id: userData.id || userData._id || "1",
        name: userData.name || "Your Company",
        email: userData.email || "",
        phone: userData.phone || "",
        website: userData.website || "",
        location: userData.location || "",
        industry: userData.industry || "",
        description: userData.description || "Manage your recruitment and find the best talent",
        employeeCount: userData.employeeCount || "",
        jobs: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanyByName = async (companyName: string) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/company/${encodeURIComponent(companyName)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setCompany(data.data || data)
      } else {
        // Use user data as fallback
        const userData = JSON.parse(localStorage.getItem("userData") || "{}")
        setCompany({
          _id: userData.id || userData._id || "1",
          name: userData.name || "Your Company",
          email: userData.email || "",
          phone: userData.phone || "",
          website: userData.website || "",
          location: userData.location || "",
          industry: userData.industry || "",
          description: userData.description || "Manage your recruitment and find the best talent",
          employeeCount: userData.employeeCount || "",
          jobs: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error("Error fetching company by name:", error)
    }
  }

  const handleJobCreated = () => {
    setShowJobForm(false)
    // Refresh company data to get updated jobs count
    fetchCompanyData()
    
    // If on jobs tab, you might want to refresh job listings
    if (activeTab === "jobs") {
      // You can add a callback prop to JobManagement to refresh data
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/10">
        <CompanyNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mr-3" />
            <span className="text-muted-foreground">Loading company dashboard...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/10">
      <CompanyNavbar company={company} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-balance mb-2">
              {company?.name || "Company"} Dashboard
            </h1>
            <p className="text-muted-foreground text-pretty max-w-2xl">
              {company?.description || "Manage your recruitment and find the best talent"}
            </p>
            {company && (
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                {company.industry && (
                  <span className="bg-secondary/50 px-2 py-1 rounded-md">
                    {company.industry}
                  </span>
                )}
                {company.location && (
                  <span className="bg-secondary/50 px-2 py-1 rounded-md">
                    📍 {company.location}
                  </span>
                )}
                {company.employeeCount && (
                  <span className="bg-secondary/50 px-2 py-1 rounded-md">
                    👥 {company.employeeCount} employees
                  </span>
                )}
              </div>
            )}
          </div>
          <Button 
            onClick={() => setShowJobForm(true)} 
            className="bg-primary hover:bg-primary/90 shrink-0"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass p-1 h-auto w-full max-w-md">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 flex-1"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="jobs"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 flex-1"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Jobs
            </TabsTrigger>
            <TabsTrigger
              value="applicants"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 flex-1"
            >
              <Users className="w-4 h-4 mr-2" />
              Applicants
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <CompanyOverview company={company} />
          </TabsContent>

          <TabsContent value="jobs">
            <JobManagement 
              company={company}
              onCreateJob={() => setShowJobForm(true)} 
            />
          </TabsContent>

          <TabsContent value="applicants">
            <ApplicantManagement company={company} />
          </TabsContent>
        </Tabs>

        {showJobForm && (
          <JobPostingForm 
            company={company}
            onClose={() => setShowJobForm(false)}
            onSuccess={handleJobCreated}
          />
        )}
      </div>
    </div>
  )
}