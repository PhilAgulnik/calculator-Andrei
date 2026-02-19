# Saved Scenarios Migration Guide
## From better-off-calculator-test to calculator-Andrei (TypeScript + Tailwind)

## Table of Contents
1. [Critical Issues to Fix](#critical-issues-to-fix)
2. [TypeScript Conversion](#typescript-conversion)
3. [Tailwind CSS Conversion](#tailwind-css-conversion)
4. [Architecture Improvements](#architecture-improvements)
5. [Feature Enhancements](#feature-enhancements)
6. [Implementation Steps](#implementation-steps)

---

## Critical Issues to Fix

### 1. Data Structure Mismatch (MUST FIX)
**Problem**: SavedScenarios.js expects different structure than CalculatorPage.js saves

**Current Save Format** (CalculatorPage.js):
```javascript
{
  id: Date.now(),
  name: "Scenario 1",
  input: { ...formData },
  calculation: results,        // Direct reference
  timestamp: new Date().toISOString()
}
```

**Expected Display Format** (SavedScenarios.js):
```javascript
{
  id: number,
  name: string,
  taxYear: string,             // Missing!
  savedAt: string,             // Named differently
  calculation: {
    calculation: {             // Nested differently!
      finalAmount: number
    }
  }
}
```

**Solution**: Standardize on this structure:
```typescript
interface SavedScenario {
  id: number;
  name: string;
  description?: string;
  taxYear: string;
  savedAt: string;
  formData: FormData;
  results: CalculationResults;
  tags?: string[];
}
```

**Update Save Function**:
```typescript
const handleSaveScenario = (name?: string, description?: string) => {
  if (!results?.calculation) return;

  const scenario: SavedScenario = {
    id: Date.now(),
    name: name || `Scenario ${savedScenarios.length + 1}`,
    description: description || undefined,
    taxYear: formData.taxYear,
    savedAt: new Date().toISOString(),
    formData: { ...formData },
    results: { ...results },
    tags: []
  };

  const updated = [...savedScenarios, scenario];
  setSavedScenarios(updated);
  localStorage.setItem('ucSavedScenarios', JSON.stringify(updated));
};
```

**Update Display**:
```typescript
<p>Amount: £{scenario.results.calculation.finalAmount.toFixed(2)}/month</p>
```

### 2. SavedScenarios Component Not Used
**Problem**: CalculatorPage.js renders scenarios inline, SavedScenarios.js is unused

**Solution**: Actually use the SavedScenarios component
```typescript
// In CalculatorPage.tsx
{!pensionWarningType && savedScenarios.length > 0 && (
  <SavedScenarios
    scenarios={savedScenarios}
    onLoadScenario={handleLoadScenario}
    onDeleteScenario={handleDeleteScenario}
    onCompare={handleCompareScenarios}  // New feature
  />
)}
```

---

## TypeScript Conversion

### Step 1: Define Core Interfaces

Create `src/types/scenarios.ts`:
```typescript
export interface SavedScenario {
  id: number;
  name: string;
  description?: string;
  taxYear: string;
  savedAt: string;
  formData: FormData;
  results: CalculationResults;
  tags?: string[];
}

export interface ScenarioListProps {
  scenarios: SavedScenario[];
  onLoadScenario: (scenario: SavedScenario) => void;
  onDeleteScenario: (id: number) => void;
  onEditScenario?: (id: number, updates: Partial<SavedScenario>) => void;
  onCompare?: (scenarioIds: number[]) => void;
}

export interface ScenarioCardProps {
  scenario: SavedScenario;
  onLoad: (scenario: SavedScenario) => void;
  onDelete: (id: number) => void;
  onEdit?: (id: number, updates: Partial<SavedScenario>) => void;
  isSelected?: boolean;
  onSelect?: (id: number, selected: boolean) => void;
}
```

### Step 2: Create Storage Service

Create `src/services/scenarioStorage.ts`:
```typescript
import { SavedScenario } from '../types/scenarios';

const STORAGE_KEY = 'ucSavedScenarios';

export class ScenarioStorage {
  static getAll(): SavedScenario[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading scenarios:', error);
      return [];
    }
  }

  static save(scenarios: SavedScenario[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
      return true;
    } catch (error) {
      console.error('Error saving scenarios:', error);
      return false;
    }
  }

  static add(scenario: SavedScenario): boolean {
    const scenarios = this.getAll();
    scenarios.push(scenario);
    return this.save(scenarios);
  }

  static update(id: number, updates: Partial<SavedScenario>): boolean {
    const scenarios = this.getAll();
    const index = scenarios.findIndex(s => s.id === id);
    if (index === -1) return false;

    scenarios[index] = { ...scenarios[index], ...updates };
    return this.save(scenarios);
  }

  static delete(id: number): boolean {
    const scenarios = this.getAll().filter(s => s.id !== id);
    return this.save(scenarios);
  }

  static get(id: number): SavedScenario | null {
    return this.getAll().find(s => s.id === id) || null;
  }

  static clear(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing scenarios:', error);
      return false;
    }
  }
}
```

### Step 3: Convert SavedScenarios Component

Create `src/components/scenarios/SavedScenarios.tsx`:
```typescript
import React from 'react';
import { SavedScenario } from '../../types/scenarios';
import ScenarioCard from './ScenarioCard';

interface SavedScenariosProps {
  scenarios: SavedScenario[];
  onLoadScenario: (scenario: SavedScenario) => void;
  onDeleteScenario: (id: number) => void;
  onEditScenario?: (id: number, updates: Partial<SavedScenario>) => void;
  onCompare?: (scenarioIds: number[]) => void;
}

const SavedScenarios: React.FC<SavedScenariosProps> = ({
  scenarios,
  onLoadScenario,
  onDeleteScenario,
  onEditScenario,
  onCompare
}) => {
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);

  if (scenarios.length === 0) {
    return (
      <section className="mt-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8">
          <h2 className="text-2xl font-bold mb-4">Saved Scenarios</h2>
          <div className="min-h-[100px]">
            <p className="text-center text-gray-500 italic py-8">
              No saved scenarios yet. Save your first calculation to compare different scenarios.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const handleSelectScenario = (id: number, selected: boolean) => {
    setSelectedIds(prev =>
      selected ? [...prev, id] : prev.filter(i => i !== id)
    );
  };

  const handleCompare = () => {
    if (onCompare && selectedIds.length >= 2) {
      onCompare(selectedIds);
    }
  };

  return (
    <section className="mt-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Saved Scenarios</h2>
          {onCompare && selectedIds.length >= 2 && (
            <button
              onClick={handleCompare}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Compare Selected ({selectedIds.length})
            </button>
          )}
        </div>

        <div className="space-y-4">
          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onLoad={onLoadScenario}
              onDelete={onDeleteScenario}
              onEdit={onEditScenario}
              isSelected={selectedIds.includes(scenario.id)}
              onSelect={onCompare ? handleSelectScenario : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SavedScenarios;
```

---

## Tailwind CSS Conversion

### Original CSS Classes → Tailwind Mapping

```css
/* Original */
.saved-scenarios { margin-top: var(--spacing-12); }
/* Tailwind */
mt-12

/* Original */
.card {
  background: var(--white);
  border-radius: 0;
  padding: var(--spacing-8);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #b1b4b6;
}
/* Tailwind */
bg-white rounded-none p-8 shadow-sm border border-gray-300

/* Original */
.btn-primary {
  background: var(--primary-color);
  color: var(--white);
  border: none;
  padding: var(--spacing-2) var(--spacing-4);
  cursor: pointer;
}
/* Tailwind */
bg-blue-600 text-white border-0 px-4 py-2 cursor-pointer hover:bg-blue-700

/* Original */
.btn-outline {
  background: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}
/* Tailwind */
bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50

/* Original */
.no-scenarios {
  text-align: center;
  color: var(--gray-500);
  font-style: italic;
  padding: var(--spacing-8);
}
/* Tailwind */
text-center text-gray-500 italic py-8
```

### Scenario Card Component with Tailwind

Create `src/components/scenarios/ScenarioCard.tsx`:
```typescript
import React, { useState } from 'react';
import { SavedScenario } from '../../types/scenarios';
import { formatCurrency } from '../../utils/formatters';

interface ScenarioCardProps {
  scenario: SavedScenario;
  onLoad: (scenario: SavedScenario) => void;
  onDelete: (id: number) => void;
  onEdit?: (id: number, updates: Partial<SavedScenario>) => void;
  isSelected?: boolean;
  onSelect?: (id: number, selected: boolean) => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  onLoad,
  onDelete,
  onEdit,
  isSelected = false,
  onSelect
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(scenario.name);
  const [editDescription, setEditDescription] = useState(scenario.description || '');

  const handleSaveEdit = () => {
    if (onEdit) {
      onEdit(scenario.id, {
        name: editName,
        description: editDescription || undefined
      });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(scenario.name);
    setEditDescription(scenario.description || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Scenario name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add notes about this scenario..."
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        bg-white border rounded-lg p-6 shadow-sm transition-all
        ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}
        hover:shadow-md
      `}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Selection Checkbox */}
        {onSelect && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(scenario.id, e.target.checked)}
            className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        )}

        {/* Scenario Info */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            {scenario.name}
          </h4>
          {scenario.description && (
            <p className="text-sm text-gray-600 mb-3">
              {scenario.description}
            </p>
          )}
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <span className="font-medium">Tax Year:</span>{' '}
              {scenario.taxYear.replace('_', '/')}
            </p>
            <p>
              <span className="font-medium">Saved:</span>{' '}
              {new Date(scenario.savedAt).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Amount:</span>{' '}
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(scenario.results.calculation.finalAmount)}/month
              </span>
            </p>
          </div>
          {scenario.tags && scenario.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {scenario.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onLoad(scenario)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Load
          </button>
          {onEdit && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
            >
              Edit
            </button>
          )}
          <button
            onClick={() => {
              if (confirm(`Delete scenario "${scenario.name}"?`)) {
                onDelete(scenario.id);
              }
            }}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioCard;
```

---

## Architecture Improvements

### 1. Custom Hook for Scenario Management

Create `src/hooks/useScenarios.ts`:
```typescript
import { useState, useEffect, useCallback } from 'react';
import { SavedScenario } from '../types/scenarios';
import { ScenarioStorage } from '../services/scenarioStorage';

export const useScenarios = () => {
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load scenarios on mount
  useEffect(() => {
    try {
      const loaded = ScenarioStorage.getAll();
      setScenarios(loaded);
      setError(null);
    } catch (err) {
      setError('Failed to load scenarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveScenario = useCallback((scenario: SavedScenario) => {
    try {
      const success = ScenarioStorage.add(scenario);
      if (success) {
        setScenarios(prev => [...prev, scenario]);
        setError(null);
        return true;
      }
      setError('Failed to save scenario');
      return false;
    } catch (err) {
      setError('Failed to save scenario');
      console.error(err);
      return false;
    }
  }, []);

  const updateScenario = useCallback((id: number, updates: Partial<SavedScenario>) => {
    try {
      const success = ScenarioStorage.update(id, updates);
      if (success) {
        setScenarios(prev =>
          prev.map(s => s.id === id ? { ...s, ...updates } : s)
        );
        setError(null);
        return true;
      }
      setError('Failed to update scenario');
      return false;
    } catch (err) {
      setError('Failed to update scenario');
      console.error(err);
      return false;
    }
  }, []);

  const deleteScenario = useCallback((id: number) => {
    try {
      const success = ScenarioStorage.delete(id);
      if (success) {
        setScenarios(prev => prev.filter(s => s.id !== id));
        setError(null);
        return true;
      }
      setError('Failed to delete scenario');
      return false;
    } catch (err) {
      setError('Failed to delete scenario');
      console.error(err);
      return false;
    }
  }, []);

  const clearAllScenarios = useCallback(() => {
    try {
      const success = ScenarioStorage.clear();
      if (success) {
        setScenarios([]);
        setError(null);
        return true;
      }
      setError('Failed to clear scenarios');
      return false;
    } catch (err) {
      setError('Failed to clear scenarios');
      console.error(err);
      return false;
    }
  }, []);

  const getScenario = useCallback((id: number) => {
    return scenarios.find(s => s.id === id) || null;
  }, [scenarios]);

  return {
    scenarios,
    loading,
    error,
    saveScenario,
    updateScenario,
    deleteScenario,
    clearAllScenarios,
    getScenario
  };
};
```

### 2. Usage in CalculatorPage

```typescript
import { useScenarios } from '../../hooks/useScenarios';

function CalculatorPage() {
  const {
    scenarios,
    loading: scenariosLoading,
    error: scenariosError,
    saveScenario,
    updateScenario,
    deleteScenario
  } = useScenarios();

  const handleSaveScenario = async (name?: string, description?: string) => {
    if (!results?.calculation) return;

    const scenario: SavedScenario = {
      id: Date.now(),
      name: name || `Scenario ${scenarios.length + 1}`,
      description: description || undefined,
      taxYear: formData.taxYear,
      savedAt: new Date().toISOString(),
      formData: { ...formData },
      results: { ...results }
    };

    const success = saveScenario(scenario);
    if (success) {
      // Show success notification
      toast.success('Scenario saved successfully');
    } else {
      // Show error notification
      toast.error('Failed to save scenario');
    }
  };

  // ... rest of component
}
```

---

## Feature Enhancements

### 1. Save Dialog with Custom Name

Create `src/components/scenarios/SaveScenarioDialog.tsx`:
```typescript
import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';

interface SaveScenarioDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description?: string) => void;
  defaultName: string;
}

const SaveScenarioDialog: React.FC<SaveScenarioDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultName
}) => {
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), description.trim() || undefined);
      setName(defaultName);
      setDescription('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-lg p-6 shadow-xl">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Save Scenario
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scenario Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Current situation"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add notes about this scenario..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default SaveScenarioDialog;
```

### 2. Scenario Comparison View

Create `src/components/scenarios/ScenarioComparison.tsx`:
```typescript
import React from 'react';
import { SavedScenario } from '../../types/scenarios';
import { formatCurrency } from '../../utils/formatters';

interface ScenarioComparisonProps {
  scenarios: SavedScenario[];
  baselineId?: number;
}

const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({
  scenarios,
  baselineId
}) => {
  if (scenarios.length < 2) {
    return (
      <div className="text-center py-8 text-gray-500">
        Select at least 2 scenarios to compare
      </div>
    );
  }

  const baseline = scenarios.find(s => s.id === baselineId) || scenarios[0];
  const others = scenarios.filter(s => s.id !== baseline.id);

  const rows = [
    {
      label: 'Standard Allowance',
      getValue: (s: SavedScenario) => s.results.calculation.standardAllowance
    },
    {
      label: 'Housing Element',
      getValue: (s: SavedScenario) => s.results.calculation.housingElement
    },
    {
      label: 'Child Element',
      getValue: (s: SavedScenario) => s.results.calculation.childElement
    },
    {
      label: 'Childcare Element',
      getValue: (s: SavedScenario) => s.results.calculation.childcareElement
    },
    {
      label: 'Total Elements',
      getValue: (s: SavedScenario) => s.results.calculation.totalElements,
      isTotal: true
    },
    {
      label: 'Earnings Reduction',
      getValue: (s: SavedScenario) => s.results.calculation.earningsReduction,
      isDeduction: true
    },
    {
      label: 'Final Amount',
      getValue: (s: SavedScenario) => s.results.calculation.finalAmount,
      isFinal: true
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8 overflow-x-auto">
      <h3 className="text-xl font-bold mb-6">Scenario Comparison</h3>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left py-3 px-4 font-semibold">Metric</th>
            <th className="text-right py-3 px-4 font-semibold bg-blue-50">
              {baseline.name}
              <div className="text-xs font-normal text-gray-600">Baseline</div>
            </th>
            {others.map(scenario => (
              <th key={scenario.id} className="text-right py-3 px-4 font-semibold">
                {scenario.name}
              </th>
            ))}
            {others.map(scenario => (
              <th key={`diff-${scenario.id}`} className="text-right py-3 px-4 font-semibold text-gray-600">
                Difference
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const baseValue = row.getValue(baseline);

            return (
              <tr
                key={index}
                className={`
                  border-b border-gray-200
                  ${row.isTotal ? 'bg-gray-50 font-semibold' : ''}
                  ${row.isFinal ? 'bg-blue-50 font-bold' : ''}
                `}
              >
                <td className="py-3 px-4">{row.label}</td>
                <td className="py-3 px-4 text-right bg-blue-50">
                  {row.isDeduction && baseValue > 0 ? '-' : ''}
                  {formatCurrency(baseValue)}
                </td>
                {others.map(scenario => {
                  const value = row.getValue(scenario);
                  return (
                    <td key={scenario.id} className="py-3 px-4 text-right">
                      {row.isDeduction && value > 0 ? '-' : ''}
                      {formatCurrency(value)}
                    </td>
                  );
                })}
                {others.map(scenario => {
                  const value = row.getValue(scenario);
                  const diff = row.isDeduction
                    ? baseValue - value
                    : value - baseValue;
                  const isPositive = diff >= 0;

                  return (
                    <td
                      key={`diff-${scenario.id}`}
                      className={`
                        py-3 px-4 text-right font-medium
                        ${isPositive ? 'text-green-600' : 'text-red-600'}
                      `}
                    >
                      {isPositive ? '+' : ''}
                      {formatCurrency(diff)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ScenarioComparison;
```

---

## Implementation Steps

### Phase 1: Foundation (Critical)
1. ✅ Create TypeScript interfaces in `src/types/scenarios.ts`
2. ✅ Create `ScenarioStorage` service in `src/services/scenarioStorage.ts`
3. ✅ Fix data structure mismatch in save/load functions
4. ✅ Create `useScenarios` hook
5. ✅ Test storage CRUD operations

### Phase 2: Basic UI (Essential)
1. ✅ Convert SavedScenarios to TypeScript
2. ✅ Apply Tailwind CSS classes
3. ✅ Create ScenarioCard component
4. ✅ Add edit scenario functionality
5. ✅ Test load/delete operations

### Phase 3: Enhanced Save (Important)
1. ✅ Create SaveScenarioDialog component
2. ✅ Add custom naming on save
3. ✅ Add description field
4. ✅ Show save confirmation/toast
5. ✅ Handle save errors gracefully

### Phase 4: Comparison (Nice-to-have)
1. ✅ Create ScenarioComparison component
2. ✅ Add multi-select in SavedScenarios
3. ✅ Implement comparison view
4. ✅ Add baseline selection
5. ✅ Show difference calculations

### Phase 5: Polish (Optional)
1. Add tags/categories
2. Add search/filter
3. Add sorting options
4. Add export/import JSON
5. Add scenario history/versioning
6. Add duplicate scenario
7. Add bulk operations

---

## Testing Checklist

### Unit Tests
- [ ] ScenarioStorage.getAll()
- [ ] ScenarioStorage.save()
- [ ] ScenarioStorage.add()
- [ ] ScenarioStorage.update()
- [ ] ScenarioStorage.delete()
- [ ] useScenarios hook operations

### Integration Tests
- [ ] Save scenario flow
- [ ] Load scenario restores form
- [ ] Delete removes from list
- [ ] Edit updates scenario
- [ ] Comparison shows correct data

### E2E Tests
- [ ] Complete calculation → Save → Load workflow
- [ ] Create multiple scenarios and compare
- [ ] Edit scenario name and description
- [ ] Delete scenario with confirmation

---

## Migration Checklist

- [ ] Create types file
- [ ] Create storage service
- [ ] Create useScenarios hook
- [ ] Convert SavedScenarios to TSX + Tailwind
- [ ] Create ScenarioCard component
- [ ] Create SaveScenarioDialog component
- [ ] Update CalculatorPage to use new components
- [ ] Update ResultsSection save button
- [ ] Add comparison feature
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Update documentation

---

## Notes

- Always validate data when loading from localStorage
- Consider migration path for existing saved scenarios
- Add version field for future data structure changes
- Consider max scenarios limit (localStorage size)
- Add export/import for backup and sharing
- Consider IndexedDB for larger scenario storage
