"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"

// Define the User type
interface User {
  id: string
  username: string
  email: string
}

// Define the AuthContext type
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  signup: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider component
 *
 * This component provides authentication state and methods to the entire application.
 * It handles user login, signup, and logout functionality, and persists the user state
 * in localStorage for session persistence.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("voxify-user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("voxify-user")
      }
    }
    setIsLoading(false)
  }, [])

  /**
   * Merge guest words with user words
   * This is called when a user logs in or signs up
   */
  const mergeGuestWords = (userId: string) => {
    // Get guest words
    const guestWordsJson = localStorage.getItem("voxify-guest-words")
    if (!guestWordsJson) return

    try {
      const guestWords = JSON.parse(guestWordsJson)
      if (!Array.isArray(guestWords) || guestWords.length === 0) return

      // Get user data
      const userDataKey = `voxify-user-data-${userId}`
      const userDataJson = localStorage.getItem(userDataKey)
      const userData = userDataJson ? JSON.parse(userDataJson) : { settings: {}, words: [] }

      // Merge words
      userData.words = [...(userData.words || []), ...guestWords]

      // Save merged data
      localStorage.setItem(userDataKey, JSON.stringify(userData))

      // Clear guest words
      localStorage.removeItem("voxify-guest-words")
    } catch (error) {
      console.error("Failed to merge guest words:", error)
    }
  }

  /**
   * Login function
   *
   * Authenticates a user with email and password.
   * In a real app, this would make an API call to a backend service.
   */
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would be an API call to verify credentials
      // For demo purposes, we'll check localStorage for registered users
      const usersJson = localStorage.getItem("voxify-users")
      const users = usersJson ? JSON.parse(usersJson) : []

      const foundUser = users.find((u: any) => u.email === email)

      if (!foundUser) {
        setIsLoading(false)
        return { success: false, message: "User not found" }
      }

      // In a real app, you would use proper password hashing and comparison
      if (foundUser.password !== password) {
        setIsLoading(false)
        return { success: false, message: "Invalid password" }
      }

      // Create user object (excluding password)
      const loggedInUser = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
      }

      // Merge guest words with user words
      mergeGuestWords(foundUser.id)

      // Save user to state and localStorage
      setUser(loggedInUser)
      localStorage.setItem("voxify-user", JSON.stringify(loggedInUser))

      setIsLoading(false)
      return { success: true, message: "Login successful" }
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      return { success: false, message: "An error occurred during login" }
    }
  }

  /**
   * Signup function
   *
   * Registers a new user with username, email, and password.
   * In a real app, this would make an API call to a backend service.
   */
  const signup = async (
    username: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would be an API call to register the user
      // For demo purposes, we'll store in localStorage
      const usersJson = localStorage.getItem("voxify-users")
      const users = usersJson ? JSON.parse(usersJson) : []

      // Check if email already exists
      if (users.some((u: any) => u.email === email)) {
        setIsLoading(false)
        return { success: false, message: "Email already in use" }
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        username,
        email,
        password, // In a real app, this would be hashed
        createdAt: new Date().toISOString(),
      }

      // Add to users array and save
      users.push(newUser)
      localStorage.setItem("voxify-users", JSON.stringify(users))

      // Create user object (excluding password) for state
      const registeredUser = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      }

      // Merge guest words with user words
      mergeGuestWords(newUser.id)

      // Save user to state and localStorage
      setUser(registeredUser)
      localStorage.setItem("voxify-user", JSON.stringify(registeredUser))

      // Initialize user data
      localStorage.setItem(
        `voxify-user-data-${registeredUser.id}`,
        JSON.stringify({
          words: [],
          settings: {
            language: "english",
            theme: "light",
            colorblindMode: "none",
            fontSize: 100,
            voice: "",
            speechRate: 1,
            pitch: 1,
          },
        }),
      )

      setIsLoading(false)
      return { success: true, message: "Signup successful" }
    } catch (error) {
      console.error("Signup error:", error)
      setIsLoading(false)
      return { success: false, message: "An error occurred during signup" }
    }
  }

  /**
   * Logout function
   *
   * Logs out the current user by clearing the user state and localStorage.
   */
  const logout = () => {
    setUser(null)
    localStorage.removeItem("voxify-user")
  }

  // Create the context value object
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth hook
 *
 * Custom hook to access the AuthContext from any component.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
