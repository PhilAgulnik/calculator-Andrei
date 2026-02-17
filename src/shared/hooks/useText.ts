/**
 * useText React Hook
 * Provides dynamic text content to React components
 */

import { useState, useEffect } from 'react'
import { getText } from '../utils/textManager'

/**
 * Hook to get a single text value
 * Re-renders when text changes
 */
export function useText(key: string, fallback?: string): string {
  const [text, setText] = useState(() => getText(key, fallback))

  useEffect(() => {
    // Update text when it changes
    const handleTextsChanged = () => {
      setText(getText(key, fallback))
    }

    window.addEventListener('texts-changed', handleTextsChanged)

    return () => {
      window.removeEventListener('texts-changed', handleTextsChanged)
    }
  }, [key, fallback])

  return text
}

/**
 * Hook to get multiple texts at once
 */
export function useTexts(keys: string[]): Record<string, string> {
  const [texts, setTexts] = useState<Record<string, string>>(() => {
    const result: Record<string, string> = {}
    keys.forEach((key) => {
      result[key] = getText(key)
    })
    return result
  })

  useEffect(() => {
    // Update texts when they change
    const handleTextsChanged = () => {
      const result: Record<string, string> = {}
      keys.forEach((key) => {
        result[key] = getText(key)
      })
      setTexts(result)
    }

    window.addEventListener('texts-changed', handleTextsChanged)

    return () => {
      window.removeEventListener('texts-changed', handleTextsChanged)
    }
  }, [keys])

  return texts
}
