// Authentication utilities and types
export interface User {
  id: string
  email: string
  role: "student" | "company" | "admin"
  name: string
  isApproved?: boolean
}

export interface Student extends User {
  role: "student"
  rollNo: string
  branch: string
  cgpa: number
  skills?: string[]
  resumeUrl?: string
}

export interface Company extends User {
  role: "company"
  companyName: string
  contactPerson: string
  description: string
  isApproved: boolean
}

export interface Admin extends User {
  role: "admin"
}

// Mock authentication functions (replace with actual API calls)
export const login = async (email: string, password: string, role: string): Promise<User> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock user data
  const mockUser: User = {
    id: "1",
    email,
    role: role as "student" | "company" | "admin",
    name: "John Doe",
  }

  return mockUser
}

export const register = async (userData: any): Promise<User> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock registration
  const mockUser: User = {
    id: Date.now().toString(),
    email: userData.email,
    role: userData.role,
    name: userData.name || userData.contactPerson,
  }

  return mockUser
}

export const logout = async (): Promise<void> => {
  try {
    // Simulate API call to invalidate session
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Clear authentication state
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      localStorage.removeItem("authState")

      // Clear any cached data
      sessionStorage.clear()
    }
  } catch (error) {
    console.error("Logout error:", error)
    throw new Error("Failed to logout")
  }
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem("user")
  return userData ? JSON.parse(userData) : null
}

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null
}

export const hasRole = (requiredRole: string): boolean => {
  const user = getCurrentUser()
  return user?.role === requiredRole
}
