// Utility functions for placement management
export interface PlacementStats {
  totalApplications: number
  shortlisted: number
  selected: number
  rejected: number
  pending: number
}

export interface JobApplication {
  id: string
  jobId: string
  studentId: string
  companyName: string
  role: string
  status: "applied" | "shortlisted" | "selected" | "rejected"
  appliedDate: string
  lastUpdated: string
}

export const calculatePlacementStats = (applications: JobApplication[]): PlacementStats => {
  return {
    totalApplications: applications.length,
    shortlisted: applications.filter((app) => app.status === "shortlisted").length,
    selected: applications.filter((app) => app.status === "selected").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
    pending: applications.filter((app) => app.status === "applied").length,
  }
}

export const getApplicationStatusColor = (status: string): string => {
  switch (status) {
    case "applied":
      return "bg-blue-100 text-blue-800"
    case "shortlisted":
      return "bg-yellow-100 text-yellow-800"
    case "selected":
      return "bg-green-100 text-green-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const formatApplicationDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const isApplicationDeadlineNear = (deadline: string, daysThreshold = 3): boolean => {
  const deadlineDate = new Date(deadline)
  const today = new Date()
  const diffTime = deadlineDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays <= daysThreshold && diffDays > 0
}

export const generatePlacementReport = (applications: JobApplication[]) => {
  const stats = calculatePlacementStats(applications)
  const successRate = stats.totalApplications > 0 ? Math.round((stats.selected / stats.totalApplications) * 100) : 0

  return {
    ...stats,
    successRate,
    conversionRate: stats.shortlisted > 0 ? Math.round((stats.selected / stats.shortlisted) * 100) : 0,
  }
}

// Mock API functions (replace with actual API calls)
export const updateApplicationStatus = async (applicationId: string, newStatus: string): Promise<boolean> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return true
}

export const sendNotification = async (
  userId: string,
  notification: {
    type: string
    title: string
    message: string
  },
): Promise<boolean> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return true
}
