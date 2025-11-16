"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, MapPin, DollarSign, Clock, Users, Loader2 } from "lucide-react"
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

interface JobPostingFormProps {
  company?: Company | null
  onClose: () => void
  onSuccess: () => void
}

interface JobFormData {
  title: string
  department: string
  jobType: "Full-time" | "Part-time" | "Contract" | "Internship"
  description: string
  location: string
  workMode: "remote" | "onsite" | "hybrid"
  minSalary: string
  maxSalary: string
  salaryCurrency: string
  deadline: string
  experienceLevel: "entry" | "mid" | "senior"
  education: "bachelors" | "masters" | "phd" | "any"
  skills: string[]
  requirements: string
  benefits: string[]
}

export function JobPostingForm({ company, onClose, onSuccess }: JobPostingFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [skills, setSkills] = useState<string[]>([])
  const [benefits, setBenefits] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [newBenefit, setNewBenefit] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    department: "",
    jobType: "Full-time",
    description: "",
    location: company?.location || "",
    workMode: "remote",
    minSalary: "",
    maxSalary: "",
    salaryCurrency: "USD",
    deadline: "",
    experienceLevel: "mid",
    education: "bachelors",
    skills: [],
    requirements: "",
    benefits: []
  })

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()]
      setSkills(updatedSkills)
      setFormData(prev => ({ ...prev, skills: updatedSkills }))
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove)
    setSkills(updatedSkills)
    setFormData(prev => ({ ...prev, skills: updatedSkills }))
  }

  const addBenefit = () => {
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      const updatedBenefits = [...benefits, newBenefit.trim()]
      setBenefits(updatedBenefits)
      setFormData(prev => ({ ...prev, benefits: updatedBenefits }))
      setNewBenefit("")
    }
  }

  const removeBenefit = (benefitToRemove: string) => {
    const updatedBenefits = benefits.filter((benefit) => benefit !== benefitToRemove)
    setBenefits(updatedBenefits)
    setFormData(prev => ({ ...prev, benefits: updatedBenefits }))
  }

  const handleInputChange = (field: keyof JobFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      // Validate required fields
      if (!formData.title || !formData.description || !formData.location) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      // Prepare the job data for API
      const jobData = {
        title: formData.title,
        department: formData.department,
        jobType: formData.jobType,
        description: formData.description,
        location: formData.location,
        workMode: formData.workMode,
        salary: formData.minSalary && formData.maxSalary ? 
          `${formData.salaryCurrency} ${formData.minSalary} - ${formData.maxSalary}` : undefined,
        minSalary: formData.minSalary ? parseInt(formData.minSalary) : undefined,
        maxSalary: formData.maxSalary ? parseInt(formData.maxSalary) : undefined,
        salaryCurrency: formData.salaryCurrency,
        deadline: formData.deadline || undefined,
        experienceLevel: formData.experienceLevel,
        education: formData.education,
        skills: formData.skills,
        requirements: formData.requirements,
        benefits: formData.benefits,
        status: "active" as const,
        companyId: company?._id,
        companyName: company?.name
      }

      // Try multiple endpoints for job creation
      const endpoints = [
        'http://localhost:5000/api/company/jobs',
        'http://localhost:5000/api/jobs',
        'http://localhost:5000/api/jobs/create'
      ]

      let success = false

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(jobData),
          })

          if (res.ok) {
            success = true
            break
          }
        } catch (error) {
          console.log(`Endpoint ${endpoint} failed:`, error)
        }
      }

      if (!success) {
        throw new Error("Failed to create job on all endpoints")
      }

      toast({
        title: "Success!",
        description: "Job posted successfully",
        variant: "default",
      })

      onSuccess()
      onClose()

    } catch (error) {
      console.error("Error posting job:", error)
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: "Basic Information", icon: Users },
    { number: 2, title: "Job Details", icon: MapPin },
    { number: 3, title: "Requirements", icon: Clock },
  ]

  const departments = [
    "Engineering", "Product", "Design", "Marketing", "Sales", 
    "Operations", "Finance", "HR", "Customer Support", "Other"
  ]

  const experienceLevels = [
    { value: "entry", label: "Entry Level (0-2 years)" },
    { value: "mid", label: "Mid Level (2-5 years)" },
    { value: "senior", label: "Senior Level (5+ years)" }
  ]

  const educationLevels = [
    { value: "any", label: "Any Degree" },
    { value: "bachelors", label: "Bachelor's Degree" },
    { value: "masters", label: "Master's Degree" },
    { value: "phd", label: "PhD" }
  ]

  const workModes = [
    { value: "remote", label: "Remote" },
    { value: "onsite", label: "On-site" },
    { value: "hybrid", label: "Hybrid" }
  ]

  const currencies = [
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
    { value: "GBP", label: "GBP (£)" },
    { value: "INR", label: "INR (₹)" }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Post New Job</CardTitle>
            <CardDescription>Create a new job posting to attract top talent</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isSubmitting}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = currentStep > step.number

              return (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : isCompleted
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-muted-foreground bg-background"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${isActive ? "text-primary" : isCompleted ? "text-green-500" : "text-muted-foreground"}`}>
                      Step {step.number}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.title}</p>
                  </div>
                  {index < steps.length - 1 && <div className="w-12 h-px bg-border mx-4 hidden sm:block"></div>}
                </div>
              )
            })}
          </div>

          <div className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input 
                    id="jobTitle" 
                    placeholder="e.g. Senior Software Engineer" 
                    className="glass"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select 
                      value={formData.department} 
                      onValueChange={(value) => handleInputChange('department', value)}
                    >
                      <SelectTrigger className="glass">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent className="glass-card">
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept.toLowerCase()}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobType">Job Type *</Label>
                    <Select 
                      value={formData.jobType} 
                      onValueChange={(value: JobFormData['jobType']) => handleInputChange('jobType', value)}
                    >
                      <SelectTrigger className="glass">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent className="glass-card">
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                    className="glass min-h-32"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="location" 
                        placeholder="e.g. San Francisco, CA" 
                        className="pl-10 glass"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workMode">Work Mode</Label>
                    <Select 
                      value={formData.workMode} 
                      onValueChange={(value: JobFormData['workMode']) => handleInputChange('workMode', value)}
                    >
                      <SelectTrigger className="glass">
                        <SelectValue placeholder="Select work mode" />
                      </SelectTrigger>
                      <SelectContent className="glass-card">
                        {workModes.map(mode => (
                          <SelectItem key={mode.value} value={mode.value}>{mode.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minSalary">Minimum Salary</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="minSalary" 
                        type="number" 
                        placeholder="80000" 
                        className="pl-10 glass"
                        value={formData.minSalary}
                        onChange={(e) => handleInputChange('minSalary', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxSalary">Maximum Salary</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="maxSalary" 
                        type="number" 
                        placeholder="120000" 
                        className="pl-10 glass"
                        value={formData.maxSalary}
                        onChange={(e) => handleInputChange('maxSalary', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select 
                      value={formData.salaryCurrency} 
                      onValueChange={(value) => handleInputChange('salaryCurrency', value)}
                    >
                      <SelectTrigger className="glass">
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent className="glass-card">
                        {currencies.map(currency => (
                          <SelectItem key={currency.value} value={currency.value}>{currency.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input 
                    id="deadline" 
                    type="date" 
                    className="glass"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Benefits & Perks</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      placeholder="Add a benefit (e.g. Health Insurance)"
                      className="glass"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
                    />
                    <Button type="button" onClick={addBenefit} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {benefits.map((benefit) => (
                      <Badge key={benefit} variant="secondary" className="flex items-center gap-1">
                        {benefit}
                        <button type="button" onClick={() => removeBenefit(benefit)} className="ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience Level</Label>
                    <Select 
                      value={formData.experienceLevel} 
                      onValueChange={(value: JobFormData['experienceLevel']) => handleInputChange('experienceLevel', value)}
                    >
                      <SelectTrigger className="glass">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent className="glass-card">
                        {experienceLevels.map(level => (
                          <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education">Education Requirement</Label>
                    <Select 
                      value={formData.education} 
                      onValueChange={(value: JobFormData['education']) => handleInputChange('education', value)}
                    >
                      <SelectTrigger className="glass">
                        <SelectValue placeholder="Select education requirement" />
                      </SelectTrigger>
                      <SelectContent className="glass-card">
                        {educationLevels.map(edu => (
                          <SelectItem key={edu.value} value={edu.value}>{edu.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Required Skills</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill (e.g. React, Python)"
                      className="glass"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={addSkill} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Additional Requirements</Label>
                  <Textarea
                    id="requirements"
                    placeholder="Any additional requirements or qualifications..."
                    className="glass min-h-24"
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1 || isSubmitting}
              >
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button 
                  type="button" 
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!formData.title || !formData.description || !formData.location}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !formData.title || !formData.description || !formData.location}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Job"
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}