"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { StudentNavbar } from "./student-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Upload, User, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function StudentProfilePage() {
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [student, setStudent] = useState<any>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token")
      if (!token) return router.push("/")

      try {
        const res = await fetch(`${API_BASE_URL}/api/student/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("Fetch failed")

        const data = await res.json()
        setStudent(data)
        
        // Set profile photo preview if exists - FIXED: Use profilePhotoUrl
        if (data.profilePhotoUrl) {
          // Add cache busting timestamp
          setPreviewUrl(`${data.profilePhotoUrl}?t=${Date.now()}`)
        }
        
        setLoading(false)
      } catch {
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        })
      }
    }

    fetchProfile()
  }, [])

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPEG, PNG, GIF, or WebP image",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  // Upload profile photo
  const uploadProfilePhoto = async () => {
    if (!selectedFile) return

    setUploadingPhoto(true)
    const token = localStorage.getItem("token")

    try {
      const formData = new FormData()
      formData.append('profilePhoto', selectedFile)

      const res = await fetch(`${API_BASE_URL}/api/student/profile/photo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Upload failed")
      }

      const data = await res.json()
      
      // Force cache busting by adding timestamp
      const timestamp = Date.now()
      setPreviewUrl(`${data.profilePhotoUrl}?t=${timestamp}`)
      setSelectedFile(null)
      
      // Also refresh the student data to get updated photo
      const profileRes = await fetch(`${API_BASE_URL}/api/student/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      })
      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setStudent(profileData)
      }
      
      toast({
        title: "Success",
        description: "Profile photo updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload profile photo",
        variant: "destructive",
      })
    } finally {
      setUploadingPhoto(false)
    }
  }

  // Remove profile photo
  const removeProfilePhoto = async () => {
    const token = localStorage.getItem("token")
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/student/profile/photo`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Failed to remove photo")

      setPreviewUrl(null)
      setSelectedFile(null)
      
      // Refresh student data
      const profileRes = await fetch(`${API_BASE_URL}/api/student/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      })
      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setStudent(profileData)
      }
      
      toast({
        title: "Success",
        description: "Profile photo removed successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove profile photo",
        variant: "destructive",
      })
    }
  }

  const saveProfile = async () => {
    setSaving(true)
    const token = localStorage.getItem("token")

    try {
      const res = await fetch(`${API_BASE_URL}/api/student/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: student.phone,
          location: student.location,
          year: student.year,
          skills: student.skills,
          backlogs: student.backlogs,
        }),
      })

      if (!res.ok) throw new Error("Save failed")

      toast({ title: "Profile updated successfully" })
      router.push("/student/dashboard")
    } catch {
      toast({
        title: "Update failed",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    )
  }

  return (
    <>
      <StudentNavbar />

      <div className="min-h-screen bg-muted/40">
        <div className="container mx-auto max-w-4xl p-6 space-y-6">

          {/* ===== Top Profile Summary ===== */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Profile Photo Section */}
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-32 w-32 border-4 border-background">
                    <AvatarImage 
                      src={previewUrl ? `${previewUrl}?t=${Date.now()}` : ""} 
                      key={previewUrl || "default"}
                    />
                    <AvatarFallback className="text-2xl bg-primary/10">
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Label htmlFor="profile-photo" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                        <Upload className="h-4 w-4" />
                        <span>Change Photo</span>
                      </div>
                      <Input
                        id="profile-photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </Label>
                    
                    {previewUrl && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={removeProfilePhoto}
                      >
                        <X className="h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  {selectedFile && (
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        {selectedFile.name}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={uploadProfilePhoto}
                          disabled={uploadingPhoto}
                        >
                          {uploadingPhoto ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Uploading...
                            </>
                          ) : (
                            "Save Photo"
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedFile(null)
                            if (previewUrl && previewUrl.startsWith('blob:')) {
                              URL.revokeObjectURL(previewUrl)
                            }
                            // Reset to original profile photo URL if exists
                            if (student.profilePhotoUrl) {
                              setPreviewUrl(`${student.profilePhotoUrl}?t=${Date.now()}`)
                            } else {
                              setPreviewUrl(null)
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Info Section */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">
                    {student.name}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {student.email}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Phone:</span>
                        <span>{student.phone || "Not added"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Location:</span>
                        <span>{student.location || "Not added"}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Year:</span>
                        <span>{student.year || "—"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Backlogs:</span>
                        <span>{student.backlogs ?? 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <span className="font-medium">Skills: </span>
                    <span className="text-muted-foreground">
                      {(student.skills || []).join(", ") || "No skills added"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ===== Edit Form Card ===== */}
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={student.name} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={student.email} disabled />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={student.phone || ""}
                    onChange={(e) =>
                      setStudent({ ...student, phone: e.target.value })
                    }
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={student.location || ""}
                    onChange={(e) =>
                      setStudent({ ...student, location: e.target.value })
                    }
                    placeholder="Enter your location"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    value={student.year || ""}
                    onChange={(e) =>
                      setStudent({ ...student, year: e.target.value })
                    }
                    placeholder="e.g., 3rd or 2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backlogs">Backlogs</Label>
                  <Input
                    id="backlogs"
                    type="number"
                    min="0"
                    value={student.backlogs || ""}
                    onChange={(e) =>
                      setStudent({ ...student, backlogs: parseInt(e.target.value) || 0 })
                    }
                    placeholder="Number of backlogs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Textarea
                  id="skills"
                  placeholder="Java, React, SQL, Python"
                  value={(student.skills || []).join(", ")}
                  onChange={(e) =>
                    setStudent({
                      ...student,
                      skills: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(s => s !== "")
                    })
                  }
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button onClick={saveProfile} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}