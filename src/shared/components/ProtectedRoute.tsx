/**
 * Protected Route Component
 * Wraps content that requires authentication
 */

import { ReactNode, useEffect } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  fallback,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLockedOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated && !isLockedOut) {
      // Redirect to login with current path as redirect target
      navigate({
        to: redirectTo,
        search: { redirect: location.pathname },
      } as any)
    }
  }, [isAuthenticated, isLockedOut, navigate, redirectTo, location.pathname])

  // Show loading/fallback while checking auth
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
