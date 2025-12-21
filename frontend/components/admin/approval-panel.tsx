"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  GraduationCap,
  Shield,
  Download,
  User
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ApprovalPanel() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const approvalItems = [
    {
      id: 1,
      type: "company",
      name: "Tech Innovations Inc.",
      email: "hr@techinnovations.com",
      submitted: "2024-01-15",
      status: "pending",
      details: "Software development company looking to hire interns"
    },
    {
      id: 2,
      type: "student",
      name: "John Doe",
      email: "john@example.com",
      submitted: "2024-01-14",
      status: "pending",
      details: "Final year CSE student with 8.5 CGPA"
    },
    {
      id: 3,
      type: "job",
      name: "Frontend Developer Intern",
      email: "careers@google.com",
      submitted: "2024-01-13",
      status: "pending",
      details: "6-month internship with stipend"
    },
    {
      id: 4,
      type: "company",
      name: "Global Finance Corp",
      email: "info@globalfinance.com",
      submitted: "2024-01-12",
      status: "approved",
      details: "Financial services company"
    },
    {
      id: 5,
      type: "student",
      name: "Jane Smith",
      email: "jane@example.com",
      submitted: "2024-01-11",
      status: "rejected",
      details: "Profile incomplete"
    },
    {
      id: 6,
      type: "job",
      name: "Data Scientist",
      email: "hr@amazon.com",
      submitted: "2024-01-10",
      status: "pending",
      details: "Full-time position"
    },
    {
      id: 7,
      type: "company",
      name: "StartUp Ventures",
      email: "contact@startup.com",
      submitted: "2024-01-09",
      status: "pending",
      details: "Early-stage startup"
    },
    {
      id: 8,
      type: "student",
      name: "Mike Johnson",
      email: "mike@example.com",
      submitted: "2024-01-08",
      status: "approved",
      details: "MBA graduate"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>
      default:
        return null
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "company":
        return <Building2 className="h-4 w-4" />
      case "student":
        return <GraduationCap className="h-4 w-4" />
      case "job":
        return <Shield className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const handleViewDetails = (item: any) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  const handleApprove = (id: number) => {
    // API call would go here
    console.log("Approved item:", id)
  }

  const handleReject = (id: number) => {
    // API call would go here
    console.log("Rejected item:", id)
  }

  const filteredItems = approvalItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || item.type === filterType
    const matchesTab = activeTab === "all" || item.status === activeTab
    
    return matchesSearch && matchesType && matchesTab
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Approval Management</h2>
          <p className="text-muted-foreground">Review and manage pending approvals</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="company">Companies</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="job">Job Postings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <span className="capitalize">{item.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.submitted}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(item)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {item.status === "pending" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApprove(item.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(item.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog for viewing details */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Approval Details</DialogTitle>
            <DialogDescription>
              Review details before making a decision
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
                  <p className="capitalize">{selectedItem.type}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                  <p>{selectedItem.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                  <p>{selectedItem.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Submitted</h4>
                  <p>{selectedItem.submitted}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Details</h4>
                <p className="mt-1">{selectedItem.details}</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Additional Information</h4>
                <p className="text-sm text-muted-foreground">
                  This {selectedItem.type} registration requires administrative approval before gaining full access to the platform.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedItem?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleReject(selectedItem.id)
                    setIsDialogOpen(false)
                  }}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    handleApprove(selectedItem.id)
                    setIsDialogOpen(false)
                  }}
                >
                  Approve
                </Button>
              </>
            )}
            <Button
              variant="secondary"
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}