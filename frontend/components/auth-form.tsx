"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Building2, Shield, Mail, Lock, User, Phone } from "lucide-react"

type UserRole = "student" | "company" | "admin"

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [selectedRole, setSelectedRole] = useState<UserRole>("student")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect based on role
    const redirectPaths = {
      student: "/student/dashboard",
      company: "/company/dashboard",
      admin: "/admin/dashboard",
    }

    window.location.href = redirectPaths[selectedRole]
  }

  const roleConfig = {
    student: {
      icon: GraduationCap,
      title: "Student Portal",
      description: "Access job opportunities and track applications",
      color: "bg-primary text-primary-foreground",
    },
    company: {
      icon: Building2,
      title: "Company Portal",
      description: "Post jobs and manage recruitment",
      color: "bg-secondary text-secondary-foreground",
    },
    admin: {
      icon: Shield,
      title: "Admin Portal",
      description: "Manage platform and oversee placements",
      color: "bg-accent text-accent-foreground",
    },
  }

  const currentRole = roleConfig[selectedRole]
  const Icon = currentRole.icon

  return (
    <Card className="glass-card">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Badge className={`${currentRole.color} px-4 py-2 text-sm font-medium`}>
            <Icon className="w-4 h-4 mr-2" />
            {currentRole.title}
          </Badge>
        </div>
        <CardTitle className="text-2xl font-bold text-balance">{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
        <CardDescription className="text-pretty">{currentRole.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={isLogin ? "login" : "signup"} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 glass">
            <TabsTrigger
              value="login"
              onClick={() => setIsLogin(true)}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              onClick={() => setIsLogin(false)}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mb-6">
          <Label htmlFor="role" className="text-sm font-medium mb-3 block">
            Select Your Role
          </Label>
          <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
            <SelectTrigger className="glass">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-card">
              <SelectItem value="student">
                <div className="flex items-center">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Student
                </div>
              </SelectItem>
              <SelectItem value="company">
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  Company
                </div>
              </SelectItem>
              <SelectItem value="admin">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Administrator
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder="Enter your full name" className="pl-10 glass" required />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="Enter your email" className="pl-10 glass" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="password" type="password" placeholder="Enter your password" className="pl-10 glass" required />
            </div>
          </div>

          {!isLogin && selectedRole === "student" && (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="phone" type="tel" placeholder="Enter your phone number" className="pl-10 glass" required />
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 transition-all duration-200 hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                {isLogin ? "Signing In..." : "Creating Account..."}
              </div>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
