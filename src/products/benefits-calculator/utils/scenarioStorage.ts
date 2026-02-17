/**
 * Scenario Storage Service
 * Manages saving, loading, and managing scenarios in localStorage
 */

import type { SavedScenario, ScenarioExport } from '../types/saved-scenarios'

const STORAGE_KEY = 'ucSavedScenarios'
const STORAGE_VERSION = '1.0.0'

/**
 * Load all scenarios from localStorage
 */
export function loadScenarios(): SavedScenario[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const scenarios = JSON.parse(stored) as SavedScenario[]

    // Validate and migrate old format if needed
    return scenarios.map(migrateScenario).filter(Boolean) as SavedScenario[]
  } catch (error) {
    console.error('Failed to load scenarios:', error)
    return []
  }
}

/**
 * Save scenarios to localStorage
 */
export function saveScenarios(scenarios: SavedScenario[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios))
    return true
  } catch (error) {
    console.error('Failed to save scenarios:', error)
    return false
  }
}

/**
 * Add a new scenario
 */
export function addScenario(scenario: SavedScenario): boolean {
  const scenarios = loadScenarios()
  scenarios.unshift(scenario) // Add to beginning
  return saveScenarios(scenarios)
}

/**
 * Update an existing scenario
 */
export function updateScenario(id: string, updates: Partial<SavedScenario>): boolean {
  const scenarios = loadScenarios()
  const index = scenarios.findIndex((s) => s.id === id)

  if (index === -1) return false

  scenarios[index] = {
    ...scenarios[index],
    ...updates,
    lastModified: new Date().toISOString(),
  }

  return saveScenarios(scenarios)
}

/**
 * Delete a scenario by ID
 */
export function deleteScenario(id: string): boolean {
  const scenarios = loadScenarios()
  const filtered = scenarios.filter((s) => s.id !== id)
  return saveScenarios(filtered)
}

/**
 * Delete multiple scenarios
 */
export function deleteScenarios(ids: string[]): boolean {
  const scenarios = loadScenarios()
  const filtered = scenarios.filter((s) => !ids.includes(s.id))
  return saveScenarios(filtered)
}

/**
 * Get a single scenario by ID
 */
export function getScenario(id: string): SavedScenario | null {
  const scenarios = loadScenarios()
  return scenarios.find((s) => s.id === id) || null
}

/**
 * Clone a scenario with a new ID and name
 */
export function cloneScenario(id: string, newName?: string): SavedScenario | null {
  const original = getScenario(id)
  if (!original) return null

  const cloned: SavedScenario = {
    ...original,
    id: generateScenarioId(),
    name: newName || `${original.name} (Copy)`,
    savedAt: new Date().toISOString(),
    lastModified: undefined,
  }

  addScenario(cloned)
  return cloned
}

/**
 * Export scenarios to JSON
 */
export function exportScenarios(scenarioIds?: string[]): ScenarioExport {
  const allScenarios = loadScenarios()
  const scenarios = scenarioIds
    ? allScenarios.filter((s) => scenarioIds.includes(s.id))
    : allScenarios

  return {
    version: STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
    scenarios,
    metadata: {
      source: 'calculator-Andrei',
      calculatorVersion: '1.0.0',
    },
  }
}

/**
 * Import scenarios from JSON
 */
export function importScenarios(
  exportData: ScenarioExport,
  options: { replace?: boolean; skipDuplicates?: boolean } = {}
): { success: boolean; imported: number; errors: string[] } {
  const errors: string[] = []
  let imported = 0

  try {
    // Validate export format
    if (!exportData.scenarios || !Array.isArray(exportData.scenarios)) {
      return { success: false, imported: 0, errors: ['Invalid export format'] }
    }

    const existingScenarios = options.replace ? [] : loadScenarios()
    const existingIds = new Set(existingScenarios.map((s) => s.id))

    for (const scenario of exportData.scenarios) {
      // Skip duplicates if requested
      if (options.skipDuplicates && existingIds.has(scenario.id)) {
        continue
      }

      // Validate scenario structure
      if (!isValidScenario(scenario)) {
        errors.push(`Invalid scenario: ${scenario.name || scenario.id}`)
        continue
      }

      // Generate new ID if duplicate
      if (existingIds.has(scenario.id)) {
        scenario.id = generateScenarioId()
      }

      existingScenarios.push(scenario)
      existingIds.add(scenario.id)
      imported++
    }

    saveScenarios(existingScenarios)
    return { success: true, imported, errors }
  } catch (error) {
    return {
      success: false,
      imported,
      errors: [...errors, `Import failed: ${error}`],
    }
  }
}

/**
 * Generate unique scenario ID
 */
export function generateScenarioId(): string {
  return `scenario_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Generate auto scenario name
 */
export function generateScenarioName(): string {
  const scenarios = loadScenarios()
  const count = scenarios.length + 1
  return `Scenario ${count}`
}

/**
 * Migrate old scenario format to new format
 */
function migrateScenario(scenario: any): SavedScenario | null {
  try {
    // Already in new format
    if (scenario.formData && scenario.results && scenario.savedAt) {
      return scenario as SavedScenario
    }

    // Old format: { id, name, input, calculation, timestamp }
    if (scenario.input && scenario.calculation) {
      return {
        id: scenario.id?.toString() || generateScenarioId(),
        name: scenario.name || generateScenarioName(),
        description: scenario.description,
        taxYear: scenario.input?.taxYear || '2025_26',
        savedAt: scenario.timestamp || new Date().toISOString(),
        formData: scenario.input,
        results: {
          success: true,
          taxYear: scenario.input?.taxYear || '2025_26',
          calculation: scenario.calculation,
          calculatedAt: scenario.timestamp || new Date().toISOString(),
        },
        tags: scenario.tags,
      }
    }

    return null
  } catch (error) {
    console.error('Failed to migrate scenario:', error)
    return null
  }
}

/**
 * Validate scenario structure
 */
function isValidScenario(scenario: any): boolean {
  return !!(
    scenario &&
    scenario.id &&
    scenario.name &&
    scenario.savedAt &&
    scenario.formData &&
    scenario.results &&
    scenario.results.calculation
  )
}

/**
 * Get storage usage info
 */
export function getStorageInfo(): {
  scenarioCount: number
  storageSize: number
  maxSize: number
  usagePercent: number
} {
  const scenarios = loadScenarios()
  const stored = localStorage.getItem(STORAGE_KEY) || ''
  const storageSize = new Blob([stored]).size
  const maxSize = 5 * 1024 * 1024 // 5MB typical localStorage limit

  return {
    scenarioCount: scenarios.length,
    storageSize,
    maxSize,
    usagePercent: (storageSize / maxSize) * 100,
  }
}

/**
 * Clear all scenarios (with confirmation)
 */
export function clearAllScenarios(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Failed to clear scenarios:', error)
    return false
  }
}
