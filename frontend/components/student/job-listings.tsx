"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, MapPin, DollarSign, Calendar, Clock, Search, Filter, CheckCircle, XCircle, Eye } from "lucide-react"

const jobListings = [
  {
    id: 1,
    title: "Software Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$80,000 - $120,000",
    type: "Full-time",
    posted: "2 days ago",
    deadline: "Dec 15, 2024",
    eligible: true,
    applied: false,
    description: "Join our innovative team building next-generation software solutions.",
    requirements: ["React", "Node.js", "TypeScript"],
    logo: "/abstract-tech-logo.png",
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "StartupXYZ",
    location: "Remote",
    salary: "$70,000 - $100,000",
    type: "Full-time",
    posted: "1 week ago",
    deadline: "Dec 20, 2024",
    eligible: true,
    applied: true,
    description: "Build beautiful, responsive web applications using modern frameworks.",
    requirements: ["React", "CSS", "JavaScript"],
    logo: "/abstract-startup-logo.png",
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "DataFlow Analytics",
    location: "New York, NY",
    salary: "$90,000 - $130,000",
    type: "Full-time",
    posted: "3 days ago",
    deadline: "Dec 10, 2024",
    eligible: false,
    applied: false,
    description: "Analyze complex datasets to drive business insights and decisions.",
    requirements: ["Python", "Machine Learning", "SQL"],
    logo: "/analytics-company-logo.png",
  },
]

export function JobListings() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterType === "all" || (filterType === "eligible" && job.eligible) || (filterType === "applied" && job.applied)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs or companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-48 glass">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass-card">
            <SelectItem value="all">All Jobs</SelectItem>
            <SelectItem value="eligible">Eligible Only</SelectItem>
            <SelectItem value="applied">Applied Jobs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="glass-card hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      {job.company}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {job.eligible ? (
                    <Badge className="bg-accent/10 text-accent border-accent/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Eligible
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">
                      <XCircle className="w-3 h-3 mr-1" />
                      Not Eligible
                    </Badge>
                  )}
                  {job.applied && <Badge variant="outline">Applied</Badge>}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{job.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  {job.location}
                </div>
                <div className="flex items-center text-sm">
                  <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                  {job.salary}
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                  Posted {job.posted}
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  Deadline: {job.deadline}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.requirements.map((req) => (
                  <Badge key={req} variant="secondary" className="text-xs">
                    {req}
                  </Badge>
                ))}
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                {job.eligible && !job.applied && (
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Apply Now
                  </Button>
                )}
                {job.applied && (
                  <Button size="sm" variant="secondary" disabled>
                    Applied
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
