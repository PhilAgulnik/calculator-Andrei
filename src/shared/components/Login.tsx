/**
 * Login Component
 * Simple password-based login form for admin access
 */

import { useState, FormEvent } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth'
import { Button } from '~/components/Button'

export function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const search = useSearch({ from: '__root__' }) as { redirect?: string }
  const { login, attemptsRemaining, isLockedOut, lockoutExpiresAt } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await login(password)

      if (result.success) {
        // Redirect to the intended page or default to admin
        const redirect = search.redirect || '/admin'
        navigate({ to: redirect } as any)
      } else {
        setError(result.message)
        setPassword('')
      }
    } catch (err) {
      setError('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  const getLockoutMessage = () => {
    if (!isLockedOut || !lockoutExpiresAt) return ''

    const remainingMinutes = Math.ceil((lockoutExpiresAt - Date.now()) / 60000)
    return `Account locked. Try again in ${remainingMinutes} minute(s).`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600 text-sm">
            Enter the administrator password to access admin features
          </p>
        </div>

        {/* Lockout Warning */}
        {isLockedOut && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Account Locked</h3>
                <p className="text-sm text-red-700">{getLockoutMessage()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLockedOut || isLoading}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter admin password"
              autoFocus
              autoComplete="current-password"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Attempts Remaining */}
          {!isLockedOut && attemptsRemaining < 5 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> {attemptsRemaining} attempt(s) remaining before lockout
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLockedOut || isLoading || !password}
            className="w-full"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        {/* Help Text */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            This is a password-protected area. If you've forgotten your password, contact your
            system administrator.
          </p>
          {(import.meta.env as any).DEV && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-xs text-blue-800">
                <strong>Dev Mode:</strong> Default password is "admin123"
              </p>
            </div>
          )}
        </div>

        {/* Back to Calculator Link */}
        <div className="mt-4 text-center">
          <a
            href="/calculator-Andrei/"
            className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
          >
            ← Back to Calculator
          </a>
        </div>
      </div>
    </div>
  )
}
