import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Building2, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <header className="border-b border-primary-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary-900" />
              <h1 className="text-2xl font-serif font-bold text-primary-900">PlacementPortal</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-primary-900">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gold text-primary-900 hover:bg-gold/90">Register</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-900 mb-6">
            Your Gateway to Career Success
          </h2>
          <p className="text-xl text-text-default max-w-2xl mx-auto leading-relaxed">
            Connect students with top companies through our comprehensive placement management system
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="border-primary-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary-50 rounded-full w-fit">
                <GraduationCap className="h-8 w-8 text-primary-900" />
              </div>
              <CardTitle className="font-serif text-primary-900">Students</CardTitle>
              <CardDescription>Upload your resume, browse opportunities, and track your applications</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/auth/register?role=student">
                <Button className="w-full bg-primary-900 hover:bg-primary-800">Get Started as Student</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-primary-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary-50 rounded-full w-fit">
                <Building2 className="h-8 w-8 text-primary-900" />
              </div>
              <CardTitle className="font-serif text-primary-900">Companies</CardTitle>
              <CardDescription>Post job openings, review applications, and find the best talent</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/auth/register?role=company">
                <Button className="w-full bg-gold text-primary-900 hover:bg-gold/90">Register Your Company</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-primary-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary-50 rounded-full w-fit">
                <Shield className="h-8 w-8 text-primary-900" />
              </div>
              <CardTitle className="font-serif text-primary-900">Admin</CardTitle>
              <CardDescription>Manage users, approve companies, and generate placement reports</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/auth/login?role=admin">
                <Button
                  variant="outline"
                  className="w-full border-primary-900 text-primary-900 hover:bg-primary-50 bg-transparent"
                >
                  Admin Access
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
