"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Building2, Globe, MapPin, User, Save, Edit } from "lucide-react"

interface Company {
  id: string
  companyName: string
  email: string
  contactPerson: string
  description: string
  website?: string
  location?: string
  isApproved: boolean
}

interface CompanyProfileProps {
  company: Company
  onUpdate: (company: Company) => void
}

export function CompanyProfile({ company, onUpdate }: CompanyProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(company)

  const handleSave = () => {
    onUpdate(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(company)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-900 rounded-full">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-serif text-primary-900">Company Profile</CardTitle>
                <CardDescription>Manage your company information and settings</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={company.isApproved ? "default" : "secondary"}
                className={company.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
              >
                {company.isApproved ? "Approved" : "Pending Approval"}
              </Badge>
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
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                disabled={!isEditing}
                className="border-primary-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={formData.email} disabled className="border-primary-200 bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  disabled={!isEditing}
                  className="border-primary-200 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="location"
                  placeholder="e.g., Bangalore, India"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  disabled={!isEditing}
                  className="border-primary-200 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="website"
                  placeholder="https://yourcompany.com"
                  value={formData.website || ""}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  disabled={!isEditing}
                  className="border-primary-200 pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Company Description</Label>
            <Textarea
              id="description"
              placeholder="Tell students about your company..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={!isEditing}
              className="border-primary-200 min-h-[120px]"
            />
          </div>
        </CardContent>
      </Card>

      {!company.isApproved && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-200 rounded-full">
                <Building2 className="h-5 w-5 text-yellow-800" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Approval Process</h3>
                <p className="text-yellow-700 text-sm leading-relaxed">
                  Your company registration is currently under review by the Training & Placement Cell. Once approved,
                  you'll be able to post job openings and access all recruiter features. This process typically takes
                  1-2 business days.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
