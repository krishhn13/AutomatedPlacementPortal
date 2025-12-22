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
  const [jobs, setJobs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview")
  const [showJobForm, setShowJobForm] = useState(false)
  const [company, setCompany] = useState<Company | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  useEffect(() => {
    fetchDashboardData()
    // debugJobsData() will be called after fetchDashboardData completes
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      if (!token) {
        toast({
          title: "Not authenticated",
          description: "Please log in again",
          variant: "destructive",
        })
        setFallbackCompanyData()
        setStats(getDefaultStats())
        return
      }

      console.log("Fetching dashboard data with token:", token.substring(0, 20) + "...")
      
      // Fetch company profile
      await fetchCompanyProfile(token)
      
      // Fetch dashboard stats
      await fetchDashboardStats(token)
      await fetchCompanyJobs(token);
      // Debug jobs data after fetching everything
      await debugJobsData(token)
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Using cached information.",
        variant: "destructive",
      })
      
      setFallbackCompanyData()
      setStats(getDefaultStats())
    } finally {
      setLoading(false)
    }
  }

const fetchCompanyJobs = async (token: string) => {
  try {
    const endpoint = `${API_BASE_URL}/api/company/jobs`;
    console.log("Fetching jobs from:", endpoint);

    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch jobs:", res.status);
      setJobs([]);
      return;
    }

    const data = await res.json();
    console.log("Jobs API response:", data);

    // ✅ THIS IS THE FIX
    setJobs(Array.isArray(data.jobs) ? data.jobs : []);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    setJobs([]);
  }
};


  const fetchCompanyProfile = async (token: string) => {
    try {
      const endpoint = `${API_BASE_URL}/api/company/profile/me`
      console.log("Fetching company profile from:", endpoint)
      
      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Company profile response status:", res.status)
      
      if (res.ok) {
        const data = await res.json()
        console.log("Company profile data:", data)
        
        // Handle different response formats
        if (data.data) {
          setCompany(data.data)
        } else if (data.company) {
          setCompany(data.company)
        } else {
          setCompany(data)
        }
      } else {
        // If endpoint doesn't exist, try to get company from localStorage
        console.log("Company profile endpoint failed, using localStorage")
        await fetchCompanyFromLocalStorage()
      }
    } catch (error) {
      console.error("Error fetching company profile:", error)
      await fetchCompanyFromLocalStorage()
    }
  }

  const fetchCompanyFromLocalStorage = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}")
      const companyId = userData.id || userData._id
      
      if (companyId) {
        // Try to fetch company by ID
        const token = localStorage.getItem("token")
        if (token) {
          const endpoint = `${API_BASE_URL}/api/companies/${companyId}`
          console.log("Trying to fetch company by ID:", endpoint)
          
          const res = await fetch(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          
          if (res.ok) {
            const data = await res.json()
            if (data.data) {
              setCompany(data.data)
              return
            }
          }
        }
      }
      
      // If all else fails, use fallback
      setFallbackCompanyData()
    } catch (error) {
      console.error("Error fetching company from localStorage:", error)
      setFallbackCompanyData()
    }
  }

  const fetchDashboardStats = async (token: string) => {
    try {
      const endpoints = [
        `${API_BASE_URL}/api/company/dashboard/stats`,
        `${API_BASE_URL}/api/company/stats`
      ]

      console.log("Fetching stats from endpoints:", endpoints)
      
      for (const endpoint of endpoints) {
        try {
          console.log("Trying endpoint:", endpoint)
          const res = await fetch(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          console.log("Stats response status:", res.status, "for endpoint:", endpoint)
          
          if (res.ok) {
            const data = await res.json()
            console.log("Stats data received:", data)
            
            if (data.stats) {
              setStats(data.stats)
            } else {
              setStats(data)
            }
            return
          }
        } catch (error) {
          console.log(`Stats endpoint ${endpoint} failed:`, error)
        }
      }

      // If no stats endpoints work, calculate manually
      console.log("All stats endpoints failed, calculating manually")
      await fetchStatsManually(token)
      
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      setStats(getDefaultStats())
    }
  }

  const fetchStatsManually = async (token: string) => {
    try {
      // Fetch company's jobs
      const endpoint = `${API_BASE_URL}/api/company/jobs`;
      console.log("Fetching jobs for manual stats from:", endpoint);
      
      const jobsRes = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      let totalJobs = 0;
      let activeJobs = 0;

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        console.log("Full jobs response:", jobsData);
        
        // Extract jobs array from different possible response formats
        let jobs = [];
        if (jobsData.jobs && Array.isArray(jobsData.jobs)) {
          jobs = jobsData.jobs;
        } else if (jobsData.data && Array.isArray(jobsData.data)) {
          jobs = jobsData.data;
        } else if (Array.isArray(jobsData)) {
          jobs = jobsData;
        }
        
        console.log("Extracted jobs array:", jobs);
        totalJobs = jobs.length;
        activeJobs = jobs.filter((job: any) => job.status === 'active').length;
        
        // Store jobs in localStorage for debugging
        localStorage.setItem('companyJobs', JSON.stringify(jobs));
      } else {
        console.log("Failed to fetch jobs for manual stats:", jobsRes.status);
        const errorText = await jobsRes.text();
        console.log("Error response:", errorText);
      }

      // For now, set applications to 0
      const totalApplications = 0;
      const pendingApplications = 0;
      const hiredCount = 0;

      const calculatedStats = {
        totalJobs,
        activeJobs,
        totalApplications,
        pendingApplications,
        hiredCount
      };
      
      console.log("Calculated stats manually:", calculatedStats);
      setStats(calculatedStats);
    } catch (error) {
      console.error("Error fetching stats manually:", error);
      setStats(getDefaultStats());
    }
  }

  const debugJobsData = async (token: string) => {
    try {
      const endpoint = `${API_BASE_URL}/api/company/jobs`;
      console.log("🔍 DEBUG: Fetching jobs from:", endpoint);
      
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log("🔍 DEBUG: Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("🔍 DEBUG: Full jobs data:", data);
        
        // Check what's actually in the response
        console.log("🔍 DEBUG: jobsData.jobs:", data.jobs);
        console.log("🔍 DEBUG: jobsData.data:", data.data);
        console.log("🔍 DEBUG: jobsData length:", data.length);
        
        if (data.jobs && Array.isArray(data.jobs)) {
          console.log(`🔍 DEBUG: Found ${data.jobs.length} jobs in jobs array`);
          data.jobs.forEach((job, index) => {
            console.log(`🔍 DEBUG: Job ${index + 1}:`, {
              id: job._id,
              title: job.title,
              status: job.status,
              companyId: job.companyId,
              jobType: job.jobType
            });
          });
        }
      } else {
        const errorText = await response.text();
        console.log("🔍 DEBUG: Error:", errorText);
      }
    } catch (error) {
      console.error("🔍 DEBUG: Error:", error);
    }
  };

  const getDefaultStats = (): DashboardStats => ({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    hiredCount: 0
  })

  const setFallbackCompanyData = () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}")
      console.log("Setting fallback company data from localStorage:", userData)
      
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
        jobs: userData.jobs || [],
        createdAt: userData.createdAt || new Date().toISOString(),
        updatedAt: userData.updatedAt || new Date().toISOString()
      })
    } catch (error) {
      console.error("Error setting fallback data:", error)
      setCompany({
        _id: "1",
        name: "Your Company",
        email: "",
        phone: "",
        website: "",
        location: "",
        industry: "Technology",
        description: "Manage your recruitment and find the best talent",
        employeeCount: "",
        jobs: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }
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
    fetchDashboardData()
    toast({
      title: "Success",
      description: "Job posted successfully",
      variant: "default",
    })
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab === "overview" || tab === "jobs") {
      fetchDashboardData()
    }
  }

  // Function to manually debug jobs
  const handleDebugJobs = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await debugJobsData(token);
    } else {
      console.log("🔍 DEBUG: No token found");
    }
  }

  // Function to check authentication
  const handleCheckAuth = () => {
    const token = localStorage.getItem("token");
    console.log("🔑 Check Auth - Token:", token ? token.substring(0, 20) + "..." : "No token");
    console.log("🔑 Check Auth - UserData:", localStorage.getItem("userData"));
    
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    console.log("🔑 Check Auth - Parsed UserData:", userData);
    
    toast({
      title: "Auth Status",
      description: token ? "Token found" : "No token found",
      variant: token ? "default" : "destructive",
    });
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
            
            {/* Debug buttons */}
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDebugJobs}
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
              >
                🔍 Debug Jobs
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCheckAuth}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800"
              >
                🔑 Check Auth
              </Button>
            </div>
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

        {/* Dashboard Tabs */}
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
              jobs={company?.jobs || []}
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