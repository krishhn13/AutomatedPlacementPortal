"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, X, Plus, Save, Edit } from "lucide-react"

interface Student {
  id: string
  name: string
  email: string
  rollNo: string
  branch: string
  cgpa: number
  skills?: string[]
  resumeUrl?: string | null
}

interface StudentProfileProps {
  student: Student
  onUpdate: (student: Student) => void
}

export function StudentProfile({ student, onUpdate }: StudentProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(student)
  const [newSkill, setNewSkill] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleSave = () => {
    onUpdate(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(student)
    setIsEditing(false)
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills?.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), newSkill.trim()],
      })
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills?.filter((skill) => skill !== skillToRemove) || [],
    })
  }

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setIsUploading(true)
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setFormData({
        ...formData,
        resumeUrl: `/uploads/resume_${student.rollNo}.pdf`,
      })
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-serif text-primary-900">Profile Information</CardTitle>
              <CardDescription>Manage your personal and academic details</CardDescription>
            </div>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="border-primary-900 text-primary-900"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-primary-900 hover:bg-primary-800">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="border-primary-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={formData.email} disabled className="border-primary-200 bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rollNo">Roll Number</Label>
              <Input id="rollNo" value={formData.rollNo} disabled className="border-primary-200 bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Input id="branch" value={formData.branch} disabled className="border-primary-200 bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cgpa">CGPA</Label>
              <Input
                id="cgpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: Number.parseFloat(e.target.value) })}
                disabled={!isEditing}
                className="border-primary-200"
              />
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-4">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2">
              {formData.skills?.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-primary-50 text-primary-900">
                  {skill}
                  {isEditing && (
                    <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-600">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  className="border-primary-200"
                />
                <Button onClick={addSkill} size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resume Section */}
      <Card className="border-primary-200">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-primary-900">Resume</CardTitle>
          <CardDescription>Upload your resume (PDF only, max 5MB)</CardDescription>
        </CardHeader>

        <CardContent>
          {formData.resumeUrl ? (
            <div className="flex items-center justify-between p-4 border border-primary-200 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary-900" />
                <div>
                  <p className="font-medium text-primary-900">Resume.pdf</p>
                  <p className="text-sm text-text-default">Uploaded successfully</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View
                </Button>
                <Button variant="outline" size="sm">
                  Download
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-primary-200 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-primary-900 mx-auto mb-4" />
              <p className="text-lg font-medium text-primary-900 mb-2">Upload your resume</p>
              <p className="text-text-default mb-4">PDF files only, maximum 5MB</p>
              <label htmlFor="resume-upload">
                <Button as="span" disabled={isUploading} className="bg-primary-900 hover:bg-primary-800">
                  {isUploading ? "Uploading..." : "Choose File"}
                </Button>
              </label>
              <input id="resume-upload" type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
