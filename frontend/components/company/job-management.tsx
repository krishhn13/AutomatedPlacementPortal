"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, MapPin, DollarSign, Users, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Job {
  id: string
  role: string
  description: string
  eligibleBranches: string[]
  minCGPA: number
  deadline: string
  package: string
  location: string
  postedDate: string
  applicants: number
  shortlisted: number
  status: "active" | "closed" | "draft"
}

interface JobManagementProps {
  jobs: Job[]
  onUpdateJob: (jobId: string, updates: Partial<Job>) => void
  onDeleteJob: (jobId: string) => void
  disabled?: boolean
}

export function JobManagement({ jobs, onUpdateJob, onDeleteJob, disabled }: JobManagementProps) {
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  const handleEditJob = (job: Job) => {
    setEditingJob({ ...job })
    setIsEditing(true)
  }

  const handleSaveJob = () => {
    if (!editingJob) return

    onUpdateJob(editingJob.id, editingJob)
    setIsEditing(false)
    setEditingJob(null)

    toast({
      title: "Job updated successfully",
      description: "The job posting has been updated.",
    })
  }

  const handleDeleteJob = (jobId: string) => {
    onDeleteJob(jobId)
    toast({
      title: "Job deleted",
      description: "The job posting has been removed.",
    })
  }

  const handleStatusToggle = (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "closed" : "active"
    onUpdateJob(jobId, { status: newStatus as "active" | "closed" })

    toast({
      title: `Job ${newStatus}`,
      description: `The job posting is now ${newStatus}.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif font-semibold text-primary-900">Job Management</h3>
        <Badge variant="secondary" className="bg-primary-50 text-primary-900">
          {jobs.length} total jobs
        </Badge>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="border-primary-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl font-serif text-primary-900">{job.role}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-text-default">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{job.package}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={job.status === "active" ? "default" : "secondary"}
                    className={
                      job.status === "active"
                        ? "bg-green-100 text-green-800"
                        : job.status === "closed"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }
                  >
                    {job.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-text-default line-clamp-2">{job.description}</p>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-6 text-sm text-text-default">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{job.applicants} applicants</span>
                  </div>
                  <span>{job.shortlisted} shortlisted</span>
                  <span>Min CGPA: {job.minCGPA}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusToggle(job.id, job.status)}
                    disabled={disabled}
                  >
                    {job.status === "active" ? "Close" : "Activate"}
                  </Button>

                  <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleEditJob(job)} disabled={disabled}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Job Posting</DialogTitle>
                      </DialogHeader>

                      {editingJob && (
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-role">Job Role</Label>
                              <Input
                                id="edit-role"
                                value={editingJob.role}
                                onChange={(e) => setEditingJob({ ...editingJob, role: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-location">Location</Label>
                              <Input
                                id="edit-location"
                                value={editingJob.location}
                                onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-package">Package</Label>
                              <Input
                                id="edit-package"
                                value={editingJob.package}
                                onChange={(e) => setEditingJob({ ...editingJob, package: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-cgpa">Min CGPA</Label>
                              <Input
                                id="edit-cgpa"
                                type="number"
                                step="0.1"
                                value={editingJob.minCGPA}
                                onChange={(e) =>
                                  setEditingJob({ ...editingJob, minCGPA: Number.parseFloat(e.target.value) })
                                }
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="edit-deadline">Deadline</Label>
                              <Input
                                id="edit-deadline"
                                type="date"
                                value={editingJob.deadline}
                                onChange={(e) => setEditingJob({ ...editingJob, deadline: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                              id="edit-description"
                              value={editingJob.description}
                              onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                              className="min-h-[100px]"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSaveJob} className="bg-primary-900 hover:bg-primary-800">
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteJob(job.id)}
                    disabled={disabled}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
