"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Building2 } from "lucide-react"

interface PlacementEvent {
  id: string
  title: string
  type: "interview" | "deadline" | "result" | "drive"
  company: string
  date: string
  time?: string
  location?: string
  description?: string
}

interface PlacementCalendarProps {
  events: PlacementEvent[]
}

export function PlacementCalendar({ events }: PlacementCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "interview":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "deadline":
        return "bg-red-100 text-red-800 border-red-200"
      case "result":
        return "bg-green-100 text-green-800 border-green-200"
      case "drive":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "interview":
        return <Clock className="h-4 w-4" />
      case "deadline":
        return <Calendar className="h-4 w-4" />
      case "result":
        return <Badge className="h-4 w-4" />
      case "drive":
        return <Building2 className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  // Get events for the current month
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const monthEvents = events.filter((event) => {
    const eventDate = new Date(event.date)
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear
  })

  // Sort events by date
  const sortedEvents = monthEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(currentDate.getMonth() - 1)
    } else {
      newDate.setMonth(currentDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const isToday = (date: string) => {
    const today = new Date()
    const eventDate = new Date(date)
    return eventDate.toDateString() === today.toDateString()
  }

  const isUpcoming = (date: string) => {
    const today = new Date()
    const eventDate = new Date(date)
    return eventDate > today
  }

  return (
    <Card className="border-primary-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-serif text-primary-900 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Placement Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium text-primary-900 min-w-[120px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events this month</h3>
            <p className="text-gray-500">Check back later for upcoming placement activities.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedEvents.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-lg border ${getEventTypeColor(event.type)} ${
                  isToday(event.date) ? "ring-2 ring-primary-900" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      {getEventTypeIcon(event.type)}
                      <h4 className="font-medium text-primary-900">{event.title}</h4>
                      <Badge variant="outline" className="text-xs capitalize">
                        {event.type}
                      </Badge>
                      {isToday(event.date) && <Badge className="bg-primary-900 text-white text-xs">Today</Badge>}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-text-default">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        <span>{event.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>

                    {event.description && <p className="text-sm text-text-default">{event.description}</p>}
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-text-default">{isUpcoming(event.date) ? "Upcoming" : "Past"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
