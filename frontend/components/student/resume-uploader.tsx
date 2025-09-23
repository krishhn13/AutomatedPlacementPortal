"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Eye, Download, Trash2, CheckCircle } from "lucide-react"

interface Resume {
  filename: string
  url: string
  uploadedAt: string
  size: number
}

export function ResumeUploader() {
  const [resume, setResume] = useState<Resume | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const fetchResume = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/student/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.resume) {
        setResume({
          filename: data.resume.filename,
          url: data.resume.url,
          uploadedAt: new Date(data.resume.uploadedAt).toLocaleDateString(),
          size: data.resume.size,
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchResume()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("resume", file)
      const token = localStorage.getItem("token")

      const res = await fetch("http://localhost:5000/api/student/profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      setResume({
        filename: data.resume.filename,
        url: data.resume.url,
        uploadedAt: new Date(data.resume.uploadedAt).toLocaleDateString(),
        size: data.resume.size,
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!resume) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/student/resume", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setResume(null)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Resume Management
        </CardTitle>
        <CardDescription>Upload and manage your resume for job applications</CardDescription>
      </CardHeader>

      <CardContent>
        {resume ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-muted/30">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium">{resume.filename}</p>
                  <p className="text-sm text-muted-foreground">
                    Uploaded {resume.uploadedAt} • {(resume.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-accent/10 text-accent border-accent/20">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(resume.url, "_blank")}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const link = document.createElement("a")
                  link.href = resume.url
                  link.download = resume.filename
                  link.click()
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive bg-transparent"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">No resume uploaded</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your resume to start applying for jobs
            </p>
          </div>
        )}

        <div className="mt-4">
          <label className="w-full">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading}
            />
            <Button className="w-full">
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {resume ? "Upload New Resume" : "Upload Resume"}
                </>
              )}
            </Button>
          </label>
        </div>
      </CardContent>
    </Card>
  )
}
