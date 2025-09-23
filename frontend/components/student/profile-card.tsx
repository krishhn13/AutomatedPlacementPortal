"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Edit, GraduationCap, Mail, Phone, MapPin } from "lucide-react"

interface Profile {
  name: string
  email: string
  phone: string
  location: string
  branch: string
  cgpa: number
  year: string
  profileCompletion: number
  avatar?: string
}

export function ProfileCard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:5000/api/student/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch profile")
        const data = await res.json()
        setProfile(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) return <p className="text-center py-8">Loading profile...</p>
  if (!profile) return <p className="text-center py-8 text-red-500">Failed to load profile</p>

  return (
    <Card className="glass-card">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              {profile.avatar ? <AvatarImage src={profile.avatar} alt="Profile" /> : <AvatarFallback>{profile.name[0]}</AvatarFallback>}
            </Avatar>
            <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardTitle className="text-xl">{profile.name}</CardTitle>
        <Badge variant="secondary" className="w-fit mx-auto">
          <GraduationCap className="w-3 h-3 mr-1" />
          {profile.branch}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Profile Completion</span>
            <span className="font-medium">{profile.profileCompletion}%</span>
          </div>
          <Progress value={profile.profileCompletion} className="h-2" />
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center text-sm">
            <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
            <span>{profile.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
            <span>{profile.phone}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-3 text-muted-foreground" />
            <span>{profile.location}</span>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">CGPA</span>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
              {profile.cgpa}/10
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Year</span>
            <Badge variant="outline">{profile.year}</Badge>
          </div>
        </div>

        <Button className="w-full mt-4 bg-transparent" variant="outline">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  )
}
