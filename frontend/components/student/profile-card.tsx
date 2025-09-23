"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Edit, GraduationCap, Mail, Phone, MapPin } from "lucide-react"

interface ProfileCardProps {
  student: any
}

export function ProfileCard({ student }: ProfileCardProps) {
  const profileCompletion = student.profileCompletion || 80

  return (
    <Card className="glass-card">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={student.avatar || "/student-profile.png"} alt="Profile" />
              <AvatarFallback>{student.name?.[0]}</AvatarFallback>
            </Avatar>
            <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardTitle className="text-xl">{student.name}</CardTitle>
        <Badge variant="secondary" className="w-fit mx-auto">
          <GraduationCap className="w-3 h-3 mr-1" />
          {student.branch}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Profile Completion</span>
            <span className="font-medium">{profileCompletion}%</span>
          </div>
          <Progress value={profileCompletion} className="h-2" />
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center text-sm">
            <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
            <span>{student.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
            <span>{student.phone}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-3 text-muted-foreground" />
            <span>{student.location}</span>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">CGPA</span>
            <Badge variant="outline">{student.cgpa}/10</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Year</span>
            <Badge variant="outline">{student.year}</Badge>
          </div>
        </div>

        <Button className="w-full mt-4" variant="outline">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  )
}
