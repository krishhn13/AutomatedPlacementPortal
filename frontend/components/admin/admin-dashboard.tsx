"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, CheckCircle } from "lucide-react"
import { AdminNavbar } from "@/components/admin/admin-navbar"
import { AdminOverview } from "@/components/admin/admin-overview"
import { ApprovalPanel } from "@/components/admin/approval-panel"
import { UserManagement } from "@/components/admin/user-management"
import { ReportsAnalytics } from "@/components/admin/reports-analytics"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/10">
      <AdminNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground text-pretty">Manage the placement portal and oversee all activities</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass p-1 h-auto">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="approvals"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approvals
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3"
            >
              <Users className="w-4 h-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminOverview />
          </TabsContent>

          <TabsContent value="approvals">
            <ApprovalPanel />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
