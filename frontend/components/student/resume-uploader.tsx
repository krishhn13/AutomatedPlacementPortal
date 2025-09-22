"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Eye, Download, Trash2, CheckCircle } from "lucide-react"

export function ResumeUploader() {
  const [hasResume, setHasResume] = useState(true)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async () => {
    setIsUploading(true)
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setHasResume(true)
    setIsUploading(false)
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
        {hasResume ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-muted/30">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium">Alex_Smith_Resume.pdf</p>
                  <p className="text-sm text-muted-foreground">Uploaded 2 days ago • 245 KB</p>
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
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive bg-transparent">
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
            <p className="text-sm text-muted-foreground mb-4">Upload your resume to start applying for jobs</p>
          </div>
        )}

        <div className="mt-4">
          <Button onClick={handleUpload} disabled={isUploading} className="w-full">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {hasResume ? "Upload New Resume" : "Upload Resume"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
