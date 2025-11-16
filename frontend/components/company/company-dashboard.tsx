"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Plus, Users, BarChart3, Loader2, RefreshCw } from "lucide-react"
import { CompanyNavbar } from "@/components/company/company-navbar"
import { CompanyOverview } from "@/components/company/company-overview"
import { JobPostingForm } from "@/components/company/job-posting-form"
import { JobManagement } from "@/components/company/job-management"
import { ApplicantManagement } from "@/components/company/applicant-management"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

interface DashboardStats {
  totalJobs: number
  activeJobs: number
  totalApplications: number
  pendingApplications: number
  hiredCount: number
}

export function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showJobForm, setShowJobForm] = useState(false)
  const [company, setCompany] = useState<Company | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      if (!token) {
        throw new Error("No authentication token found")
      }

      // Get user data from localStorage (set during login)
      const userData = JSON.parse(localStorage.getItem("userData") || "{}")
      const companyId = userData.id || userData._id || userData.companyId

      if (!companyId) {
        throw new Error("Company ID not found in user data")
      }

      // Fetch company details using the company ID from auth
      await fetchCompanyById(companyId)
      
      // Fetch dashboard stats
      await fetchDashboardStats()
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
      
      // Set fallback company data from localStorage
      setFallbackCompanyData()
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanyById = async (companyId: string) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/companies/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setCompany(data.data || data)
      } else {
        // Try alternative endpoints
        await tryAlternativeCompanyEndpoints(companyId)
      }
    } catch (error) {
      console.error("Error fetching company by ID:", error)
      throw error
    }
  }

  const tryAlternativeCompanyEndpoints = async (companyId: string) => {
    const token = localStorage.getItem("token")
    const userData = JSON.parse(localStorage.getItem("userData") || "{}")
    
    // Try different endpoint variations
    const endpoints = [
      `http://localhost:5000/api/company/${companyId}`,
      `http://localhost:5000/api/companies/${companyId}`,
      `http://localhost:5000/api/company/profile`,
      `http://localhost:5000/api/company/me`
    ]

    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.ok) {
          const data = await res.json()
          setCompany(data.data || data.company || data)
          return
        }
      } catch (error) {
        console.log(`Endpoint ${endpoint} failed:`, error)
      }
    }

    // If all endpoints fail, try fetching by company name
    if (userData.name) {
      await fetchCompanyByName(userData.name)
    } else {
      throw new Error("Could not fetch company data from any endpoint")
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
        throw new Error("Company not found by name")
      }
    } catch (error) {
      console.error("Error fetching company by name:", error)
      throw error
    }
  }

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token")
      
      // Try multiple stats endpoints
      const endpoints = [
        'http://localhost:5000/api/company/stats',
        'http://localhost:5000/api/company/dashboard/stats',
        'http://localhost:5000/api/company/overview'
      ]

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (res.ok) {
            const data = await res.json()
            setStats(data.stats || data)
            return
          }
        } catch (error) {
          console.log(`Stats endpoint ${endpoint} failed:`, error)
        }
      }

      // If no stats endpoints work, set default stats
      setStats({
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        pendingApplications: 0,
        hiredCount: 0
      })
      
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    }
  }

  const setFallbackCompanyData = () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}")
    setCompany({
      _id: userData.id || userData._id || "1",
      name: userData.name || userData.companyName || "Your Company",
      email: userData.email || "",
      phone: userData.phone || "",
      website: userData.website || "",
      location: userData.location || "",
      industry: userData.industry || "Technology",
      description: userData.description || "Manage your recruitment and find the best talent",
      employeeCount: userData.employeeCount || "",
      jobs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
    toast({
      title: "Refreshed",
      description: "Dashboard data updated",
      variant: "default",
    })
  }

  const handleJobCreated = () => {
    setShowJobForm(false)
    // Refresh all data
    fetchDashboardData()
    
    toast({
      title: "Success",
      description: "Job posted successfully",
      variant: "default",
    })
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    // Refresh data when switching to certain tabs
    if (tab === "overview" || tab === "jobs") {
      fetchDashboardData()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/10">
        <CompanyNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading company dashboard...</span>
            <Button 
              variant="outline" 
              onClick={fetchDashboardData}
              className="mt-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/10">
      {/* CompanyNavbar with proper props */}
      <CompanyNavbar company={company} onRefresh={handleRefresh} />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold text-balance">
                {company?.name || "Company"} Dashboard
              </h1>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="shrink-0"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <p className="text-muted-foreground text-pretty max-w-2xl">
              {company?.description || "Manage your recruitment and find the best talent"}
            </p>
            {company && (
              <div className="flex flex-wrap gap-2 mt-3">
                {company.industry && (
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">
                    🏢 {company.industry}
                  </Badge>
                )}
                {company.location && (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                    📍 {company.location}
                  </Badge>
                )}
                {company.employeeCount && (
                  <Badge variant="secondary" className="bg-purple-500/10 text-purple-600">
                    👥 {company.employeeCount} employees
                  </Badge>
                )}
                {company.website && (
                  <Badge variant="secondary" className="bg-orange-500/10 text-orange-600">
                    🌐 {company.website}
                  </Badge>
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

        {/* Dashboard Tabs - Fixed Structure */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
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
              {stats && stats.totalJobs > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {stats.totalJobs}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="applicants"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 flex-1"
            >
              <Users className="w-4 h-4 mr-2" />
              Applicants
              {stats && stats.totalApplications > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {stats.totalApplications}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <CompanyOverview company={company} stats={stats} />
          </TabsContent>

          <TabsContent value="jobs">
            <JobManagement 
              company={company}
              onCreateJob={() => setShowJobForm(true)}
              onRefresh={fetchDashboardData}
            />
          </TabsContent>

          <TabsContent value="applicants">
            <ApplicantManagement 
              company={company}
              onRefresh={fetchDashboardData}
            />
          </TabsContent>
        </Tabs>

        {/* Job Posting Modal */}
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