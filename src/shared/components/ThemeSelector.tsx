/**
 * Theme Selector Component
 * UI for selecting and previewing themes
 */

import { useState } from 'react'
import type { ThemeName } from '../types/theme'
import { useTheme } from '../hooks/useTheme'
import { Button } from '~/components/Button'

interface ThemeSelectorProps {
  showPreview?: boolean
  compact?: boolean
}

export function ThemeSelector({ showPreview = true, compact = false }: ThemeSelectorProps) {
  const { currentThemeName, currentTheme, allThemes, setTheme, resetTheme } = useTheme()
  const [previewTheme, setPreviewTheme] = useState<ThemeName | null>(null)

  const handleThemeSelect = (themeName: ThemeName) => {
    setTheme(themeName)
    setPreviewTheme(null)
  }

  const handlePreview = (themeName: ThemeName) => {
    setPreviewTheme(themeName)
  }

  const handleCancelPreview = () => {
    setPreviewTheme(null)
  }

  const displayTheme = previewTheme
    ? allThemes.find((t) => t.name === previewTheme)
    : currentTheme

  if (compact) {
    return (
      <div className="inline-block">
        <label htmlFor="theme-select" className="text-sm font-medium text-gray-700 mr-2">
          Theme:
        </label>
        <select
          id="theme-select"
          value={currentThemeName}
          onChange={(e) => handleThemeSelect(e.target.value as ThemeName)}
          className="border border-gray-300 rounded px-3 py-1 text-sm"
        >
          {allThemes.map((theme) => (
            <option key={theme.name} value={theme.name}>
              {theme.displayName}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Theme Selection</h2>
        <p className="text-gray-600 mb-6">
          Choose a theme to customize the appearance of the calculator. Each theme has its own
          color scheme and branding.
        </p>
      </div>

      {/* Current Theme */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900">Current Theme</h3>
            <p className="text-blue-700">{currentTheme.displayName}</p>
          </div>
          <Button onClick={resetTheme} className="px-3 py-1 text-sm">
            Reset to Default
          </Button>
        </div>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allThemes.map((theme) => {
          const isActive = theme.name === currentThemeName
          const isPreviewing = theme.name === previewTheme

          return (
            <div
              key={theme.name}
              className={`
                border rounded-lg p-4 transition-all
                ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                ${isPreviewing ? 'ring-2 ring-purple-500' : ''}
              `}
            >
              {/* Theme Header */}
              <div className="mb-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {theme.displayName}
                  {isActive && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                      Active
                    </span>
                  )}
                  {isPreviewing && (
                    <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded">
                      Preview
                    </span>
                  )}
                </h3>
                {theme.description && (
                  <p className="text-sm text-gray-600 mt-1">{theme.description}</p>
                )}
              </div>

              {/* Color Preview */}
              {showPreview && (
                <div className="flex gap-2 mb-4">
                  <div
                    className="w-12 h-12 rounded border border-gray-300"
                    style={{ backgroundColor: theme.primaryColor }}
                    title={`Primary: ${theme.primaryColor}`}
                  />
                  <div
                    className="w-12 h-12 rounded border border-gray-300"
                    style={{ backgroundColor: theme.secondaryColor }}
                    title={`Secondary: ${theme.secondaryColor}`}
                  />
                  <div
                    className="w-12 h-12 rounded border border-gray-300"
                    style={{ backgroundColor: theme.accentColor }}
                    title={`Accent: ${theme.accentColor}`}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {!isActive && (
                  <Button
                    onClick={() => handleThemeSelect(theme.name)}
                    className="flex-1 px-3 py-1 text-sm"
                  >
                    Apply Theme
                  </Button>
                )}
                {showPreview && !isPreviewing && (
                  <Button
                    onClick={() => handlePreview(theme.name)}
                    className="px-3 py-1 text-sm"
                  >
                    Preview
                  </Button>
                )}
                {isPreviewing && (
                  <Button onClick={handleCancelPreview} className="px-3 py-1 text-sm">
                    Cancel Preview
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Preview Notice */}
      {previewTheme && displayTheme && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-2">Preview Mode</h3>
          <p className="text-purple-700 text-sm mb-3">
            You are previewing <strong>{displayTheme.displayName}</strong>. This is a temporary
            preview and has not been saved.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => handleThemeSelect(previewTheme)} className="px-3 py-1 text-sm">
              Apply This Theme
            </Button>
            <Button onClick={handleCancelPreview} className="px-3 py-1 text-sm">
              Cancel Preview
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
