"use client"

import { useState, useRef } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  FileText,
  Eye,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

/* -------------------- Types -------------------- */

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
}

interface ResumeUploaderProps {
  student: Student | null
  setStudent: React.Dispatch<React.SetStateAction<Student | null>>
}

/* -------------------- Component -------------------- */

export function ResumeUploader({
  student,
  setStudent,
}: ResumeUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  /* -------------------- Helpers -------------------- */

  const validateFile = (file: File): string | null => {
    if (file.type !== "application/pdf") {
      return "Only PDF files are allowed"
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 5MB"
    }
    return null
  }

  const formatSize = (bytes: number) =>
    `${(bytes / 1024 / 1024).toFixed(2)} MB`

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString()

  /* -------------------- Upload -------------------- */

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.length) return

    const file = e.target.files[0]
    setError(null)

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
      if (!token) throw new Error("Authentication required")

      const formData = new FormData()
      formData.append("resume", file)

      const res = await fetch(
        `${API_BASE_URL}/api/student/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      const data = await res.json()

      if (!res.ok || !data?.resume?.url) {
        throw new Error(data?.message || "Upload failed")
      }

      setStudent((prev) =>
        prev ? { ...prev, resume: data.resume } : prev
      )

      toast({
        title: "Success",
        description: "Resume uploaded successfully",
      })
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Upload failed",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  /* -------------------- Delete -------------------- */

  const handleDelete = async () => {
    if (!student?.resume) return
    if (!confirm("Delete your resume? This cannot be undone.")) return

    setIsDeleting(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Authentication required")

      const res = await fetch(
        `${API_BASE_URL}/api/student/resume`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || "Delete failed")
      }

      setStudent((prev) =>
        prev ? { ...prev, resume: null } : prev
      )

      toast({
        title: "Deleted",
        description: "Resume deleted successfully",
      })
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  /* -------------------- UI -------------------- */

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Resume Management
        </CardTitle>
        <CardDescription>
          Upload a PDF resume (max 5MB)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="flex gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {student?.resume ? (
          <>
            <div className="flex justify-between items-center p-4 border rounded">
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {student.resume.filename}
                </p>
                <p className="text-sm text-muted-foreground">
                  Uploaded {formatDate(student.resume.uploadedAt)} •{" "}
                  {formatSize(student.resume.size)}
                </p>
              </div>
              <Badge>
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  window.open(student.resume!.url, "_blank")
                }
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  window.open(student.resume!.url, "_blank")
                }
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-6 border-2 border-dashed rounded">
            <Upload className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No resume uploaded
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          hidden
          onChange={handleUpload}
        />

        <Button
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isDeleting}
        >
          {isUploading ? "Uploading..." : "Upload Resume"}
        </Button>
      </CardContent>
    </Card>
  )
}
