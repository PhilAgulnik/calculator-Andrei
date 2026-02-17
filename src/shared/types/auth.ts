/**
 * Authentication Types
 * For simple password-based access control
 */

export interface AuthSession {
  authenticated: boolean
  timestamp: number
  expiresAt: number
}

export interface AuthConfig {
  passwordHash: string
  sessionDuration: number // milliseconds
  maxAttempts: number
  lockoutDuration: number // milliseconds
}

export interface LoginAttempt {
  timestamp: number
  success: boolean
}

export interface AuthState {
  isAuthenticated: boolean
  sessionExpiry: number | null
  attemptsRemaining: number
  isLockedOut: boolean
  lockoutExpiresAt: number | null
}
