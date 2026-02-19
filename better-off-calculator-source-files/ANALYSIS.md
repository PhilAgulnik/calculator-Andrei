# Saved Scenarios Feature Analysis

## Overview
This document provides a comprehensive analysis of the Saved Scenarios feature from the better-off-calculator-test repository.

## Source Files Location
- **SavedScenarios Component**: `src/features/uc-calculator/components/SavedScenarios.js`
- **Storage Service**: `src/features/uc-calculator/utils/benefitDataService.js`
- **Main Integration**: `src/features/uc-calculator/components/CalculatorPage.js`
- **Results Display**: `src/features/uc-calculator/components/ResultsSection.js`

## Data Structure

### Scenario Object
```javascript
{
  id: Date.now(),                    // Unique timestamp-based ID
  name: "Scenario N",                // Auto-generated name (Scenario 1, Scenario 2, etc.)
  input: { ...formData },            // Complete form data snapshot
  calculation: results,              // Full calculation results object
  timestamp: new Date().toISOString() // ISO timestamp
}
```

### Important Note
The SavedScenarios component expects a slightly different structure:
```javascript
{
  id: number,
  name: string,
  taxYear: string,                   // e.g., "2025_26"
  savedAt: string,                   // ISO timestamp
  calculation: {
    calculation: {
      finalAmount: number
    }
  }
}
```

**Migration Issue**: There's a mismatch between how scenarios are saved (in CalculatorPage) and how they're displayed (in SavedScenarios). The component expects `scenario.calculation.calculation.finalAmount`, but CalculatorPage saves it as `scenario.calculation.finalAmount`.

## Storage Implementation

### localStorage Key
- **Key**: `ucSavedScenarios`
- **Format**: JSON array of scenario objects
- **Persistence**: Browser localStorage (survives page refreshes but is browser-specific)

### Storage Functions (from benefitDataService.js)
The benefitDataService.js focuses on single-benefit data, not scenarios:
- `saveBenefitCalculatorData()` - Saves current calculation to budgeting tool
- `getBenefitCalculatorData()` - Retrieves saved calculation
- `clearBenefitCalculatorData()` - Clears saved data
- `hasBenefitCalculatorData()` - Checks if data exists

**Important**: The actual scenario storage is handled directly in CalculatorPage.js, NOT through benefitDataService.js

## SavedScenarios Component Features

### Props Interface
```typescript
interface SavedScenariosProps {
  scenarios: Scenario[];
  onLoadScenario: (scenario: Scenario) => void;
  onDeleteScenario: (id: number) => void;
}
```

### Display Elements
Each scenario shows:
1. **Name**: Auto-generated (Scenario 1, Scenario 2, etc.)
2. **Tax Year**: Formatted from underscore to slash (2025_26 → 2025/26)
3. **Saved Date**: Localized date string
4. **Amount**: Monthly UC amount with currency formatting

### Actions
- **Load**: Restores form data and results, triggers results display
- **Delete**: Removes scenario from array and updates localStorage

### Empty State
Shows friendly message: "No saved scenarios yet. Save your first calculation to compare different scenarios."

## Integration in CalculatorPage

### State Management
```javascript
const [savedScenarios, setSavedScenarios] = useState([]);
const [showResults, setShowResults] = useState(false);
```

### Lifecycle
1. **Component Mount**: Load scenarios from localStorage
2. **Save Action**: Called from ResultsSection → adds new scenario
3. **Load Action**: Sets formData and results state
4. **Delete Action**: Filters out scenario and updates localStorage

### Save Scenario Function
```javascript
const handleSaveScenario = () => {
  if (!results || !results.calculation) {
    console.warn('Cannot save scenario: no calculation results');
    return;
  }

  const scenario = {
    id: Date.now(),
    name: `Scenario ${savedScenarios.length + 1}`,
    input: { ...formData },
    calculation: results,
    timestamp: new Date().toISOString()
  };

  const updated = [...savedScenarios, scenario];
  setSavedScenarios(updated);
  localStorage.setItem('ucSavedScenarios', JSON.stringify(updated));
};
```

## UI/UX Flow

### Save Workflow
1. User completes calculation
2. Results displayed via ResultsSection
3. User clicks "Save Scenario" button
4. Scenario added to list with auto-generated name
5. Appears in SavedScenarios section (if not hidden by pension warning)

### Load Workflow
1. User views saved scenarios list
2. Clicks "Load" on desired scenario
3. Form repopulates with saved input data
4. Results display with saved calculation
5. User can modify and recalculate

### Delete Workflow
1. User clicks "Delete" on scenario
2. Scenario removed from array
3. localStorage updated immediately
4. List re-renders without deleted item

## Comparison Features

### Current State: NO Side-by-Side Comparison
The current implementation does NOT have:
- ❌ Side-by-side scenario comparison table
- ❌ Multi-select for comparison
- ❌ Comparison view mode
- ❌ Differential analysis

### What It DOES Have:
- ✅ Save/Load individual scenarios
- ✅ Quick preview of scenario amount
- ✅ Ability to switch between scenarios
- ✅ Delete individual scenarios

### Comparison Capability via MIF Panel
The ResultsSection DOES have a comparison table for Minimum Income Floor (MIF):
- Compares "Without MIF" vs "With MIF"
- Shows impact columns
- Uses color coding (positive/negative)
- Side-by-side format

This MIF comparison could serve as a template for multi-scenario comparison.

## Export/Import Functionality

### Export (from CalculatorPage)
Located in `handleExport()` function:
1. **PDF Export** (primary): Uses jsPDF library
   - Formatted report with all details
   - Breakdown sections
   - Professional layout
2. **JSON Fallback**: If PDF fails
   - Complete data export
   - Includes formData + results + timestamp
   - Downloads as .json file

### Import
**NOT IMPLEMENTED** in the current codebase. Users cannot:
- Import previously exported scenarios
- Share scenarios between browsers/devices
- Restore from JSON backup

## Naming and Description

### Current Implementation
- **Naming**: Auto-generated sequentially ("Scenario 1", "Scenario 2", etc.)
- **Description**: None - no custom description field
- **Editing**: Cannot rename scenarios after creation

### Fields Displayed
- Tax Year (from formData)
- Saved Date (automatically generated)
- Final Amount (from calculation results)

### Limitations
- No custom naming ability
- No description or notes field
- No tags or categories
- No search/filter capability

## Technical Details

### React Patterns Used
- Functional components with hooks
- Props-based communication
- Controlled components
- State lifting (parent manages scenarios)
- Conditional rendering

### Styling Approach
- CSS classes (not Tailwind)
- Uses CSS variables for theming
- Minimal scenario-specific styles
- Relies on base .card and .btn classes

### Error Handling
```javascript
try {
  setSavedScenarios(JSON.parse(saved));
} catch (error) {
  console.error('Error loading saved scenarios:', error);
  setSavedScenarios([]);
}
```

### Validation
- Checks for results existence before saving
- Validates calculation data presence
- Graceful fallback to empty array

## Migration Considerations for TypeScript/Tailwind

### TypeScript Conversion
1. Define interface for Scenario type
2. Type all props and state
3. Add proper typing for localStorage interactions
4. Type the calculation results structure

### Tailwind Conversion
1. Replace .card class with Tailwind utilities
2. Replace .btn classes with Tailwind button styles
3. Convert layout classes to Tailwind flexbox/grid
4. Add responsive design breakpoints
5. Implement Tailwind color schemes

### Data Structure Alignment
**CRITICAL**: Fix the mismatch between save and display structures:
- Option A: Change SavedScenarios to expect flat structure
- Option B: Change CalculatorPage to save nested structure
- Option C: Add adapter/mapper function

### Recommended Structure
```typescript
interface Scenario {
  id: number;
  name: string;
  description?: string; // Add this feature
  taxYear: string;
  savedAt: string;
  formData: FormData;
  results: CalculationResults;
  tags?: string[]; // Consider adding
}
```

## Enhancement Opportunities

### Must-Have for Migration
1. **Fix data structure mismatch** (critical bug)
2. **Custom naming** - Let users name scenarios
3. **TypeScript types** - Full type safety
4. **Tailwind styling** - Match new design system

### Should-Have
1. **Description field** - Add notes/context
2. **Edit scenario names** - Rename after creation
3. **Comparison view** - Side-by-side comparison of 2+ scenarios
4. **Import functionality** - Load exported JSON files
5. **Validation** - Better error states

### Nice-to-Have
1. **Tags/Categories** - Organize scenarios
2. **Search/Filter** - Find scenarios quickly
3. **Sorting options** - By date, name, amount
4. **Duplicate scenario** - Clone and modify
5. **Export selected** - Export multiple scenarios
6. **Scenario history** - Track changes over time
7. **Share scenarios** - Generate shareable links

## Key Takeaways

1. **Simple Implementation**: Basic save/load/delete functionality
2. **No Real Comparison**: Despite the name, no side-by-side comparison exists
3. **Data Structure Issue**: Mismatch between save and display formats
4. **Limited Metadata**: Only auto-generated names, no descriptions
5. **localStorage Only**: No backend, no cross-device sync
6. **No Import**: Can export but cannot import back
7. **MIF Panel Pattern**: Good reference for comparison UI design
8. **Minimal CSS**: Easy to convert to Tailwind
9. **Functional Approach**: Clean React patterns, ready for TypeScript

## Related Files to Review

For complete migration, also review:
- `ResultsSection.js` - Contains MIF comparison table (good pattern to follow)
- `BetterOffCalculator.js` - Another comparison feature (work vs benefits)
- `CalculatorForm.js` - Form structure to save in scenarios
- `formatters.js` - Currency formatting utilities
- Global CSS variables - For Tailwind theme mapping
