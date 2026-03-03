import { useState, type ReactNode } from 'react'

const SITE_PASSWORD = '3ntitledto'
const STORAGE_KEY = 'site-auth'

function isLocalhost() {
  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1' || host === '::1'
}

export function PasswordGate({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(
    () => isLocalhost() || sessionStorage.getItem(STORAGE_KEY) === 'true',
  )
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  if (authenticated) {
    return <>{children}</>
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === SITE_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true')
      setAuthenticated(true)
    } else {
      setError(true)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>entitledto</h1>
        <p style={{ marginBottom: '1rem', color: '#666' }}>Enter password to continue</p>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false) }}
          placeholder="Password"
          autoFocus
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            border: `1px solid ${error ? '#e53e3e' : '#ccc'}`,
            borderRadius: '4px',
            marginRight: '0.5rem',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.5rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Enter
        </button>
        {error && <p style={{ color: '#e53e3e', marginTop: '0.5rem' }}>Incorrect password</p>}
      </form>
    </div>
  )
}
