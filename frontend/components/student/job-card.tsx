"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Building2, CheckCircle } from "lucide-react"
import { useState } from "react"

interface Job {
  id: string
  role: string
  company: string
  location: string
  eligibleBranches: string[]
  minCGPA: number
  deadline: string
  description: string
  package: string
  applied: boolean
}

interface Student {
  branch: string
  cgpa: number
}

interface JobCardProps {
  job: Job
  student: Student
  onApply: () => void
}

export function JobCard({ job, student, onApply }: JobCardProps) {
  const [isApplying, setIsApplying] = useState(false)

  const isEligible = job.eligibleBranches.includes(student.branch) && student.cgpa >= job.minCGPA
  const daysLeft = Math.ceil((new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const handleApply = async () => {
    setIsApplying(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onApply()
    setIsApplying(false)
  }

  return (
    <Card className="border-primary-200 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl font-serif text-primary-900">{job.role}</CardTitle>
            <div className="flex items-center gap-2 text-text-default">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">{job.company}</span>
            </div>
          </div>
          <Badge
            variant={isEligible ? "default" : "secondary"}
            className={isEligible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
          >
            {isEligible ? "Eligible" : "Not Eligible"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className="text-base leading-relaxed">{job.description}</CardDescription>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-text-default">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-default">
            <Calendar className="h-4 w-4" />
            <span>Package: {job.package}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-default">
            <Clock className="h-4 w-4" />
            <span>{daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}</span>
          </div>
          <div className="text-sm text-text-default">
            <span>Min CGPA: {job.minCGPA}</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-text-default">Eligible Branches:</p>
          <div className="flex flex-wrap gap-2">
            {job.eligibleBranches.map((branch) => (
              <Badge
                key={branch}
                variant="outline"
                className={student.branch === branch ? "border-primary-900 text-primary-900" : ""}
              >
                {branch}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          {job.applied ? (
            <Button disabled className="w-full bg-green-100 text-green-800 hover:bg-green-100">
              <CheckCircle className="mr-2 h-4 w-4" />
              Applied
            </Button>
          ) : (
            <Button
              onClick={handleApply}
              disabled={!isEligible || daysLeft <= 0 || isApplying}
              className="w-full bg-primary-900 hover:bg-primary-800 disabled:opacity-50"
            >
              {isApplying ? "Applying..." : "Apply Now"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
