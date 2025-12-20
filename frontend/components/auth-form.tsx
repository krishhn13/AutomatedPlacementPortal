"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { GraduationCap, Building2, Shield, Mail, Lock, User, Phone, MapPin, Globe, Briefcase } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type UserRole = "student" | "company" | "admin"

interface AuthFormProps {
  defaultRole?: UserRole
}

interface ApiError {
  message: string
  status?: number
}

interface AuthResponse {
  token: string
  user?: any
  student?: any
  company?: any
  admin?: any
  message?: string
}

export function AuthForm({ defaultRole = "student" }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formElement = e.target as HTMLFormElement
    const formData = new FormData(formElement)
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

    // DEBUG: Log all form fields
    console.log('=== FORM DATA DEBUG ===')
    const formValues: Record<string, any> = {}
    for (let [key, value] of formData.entries()) {
      formValues[key] = value
      console.log(`${key}: ${value} (type: ${typeof value})`)
    }
    console.log('=== END DEBUG ===')

    // Base payload for all roles
    const payload: any = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    // Add role-specific fields for registration
    if (!isLogin) {
      payload.name = formData.get("name") as string
      
      if (selectedRole === "student") {
        // Get ALL student fields explicitly
        const studentFields = {
          phone: formData.get("phone"),
          rollNo: formData.get("rollNo"),
          branch: formData.get("branch"),
          year: formData.get("year"), // CRITICAL: Check if this exists
          location: formData.get("location"),
          cgpa: formData.get("cgpa"),
          backlogs: formData.get("backlogs"),
          skills: formData.get("skills"),
        }

        console.log('Student fields from form:', studentFields)

        // Check if year field exists and is not empty
        if (!studentFields.year || studentFields.year.toString().trim() === '') {
          console.error('Year field is missing or empty:', studentFields.year)
          toast({
            title: "Validation Error",
            description: "Year field is required. Please enter your current year (e.g., 3rd, 4th, or 2024, 2025)",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        // Assign all fields
        payload.phone = studentFields.phone as string
        payload.rollNo = studentFields.rollNo as string
        payload.branch = studentFields.branch as string
        payload.year = studentFields.year.toString().trim() // Convert to string and trim
        payload.location = studentFields.location as string
        
        // Parse numeric values safely
        if (studentFields.cgpa && studentFields.cgpa.toString().trim() !== '') {
          const cgpaNum = parseFloat(studentFields.cgpa.toString())
          if (!isNaN(cgpaNum)) {
            payload.cgpa = cgpaNum
          } else {
            payload.cgpa = 0 // Default value if invalid
          }
        } else {
          payload.cgpa = 0 // Default value if empty
        }
        
        if (studentFields.backlogs && studentFields.backlogs.toString().trim() !== '') {
          const backlogsNum = parseInt(studentFields.backlogs.toString())
          if (!isNaN(backlogsNum)) {
            payload.backlogs = backlogsNum
          }
        }
        
        if (studentFields.skills && studentFields.skills.toString().trim() !== '') {
          payload.skills = studentFields.skills.toString()
            .split(',')
            .map((skill: string) => skill.trim())
            .filter((skill: string) => skill !== '')
        }
      } else if (selectedRole === "company") {
        payload.phone = formData.get("phone") as string
        payload.website = formData.get("website") as string
        payload.location = formData.get("location") as string
        payload.industry = formData.get("industry") as string
        payload.description = formData.get("description") as string
        payload.employeeCount = formData.get("employeeCount") as string
      } else if (selectedRole === "admin") {
        payload.phone = formData.get("phone") as string
        payload.department = formData.get("department") as string
      }
    }

    console.log('Final payload being sent:', payload)

    try {
      // Correct endpoint construction for your backend
      const action = isLogin ? 'login' : 'register'
      const endpoint = `${API_BASE_URL}/api/${action}/${selectedRole}`
      
      console.log('Making request to:', endpoint)

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      // Check if response is HTML (error page)
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await res.text()
        console.error('Non-JSON response:', textResponse.substring(0, 200))
        
        if (textResponse.includes('<!DOCTYPE') || textResponse.includes('<html')) {
          throw new Error(`Endpoint not found (404): ${endpoint}`)
        }
        
        throw new Error(`Server error: ${res.status} ${res.statusText}`)
      }

      const data: AuthResponse = await res.json()

      if (!res.ok) {
        console.error('Backend error response:', data)
        throw new Error(data.message || `Authentication failed: ${res.statusText}`)
      }

      // Handle successful authentication
      if (data.token) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("userRole", selectedRole)
        
        // Store user ID based on role
        const userId = data.user?.id || data.student?._id || data.company?._id || data.admin?._id || data.student?.id || data.company?.id || data.admin?.id
        if (userId) {
          localStorage.setItem("userId", userId)
        }
        
        toast({
          title: "Success!",
          description: isLogin ? "Welcome back!" : "Account created successfully!",
          variant: "default",
        })

        // Redirect to appropriate dashboard
        setTimeout(() => {
          window.location.href = `/${selectedRole}/dashboard`
        }, 1000)

      } else {
        throw new Error("No authentication token received")
      }

    } catch (err) {
      const error = err as ApiError
      console.error("Auth error:", error)
      
      let errorMessage = error.message || "Something went wrong. Please try again."
      
      // Provide more specific error messages
      if (errorMessage.includes('Endpoint not found')) {
        errorMessage = `The authentication endpoint is not available. Please make sure your backend has the route: /api/${isLogin ? 'login' : 'register'}/${selectedRole}`
      } else if (errorMessage.includes('Failed to fetch')) {
        errorMessage = "Cannot connect to server. Please check if the backend is running on http://localhost:5000"
      } else if (errorMessage.includes('Students validation failed: year: Path `year` is required')) {
        errorMessage = "Year field is required for student registration. Please enter your current year."
      }
      
      toast({
        title: "Authentication Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const roleConfig = {
    student: {
      icon: GraduationCap,
      title: "Student Portal",
      description: "Access job opportunities and track applications",
      color: "bg-blue-500 text-white",
    },
    company: {
      icon: Building2,
      title: "Company Portal",
      description: "Post jobs and manage recruitment",
      color: "bg-green-500 text-white",
    },
    admin: {
      icon: Shield,
      title: "Admin Portal",
      description: "Manage platform and oversee placements",
      color: "bg-purple-500 text-white",
    },
  }

  const currentRole = roleConfig[selectedRole]
  const Icon = currentRole.icon

  return (
    <Card className="glass-card max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Badge className={`${currentRole.color} px-4 py-2 text-sm font-medium`}>
            <Icon className="w-4 h-4 mr-2" />
            {currentRole.title}
          </Badge>
        </div>
        <CardTitle className="text-2xl font-bold text-balance">
          {isLogin ? "Welcome Back" : "Create Account"}
        </CardTitle>
        <CardDescription className="text-pretty">{currentRole.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={isLogin ? "login" : "signup"} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 glass">
            <TabsTrigger
              value="login"
              onClick={() => setIsLogin(true)}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              onClick={() => setIsLogin(false)}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mb-6">
          <Label htmlFor="role" className="text-sm font-medium mb-3 block">
            Select Your Role
          </Label>
          <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
            <SelectTrigger className="glass">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-card">
              <SelectItem value="student">
                <div className="flex items-center">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Student
                </div>
              </SelectItem>
              <SelectItem value="company">
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  Company
                </div>
              </SelectItem>
              <SelectItem value="admin">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Administrator
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common fields for all roles */}
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">
                {selectedRole === "student" ? "Full Name" : 
                 selectedRole === "company" ? "Company Name" : "Admin Name"}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="name" 
                  name="name" 
                  placeholder={
                    selectedRole === "student" ? "Enter your full name" :
                    selectedRole === "company" ? "Enter company name" : "Enter admin name"
                  } 
                  className="pl-10 glass" 
                  required 
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="Enter your email" 
                className="pl-10 glass" 
                required 
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="Enter your password" 
                className="pl-10 glass" 
                required 
                minLength={6}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Student-specific registration fields */}
          {!isLogin && selectedRole === "student" && (
            <div className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    placeholder="Enter your phone number" 
                    className="pl-10 glass" 
                    required 
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rollNo">Roll Number</Label>
                  <Input 
                    id="rollNo" 
                    name="rollNo" 
                    placeholder="Enter roll number" 
                    className="glass" 
                    required 
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Input 
                    id="branch" 
                    name="branch" 
                    placeholder="Enter branch" 
                    className="glass" 
                    required 
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input 
                    id="year" 
                    name="year" 
                    placeholder="e.g., 3rd or 2024" 
                    className="glass" 
                    required 
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    name="location" 
                    placeholder="Enter location" 
                    className="glass" 
                    required 
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cgpa">CGPA *</Label>
                  <Input 
                    id="cgpa" 
                    name="cgpa" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    max="10" 
                    placeholder="e.g., 8.5" 
                    className="glass" 
                    required 
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backlogs">Backlogs</Label>
                  <Input 
                    id="backlogs" 
                    name="backlogs" 
                    type="number" 
                    min="0" 
                    placeholder="0" 
                    className="glass" 
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input 
                  id="skills" 
                  name="skills" 
                  placeholder="e.g., React, Node.js, Python" 
                  className="glass" 
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Company-specific registration fields */}
          {!isLogin && selectedRole === "company" && (
            <div className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Contact Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    placeholder="Enter company phone number" 
                    className="pl-10 glass" 
                    required 
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="website" 
                    name="website" 
                    type="url" 
                    placeholder="https://company.com" 
                    className="pl-10 glass" 
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="location" 
                    name="location" 
                    placeholder="Enter company location" 
                    className="pl-10 glass" 
                    required 
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input 
                  id="industry" 
                  name="industry" 
                  placeholder="e.g., Technology, Finance" 
                  className="glass" 
                  required 
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeCount">Employee Count</Label>
                <Input 
                  id="employeeCount" 
                  name="employeeCount" 
                  type="number" 
                  placeholder="e.g., 100" 
                  className="glass" 
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Company Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Brief description of your company" 
                  className="glass min-h-[80px]" 
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Admin-specific registration fields */}
          {!isLogin && selectedRole === "admin" && (
            <div className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    placeholder="Enter your phone number" 
                    className="pl-10 glass" 
                    required 
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="department" 
                    name="department" 
                    placeholder="Enter department" 
                    className="pl-10 glass" 
                    required 
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 transition-all duration-200 hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                {isLogin ? "Signing In..." : "Creating Account..."}
              </div>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
              disabled={isLoading}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}