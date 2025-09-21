"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Building2, Calendar, Globe, MapPin, User, CheckCircle, XCircle, Eye } from "lucide-react"

interface Company {
  id: string
  companyName: string
  email: string
  contactPerson: string
  description: string
  website?: string
  location?: string
  registeredDate: string
  status: "pending" | "approved" | "rejected"
}

interface PendingCompaniesProps {
  companies: Company[]
  onApprove: (companyId: string) => void
  onReject: (companyId: string) => void
}

export function PendingCompanies({ companies, onApprove, onReject }: PendingCompaniesProps) {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleApprove = async (companyId: string) => {
    setActionLoading(companyId)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onApprove(companyId)
    setActionLoading(null)
    setSelectedCompany(null)
  }

  const handleReject = async (companyId: string) => {
    setActionLoading(companyId)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onReject(companyId)
    setActionLoading(null)
    setSelectedCompany(null)
  }

  const pendingCompanies = companies.filter((c) => c.status === "pending")

  if (pendingCompanies.length === 0) {
    return (
      <Card className="border-primary-200">
        <CardContent className="p-8 text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
          <p className="text-gray-500">All company registrations have been processed.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      {pendingCompanies.map((company) => (
        <Card key={company.id} className="border-primary-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-xl font-serif text-primary-900">{company.companyName}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-text-default">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{company.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Registered: {new Date(company.registeredDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-text-default leading-relaxed">{company.description}</p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-text-default">
                <span className="font-medium">Email:</span>
                <span>{company.email}</span>
              </div>
              {company.location && (
                <div className="flex items-center gap-2 text-sm text-text-default">
                  <MapPin className="h-4 w-4" />
                  <span>{company.location}</span>
                </div>
              )}
              {company.website && (
                <div className="flex items-center gap-2 text-sm text-text-default">
                  <Globe className="h-4 w-4" />
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-900 hover:underline"
                  >
                    {company.website}
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setSelectedCompany(company)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-serif text-primary-900">
                      {selectedCompany?.companyName}
                    </DialogTitle>
                    <DialogDescription>Review company details before making a decision</DialogDescription>
                  </DialogHeader>

                  {selectedCompany && (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-text-default">Contact Person</label>
                          <p className="text-primary-900">{selectedCompany.contactPerson}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-text-default">Email</label>
                          <p className="text-primary-900">{selectedCompany.email}</p>
                        </div>
                        {selectedCompany.location && (
                          <div>
                            <label className="text-sm font-medium text-text-default">Location</label>
                            <p className="text-primary-900">{selectedCompany.location}</p>
                          </div>
                        )}
                        {selectedCompany.website && (
                          <div>
                            <label className="text-sm font-medium text-text-default">Website</label>
                            <a
                              href={selectedCompany.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-900 hover:underline"
                            >
                              {selectedCompany.website}
                            </a>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium text-text-default">Company Description</label>
                        <p className="text-primary-900 mt-1 leading-relaxed">{selectedCompany.description}</p>
                      </div>
                    </div>
                  )}

                  <DialogFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={() => selectedCompany && handleReject(selectedCompany.id)}
                      disabled={actionLoading === selectedCompany?.id}
                      className="border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      {actionLoading === selectedCompany?.id ? "Rejecting..." : "Reject"}
                    </Button>
                    <Button
                      onClick={() => selectedCompany && handleApprove(selectedCompany.id)}
                      disabled={actionLoading === selectedCompany?.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {actionLoading === selectedCompany?.id ? "Approving..." : "Approve"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReject(company.id)}
                  disabled={actionLoading === company.id}
                  className="border-red-200 text-red-700 hover:bg-red-50"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  {actionLoading === company.id ? "Rejecting..." : "Reject"}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleApprove(company.id)}
                  disabled={actionLoading === company.id}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {actionLoading === company.id ? "Approving..." : "Approve"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
