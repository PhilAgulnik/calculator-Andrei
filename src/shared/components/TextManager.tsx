/**
 * Text Manager Component
 * Admin interface for managing dynamic text content
 */

import { useState, useEffect } from 'react'
import { Button } from '~/components/Button'
import type { TextCollection, TextContext } from '../types/text-manager'
import {
  getAllTexts,
  getTextsByContext,
  searchTexts,
  setText,
  resetText,
  resetAllTexts,
  exportTexts,
  importTexts,
  getTextStats,
} from '../utils/textManager'

export function TextManager() {
  const [texts, setTexts] = useState<TextCollection>(getAllTexts())
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContext, setSelectedContext] = useState<TextContext | 'all'>('all')
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [stats, setStats] = useState(getTextStats())
  const [importFile, setImportFile] = useState<File | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Load texts
  useEffect(() => {
    loadTexts()
  }, [selectedContext, searchQuery])

  // Listen for text changes
  useEffect(() => {
    const handleTextsChanged = () => {
      loadTexts()
      setStats(getTextStats())
    }

    window.addEventListener('texts-changed', handleTextsChanged)

    return () => {
      window.removeEventListener('texts-changed', handleTextsChanged)
    }
  }, [selectedContext, searchQuery])

  const loadTexts = () => {
    let newTexts: TextCollection

    if (searchQuery) {
      newTexts = searchTexts(searchQuery)
    } else if (selectedContext === 'all') {
      newTexts = getAllTexts()
    } else {
      newTexts = getTextsByContext(selectedContext)
    }

    setTexts(newTexts)
  }

  const handleEdit = (key: string, currentValue: string) => {
    setEditingKey(key)
    setEditValue(currentValue)
  }

  const handleSave = (key: string) => {
    setText(key, editValue)
    setEditingKey(null)
    showMessage('success', 'Text saved successfully')
  }

  const handleCancel = () => {
    setEditingKey(null)
    setEditValue('')
  }

  const handleReset = (key: string) => {
    if (confirm('Reset this text to default?')) {
      resetText(key)
      showMessage('success', 'Text reset to default')
    }
  }

  const handleResetAll = () => {
    if (
      confirm(
        'Are you sure you want to reset ALL texts to defaults? This cannot be undone.'
      )
    ) {
      resetAllTexts()
      showMessage('success', 'All texts reset to defaults')
    }
  }

  const handleExport = () => {
    const json = exportTexts()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `texts-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showMessage('success', 'Texts exported successfully')
  }

  const handleImport = async () => {
    if (!importFile) return

    try {
      const content = await importFile.text()
      const result = importTexts(content)

      if (result.success) {
        showMessage('success', result.message)
        setImportFile(null)
      } else {
        showMessage('error', result.message)
      }
    } catch (error) {
      showMessage('error', 'Failed to import file')
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const contexts: { id: TextContext | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'calculator', label: 'Calculator' },
    { id: 'help', label: 'Help' },
    { id: 'error', label: 'Error Messages' },
    { id: 'general', label: 'General' },
    { id: 'admin', label: 'Admin' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold mb-2">Text Content Management</h2>
        <p className="text-gray-600">
          Customize text content throughout the calculator without code changes
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`rounded-lg p-4 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-900">{stats.totalTexts}</div>
          <div className="text-sm text-blue-700">Total Texts</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-900">{stats.customizedTexts}</div>
          <div className="text-sm text-purple-700">Customized</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-900">
            {Math.round((stats.customizedTexts / stats.totalTexts) * 100)}%
          </div>
          <div className="text-sm text-green-700">Customization Rate</div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex gap-2">
          <Button onClick={handleExport} className="px-3 py-1 text-sm">
            Export All
          </Button>
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">
              Choose Import File
            </span>
          </label>
          {importFile && (
            <Button onClick={handleImport} className="px-3 py-1 text-sm">
              Import {importFile.name}
            </Button>
          )}
        </div>
        <Button onClick={handleResetAll} className="px-3 py-1 text-sm">
          Reset All to Defaults
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Context Filter */}
        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium text-gray-700">Context:</label>
          <select
            value={selectedContext}
            onChange={(e) => setSelectedContext(e.target.value as TextContext | 'all')}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            {contexts.map((ctx) => (
              <option key={ctx.id} value={ctx.id}>
                {ctx.label} ({stats.contexts[ctx.id as TextContext] || 'N/A'})
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search texts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
          />
        </div>
      </div>

      {/* Texts List */}
      <div className="space-y-3">
        {Object.entries(texts).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No texts found matching your criteria
          </div>
        ) : (
          Object.entries(texts).map(([key, content]) => {
            const isEditing = editingKey === key
            const isCustomized = !!content.customText

            return (
              <div
                key={key}
                className={`border rounded-lg p-4 ${
                  isCustomized
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                        {key}
                      </code>
                      {isCustomized && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                          Customized
                        </span>
                      )}
                    </div>
                    {content.description && (
                      <p className="text-xs text-gray-600 mt-1">{content.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!isEditing && (
                      <>
                        <Button
                          onClick={() => handleEdit(key, content.customText || content.defaultText)}
                          className="px-3 py-1 text-sm"
                        >
                          Edit
                        </Button>
                        {isCustomized && (
                          <Button onClick={() => handleReset(key)} className="px-3 py-1 text-sm">
                            Reset
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Content */}
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => handleSave(key)} className="px-3 py-1 text-sm">
                        Save
                      </Button>
                      <Button onClick={handleCancel} className="px-3 py-1 text-sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Default:</div>
                      <div className="text-sm text-gray-700 bg-gray-50 rounded p-2">
                        {content.defaultText}
                      </div>
                    </div>
                    {isCustomized && (
                      <div>
                        <div className="text-xs text-blue-600 mb-1">Custom:</div>
                        <div className="text-sm text-blue-900 bg-blue-100 rounded p-2">
                          {content.customText}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
