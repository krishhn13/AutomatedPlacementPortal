"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Eye, Download, Trash2, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Resume {
  filename: string
  url: string
  uploadedAt: string
  size: number
}

interface Student {
  id: string
  name: string
  email: string
  resume?: Resume | null
  // Add other student fields as needed
}

interface ResumeUploaderProps {
  student: Student | null
  setStudent: React.Dispatch<React.SetStateAction<Student | null>>
}

interface ApiError {
  message: string
  status?: number
}

export function ResumeUploader({ student, setStudent }: ResumeUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  const validateFile = (file: File): string | null => {
    if (file.type !== "application/pdf") {
      return "Only PDF files are allowed"
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`
    }
    
    return null
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    const file = e.target.files[0]
    setUploadError(null)

    // Validate file
    const validationError = validateFile(file)
    if (validationError) {
      toast({
        title: "Invalid file",
        description: validationError,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required. Please log in again.")
      }

      const formData = new FormData()
      formData.append("resume", file)

      const res = await fetch(`${API_BASE_URL}/api/student/profile`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          // Note: Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Upload failed" }))
        throw new Error(errorData.message || `Upload failed: ${res.statusText}`)
      }

      const data = await res.json()
      
      // Validate response structure
      if (!data.resume || !data.resume.filename || !data.resume.url) {
        throw new Error("Invalid response from server")
      }

      setStudent((prev: Student | null) => {
        if (!prev) return prev
        return {
          ...prev,
          resume: {
            filename: data.resume.filename,
            url: data.resume.url,
            uploadedAt: data.resume.uploadedAt || new Date().toISOString(),
            size: data.resume.size || file.size,
          },
        }
      })

      toast({
        title: "Success!",
        description: "Resume uploaded successfully",
        variant: "default",
      })

    } catch (err) {
      const error = err as ApiError
      console.error("Upload error:", error)
      
      const errorMessage = error.message || "Failed to upload resume. Please try again."
      setUploadError(errorMessage)
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleDelete = async () => {
    if (!student?.resume) return

    // Confirmation dialog
    if (!confirm("Are you sure you want to delete your resume? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const res = await fetch(`${API_BASE_URL}/api/student/resume`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Delete failed" }))
        throw new Error(errorData.message || `Delete failed: ${res.statusText}`)
      }

      setStudent((prev: Student | null) => {
        if (!prev) return prev
        return { ...prev, resume: null }
      })

      toast({
        title: "Success!",
        description: "Resume deleted successfully",
        variant: "default",
      })

    } catch (err) {
      const error = err as ApiError
      console.error("Delete error:", error)
      
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownload = () => {
    if (!student?.resume?.url) return

    try {
      const link = document.createElement("a")
      link.href = student.resume.url
      link.download = student.resume.filename
      link.target = "_blank" // Open in new tab for PDFs
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("Download error:", err)
      toast({
        title: "Download failed",
        description: "Unable to download resume. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Resume Management
        </CardTitle>
        <CardDescription>
          Upload and manage your resume for job applications. Only PDF files up to {MAX_FILE_SIZE / 1024 / 1024}MB are allowed.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Error Display */}
        {uploadError && (
          <div className="flex items-center gap-2 p-3 text-sm border border-destructive/50 bg-destructive/10 text-destructive rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {student?.resume ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-accent/10 rounded-lg flex-shrink-0">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate" title={student.resume.filename}>
                    {student.resume.filename}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Uploaded {formatDate(student.resume.uploadedAt)} • {formatFileSize(student.resume.size)}
                  </p>
                </div>
              </div>
              <Badge className="bg-accent/10 text-accent border-accent/20 flex-shrink-0">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(student.resume?.url, "_blank", "noopener,noreferrer")}
                disabled={isUploading || isDeleting}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={isUploading || isDeleting}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleDelete}
                disabled={isDeleting || isUploading}
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-destructive mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-border/50 rounded-lg">
            <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">No resume uploaded</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your resume to start applying for jobs
            </p>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleUpload}
          disabled={isUploading || isDeleting}
          aria-label="Upload resume"
        />

        {/* Upload button */}
        <div className="pt-2">
          <Button
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isDeleting}
            aria-busy={isUploading}
          >
            {isUploading ? (
              <>
                <div 
                  className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" 
                  aria-label="Uploading..."
                />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {student?.resume ? "Upload New Resume" : "Upload Resume"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}