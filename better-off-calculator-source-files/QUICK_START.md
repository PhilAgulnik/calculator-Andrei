# Saved Scenarios - Quick Start Guide

This is a rapid-reference guide for implementing the Saved Scenarios feature. For detailed information, see the other documentation files.

## 🎯 30-Second Overview

The Saved Scenarios feature lets users:
- Save calculation results with a name
- View list of all saved scenarios
- Load previous calculations
- Delete unwanted scenarios
- Compare multiple scenarios side-by-side (to be implemented)

**Critical Bug:** Data structure mismatch between save and display - MUST FIX first!

## 🚨 Critical Issues to Fix First

```typescript
// ❌ WRONG - Current implementation saves this:
{
  timestamp: "2025-...",  // Wrong field name!
  calculation: results    // Wrong nesting!
}

// ✅ RIGHT - Should save this:
{
  savedAt: "2025-...",
  taxYear: "2025_26",
  results: results  // Correct nesting
}
```

## 🏗️ Quick Implementation Steps

### 1. Create Types (5 minutes)
```typescript
// src/types/scenarios.ts
export interface SavedScenario {
  id: number;
  name: string;
  description?: string;
  taxYear: string;
  savedAt: string;
  formData: FormData;
  results: CalculationResults;
}
```

### 2. Create Storage Service (10 minutes)
```typescript
// src/services/scenarioStorage.ts
const STORAGE_KEY = 'ucSavedScenarios';

export class ScenarioStorage {
  static getAll(): SavedScenario[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static save(scenarios: SavedScenario[]): boolean {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
    return true;
  }

  static add(scenario: SavedScenario): boolean {
    const scenarios = this.getAll();
    scenarios.push(scenario);
    return this.save(scenarios);
  }

  static delete(id: number): boolean {
    const scenarios = this.getAll().filter(s => s.id !== id);
    return this.save(scenarios);
  }
}
```

### 3. Create Hook (15 minutes)
```typescript
// src/hooks/useScenarios.ts
import { useState, useEffect } from 'react';
import { ScenarioStorage } from '../services/scenarioStorage';

export const useScenarios = () => {
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);

  useEffect(() => {
    setScenarios(ScenarioStorage.getAll());
  }, []);

  const saveScenario = (scenario: SavedScenario) => {
    ScenarioStorage.add(scenario);
    setScenarios(ScenarioStorage.getAll());
  };

  const deleteScenario = (id: number) => {
    ScenarioStorage.delete(id);
    setScenarios(ScenarioStorage.getAll());
  };

  return { scenarios, saveScenario, deleteScenario };
};
```

### 4. Update CalculatorPage (10 minutes)
```typescript
import { useScenarios } from '../../hooks/useScenarios';

function CalculatorPage() {
  const { scenarios, saveScenario, deleteScenario } = useScenarios();

  const handleSaveScenario = () => {
    if (!results?.calculation) return;

    saveScenario({
      id: Date.now(),
      name: `Scenario ${scenarios.length + 1}`,
      taxYear: formData.taxYear,
      savedAt: new Date().toISOString(),
      formData: { ...formData },
      results: { ...results }
    });
  };

  const handleLoadScenario = (scenario: SavedScenario) => {
    setFormData(scenario.formData);
    setResults(scenario.results);
    setShowResults(true);
  };

  return (
    <>
      {/* Pass to ResultsSection */}
      <ResultsSection onSave={handleSaveScenario} />

      {/* Render scenarios */}
      <SavedScenarios
        scenarios={scenarios}
        onLoadScenario={handleLoadScenario}
        onDeleteScenario={deleteScenario}
      />
    </>
  );
}
```

### 5. Create SavedScenarios Component (20 minutes)
```typescript
// src/components/scenarios/SavedScenarios.tsx
import React from 'react';
import { SavedScenario } from '../../types/scenarios';

interface Props {
  scenarios: SavedScenario[];
  onLoadScenario: (scenario: SavedScenario) => void;
  onDeleteScenario: (id: number) => void;
}

const SavedScenarios: React.FC<Props> = ({
  scenarios,
  onLoadScenario,
  onDeleteScenario
}) => {
  if (scenarios.length === 0) {
    return (
      <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-300 p-8">
        <h2 className="text-2xl font-bold mb-4">Saved Scenarios</h2>
        <p className="text-center text-gray-500 italic py-8">
          No saved scenarios yet. Save your first calculation to compare different scenarios.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-300 p-8">
      <h2 className="text-2xl font-bold mb-6">Saved Scenarios</h2>

      <div className="space-y-4">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className="border border-gray-300 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold mb-2">{scenario.name}</h4>
                <p className="text-sm text-gray-600">
                  Tax Year: {scenario.taxYear.replace('_', '/')}
                </p>
                <p className="text-sm text-gray-600">
                  Saved: {new Date(scenario.savedAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Amount: <span className="font-semibold">
                    £{scenario.results.calculation.finalAmount.toFixed(2)}/month
                  </span>
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onLoadScenario(scenario)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Load
                </button>
                <button
                  onClick={() => onDeleteScenario(scenario.id)}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedScenarios;
```

## 📋 Tailwind Class Reference

```typescript
// Layout
mt-12              // margin-top: 3rem
p-8               // padding: 2rem
space-y-4         // gap between children: 1rem

// Colors & Backgrounds
bg-white          // white background
bg-blue-600       // primary button
bg-red-50         // delete hover

// Borders & Shadows
rounded-lg        // border-radius: 0.5rem
shadow-sm         // small shadow
border            // 1px border
border-gray-300   // gray border

// Typography
text-2xl          // font-size: 1.5rem
font-bold         // font-weight: 700
text-gray-600     // gray text

// Interactions
hover:bg-blue-700 // darker on hover
transition-shadow // smooth shadow transition
cursor-pointer    // pointer cursor
```

## 🎨 Component Structure

```
CalculatorPage (manages state)
├── CalculatorForm (input)
├── ResultsSection (displays results + save button)
└── SavedScenarios (displays list)
    └── ScenarioCard × N (individual scenario)
```

## 🔄 Data Flow

```
User calculates → Results shown → User clicks "Save"
    ↓
handleSaveScenario creates SavedScenario object
    ↓
useScenarios.saveScenario updates state & localStorage
    ↓
SavedScenarios component re-renders with new scenario
    ↓
User clicks "Load" on a scenario
    ↓
handleLoadScenario restores formData & results
    ↓
Calculator shows previous calculation
```

## ⚡ Quick Wins

### Add Custom Name Dialog
```typescript
const [showSaveDialog, setShowSaveDialog] = useState(false);
const [scenarioName, setScenarioName] = useState('');

// Button in ResultsSection
<button onClick={() => setShowSaveDialog(true)}>Save Scenario</button>

// Dialog
{showSaveDialog && (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg">
      <input
        value={scenarioName}
        onChange={(e) => setScenarioName(e.target.value)}
        placeholder="Scenario name"
        className="border p-2 rounded w-full mb-4"
      />
      <button onClick={() => {
        handleSaveScenario(scenarioName);
        setShowSaveDialog(false);
      }}>
        Save
      </button>
    </div>
  </div>
)}
```

### Add Edit Functionality
```typescript
const [editingId, setEditingId] = useState<number | null>(null);

const handleUpdateScenario = (id: number, name: string) => {
  const scenarios = ScenarioStorage.getAll();
  const index = scenarios.findIndex(s => s.id === id);
  scenarios[index].name = name;
  ScenarioStorage.save(scenarios);
  setScenarios(scenarios);
};
```

### Add Comparison
```typescript
const [selectedIds, setSelectedIds] = useState<number[]>([]);

// In ScenarioCard
<input
  type="checkbox"
  checked={selectedIds.includes(scenario.id)}
  onChange={(e) => {
    if (e.target.checked) {
      setSelectedIds([...selectedIds, scenario.id]);
    } else {
      setSelectedIds(selectedIds.filter(id => id !== scenario.id));
    }
  }}
/>

// Compare button
{selectedIds.length >= 2 && (
  <button onClick={() => setShowComparison(true)}>
    Compare Selected ({selectedIds.length})
  </button>
)}
```

## 🐛 Common Pitfalls

1. **Don't access `scenario.calculation.calculation.finalAmount`**
   - Use: `scenario.results.calculation.finalAmount`

2. **Don't forget to spread formData when saving**
   - Use: `formData: { ...formData }` not `formData: formData`

3. **Don't save before checking results exist**
   - Always: `if (!results?.calculation) return;`

4. **Don't mutate state directly**
   - Use: `setScenarios([...scenarios, newScenario])`
   - Not: `scenarios.push(newScenario)`

5. **Don't forget to update localStorage**
   - After every change, call `ScenarioStorage.save()`

## 🎯 Testing Checklist

- [ ] Save scenario - appears in list
- [ ] Load scenario - restores form correctly
- [ ] Delete scenario - removes from list
- [ ] Page refresh - scenarios persist
- [ ] Multiple scenarios - all work independently
- [ ] Empty state - shows helpful message

## 📚 File Reference

- **ANALYSIS.md** - Detailed feature analysis
- **MIGRATION_GUIDE.md** - Complete implementation guide
- **SavedScenarios.js** - Original component code
- **MIF-comparison-table-example.js** - Comparison table pattern

## 🚀 Next Steps After Basic Implementation

1. Add custom naming dialog
2. Add description field
3. Add edit functionality
4. Build comparison view
5. Add export/import
6. Add search/filter
7. Add tags/categories

## ⏱️ Time Estimates

- **Basic (save/load/delete):** 1 hour
- **With custom naming:** +30 minutes
- **With edit functionality:** +30 minutes
- **With comparison view:** +2 hours
- **With all enhancements:** +4 hours

---

**Need help?** Check the detailed documentation files in this directory.
