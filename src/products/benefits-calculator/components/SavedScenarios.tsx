import { useState, useEffect } from 'react'
import { formatCurrency } from '~/utils/functions'
import { Button } from '~/components/Button'
import { Accordion } from '~/components/Accordion'
import type { SavedScenario, ScenarioFilter } from '../types/saved-scenarios'
import {
  loadScenarios,
  deleteScenario,
  deleteScenarios,
  cloneScenario,
  exportScenarios,
  getStorageInfo,
} from '../utils/scenarioStorage'
import { ScenarioComparison } from './ScenarioComparison'

interface SavedScenariosProps {
  onLoadScenario: (scenario: SavedScenario) => void
  currentScenarioId?: string
}

export function SavedScenarios({ onLoadScenario, currentScenarioId }: SavedScenariosProps) {
  const [scenarios, setScenarios] = useState<SavedScenario[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<ScenarioFilter>({
    sortBy: 'date',
    sortOrder: 'desc',
  })
  const [showFilters, setShowFilters] = useState(false)
  const [isComparing, setIsComparing] = useState(false)

  // Load scenarios on mount
  useEffect(() => {
    refreshScenarios()
  }, [])

  const refreshScenarios = () => {
    const loaded = loadScenarios()
    setScenarios(loaded)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this scenario?')) {
      deleteScenario(id)
      refreshScenarios()
      selectedIds.delete(id)
      setSelectedIds(new Set(selectedIds))
    }
  }

  const handleBulkDelete = () => {
    if (
      selectedIds.size === 0 ||
      !confirm(`Delete ${selectedIds.size} selected scenario(s)?`)
    ) {
      return
    }

    deleteScenarios(Array.from(selectedIds))
    setSelectedIds(new Set())
    refreshScenarios()
  }

  const handleClone = (id: string) => {
    const cloned = cloneScenario(id)
    if (cloned) {
      refreshScenarios()
    }
  }

  const handleExport = () => {
    const ids = selectedIds.size > 0 ? Array.from(selectedIds) : undefined
    const exportData = exportScenarios(ids)

    // Download as JSON file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `uc-scenarios-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === scenarios.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(scenarios.map((s) => s.id)))
    }
  }

  // Filter and sort scenarios
  const filteredScenarios = scenarios
    .filter((scenario) => {
      if (filter.searchTerm) {
        const term = filter.searchTerm.toLowerCase()
        return (
          scenario.name.toLowerCase().includes(term) ||
          scenario.description?.toLowerCase().includes(term)
        )
      }
      return true
    })
    .filter((scenario) => {
      if (filter.taxYear) {
        return scenario.taxYear === filter.taxYear
      }
      return true
    })
    .sort((a, b) => {
      const order = filter.sortOrder === 'asc' ? 1 : -1

      switch (filter.sortBy) {
        case 'date':
          return (new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime()) * order
        case 'name':
          return a.name.localeCompare(b.name) * order
        case 'amount':
          return (a.results.calculation.finalAmount - b.results.calculation.finalAmount) * order
        default:
          return 0
      }
    })

  const storageInfo = getStorageInfo()

  if (scenarios.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded p-6 text-center">
        <p className="text-gray-600 mb-2">No saved scenarios yet.</p>
        <p className="text-sm text-gray-500">
          Save your first calculation to compare different scenarios.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Saved Scenarios ({scenarios.length})
          </h3>
          <p className="text-sm text-gray-500">
            Storage: {storageInfo.usagePercent.toFixed(1)}% used
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm px-3 py-1 min-h-[32px] bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
          <Button
            onClick={handleExport}
            className="text-sm px-3 py-1 min-h-[32px] bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            Export {selectedIds.size > 0 ? `(${selectedIds.size})` : 'All'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <input
                type="text"
                placeholder="Search by name..."
                value={filter.searchTerm || ''}
                onChange={(e) => setFilter({ ...filter, searchTerm: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium mb-1">Sort by</label>
              <select
                value={filter.sortBy}
                onChange={(e) =>
                  setFilter({ ...filter, sortBy: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              >
                <option value="date">Date saved</option>
                <option value="name">Name</option>
                <option value="amount">UC amount</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium mb-1">Order</label>
              <select
                value={filter.sortOrder}
                onChange={(e) =>
                  setFilter({ ...filter, sortOrder: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              >
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3 flex items-center justify-between">
          <span className="text-sm text-blue-800">
            {selectedIds.size} scenario(s) selected
          </span>
          <div className="flex gap-2">
            {selectedIds.size >= 2 && selectedIds.size <= 4 && (
              <Button
                onClick={() => setIsComparing(true)}
                className="text-sm px-3 py-1 min-h-[32px] bg-blue-600 text-white hover:bg-blue-700"
              >
                Compare
              </Button>
            )}
            {(selectedIds.size < 2 || selectedIds.size > 4) && (
              <Button
                onClick={() => {}}
                className="text-sm px-3 py-1 min-h-[32px] bg-gray-300 text-gray-500 cursor-not-allowed"
              >
                Compare (2-4 needed)
              </Button>
            )}
            <Button
              onClick={handleBulkDelete}
              className="text-sm px-3 py-1 min-h-[32px] bg-red-100 text-red-700 hover:bg-red-200"
            >
              Delete
            </Button>
            <Button
              onClick={() => setSelectedIds(new Set())}
              className="text-sm px-3 py-1 min-h-[32px] bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Select All */}
      <div className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={selectedIds.size === scenarios.length && scenarios.length > 0}
          onChange={toggleSelectAll}
          className="w-4 h-4"
        />
        <label className="text-gray-600 cursor-pointer" onClick={toggleSelectAll}>
          Select all
        </label>
      </div>

      {/* Scenarios List */}
      <div className="space-y-3">
        {filteredScenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            isSelected={selectedIds.has(scenario.id)}
            isCurrent={scenario.id === currentScenarioId}
            onSelect={() => toggleSelection(scenario.id)}
            onLoad={() => onLoadScenario(scenario)}
            onDelete={() => handleDelete(scenario.id)}
            onClone={() => handleClone(scenario.id)}
          />
        ))}
      </div>

      {filteredScenarios.length === 0 && scenarios.length > 0 && (
        <div className="text-center text-gray-500 py-8">
          No scenarios match your filters.
        </div>
      )}

      {/* Scenario Comparison Modal */}
      {isComparing && selectedIds.size >= 2 && (
        <ScenarioComparison
          scenarios={scenarios.filter((s) => selectedIds.has(s.id))}
          onClose={() => setIsComparing(false)}
          onLoadScenario={(scenario) => {
            onLoadScenario(scenario)
            setIsComparing(false)
          }}
        />
      )}
    </div>
  )
}

/**
 * Individual Scenario Card Component
 */
interface ScenarioCardProps {
  scenario: SavedScenario
  isSelected: boolean
  isCurrent: boolean
  onSelect: () => void
  onLoad: () => void
  onDelete: () => void
  onClone: () => void
}

function ScenarioCard({
  scenario,
  isSelected,
  isCurrent,
  onSelect,
  onLoad,
  onDelete,
  onClone,
}: ScenarioCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const formattedDate = new Date(scenario.savedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const formattedTime = new Date(scenario.savedAt).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={`bg-white border rounded-lg p-4 ${
        isCurrent
          ? 'border-blue-500 ring-2 ring-blue-200'
          : isSelected
            ? 'border-blue-300 bg-blue-50'
            : 'border-gray-300'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="mt-1 w-4 h-4"
        />

        {/* Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">
                {scenario.name}
                {isCurrent && (
                  <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                    Current
                  </span>
                )}
              </h4>
              {scenario.description && (
                <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
              )}
            </div>

            {/* UC Amount */}
            <div className="text-right ml-4">
              <div className="text-xl font-bold text-blue-700">
                {formatCurrency(scenario.results.calculation.finalAmount)}
              </div>
              <div className="text-xs text-gray-500">per month</div>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span>Tax Year: {scenario.taxYear.replace('_', '/')}</span>
            <span>•</span>
            <span>
              Saved: {formattedDate} at {formattedTime}
            </span>
            {scenario.tags && scenario.tags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex gap-1">
                  {scenario.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-gray-100 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={onLoad}
              className="text-sm px-3 py-1 min-h-[32px] bg-green-700 text-white hover:bg-green-800"
            >
              Load
            </Button>
            <Button
              onClick={onClone}
              className="text-sm px-3 py-1 min-h-[32px] bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Clone
            </Button>
            <Button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm px-3 py-1 min-h-[32px] bg-blue-100 text-blue-700 hover:bg-blue-200"
            >
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
            <Button
              onClick={onDelete}
              className="text-sm px-3 py-1 min-h-[32px] bg-red-100 text-red-700 hover:bg-red-200 ml-auto"
            >
              Delete
            </Button>
          </div>

          {/* Expandable Details */}
          {showDetails && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Standard Allowance:</span>
                  <span className="ml-2 font-medium">
                    {formatCurrency(scenario.results.calculation.standardAllowance)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Housing Element:</span>
                  <span className="ml-2 font-medium">
                    {formatCurrency(scenario.results.calculation.housingElement)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Child Element:</span>
                  <span className="ml-2 font-medium">
                    {formatCurrency(scenario.results.calculation.childElement)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Childcare Element:</span>
                  <span className="ml-2 font-medium">
                    {formatCurrency(scenario.results.calculation.childcareElement)}
                  </span>
                </div>
                {scenario.results.calculation.carerElement > 0 && (
                  <div>
                    <span className="text-gray-600">Carer Element:</span>
                    <span className="ml-2 font-medium">
                      {formatCurrency(scenario.results.calculation.carerElement)}
                    </span>
                  </div>
                )}
                {scenario.results.calculation.lcwraElement > 0 && (
                  <div>
                    <span className="text-gray-600">LCWRA Element:</span>
                    <span className="ml-2 font-medium">
                      {formatCurrency(scenario.results.calculation.lcwraElement)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
