"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { StudentNavbar } from "./student-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function StudentProfilePage() {
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [student, setStudent] = useState<any>(null)

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token")
      if (!token) return router.push("/")

      try {
        const res = await fetch(`${API_BASE_URL}/api/student/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("Fetch failed")

        setStudent(await res.json())
        setLoading(false)
      } catch {
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        })
      }
    }

    fetchProfile()
  }, [])

  const saveProfile = async () => {
    setSaving(true)
    const token = localStorage.getItem("token")

    try {
      const res = await fetch(`${API_BASE_URL}/api/student/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: student.phone,
          location: student.location,
          year: student.year,
          skills: student.skills,
          backlogs: student.backlogs,
        }),
      })

      if (!res.ok) throw new Error("Save failed")

      toast({ title: "Profile updated successfully" })
      router.push("/student/dashboard")
    } catch {
      toast({
        title: "Update failed",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    )
  }

  return (
    <>
      <StudentNavbar />

      {/* Background wrapper adds visual weight */}
      <div className="min-h-screen bg-muted/40">
        <div className="container mx-auto max-w-4xl p-6 space-y-6">

          {/* ===== Top Profile Summary (Bhara Bhara Section) ===== */}
          <Card>
            <CardContent className="p-6">
              <h1 className="text-2xl font-semibold">
                {student.name}
              </h1>

              <p className="text-sm text-muted-foreground mt-1">
                {student.email}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <span className="font-medium">Phone:</span>{" "}
                  {student.phone || "Not added"}
                </div>
                <div>
                  <span className="font-medium">Location:</span>{" "}
                  {student.location || "Not added"}
                </div>
                <div>
                  <span className="font-medium">Year:</span>{" "}
                  {student.year || "—"}
                </div>
                <div>
                  <span className="font-medium">Backlogs:</span>{" "}
                  {student.backlogs ?? 0}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ===== Edit Form Card ===== */}
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={student.name} disabled />
              </div>

              <div>
                <Label>Email</Label>
                <Input value={student.email} disabled />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={student.phone || ""}
                  onChange={(e) =>
                    setStudent({ ...student, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Location</Label>
                <Input
                  value={student.location || ""}
                  onChange={(e) =>
                    setStudent({ ...student, location: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Skills</Label>
                <Textarea
                  placeholder="Java, React, SQL"
                  value={(student.skills || []).join(", ")}
                  onChange={(e) =>
                    setStudent({
                      ...student,
                      skills: e.target.value
                        .split(",")
                        .map((s) => s.trim()),
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button onClick={saveProfile} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
