# Better-Off Calculator - Quick Reference

## Component Overview

**Purpose:** Helps users determine if they would be financially better off by entering work, accounting for earnings, reduced UC benefits, and work-related costs.

**Location:** `src/features/uc-calculator/components/BetterOffCalculator.js`

**Type:** React functional component (JavaScript)

---

## Quick Facts

### Props
```javascript
{
  currentUCAmount: number,        // From main UC calculation
  isVisible: boolean,             // Show/hide toggle
  onToggleVisibility: function    // Toggle callback
}
```

### Key State
- **workData**: Employment type, hours/week, hourly wage, calculation period
- **costsData**: 8 categories × 4 time periods (weekly, 4-weekly, monthly, annual)
- **calculation**: Results object with gross/net earnings, UC amounts, better-off amount

### Core Calculation

```javascript
// Step 1: Calculate monthly earnings
monthlyGross = hoursPerWeek × hourlyWage × 4.33

// Step 2: Apply tax (simplified 20%)
netEarnings = monthlyGross × 0.8

// Step 3: Calculate UC reduction
earningsAboveAllowance = max(0, netEarnings - £379)
ucReduction = earningsAboveAllowance × 0.55
newUC = currentUC - ucReduction

// Step 4: Compare incomes
betterOffAmount = (netEarnings + newUC) - currentUC
```

---

## Cost Categories

### Additional Spending
1. Childcare
2. School meals
3. Prescriptions
4. Work clothing
5. Work travel
6. Other work costs

### Savings from Working
1. Energy savings
2. Other savings

---

## Key Constants

| Item | Value | Note |
|------|-------|------|
| Work Allowance | £379/month | 2025/26 rate (with housing costs) |
| Taper Rate | 55% (0.55) | UC reduction rate |
| Tax Rate | 20% | Simplified (should use proper tax calculation) |
| Weeks per Month | 4.33 | Conversion factor |
| 4-Weeks to Month | 13 ÷ 12 | Conversion factor |

---

## UI Structure

```
Module Header (title + toggle button)
└── Card Container
    ├── Work Data Input
    │   ├── Employment type dropdown
    │   ├── Hours per week input
    │   ├── Hourly wage input (£ prefix)
    │   └── Calculation period (radio buttons)
    │
    ├── Initial Results (after calculate)
    │   ├── Comparison table
    │   ├── Better-off amount
    │   └── Show costs button
    │
    ├── Costs Section (expandable)
    │   ├── Spending categories (6 items)
    │   ├── Savings categories (2 items)
    │   ├── Total costs summary
    │   └── Update button
    │
    └── Updated Results (after costs)
        └── Final better-off amount
```

---

## Integration Points

### Parent Component
**ResultsSection** renders BetterOffCalculator after main UC results

### Data Flow
```
CalculatorForm
    ↓
CalculatorPage
    ↓
UniversalCreditCalculator.calculate()
    ↓
ResultsSection (displays finalAmount)
    ↓
BetterOffCalculator (receives currentUCAmount)
```

---

## Key Functions

| Function | Purpose |
|----------|---------|
| `calculateBetterOff()` | Main calculation logic |
| `calculateMonthlyCosts()` | Aggregate all work costs |
| `calculateMonthlySavings()` | Aggregate all savings |
| `handleWorkDataChange()` | Update work inputs |
| `handleCostsDataChange()` | Update cost/saving amounts |
| `formatAmount()` | Format as currency |
| `getImpactColor()` | Get CSS class for positive/negative |

---

## Styling

**Approach:** External CSS with BEM-like naming

**Key Classes:**
- `.better-off-module` - Root container
- `.card` - White container with border
- `.form-row` - 2-column grid (1 on mobile)
- `.form-control` - Input styling (GOV.UK style)
- `.breakdown-table` - Results table
- `.cost-item` - Individual cost input
- `.btn-primary` - Green GOV.UK button

**Design System:** GOV.UK influenced (zero border-radius, bold borders, green buttons)

---

## Migration Priorities

### Must Have
1. Convert to TypeScript with interfaces
2. Replace CSS with Tailwind
3. Use existing Form components
4. Pull rates from central service
5. Implement proper tax calculation

### Should Have
6. Add work allowance eligibility checks
7. Adjust work allowance based on housing
8. Add ARIA labels and accessibility
9. Implement unit tests
10. Add state persistence

### Nice to Have
11. Scenario save/load
12. Print/export functionality
13. Comparison charts/graphs
14. Historical scenarios
15. Email/share results

---

## Known Issues & Improvements

### Current Limitations
1. **Simplified tax**: Uses flat 20% instead of proper PAYE calculation
2. **No NI calculation**: Should deduct National Insurance
3. **Fixed work allowance**: Should vary based on housing costs and eligibility
4. **No validation**: Missing work allowance eligibility checks
5. **No persistence**: State lost on page refresh

### Suggested Enhancements
1. **Proper tax calculation**: Use marginal rates with personal allowance
2. **Add NI contributions**: Class 1 or Class 2/4 for self-employed
3. **Dynamic rates**: Pull from rates data service
4. **Eligibility logic**: Check for children/LCWRA/housing
5. **Scenario comparison**: Compare multiple work options
6. **Visual aids**: Charts showing income breakdown
7. **Help text**: Contextual guidance for each field
8. **Validation**: Min wage checks, reasonable hours

---

## Example Calculation

**Scenario:** Full-time employee, 37.5 hours/week at £12.21/hour, current UC £800/month

### Step-by-Step
```
1. Gross earnings:
   37.5 hours × £12.21 × 4.33 weeks = £1,982.11/month

2. Tax (20%):
   £1,982.11 × 0.8 = £1,585.69 net

3. Earnings above work allowance:
   £1,585.69 - £379 = £1,206.69

4. UC reduction (55% taper):
   £1,206.69 × 0.55 = £663.68

5. New UC:
   £800 - £663.68 = £136.32

6. New total income:
   £1,585.69 + £136.32 = £1,722.01

7. Better off amount:
   £1,722.01 - £800 = £922.01/month
```

### With Costs
```
Work costs:
- Travel: £20/week = £86.60/month
- Childcare: £400/month
- Total: £486.60/month

Final better off:
£922.01 - £486.60 = £435.41/month
```

---

## File References

**Component Files:**
- Main: `/src/features/uc-calculator/components/BetterOffCalculator.js`
- Parent: `/src/features/uc-calculator/components/ResultsSection.js`
- Form: `/src/features/uc-calculator/components/CalculatorForm.js`

**Utility Files:**
- Calculator: `/src/features/uc-calculator/utils/calculator.js`
- Formatters: `/src/shared/utils/formatters.js`

**Style Files:**
- Main CSS: `/src/index.css`

---

## TypeScript Interface Preview

```typescript
interface BetterOffCalculatorProps {
  currentUCAmount: number;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

interface WorkData {
  employmentType: 'employee' | 'self-employed';
  hoursPerWeek: number;
  hourlyWage: number;
  calculationPeriod: 'weekly' | '4-week' | 'monthly';
}

interface CostPeriod {
  perWeek: number;
  per4Weeks: number;
  perMonth: number;
  perYear: number;
}

interface CostsData {
  childcare: CostPeriod;
  schoolMeals: CostPeriod;
  prescriptions: CostPeriod;
  workClothing: CostPeriod;
  workTravel: CostPeriod;
  otherWorkCosts: CostPeriod;
  energySavings: CostPeriod;
  otherSavings: CostPeriod;
}

interface CalculationResult {
  grossEarnings: number;
  netEarnings: number;
  currentUC: number;
  newUC: number;
  ucReduction: number;
  currentIncome: number;
  newIncome: number;
  betterOffAmount: number;
}
```

---

## Tailwind Class Mappings

| Original CSS Class | Tailwind Equivalent |
|-------------------|-------------------|
| `.better-off-module` | `mt-8 border-t border-gray-200 pt-6` |
| `.card` | `bg-white border border-gray-300 p-8 shadow-sm rounded-none` |
| `.form-row` | `grid grid-cols-1 md:grid-cols-2 gap-4` |
| `.form-control` | `w-full px-4 py-3 border-2 border-black text-lg min-h-[44px] focus:outline-none focus:ring-2 focus:ring-yellow-400` |
| `.btn-primary` | `px-6 py-3 bg-green-700 text-white text-lg min-h-[44px] hover:bg-green-800 transition-colors font-normal rounded-none` |
| `.breakdown-table` | `w-full border-collapse` + table utilities |
| `.impact.positive` | `text-green-600 font-semibold` |
| `.impact.negative` | `text-red-600 font-semibold` |
| `.costs-intro` | `bg-gray-50 p-4 border-l-4 border-blue-600 text-sm` |
| `.total-costs` | `bg-blue-50 p-4 rounded text-lg font-semibold mt-6` |

---

## Testing Scenarios

### Unit Tests
- [ ] Calculate gross earnings from hours × wage
- [ ] Apply 20% tax correctly
- [ ] Calculate UC reduction with taper rate
- [ ] Handle work allowance correctly
- [ ] Convert costs to monthly equivalents
- [ ] Sum all cost categories
- [ ] Handle edge cases (zero income, negative values)

### Integration Tests
- [ ] Form inputs update state
- [ ] Calculate button triggers calculation
- [ ] Results display after calculation
- [ ] Costs section expands/collapses
- [ ] Updated calculation includes costs
- [ ] Component receives props from parent
- [ ] Toggle visibility works

### E2E Tests
- [ ] User enters work details
- [ ] User clicks calculate
- [ ] Results appear
- [ ] User adds work costs
- [ ] Updated results reflect costs
- [ ] Better-off amount is accurate
- [ ] Component integrates with main calculator

---

## Dependencies to Install

```json
{
  "dependencies": {
    "@tanstack/react-router": "latest",
    "react": "^18.x",
    "typescript": "^5.x"
  },
  "devDependencies": {
    "@types/react": "^18.x",
    "@testing-library/react": "latest",
    "@testing-library/user-event": "latest",
    "vitest": "latest",
    "tailwindcss": "latest"
  }
}
```

---

## Next Steps

1. **Review this guide** with the team
2. **Set up TypeScript interfaces** in a shared types file
3. **Create a spike** to test Tailwind conversion
4. **Identify reusable utilities** from existing calculator
5. **Draft component structure** in calculator-Andrei
6. **Write initial tests** before implementation
7. **Implement core calculation** logic
8. **Build UI incrementally** (work data → results → costs)
9. **Integrate with parent** component
10. **Test thoroughly** and refine
