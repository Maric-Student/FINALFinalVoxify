"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "./auth-context"

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToSignup: () => void
}

/**
 * LoginForm component
 *
 * Provides a form for users to log in to the application.
 * Uses the AuthContext to handle authentication.
 */
export default function LoginForm({ onSuccess, onSwitchToSignup }: LoginFormProps) {
  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get authentication methods from context
  const { login } = useAuth()

  /**
   * Handle form submission
   * Attempts to log in the user with the provided credentials
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Attempt to log in
      const result = await login(email, password)

      if (result.success) {
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess()
        }
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-content">
      <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm mx-auto">
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            placeholder="Enter your password"
            disabled={isSubmitting}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm">
        <p>
          Don't have an account?{" "}
          <span
            onClick={onSwitchToSignup}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer font-medium"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  )
}
