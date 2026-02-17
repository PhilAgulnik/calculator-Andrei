import { useMemo } from 'react'
import { formatCurrency } from '~/utils/functions'
import { Button } from '~/components/Button'
import type { SavedScenario, ComparisonField } from '../types/saved-scenarios'

interface ScenarioComparisonProps {
  scenarios: SavedScenario[]
  onClose: () => void
  onLoadScenario?: (scenario: SavedScenario) => void
}

export function ScenarioComparison({
  scenarios,
  onClose,
  onLoadScenario,
}: ScenarioComparisonProps) {
  // Define comparison fields
  const comparisonFields = useMemo<ComparisonField[]>(
    () => [
      // Household composition
      {
        key: 'household',
        label: 'Household',
        format: 'text',
        category: 'household',
        getValue: (s) => {
          const adults = s.formData.numberOfAdults || 1
          const children = s.formData.numberOfChildren || 0
          return `${adults} adult${adults !== 1 ? 's' : ''}, ${children} child${children !== 1 ? 'ren' : ''}`
        },
      },

      // Total UC Amount
      {
        key: 'totalUC',
        label: 'Total UC (monthly)',
        format: 'currency',
        category: 'total',
        getValue: (s) => s.results.calculation.finalAmount,
      },

      // Standard Allowance
      {
        key: 'standardAllowance',
        label: 'Standard Allowance',
        format: 'currency',
        category: 'benefits',
        getValue: (s) => s.results.calculation.standardAllowance,
      },

      // Housing Element
      {
        key: 'housingElement',
        label: 'Housing Element',
        format: 'currency',
        category: 'benefits',
        getValue: (s) => s.results.calculation.housingElement,
      },

      // Child Element
      {
        key: 'childElement',
        label: 'Child Element',
        format: 'currency',
        category: 'benefits',
        getValue: (s) => s.results.calculation.childElement,
      },

      // Childcare Element
      {
        key: 'childcareElement',
        label: 'Childcare Element',
        format: 'currency',
        category: 'benefits',
        getValue: (s) => s.results.calculation.childcareElement,
      },

      // Carer Element
      {
        key: 'carerElement',
        label: 'Carer Element',
        format: 'currency',
        category: 'benefits',
        getValue: (s) => s.results.calculation.carerElement,
      },

      // LCWRA Element
      {
        key: 'lcwraElement',
        label: 'LCWRA Element',
        format: 'currency',
        category: 'benefits',
        getValue: (s) => s.results.calculation.lcwraElement,
      },

      // Deductions
      {
        key: 'earningsReduction',
        label: 'Earnings Reduction',
        format: 'currency',
        category: 'deductions',
        getValue: (s) => s.results.calculation.earningsReduction,
      },

      {
        key: 'capitalDeduction',
        label: 'Capital Deduction',
        format: 'currency',
        category: 'deductions',
        getValue: (s) => s.results.calculation.capitalDeduction,
      },
    ],
    []
  )

  // Calculate which fields have differences
  const fieldDifferences = useMemo(() => {
    const diffs = new Map<string, boolean>()

    comparisonFields.forEach((field) => {
      const values = scenarios.map((s) => field.getValue(s))
      const firstValue = values[0]
      const hasDifference = values.some((v) => {
        if (typeof v === 'number' && typeof firstValue === 'number') {
          return Math.abs(v - firstValue) > 0.01 // Allow for floating point differences
        }
        return v !== firstValue
      })
      diffs.set(field.key, hasDifference)
    })

    return diffs
  }, [comparisonFields, scenarios])

  // Format value based on format type
  const formatValue = (value: any, format: ComparisonField['format']): string => {
    if (value === null || value === undefined) return '-'

    switch (format) {
      case 'currency':
        return formatCurrency(value)
      case 'number':
        return value.toFixed(2)
      case 'boolean':
        return value ? 'Yes' : 'No'
      case 'date':
        return new Date(value).toLocaleDateString('en-GB')
      default:
        return String(value)
    }
  }

  // Get highlight color for value differences
  const getHighlightClass = (field: ComparisonField, value: any, allValues: any[]) => {
    if (!fieldDifferences.get(field.key)) return ''
    if (field.format !== 'currency' && field.format !== 'number') return ''

    const numValue = typeof value === 'number' ? value : 0
    const numValues = allValues.filter((v) => typeof v === 'number') as number[]
    const maxValue = Math.max(...numValues)
    const minValue = Math.min(...numValues)

    if (numValue === maxValue && numValue !== minValue) {
      return 'bg-green-50 border-l-4 border-green-500'
    }
    if (numValue === minValue && numValue !== maxValue) {
      return 'bg-red-50 border-l-4 border-red-500'
    }

    return ''
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-300 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Scenario Comparison</h2>
            <p className="text-sm text-gray-600 mt-1">
              Comparing {scenarios.length} scenarios side-by-side
            </p>
          </div>
          <Button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Close
          </Button>
        </div>

        {/* Comparison Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700 sticky left-0 bg-gray-100 z-10">
                    Field
                  </th>
                  {scenarios.map((scenario) => (
                    <th
                      key={scenario.id}
                      className="border border-gray-300 p-3 text-center font-semibold text-gray-700 min-w-[200px]"
                    >
                      <div className="space-y-2">
                        <div className="font-bold text-base">{scenario.name}</div>
                        {scenario.description && (
                          <div className="text-xs text-gray-500 font-normal">
                            {scenario.description}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 font-normal">
                          Saved: {new Date(scenario.savedAt).toLocaleDateString('en-GB')}
                        </div>
                        {onLoadScenario && (
                          <Button
                            onClick={() => onLoadScenario(scenario)}
                            className="text-xs px-2 py-1 bg-blue-600 text-white hover:bg-blue-700 w-full"
                          >
                            Load
                          </Button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFields.map((field) => {
                  const values = scenarios.map((s) => field.getValue(s))
                  const hasDifference = fieldDifferences.get(field.key)

                  return (
                    <tr key={field.key} className={hasDifference ? 'bg-yellow-50' : ''}>
                      <td className="border border-gray-300 p-3 font-medium text-gray-700 sticky left-0 bg-white z-10">
                        {field.label}
                        {hasDifference && (
                          <span className="ml-2 text-yellow-600 text-xs">⚠️ Differs</span>
                        )}
                      </td>
                      {values.map((value, idx) => (
                        <td
                          key={idx}
                          className={`border border-gray-300 p-3 text-center ${getHighlightClass(field, value, values)}`}
                        >
                          <span
                            className={
                              field.format === 'currency' || field.format === 'number'
                                ? 'font-mono font-medium'
                                : ''
                            }
                          >
                            {formatValue(value, field.format)}
                          </span>
                        </td>
                      ))}
                    </tr>
                  )
                })}

                {/* Summary Row */}
                <tr className="bg-blue-50 font-bold">
                  <td className="border border-gray-300 p-3 sticky left-0 bg-blue-50 z-10">
                    Total UC (monthly)
                  </td>
                  {scenarios.map((scenario, idx) => (
                    <td key={idx} className="border border-gray-300 p-3 text-center">
                      <span className="text-xl font-mono text-blue-700">
                        {formatCurrency(scenario.results.calculation.finalAmount)}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Difference from first scenario */}
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-medium sticky left-0 bg-gray-50 z-10">
                    Difference from &quot;{scenarios[0].name}&quot;
                  </td>
                  {scenarios.map((scenario, idx) => {
                    const diff = scenario.results.calculation.finalAmount - scenarios[0].results.calculation.finalAmount
                    return (
                      <td key={idx} className="border border-gray-300 p-3 text-center">
                        {idx === 0 ? (
                          <span className="text-gray-500 text-sm">-</span>
                        ) : (
                          <span
                            className={`font-mono font-medium ${
                              diff > 0
                                ? 'text-green-600'
                                : diff < 0
                                  ? 'text-red-600'
                                  : 'text-gray-600'
                            }`}
                          >
                            {diff > 0 ? '+' : ''}
                            {formatCurrency(Math.abs(diff))}
                          </span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Legend:</h3>
            <div className="flex flex-wrap gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-50 border-l-4 border-green-500"></div>
                <span>Highest value</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-50 border-l-4 border-red-500"></div>
                <span>Lowest value</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-50 border border-gray-300"></div>
                <span>Field has differences</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
