/**
 * Authentication Manager
 * Simple client-side password protection for admin access
 *
 * WARNING: This is CLIENT-SIDE ONLY protection and should NOT be used
 * for highly sensitive data. For production use, implement proper
 * server-side authentication.
 */

import type { AuthSession, AuthState, LoginAttempt } from '../types/auth'

const SESSION_KEY = 'auth-session'
const ATTEMPTS_KEY = 'auth-attempts'
const LOCKOUT_KEY = 'auth-lockout'
const SESSION_DURATION = 30 * 60 * 1000 // 30 minutes
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

/**
 * Simple hash function for password
 * NOTE: In production, use proper server-side hashing (bcrypt, argon2)
 */
function hashPassword(password: string): string {
  // Simple base64 encoding - NOT SECURE for production
  return btoa(password)
}

/**
 * Get the correct password hash from environment or fallback
 */
function getPasswordHash(): string {
  // Try to get from environment variable first
  const envHash = (import.meta.env as any).VITE_ADMIN_PASSWORD_HASH

  if (envHash) {
    return envHash
  }

  // Fallback to a default password (hash of "admin123")
  // In production, this should be set via environment variable
  return btoa('admin123')
}

/**
 * Get current session from sessionStorage
 */
function getSession(): AuthSession | null {
  if (typeof window === 'undefined') return null

  const stored = sessionStorage.getItem(SESSION_KEY)
  if (!stored) return null

  try {
    return JSON.parse(stored) as AuthSession
  } catch {
    return null
  }
}

/**
 * Save session to sessionStorage
 */
function saveSession(session: AuthSession): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

/**
 * Clear session from sessionStorage
 */
function clearSession(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(SESSION_KEY)
}

/**
 * Get login attempts from localStorage
 */
function getAttempts(): LoginAttempt[] {
  if (typeof window === 'undefined') return []

  const stored = localStorage.getItem(ATTEMPTS_KEY)
  if (!stored) return []

  try {
    return JSON.parse(stored) as LoginAttempt[]
  } catch {
    return []
  }
}

/**
 * Save login attempts to localStorage
 */
function saveAttempts(attempts: LoginAttempt[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts))
}

/**
 * Record a login attempt
 */
function recordAttempt(success: boolean): void {
  const attempts = getAttempts()
  const now = Date.now()

  // Remove attempts older than 1 hour
  const recentAttempts = attempts.filter((a) => now - a.timestamp < 60 * 60 * 1000)

  // Add new attempt
  recentAttempts.push({ timestamp: now, success })

  saveAttempts(recentAttempts)
}

/**
 * Get lockout expiry time
 */
function getLockoutExpiry(): number | null {
  if (typeof window === 'undefined') return null

  const stored = localStorage.getItem(LOCKOUT_KEY)
  if (!stored) return null

  const expiry = parseInt(stored, 10)
  if (isNaN(expiry)) return null

  // Clear if expired
  if (Date.now() > expiry) {
    localStorage.removeItem(LOCKOUT_KEY)
    return null
  }

  return expiry
}

/**
 * Set lockout
 */
function setLockout(): void {
  if (typeof window === 'undefined') return

  const expiry = Date.now() + LOCKOUT_DURATION
  localStorage.setItem(LOCKOUT_KEY, expiry.toString())
}

/**
 * Clear lockout
 */
function clearLockout(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(LOCKOUT_KEY)
}

/**
 * Check if currently locked out
 */
export function isLockedOut(): boolean {
  const lockoutExpiry = getLockoutExpiry()
  return lockoutExpiry !== null && Date.now() < lockoutExpiry
}

/**
 * Get number of recent failed attempts
 */
function getRecentFailedAttempts(): number {
  const attempts = getAttempts()
  const now = Date.now()
  const fiveMinutesAgo = now - 5 * 60 * 1000

  return attempts.filter((a) => !a.success && a.timestamp > fiveMinutesAgo).length
}

/**
 * Login with password
 */
export function login(password: string): { success: boolean; message: string } {
  // Check if locked out
  if (isLockedOut()) {
    const lockoutExpiry = getLockoutExpiry()
    const remainingMinutes = lockoutExpiry
      ? Math.ceil((lockoutExpiry - Date.now()) / 60000)
      : 0

    return {
      success: false,
      message: `Too many failed attempts. Locked out for ${remainingMinutes} more minute(s).`,
    }
  }

  const hashedInput = hashPassword(password)
  const correctHash = getPasswordHash()

  if (hashedInput === correctHash) {
    // Successful login
    const now = Date.now()
    const session: AuthSession = {
      authenticated: true,
      timestamp: now,
      expiresAt: now + SESSION_DURATION,
    }

    saveSession(session)
    recordAttempt(true)
    clearLockout()

    // Dispatch event for React components
    window.dispatchEvent(new Event('auth-state-changed'))

    return {
      success: true,
      message: 'Login successful',
    }
  }

  // Failed login
  recordAttempt(false)

  const failedAttempts = getRecentFailedAttempts()
  const remainingAttempts = MAX_ATTEMPTS - failedAttempts

  if (remainingAttempts <= 0) {
    setLockout()
    return {
      success: false,
      message: 'Too many failed attempts. You have been locked out for 15 minutes.',
    }
  }

  return {
    success: false,
    message: `Incorrect password. ${remainingAttempts} attempt(s) remaining.`,
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (isLockedOut()) return false

  const session = getSession()
  if (!session) return false

  const now = Date.now()

  // Check if session expired
  if (now > session.expiresAt) {
    clearSession()
    return false
  }

  return session.authenticated
}

/**
 * Logout and clear session
 */
export function logout(): void {
  clearSession()

  // Dispatch event for React components
  window.dispatchEvent(new Event('auth-state-changed'))
}

/**
 * Get authentication state
 */
export function getAuthState(): AuthState {
  const lockoutExpiry = getLockoutExpiry()
  const locked = lockoutExpiry !== null && Date.now() < lockoutExpiry
  const failedAttempts = getRecentFailedAttempts()
  const session = getSession()

  return {
    isAuthenticated: isAuthenticated(),
    sessionExpiry: session?.expiresAt || null,
    attemptsRemaining: locked ? 0 : Math.max(0, MAX_ATTEMPTS - failedAttempts),
    isLockedOut: locked,
    lockoutExpiresAt: lockoutExpiry,
  }
}

/**
 * Extend current session
 */
export function extendSession(): boolean {
  const session = getSession()
  if (!session || !isAuthenticated()) return false

  const now = Date.now()
  session.expiresAt = now + SESSION_DURATION
  saveSession(session)

  return true
}

/**
 * Change password (requires current session)
 * NOTE: In production, this should be done server-side
 */
export function changePassword(oldPassword: string, _newPassword: string): boolean {
  if (!isAuthenticated()) return false

  const hashedOld = hashPassword(oldPassword)
  const correctHash = getPasswordHash()

  if (hashedOld !== correctHash) return false

  // In production, this would update the password on the server
  // For now, we just log a message
  console.warn('Password change not implemented in client-side auth')

  return true
}
