/**
 * useAuth React Hook
 * Provides authentication state and actions to React components
 */

import { useState, useEffect } from 'react'
import type { AuthState } from '../types/auth'
import {
  login as authLogin,
  logout as authLogout,
  isAuthenticated,
  getAuthState,
  extendSession,
} from '../utils/authManager'

interface UseAuthReturn extends AuthState {
  login: (password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  extendSession: () => boolean
}

export function useAuth(): UseAuthReturn {
  const [authState, setAuthState] = useState<AuthState>(getAuthState)

  useEffect(() => {
    // Update auth state when it changes
    const handleAuthChange = () => {
      setAuthState(getAuthState())
    }

    window.addEventListener('auth-state-changed', handleAuthChange)

    // Check session expiry every minute
    const interval = setInterval(() => {
      if (isAuthenticated()) {
        setAuthState(getAuthState())
      }
    }, 60000)

    return () => {
      window.removeEventListener('auth-state-changed', handleAuthChange)
      clearInterval(interval)
    }
  }, [])

  const handleLogin = async (password: string) => {
    const result = authLogin(password)
    setAuthState(getAuthState())
    return result
  }

  const handleLogout = () => {
    authLogout()
    setAuthState(getAuthState())
  }

  const handleExtendSession = () => {
    const extended = extendSession()
    if (extended) {
      setAuthState(getAuthState())
    }
    return extended
  }

  return {
    ...authState,
    login: handleLogin,
    logout: handleLogout,
    extendSession: handleExtendSession,
  }
}
