# Shared Components & Utilities

This folder contains reusable components, utilities, hooks, and types that are shared across the application.

---

## Directory Structure

```
shared/
├── components/        # Reusable UI components
│   ├── AdminPanel.tsx
│   ├── ExampleScenarios.tsx
│   ├── Login.tsx
│   ├── ProtectedRoute.tsx
│   ├── TextManager.tsx
│   └── ThemeSelector.tsx
├── hooks/            # Custom React hooks
│   ├── useAuth.ts
│   ├── useText.ts
│   └── useTheme.ts
├── styles/           # Global styles
│   └── theme.css
├── types/            # TypeScript type definitions
│   ├── auth.ts
│   ├── text-manager.ts
│   └── theme.ts
└── utils/            # Utility functions
    ├── authManager.ts
    ├── textManager.ts
    └── themeManager.ts
```

---

## Components

### AdminPanel
Main administration interface with tabs for themes, settings, content, and about.

**Usage:**
```tsx
import { AdminPanel } from '~/shared/components/AdminPanel'

// Rendered at /admin route (protected)
<AdminPanel />
```

**Features:**
- Theme management
- System settings
- Text content management
- System information
- Session management

---

### ThemeSelector
UI for selecting and previewing themes.

**Usage:**
```tsx
import { ThemeSelector } from '~/shared/components/ThemeSelector'

// Full mode with preview
<ThemeSelector showPreview={true} />

// Compact mode (dropdown only)
<ThemeSelector compact={true} />
```

**Props:**
- `showPreview?: boolean` - Show color previews (default: true)
- `compact?: boolean` - Use compact dropdown mode (default: false)

---

### Login
Authentication page for admin access.

**Usage:**
```tsx
import { Login } from '~/shared/components/Login'

// Rendered at /login route
<Login />
```

**Features:**
- Password input with validation
- Error messages
- Rate limiting display
- Lockout warnings
- Auto-redirect on success

---

### ProtectedRoute
Wrapper component to protect routes requiring authentication.

**Usage:**
```tsx
import { ProtectedRoute } from '~/shared/components/ProtectedRoute'

function AdminPage() {
  return (
    <ProtectedRoute redirectTo="/login">
      <div>Protected content</div>
    </ProtectedRoute>
  )
}
```

**Props:**
- `children: ReactNode` - Content to protect
- `fallback?: ReactNode` - Loading fallback
- `redirectTo?: string` - Redirect URL (default: '/login')

---

### TextManager
Admin interface for managing dynamic text content.

**Usage:**
```tsx
import { TextManager } from '~/shared/components/TextManager'

// Rendered in AdminPanel Content tab
<TextManager />
```

**Features:**
- View all texts
- Search and filter
- Edit custom texts
- Reset to defaults
- Export/import
- Statistics

---

### ExampleScenarios
Quick-fill example scenarios for testing.

**Usage:**
```tsx
import { ExampleScenarios } from '~/shared/components/ExampleScenarios'

function CalculatorPage() {
  const handleLoadExample = (data) => {
    setFormData(data)
  }

  return (
    <>
      <ExampleScenarios onLoadExample={handleLoadExample} />
      {/* or compact mode */}
      <ExampleScenarios onLoadExample={handleLoadExample} compact={true} />
    </>
  )
}
```

**Props:**
- `onLoadExample: (data: Record<string, any>) => void` - Callback when example loaded
- `compact?: boolean` - Use dropdown mode (default: false)

---

## Hooks

### useAuth
Authentication state and actions.

**Usage:**
```tsx
import { useAuth } from '~/shared/hooks/useAuth'

function MyComponent() {
  const {
    isAuthenticated,
    attemptsRemaining,
    isLockedOut,
    sessionExpiry,
    login,
    logout,
    extendSession,
  } = useAuth()

  const handleLogin = async () => {
    const result = await login('password123')
    if (result.success) {
      // Login successful
    } else {
      // Show error: result.message
    }
  }

  if (!isAuthenticated) {
    return <button onClick={handleLogin}>Login</button>
  }

  return <button onClick={logout}>Logout</button>
}
```

**Return Values:**
- `isAuthenticated: boolean` - Current auth status
- `attemptsRemaining: number` - Failed attempts remaining
- `isLockedOut: boolean` - Whether account is locked
- `lockoutExpiresAt: number | null` - Lockout expiry timestamp
- `sessionExpiry: number | null` - Session expiry timestamp
- `login: (password: string) => Promise<{success, message}>` - Login function
- `logout: () => void` - Logout function
- `extendSession: () => boolean` - Extend current session

---

### useText
Dynamic text content (single or multiple).

**Usage:**
```tsx
import { useText, useTexts } from '~/shared/hooks/useText'

function MyComponent() {
  // Single text
  const title = useText('calculator.title', 'Default Title')

  // Multiple texts
  const texts = useTexts([
    'calculator.title',
    'calculator.subtitle',
    'calculator.start',
  ])

  return (
    <div>
      <h1>{title}</h1>
      <h2>{texts['calculator.subtitle']}</h2>
      <button>{texts['calculator.start']}</button>
    </div>
  )
}
```

**Parameters:**
- `useText(key: string, fallback?: string): string`
- `useTexts(keys: string[]): Record<string, string>`

**Notes:**
- Automatically updates when text changes
- Falls back to default or provided fallback
- Returns key if no text found

---

### useTheme
Theme management and state.

**Usage:**
```tsx
import { useTheme } from '~/shared/hooks/useTheme'

function MyComponent() {
  const {
    currentThemeName,
    currentTheme,
    allThemes,
    setTheme,
    resetTheme,
  } = useTheme()

  return (
    <div>
      <p>Current: {currentTheme.displayName}</p>

      <select value={currentThemeName} onChange={(e) => setTheme(e.target.value)}>
        {allThemes.map((theme) => (
          <option key={theme.name} value={theme.name}>
            {theme.displayName}
          </option>
        ))}
      </select>

      <button onClick={resetTheme}>Reset to Default</button>
    </div>
  )
}
```

**Return Values:**
- `currentThemeName: ThemeName` - Active theme name
- `currentTheme: ThemeConfig` - Active theme configuration
- `allThemes: ThemeConfig[]` - All available themes
- `setTheme: (theme: ThemeName) => void` - Change theme
- `resetTheme: () => void` - Reset to default theme

---

## Utilities

### authManager
Low-level authentication management.

**Functions:**
```typescript
import {
  login,
  logout,
  isAuthenticated,
  getAuthState,
  extendSession,
  isLockedOut,
} from '~/shared/utils/authManager'

// Login
const result = login('password123')
// result: { success: boolean, message: string }

// Check authentication
if (isAuthenticated()) {
  // User is logged in
}

// Get full auth state
const state = getAuthState()
// state: { isAuthenticated, sessionExpiry, attemptsRemaining, isLockedOut, lockoutExpiresAt }

// Extend session
extendSession() // Adds 30 more minutes

// Logout
logout()
```

---

### textManager
Low-level text content management.

**Functions:**
```typescript
import {
  getText,
  setText,
  resetText,
  resetAllTexts,
  getAllTexts,
  getTextsByContext,
  searchTexts,
  exportTexts,
  importTexts,
  getTextStats,
} from '~/shared/utils/textManager'

// Get text
const title = getText('calculator.title', 'Default')

// Set custom text
setText('calculator.title', 'My Custom Title')

// Reset text
resetText('calculator.title')

// Reset all
resetAllTexts()

// Get all texts
const allTexts = getAllTexts()

// Filter by context
const calculatorTexts = getTextsByContext('calculator')

// Search
const results = searchTexts('universal credit')

// Export
const json = exportTexts()

// Import
const result = importTexts(json)
// result: { success: boolean, message: string, count: number }

// Statistics
const stats = getTextStats()
// stats: { totalTexts, customizedTexts, contexts }
```

---

### themeManager
Low-level theme management.

**Functions:**
```typescript
import {
  getCurrentThemeName,
  getCurrentTheme,
  getAllThemes,
  applyTheme,
  resetTheme,
  getThemeForRoute,
  autoApplyThemeForRoute,
  initializeTheme,
  createCustomTheme,
  loadCustomTheme,
} from '~/shared/utils/themeManager'

// Initialize (call on app start)
initializeTheme()
loadCustomTheme()

// Get current theme
const themeName = getCurrentThemeName()
const theme = getCurrentTheme()

// Apply theme
applyTheme('rehabilitation')

// Reset to default
resetTheme()

// Route-based theme
const routeTheme = getThemeForRoute('/rehabilitation')
autoApplyThemeForRoute('/rehabilitation')

// Create custom theme
createCustomTheme({
  displayName: 'My Custom Theme',
  primaryColor: '#ff0000',
  secondaryColor: '#00ff00',
  accentColor: '#0000ff',
})
```

---

## Types

### Theme Types (`types/theme.ts`)

```typescript
type ThemeName = 'entitledto' | 'rehabilitation' | 'budgeting' | 'self-employment' | 'custom'

interface ThemeConfig {
  name: ThemeName
  displayName: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  logoUrl?: string
  routes?: string[]
  description?: string
}
```

### Auth Types (`types/auth.ts`)

```typescript
interface AuthSession {
  authenticated: boolean
  timestamp: number
  expiresAt: number
}

interface AuthState {
  isAuthenticated: boolean
  sessionExpiry: number | null
  attemptsRemaining: number
  isLockedOut: boolean
  lockoutExpiresAt: number | null
}
```

### Text Manager Types (`types/text-manager.ts`)

```typescript
type TextContext = 'calculator' | 'help' | 'admin' | 'error' | 'general'

interface TextContent {
  key: string
  defaultText: string
  customText?: string
  context: TextContext
  description?: string
  locale?: string
}

interface TextCollection {
  [key: string]: TextContent
}
```

---

## Styles

### theme.css

Global CSS variables for theming:

```css
:root {
  --color-primary: #1e40af;
  --color-secondary: #3b82f6;
  --color-accent: #10b981;
  --color-background: #ffffff;
  --color-text: #111827;
}

/* Utility classes */
.theme-primary { color: var(--color-primary); }
.theme-bg-primary { background-color: var(--color-primary); }
.theme-secondary { color: var(--color-secondary); }
.theme-bg-secondary { background-color: var(--color-secondary); }
.theme-accent { color: var(--color-accent); }
.theme-bg-accent { background-color: var(--color-accent); }
```

---

## Best Practices

### Authentication

1. **Check auth before rendering protected content:**
   ```tsx
   const { isAuthenticated } = useAuth()
   if (!isAuthenticated) return <Login />
   ```

2. **Use ProtectedRoute for routes:**
   ```tsx
   <ProtectedRoute>
     <AdminPanel />
   </ProtectedRoute>
   ```

3. **Handle session expiry:**
   ```tsx
   const { sessionExpiry, extendSession } = useAuth()
   // Warn user when session expires soon
   ```

### Theming

1. **Initialize on app start:**
   ```tsx
   // In main.tsx or App.tsx
   initializeTheme()
   loadCustomTheme()
   ```

2. **Use CSS variables:**
   ```css
   .my-button {
     background-color: var(--color-primary);
   }
   ```

3. **Auto-apply themes by route:**
   ```tsx
   useEffect(() => {
     autoApplyThemeForRoute(location.pathname)
   }, [location.pathname])
   ```

### Text Management

1. **Always provide fallbacks:**
   ```tsx
   const text = useText('my.key', 'Default Text')
   ```

2. **Group related texts by context:**
   ```tsx
   // Use consistent key prefixes
   'calculator.title'
   'calculator.subtitle'
   'help.household'
   'error.required'
   ```

3. **Document text keys:**
   ```typescript
   // Add description when registering texts
   {
     key: 'calculator.title',
     defaultText: 'Universal Credit Calculator',
     description: 'Main calculator page title',
     context: 'calculator',
   }
   ```

---

## Testing

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest'
import { getText, setText } from '~/shared/utils/textManager'

describe('textManager', () => {
  it('should get default text', () => {
    const text = getText('calculator.title')
    expect(text).toBe('Universal Credit Calculator')
  })

  it('should get custom text', () => {
    setText('calculator.title', 'Custom Title')
    const text = getText('calculator.title')
    expect(text).toBe('Custom Title')
  })
})
```

### Integration Tests

```typescript
import { render, screen } from '@testing-library/react'
import { useText } from '~/shared/hooks/useText'

function TestComponent() {
  const text = useText('calculator.title')
  return <h1>{text}</h1>
}

test('renders text from textManager', () => {
  render(<TestComponent />)
  expect(screen.getByText('Universal Credit Calculator')).toBeInTheDocument()
})
```

---

## Troubleshooting

### Theme not applying

**Issue:** Theme colors not showing
**Solution:**
1. Check `theme.css` is imported
2. Verify `initializeTheme()` is called
3. Check browser console for errors

### Authentication not working

**Issue:** Can't access admin panel
**Solution:**
1. Navigate to `/login` first
2. Check default password: "admin123"
3. Check for lockout (wait 15 minutes or clear localStorage)

### Text not updating

**Issue:** Custom text not showing
**Solution:**
1. Verify component uses `useText()` hook
2. Check localStorage for custom texts
3. Verify text key is correct

---

## Migration from Hardcoded Content

### Step 1: Register Text Keys

Add your text keys to `textManager.ts`:

```typescript
const defaultTexts: TextCollection = {
  'my-app.welcome': {
    key: 'my-app.welcome',
    defaultText: 'Welcome to our calculator',
    context: 'general',
    description: 'Welcome message on home page',
  },
}
```

### Step 2: Replace Hardcoded Strings

**Before:**
```tsx
<h1>Welcome to our calculator</h1>
```

**After:**
```tsx
const welcome = useText('my-app.welcome', 'Welcome to our calculator')
return <h1>{welcome}</h1>
```

### Step 3: Test

1. Verify default text shows
2. Go to Admin → Content
3. Edit the text
4. Verify custom text shows

---

## Contributing

When adding new shared components/utilities:

1. Add to appropriate directory (components, hooks, utils, types)
2. Export from index file (if applicable)
3. Add TypeScript types
4. Add JSDoc comments
5. Update this README
6. Add tests

---

## License

Same as parent project.

---

**Last Updated:** November 13, 2025
