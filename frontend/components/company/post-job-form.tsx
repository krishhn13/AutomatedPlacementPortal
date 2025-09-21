"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, MapPin, DollarSign, GraduationCap, Loader2 } from "lucide-react"

interface PostJobFormProps {
  onSubmit: (jobData: any) => void
  disabled?: boolean
}

export function PostJobForm({ onSubmit, disabled }: PostJobFormProps) {
  const [formData, setFormData] = useState({
    role: "",
    description: "",
    location: "",
    package: "",
    minCGPA: "",
    deadline: "",
    eligibleBranches: [] as string[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const branches = ["Computer Science", "Information Technology", "Electronics", "Mechanical", "Civil", "Electrical"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (disabled) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    onSubmit({
      ...formData,
      minCGPA: Number.parseFloat(formData.minCGPA),
    })

    // Reset form
    setFormData({
      role: "",
      description: "",
      location: "",
      package: "",
      minCGPA: "",
      deadline: "",
      eligibleBranches: [],
    })
    setIsSubmitting(false)
  }

  const handleBranchChange = (branch: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        eligibleBranches: [...formData.eligibleBranches, branch],
      })
    } else {
      setFormData({
        ...formData,
        eligibleBranches: formData.eligibleBranches.filter((b) => b !== branch),
      })
    }
  }

  if (disabled) {
    return (
      <Card className="border-primary-200">
        <CardContent className="p-8 text-center">
          <div className="p-4 bg-yellow-50 rounded-full w-fit mx-auto mb-4">
            <GraduationCap className="h-8 w-8 text-yellow-600" />
          </div>
          <h3 className="text-lg font-serif font-semibold text-primary-900 mb-2">Account Approval Required</h3>
          <p className="text-text-default">
            Your company account needs to be approved by the admin before you can post jobs.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary-200">
      <CardHeader>
        <CardTitle className="text-xl font-serif text-primary-900">Post New Job</CardTitle>
        <CardDescription>Create a new job posting to attract talented students</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="role">Job Role *</Label>
              <Input
                id="role"
                placeholder="e.g., Software Engineer"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                className="border-primary-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="location"
                  placeholder="e.g., Bangalore"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  className="border-primary-200 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="package">Package *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="package"
                  placeholder="e.g., 12-15 LPA"
                  value={formData.package}
                  onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                  required
                  className="border-primary-200 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minCGPA">Minimum CGPA *</Label>
              <Input
                id="minCGPA"
                type="number"
                step="0.1"
                min="0"
                max="10"
                placeholder="e.g., 7.0"
                value={formData.minCGPA}
                onChange={(e) => setFormData({ ...formData, minCGPA: e.target.value })}
                required
                className="border-primary-200"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="deadline">Application Deadline *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                  className="border-primary-200 pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Job Description *</Label>
            <Textarea
              placeholder="Describe the role, responsibilities, and requirements..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="border-primary-200 min-h-[120px]"
            />
          </div>

          <div className="space-y-4">
            <Label>Eligible Branches *</Label>
            <div className="grid md:grid-cols-2 gap-4">
              {branches.map((branch) => (
                <div key={branch} className="flex items-center space-x-2">
                  <Checkbox
                    id={branch}
                    checked={formData.eligibleBranches.includes(branch)}
                    onCheckedChange={(checked) => handleBranchChange(branch, checked as boolean)}
                  />
                  <Label htmlFor={branch} className="text-sm font-normal">
                    {branch}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t">
            <Button
              type="submit"
              disabled={isSubmitting || formData.eligibleBranches.length === 0}
              className="w-full bg-primary-900 hover:bg-primary-800"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting Job...
                </>
              ) : (
                "Post Job"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
