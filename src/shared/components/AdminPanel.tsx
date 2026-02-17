/**
 * Admin Panel Component
 * Central interface for managing calculator settings and configuration
 */

import { useState, useEffect } from 'react'
import { Button } from '~/components/Button'
import { ThemeSelector } from './ThemeSelector'
import { TextManager } from './TextManager'

type AdminTab = 'themes' | 'settings' | 'content' | 'export' | 'testing' | 'about'

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('export')
  const [showLogs, setShowLogs] = useState(false)
  const [logs, setLogs] = useState<string[]>([])


  const handleClearCache = () => {
    if (confirm('Are you sure you want to clear all cached data? This will remove saved calculator entries, scenarios, and settings.')) {
      try {
        // Get all localStorage keys
        const keys = Object.keys(localStorage)

        // Clear calculator-related data
        const clearedKeys: string[] = []
        keys.forEach(key => {
          if (key.startsWith('/benefits-calculator') ||
              key.includes('scenario') ||
              key.includes('calculator') ||
              key === 'theme' ||
              key === 'text-customizations') {
            localStorage.removeItem(key)
            clearedKeys.push(key)
          }
        })

        alert(`Cache cleared successfully! Removed ${clearedKeys.length} items:\n${clearedKeys.join('\n')}`)

        // Log the action
        const logEntry = `[${new Date().toISOString()}] Cache cleared - ${clearedKeys.length} items removed`
        addLog(logEntry)
      } catch (error) {
        alert(`Error clearing cache: ${error}`)
      }
    }
  }

  const handleViewLogs = () => {
    // Load logs from localStorage
    const storedLogs = localStorage.getItem('admin-logs')
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs))
    } else {
      setLogs(['No logs available'])
    }
    setShowLogs(true)
  }

  const addLog = (message: string) => {
    const storedLogs = localStorage.getItem('admin-logs')
    const currentLogs = storedLogs ? JSON.parse(storedLogs) : []
    const newLogs = [...currentLogs, message]

    // Keep only last 100 logs
    if (newLogs.length > 100) {
      newLogs.splice(0, newLogs.length - 100)
    }

    localStorage.setItem('admin-logs', JSON.stringify(newLogs))
  }

  const clearLogs = () => {
    if (confirm('Are you sure you want to clear all logs?')) {
      localStorage.removeItem('admin-logs')
      setLogs(['Logs cleared'])
      addLog(`[${new Date().toISOString()}] Logs cleared`)
    }
  }

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'content', label: 'Content', icon: '📝' },
    { id: 'export', label: 'Inputs & Export', icon: '📤' },
    { id: 'testing', label: 'Testing Module', icon: '🧪' },
    { id: 'themes', label: 'Themes', icon: '🎨' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Calculator Administration</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage themes, settings, and content
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/calculator-Andrei/"
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
              >
                ← Back to Calculator
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <aside className="col-span-12 md:col-span-3">
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full px-4 py-3 text-left flex items-center gap-3 transition-colors
                    ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                    }
                  `}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <a
                  href="/calculator-Andrei/benefit-rates"
                  className="w-full text-sm px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-start gap-2 cursor-pointer"
                >
                  📊 Benefit Rates
                </a>
                <Button onClick={handleClearCache} className="w-full justify-start text-sm px-3 py-2">
                  🗑️ Clear Cache
                </Button>
                <Button onClick={handleViewLogs} className="w-full justify-start text-sm px-3 py-2">
                  📋 View Logs
                </Button>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <main className="col-span-12 md:col-span-9">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {activeTab === 'settings' && <SettingsTab />}
              {activeTab === 'content' && <ContentTab />}
              {activeTab === 'export' && <ExportTab />}
              {activeTab === 'testing' && <TestingTab />}
              {activeTab === 'themes' && <ThemesTab />}
              {activeTab === 'about' && <AboutTab />}
            </div>
          </main>
        </div>
      </div>

      {/* Logs Modal */}
      {showLogs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">System Logs</h2>
              <div className="flex items-center gap-2">
                <Button onClick={clearLogs} className="px-3 py-1 text-sm bg-red-600 text-white hover:bg-red-700">
                  Clear Logs
                </Button>
                <button
                  onClick={() => setShowLogs(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-gray-900 text-green-400 font-mono text-sm rounded p-4">
                {logs.length === 0 ? (
                  <p className="text-gray-500">No logs available</p>
                ) : (
                  <div className="space-y-1">
                    {logs.map((log, index) => (
                      <div key={index} className="hover:bg-gray-800 px-2 py-1 rounded">
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Log Info */}
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">About Logs</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Logs show administrative actions and system events</li>
                  <li>• Maximum 100 most recent log entries are kept</li>
                  <li>• Logs are stored in browser localStorage</li>
                  <li>• Clearing logs removes all stored log entries</li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <Button onClick={() => setShowLogs(false)} className="px-4 py-2">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Themes Tab Content
 */
function ThemesTab() {
  return (
    <div>
      <ThemeSelector showPreview={true} />
    </div>
  )
}

/**
 * Settings Tab Content
 */
function SettingsTab() {
  const [autoSave, setAutoSave] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [maxScenarios, setMaxScenarios] = useState(50)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">System Settings</h2>
        <p className="text-gray-600 mb-6">
          Configure calculator behavior and features
        </p>
      </div>

      {/* General Settings */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">General</h3>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <div className="font-medium text-gray-900">Auto-save scenarios</div>
            <div className="text-sm text-gray-600">
              Automatically save calculation scenarios
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <div className="font-medium text-gray-900">Show advanced features</div>
            <div className="text-sm text-gray-600">
              Display expert-level options and calculations
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showAdvanced}
              onChange={(e) => setShowAdvanced(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="py-3">
          <label htmlFor="max-scenarios" className="block font-medium text-gray-900 mb-2">
            Maximum saved scenarios
          </label>
          <div className="flex items-center gap-4">
            <input
              id="max-scenarios"
              type="range"
              min="10"
              max="100"
              step="10"
              value={maxScenarios}
              onChange={(e) => setMaxScenarios(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-gray-700 font-medium w-12 text-right">{maxScenarios}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Limit the number of scenarios that can be saved in browser storage
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-gray-200">
        <Button>Save Settings</Button>
      </div>
    </div>
  )
}

/**
 * Content Tab Content
 */
function ContentTab() {
  return <TextManager />
}

/**
 * Inputs & Export Tab Content
 */
function ExportTab() {
  const [calculatorData, setCalculatorData] = useState<any>(null)
  const [showAll, setShowAll] = useState(false)

  // Load calculator data from localStorage
  useEffect(() => {
    try {
      const entries = localStorage.getItem('/benefits-calculator')
      if (entries) {
        const parsed = JSON.parse(entries)
        const entryIds = Object.keys(parsed)
        if (entryIds.length > 0) {
          // Get the most recent entry
          const latestId = entryIds.sort((a, b) => {
            const timeA = parsed[a].createdAt || 0
            const timeB = parsed[b].createdAt || 0
            return new Date(timeB).getTime() - new Date(timeA).getTime()
          })[0]
          setCalculatorData(parsed[latestId])
        }
      }
    } catch (error) {
      console.error('Error loading calculator data:', error)
    }
  }, [])

  const handleExportJSON = () => {
    if (!calculatorData) {
      alert('No calculator data available to export')
      return
    }

    const exportData = {
      exportedAt: new Date().toISOString(),
      calculatorVersion: '1.0.0',
      data: calculatorData,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `calculator-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!calculatorData) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Inputs & Export JSON</h2>
          <p className="text-gray-600 mb-6">
            View the current answers for all input variables and export inputs + results as JSON.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">How to Use This Feature</h3>
          <ol className="list-decimal list-inside text-sm text-blue-800 space-y-2">
            <li>
              <strong>Step 1:</strong> Go to the calculator and complete a Universal Credit calculation
            </li>
            <li>
              <strong>Step 2:</strong> Fill out all the required forms and view your results
            </li>
            <li>
              <strong>Step 3:</strong> Return to this admin panel to view and export your data
            </li>
          </ol>
          <p className="mt-4 text-sm text-blue-700">
            <strong>Note:</strong> Calculator data is stored in your browser's localStorage. This feature displays the most recent calculation.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800 font-medium mb-4">
            No calculator data found in this browser session.
          </p>
          <p className="text-sm text-yellow-700 mb-4">
            To see your calculation inputs and export data, you must first complete a calculation.
          </p>
          <a
            href="/calculator-Andrei/"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            Go to Calculator →
          </a>
        </div>
      </div>
    )
  }

  const data = calculatorData.data || {}
  const displayData = showAll ? data : Object.fromEntries(
    Object.entries(data).slice(0, 20)
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Inputs & Export JSON</h2>
        <p className="text-gray-600 mb-6">
          View the current answers for all input variables and export inputs + results as JSON.
        </p>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleExportJSON}
          className="px-6 py-2 bg-green-600 text-white hover:bg-green-700"
        >
          Export JSON
        </Button>
      </div>

      {/* Input Variables Display */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Variable
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(displayData).map(([key, value]) => (
                <tr key={key} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {key}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-right font-mono">
                    {value === null || value === undefined
                      ? '-'
                      : typeof value === 'object'
                        ? JSON.stringify(value)
                        : String(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Show More/Less Button */}
        {Object.keys(data).length > 20 && (
          <div className="px-4 py-3 bg-gray-100 border-t border-gray-200 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {showAll
                ? `Show Less (${Object.keys(displayData).length} of ${Object.keys(data).length})`
                : `Show All (${Object.keys(data).length} variables)`}
            </button>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Export Information</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Export includes all input variables and their current values</p>
          <p>• JSON format can be used for debugging or data analysis</p>
          <p>• Created: {new Date(calculatorData.createdAt).toLocaleString()}</p>
          {calculatorData.updatedAt && (
            <p>• Last Updated: {new Date(calculatorData.updatedAt).toLocaleString()}</p>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Testing Module Tab Content
 */
function TestingTab() {
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [testResults, setTestResults] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [summary, setSummary] = useState<{ total: number; passed: number; failed: number } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0])
      setTestResults([])
      setSummary(null)
    }
  }

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length === 0) return []

    const headers = lines[0].split(',').map(h => h.trim())
    const rows = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const row: any = {}
      headers.forEach((header, index) => {
        const value = values[index]
        // Try to parse as number, otherwise keep as string
        row[header] = isNaN(Number(value)) ? value : Number(value)
      })
      rows.push(row)
    }

    return rows
  }

  const runTests = async () => {
    if (!csvFile) {
      alert('Please select a CSV file first')
      return
    }

    setIsRunning(true)
    setTestResults([])

    try {
      const text = await csvFile.text()
      const testCases = parseCSV(text)

      if (testCases.length === 0) {
        alert('No test cases found in CSV file')
        setIsRunning(false)
        return
      }

      // Import the calculator
      const { UniversalCreditCalculator } = await import('~/products/benefits-calculator/utils/calculator')

      const results = []
      let passed = 0
      let failed = 0

      for (const testCase of testCases) {
        try {
          // Extract expected output if present
          const expectedOutput = testCase.expectedOutput || testCase.expected_output || testCase.finalAmount

          // Remove expected output from input data
          const inputData = { ...testCase }
          delete inputData.expectedOutput
          delete inputData.expected_output
          delete inputData.expected

          // Run calculation
          const calculator = new UniversalCreditCalculator()
          const result = calculator.calculate(inputData)
          const actualOutput = result.calculation?.finalAmount || 0

          // Compare results
          const difference = Math.abs(actualOutput - (expectedOutput || 0))
          const isPassing = difference < 0.01 // Allow 1p difference for floating point errors

          if (isPassing) {
            passed++
          } else {
            failed++
          }

          results.push({
            testCase,
            expected: expectedOutput,
            actual: actualOutput,
            difference,
            passed: isPassing,
            calculation: result,
          })
        } catch (error) {
          failed++
          results.push({
            testCase,
            expected: null,
            actual: null,
            difference: null,
            passed: false,
            error: String(error),
          })
        }
      }

      setTestResults(results)
      setSummary({ total: results.length, passed, failed })
    } catch (error) {
      alert(`Error running tests: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Calculator Testing Module</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            Upload a CSV file with test cases to compare your calculator results with expected outputs
          </p>
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Test File (CSV)
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              cursor-pointer"
          />
          <p className="mt-2 text-xs text-gray-500">
            File should contain columns for input variables and expected output values. First row should be headers
          </p>
        </div>

        {csvFile && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <strong>Selected:</strong> {csvFile.name} ({(csvFile.size / 1024).toFixed(2)} KB)
            </p>
          </div>
        )}

        <Button
          onClick={runTests}
          disabled={!csvFile || isRunning}
          className="px-6 py-2 bg-green-600 text-white hover:bg-green-700"
        >
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </Button>
      </div>

      {/* Summary */}
      {summary && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Test Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summary.passed}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </div>
        </div>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Test Results</h3>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  result.passed
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Test Case #{index + 1}</span>
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      result.passed
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {result.passed ? '✓ PASS' : '✗ FAIL'}
                  </span>
                </div>

                {result.error ? (
                  <div className="text-sm text-red-700">
                    <strong>Error:</strong> {result.error}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Expected</div>
                      <div className="font-mono font-medium">
                        £{result.expected?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Actual</div>
                      <div className="font-mono font-medium">
                        £{result.actual?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Difference</div>
                      <div className={`font-mono font-medium ${result.difference > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                        £{result.difference?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">CSV Format</h3>
        <p className="text-sm text-gray-700 mb-2">
          Your CSV file should include columns for all input variables and an expected output column.
        </p>
        <p className="text-sm text-gray-700">
          <strong>Example headers:</strong> taxYear, circumstances, age, housingStatus, rent, expectedOutput
        </p>
      </div>
    </div>
  )
}

/**
 * About Tab Content
 */
function AboutTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">About</h2>
        <p className="text-gray-600 mb-6">
          System information and documentation
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">System Information</h3>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-gray-600">Version:</dt>
              <dd className="font-medium text-gray-900">1.0.0</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Build:</dt>
              <dd className="font-medium text-gray-900">Vite + React + TypeScript</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Router:</dt>
              <dd className="font-medium text-gray-900">TanStack Router</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Styling:</dt>
              <dd className="font-medium text-gray-900">Tailwind CSS 4.x</dd>
            </div>
          </dl>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Features Implemented</h3>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span>Better-Off Calculator</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span>Advanced Saved Scenarios</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span>PDF Export</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span>Dedicated Carer Module</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span>Net Earnings Module</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span>Enhanced State Pension Age Warnings</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span>Child Benefit High Income Charge</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span>Theme/Skin System</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span>Admin Panel</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span>Password Protection</span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Documentation</h3>
          <p className="text-sm text-blue-700 mb-3">
            For detailed documentation about features and migration, see:
          </p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Calculator_Enhancements_Migration_Plan.md</li>
            <li>• BetterOffCalculator_Migration_Guide.md</li>
            <li>• BetterOffCalculator_Quick_Reference.md</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
