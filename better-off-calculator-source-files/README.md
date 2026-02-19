# Saved Scenarios Feature - Source Files & Analysis

This directory contains the complete source code and analysis of the Saved Scenarios feature from the `better-off-calculator-test` repository, prepared for migration to the TypeScript/Tailwind `calculator-Andrei` project.

## 📁 Files in This Directory

### Source Code
- **`SavedScenarios.js`** - React component for displaying saved scenarios
- **`benefitDataService.js`** - LocalStorage service for benefit data (note: not actually used for scenarios)
- **`scenario-styles.css`** - CSS classes used for scenario styling

### Integration Examples
- **`CalculatorPage-scenario-integration.js`** - Shows how scenarios are integrated in main calculator
- **`ResultsSection-save-button.js`** - Shows save button implementation
- **`MIF-comparison-table-example.js`** - Example comparison table pattern from MIF feature

### Documentation
- **`ANALYSIS.md`** - Comprehensive feature analysis including data structures, workflows, and limitations
- **`MIGRATION_GUIDE.md`** - Step-by-step migration guide with TypeScript/Tailwind implementations
- **`README.md`** - This file

## 🔍 Quick Summary

### What the Feature Does
- Saves calculation scenarios to localStorage
- Displays list of saved scenarios with key info
- Allows loading previously saved calculations
- Allows deleting unwanted scenarios
- Shows final UC amount for quick comparison

### What It DOESN'T Do (Yet)
- ❌ No side-by-side scenario comparison
- ❌ No custom naming (auto-generated only)
- ❌ No descriptions/notes
- ❌ No import functionality
- ❌ No tags or categories
- ❌ No search/filter

## 🚨 Critical Issues Found

### 1. Data Structure Mismatch
The `SavedScenarios.js` component expects a different data structure than what `CalculatorPage.js` actually saves:

**Saved:**
```javascript
{
  id: Date.now(),
  name: "Scenario 1",
  input: {...formData},
  calculation: results,
  timestamp: "2025-..."
}
```

**Expected:**
```javascript
{
  id: number,
  name: string,
  taxYear: string,
  savedAt: string,
  calculation: {
    calculation: {
      finalAmount: number
    }
  }
}
```

### 2. Component Not Used
`SavedScenarios.js` exists but is NOT actually imported/used in `CalculatorPage.js`. Instead, scenarios are rendered inline with a simpler structure.

## 📊 Data Structure

### Scenario Object
```typescript
interface SavedScenario {
  id: number;              // Timestamp-based ID
  name: string;            // "Scenario 1", "Scenario 2", etc.
  taxYear: string;         // "2025_26"
  savedAt: string;         // ISO timestamp
  formData: FormData;      // Complete form state
  results: CalculationResults; // Complete calculation results
}
```

### Storage
- **Location:** `localStorage`
- **Key:** `ucSavedScenarios`
- **Format:** JSON array of scenarios

## 🎯 Migration Priorities

### Must-Have (Phase 1)
1. Fix data structure mismatch
2. Create TypeScript interfaces
3. Create proper storage service
4. Convert to Tailwind CSS
5. Make SavedScenarios component actually work

### Should-Have (Phase 2)
1. Custom scenario naming
2. Description/notes field
3. Edit scenario after creation
4. Save confirmation dialog
5. Better error handling

### Nice-to-Have (Phase 3)
1. Side-by-side comparison view
2. Import/export scenarios
3. Tags and categories
4. Search and filter
5. Sorting options

## 🛠️ Key Files to Reference

### For Data Structure
- `ANALYSIS.md` - Section: "Data Structure"
- `CalculatorPage-scenario-integration.js` - See save function

### For UI Components
- `SavedScenarios.js` - Component structure
- `scenario-styles.css` - Styling reference
- `ScenarioCard.tsx` in `MIGRATION_GUIDE.md` - Tailwind version

### For Comparison Feature
- `MIF-comparison-table-example.js` - Good pattern to follow
- `ScenarioComparison.tsx` in `MIGRATION_GUIDE.md` - Full implementation

## 📖 How to Use These Files

### 1. Understand Current Implementation
Read `ANALYSIS.md` for complete feature analysis including:
- Data structures
- Storage implementation
- UI/UX workflows
- Limitations and issues

### 2. Plan Migration
Read `MIGRATION_GUIDE.md` for:
- TypeScript conversion steps
- Tailwind CSS mapping
- Architecture improvements
- Feature enhancements
- Implementation phases

### 3. Reference Original Code
Check source files when you need to:
- See exact original implementation
- Understand integration points
- Copy specific logic
- Verify behavior

### 4. Follow Examples
Use integration examples to see:
- How components are connected
- Where scenarios are saved/loaded
- Button placement and handlers
- Comparison table patterns

## 🔗 Integration Points

### In CalculatorPage
```typescript
// 1. Import hooks and components
import { useScenarios } from '../../hooks/useScenarios';
import SavedScenarios from './SavedScenarios';

// 2. Use hook
const { scenarios, saveScenario, deleteScenario } = useScenarios();

// 3. Render component
<SavedScenarios
  scenarios={scenarios}
  onLoadScenario={handleLoadScenario}
  onDeleteScenario={deleteScenario}
/>
```

### In ResultsSection
```typescript
// Pass save handler as prop
<ResultsSection
  results={results}
  onSave={handleSaveScenario}
/>

// Button in ResultsSection
<button onClick={onSave}>Save Scenario</button>
```

## 🎨 Tailwind Conversion Quick Reference

| Original CSS | Tailwind Classes |
|--------------|------------------|
| `.saved-scenarios` | `mt-12` |
| `.card` | `bg-white rounded-lg p-8 shadow-sm border border-gray-300` |
| `.btn-primary` | `bg-blue-600 text-white px-4 py-2 hover:bg-blue-700` |
| `.btn-outline` | `border border-blue-600 text-blue-600 hover:bg-blue-50` |
| `.no-scenarios` | `text-center text-gray-500 italic py-8` |

## 📦 Required Dependencies

```json
{
  "dependencies": {
    "@headlessui/react": "^1.7.17", // For dialogs
    "react-hot-toast": "^2.4.1"     // For notifications (optional)
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
```

## ✅ Testing Strategy

1. **Unit Tests** - Test storage service CRUD operations
2. **Component Tests** - Test UI interactions and prop handling
3. **Integration Tests** - Test save → load → compare workflow
4. **E2E Tests** - Test complete user journeys

## 🚀 Next Steps

1. Review `ANALYSIS.md` to understand current implementation
2. Review `MIGRATION_GUIDE.md` for implementation plan
3. Create TypeScript types and interfaces
4. Build storage service with proper error handling
5. Create Tailwind-styled components
6. Add enhanced features (naming, descriptions, comparison)
7. Write comprehensive tests
8. Update documentation

## 📝 Notes

- Original code has bugs that need fixing during migration
- Consider future enhancements while building foundation
- Keep backward compatibility for existing saved scenarios
- Add version field to scenario data for future migrations
- Consider localStorage limits (typically 5-10MB)
- May need IndexedDB for larger datasets

## 🤝 Contributing

When implementing this feature:
1. Follow TypeScript strict mode
2. Use Tailwind for all styling
3. Add proper error handling
4. Write comprehensive tests
5. Document new features
6. Consider accessibility (ARIA labels, keyboard navigation)

## 📚 Additional Resources

- Original repository: https://github.com/PhilAgulnik/better-off-calculator-test
- Target repository: calculator-Andrei (current project)
- Universal Credit rules: https://www.gov.uk/universal-credit
- Tailwind documentation: https://tailwindcss.com/docs

---

**Last Updated:** 2025-11-12
**Source Repository:** better-off-calculator-test
**Target Repository:** calculator-Andrei
**Status:** Ready for migration
