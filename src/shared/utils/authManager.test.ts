import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  login,
  logout,
  isAuthenticated,
  getAuthState,
  extendSession,
  isLockedOut,
} from './authManager'

describe('authManager', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should login with correct password', () => {
      const result = login('admin123')
      expect(result.success).toBe(true)
      expect(result.message).toBe('Login successful')
      expect(isAuthenticated()).toBe(true)
    })

    it('should fail login with incorrect password', () => {
      const result = login('wrong-password')
      expect(result.success).toBe(false)
      expect(result.message).toContain('Incorrect password')
      expect(isAuthenticated()).toBe(false)
    })

    it('should track failed attempts', () => {
      login('wrong1')
      login('wrong2')
      const result = login('wrong3')

      expect(result.success).toBe(false)
      expect(result.message).toContain('attempt(s) remaining')
    })

    it('should lockout after max attempts', () => {
      // Attempt 5 times
      for (let i = 0; i < 5; i++) {
        login('wrong-password')
      }

      const result = login('wrong-password')
      expect(result.success).toBe(false)
      expect(result.message).toContain('locked out')
      expect(isLockedOut()).toBe(true)
    })

    it('should save session to sessionStorage', () => {
      login('admin123')

      const stored = sessionStorage.getItem('auth-session')
      expect(stored).toBeTruthy()

      const session = JSON.parse(stored!)
      expect(session.authenticated).toBe(true)
      expect(session.timestamp).toBeDefined()
      expect(session.expiresAt).toBeDefined()
    })

    it('should dispatch auth-state-changed event on login', () => {
      const eventSpy = vi.fn()
      window.addEventListener('auth-state-changed', eventSpy)

      login('admin123')

      expect(eventSpy).toHaveBeenCalled()
      window.removeEventListener('auth-state-changed', eventSpy)
    })

    it('should clear lockout on successful login', () => {
      // Create lockout
      for (let i = 0; i < 5; i++) {
        login('wrong')
      }
      expect(isLockedOut()).toBe(true)

      // Advance time past lockout
      vi.advanceTimersByTime(16 * 60 * 1000) // 16 minutes

      // Successful login should clear lockout
      const result = login('admin123')
      expect(result.success).toBe(true)
      expect(isLockedOut()).toBe(false)
    })
  })

  describe('logout', () => {
    it('should clear session', () => {
      login('admin123')
      expect(isAuthenticated()).toBe(true)

      logout()
      expect(isAuthenticated()).toBe(false)
    })

    it('should remove session from sessionStorage', () => {
      login('admin123')
      logout()

      const stored = sessionStorage.getItem('auth-session')
      expect(stored).toBeNull()
    })

    it('should dispatch auth-state-changed event', () => {
      login('admin123')

      const eventSpy = vi.fn()
      window.addEventListener('auth-state-changed', eventSpy)

      logout()

      expect(eventSpy).toHaveBeenCalled()
      window.removeEventListener('auth-state-changed', eventSpy)
    })
  })

  describe('isAuthenticated', () => {
    it('should return false when not logged in', () => {
      expect(isAuthenticated()).toBe(false)
    })

    it('should return true when logged in', () => {
      login('admin123')
      expect(isAuthenticated()).toBe(true)
    })

    it('should return false when session expired', () => {
      login('admin123')
      expect(isAuthenticated()).toBe(true)

      // Advance time past session expiry (30 minutes)
      vi.advanceTimersByTime(31 * 60 * 1000)

      expect(isAuthenticated()).toBe(false)
    })

    it('should return false when locked out', () => {
      // Create lockout
      for (let i = 0; i < 6; i++) {
        login('wrong')
      }

      expect(isAuthenticated()).toBe(false)
      expect(isLockedOut()).toBe(true)
    })
  })

  describe('getAuthState', () => {
    it('should return auth state when not logged in', () => {
      const state = getAuthState()

      expect(state.isAuthenticated).toBe(false)
      expect(state.sessionExpiry).toBeNull()
      expect(state.attemptsRemaining).toBe(5)
      expect(state.isLockedOut).toBe(false)
    })

    it('should return auth state when logged in', () => {
      login('admin123')
      const state = getAuthState()

      expect(state.isAuthenticated).toBe(true)
      expect(state.sessionExpiry).toBeTruthy()
      expect(state.attemptsRemaining).toBe(5)
    })

    it('should return correct attempts remaining', () => {
      login('wrong1')
      login('wrong2')

      const state = getAuthState()
      expect(state.attemptsRemaining).toBe(3)
    })

    it('should return lockout state', () => {
      // Create lockout
      for (let i = 0; i < 6; i++) {
        login('wrong')
      }

      const state = getAuthState()
      expect(state.isLockedOut).toBe(true)
      expect(state.lockoutExpiresAt).toBeTruthy()
      expect(state.attemptsRemaining).toBe(0)
    })
  })

  describe('extendSession', () => {
    it('should extend active session', () => {
      login('admin123')

      const initialState = getAuthState()
      const initialExpiry = initialState.sessionExpiry!

      // Advance time 10 minutes
      vi.advanceTimersByTime(10 * 60 * 1000)

      const extended = extendSession()
      expect(extended).toBe(true)

      const newState = getAuthState()
      expect(newState.sessionExpiry!).toBeGreaterThan(initialExpiry)
    })

    it('should not extend when not authenticated', () => {
      const extended = extendSession()
      expect(extended).toBe(false)
    })

    it('should not extend expired session', () => {
      login('admin123')

      // Advance time past expiry
      vi.advanceTimersByTime(31 * 60 * 1000)

      const extended = extendSession()
      expect(extended).toBe(false)
    })
  })

  describe('isLockedOut', () => {
    it('should return false when not locked out', () => {
      expect(isLockedOut()).toBe(false)
    })

    it('should return true when locked out', () => {
      // Create lockout
      for (let i = 0; i < 6; i++) {
        login('wrong')
      }

      expect(isLockedOut()).toBe(true)
    })

    it('should return false after lockout expires', () => {
      // Create lockout
      for (let i = 0; i < 6; i++) {
        login('wrong')
      }
      expect(isLockedOut()).toBe(true)

      // Advance time past lockout duration (15 minutes)
      vi.advanceTimersByTime(16 * 60 * 1000)

      expect(isLockedOut()).toBe(false)
    })
  })

  describe('Session duration', () => {
    it('should have 30 minute session duration', () => {
      login('admin123')
      expect(isAuthenticated()).toBe(true)

      // 29 minutes - should still be authenticated
      vi.advanceTimersByTime(29 * 60 * 1000)
      expect(isAuthenticated()).toBe(true)

      // 31 minutes - should be expired
      vi.advanceTimersByTime(2 * 60 * 1000)
      expect(isAuthenticated()).toBe(false)
    })
  })

  describe('Rate limiting', () => {
    it('should allow 5 failed attempts before lockout', () => {
      for (let i = 1; i <= 4; i++) {
        const result = login('wrong')
        expect(result.success).toBe(false)
        expect(isLockedOut()).toBe(false)
      }

      // 5th attempt should trigger lockout
      const result = login('wrong')
      expect(result.success).toBe(false)
      expect(isLockedOut()).toBe(true)
    })

    it('should have 15 minute lockout duration', () => {
      // Create lockout
      for (let i = 0; i < 6; i++) {
        login('wrong')
      }
      expect(isLockedOut()).toBe(true)

      // 14 minutes - still locked out
      vi.advanceTimersByTime(14 * 60 * 1000)
      expect(isLockedOut()).toBe(true)

      // 16 minutes - lockout expired
      vi.advanceTimersByTime(2 * 60 * 1000)
      expect(isLockedOut()).toBe(false)
    })
  })

  describe('Failed attempts tracking', () => {
    it('should only count recent failed attempts', () => {
      // Old attempts (more than 5 minutes ago)
      login('wrong1')
      login('wrong2')

      // Advance time 6 minutes
      vi.advanceTimersByTime(6 * 60 * 1000)

      // Recent attempts
      login('wrong3')

      const state = getAuthState()
      // Should only count the recent attempt
      expect(state.attemptsRemaining).toBe(4)
    })

    it('should reset failed attempts on successful login', () => {
      login('wrong1')
      login('wrong2')

      const state1 = getAuthState()
      expect(state1.attemptsRemaining).toBe(3)

      // Successful login
      login('admin123')

      // Logout and check attempts
      logout()

      const state2 = getAuthState()
      expect(state2.attemptsRemaining).toBe(5)
    })
  })
})
