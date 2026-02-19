# Better-Off Calculator Migration Guide

## Overview
This document provides a comprehensive technical breakdown of the `BetterOffCalculator` component from the better-off-calculator-test repository to facilitate migration to calculator-Andrei (TypeScript, Vite, TanStack Router, Tailwind CSS).

---

## 1. Component File Location and Name

**Source Repository:** https://github.com/PhilAgulnik/better-off-calculator-test

**File Path:**
```
src/features/uc-calculator/components/BetterOffCalculator.js
```

**Component Type:** React functional component (JavaScript)

---

## 2. Component Structure

The BetterOffCalculator is organized into the following main sections:

### A. **Module Header**
- Title: "Better Off in Work Calculator"
- Toggle visibility button

### B. **Work Data Input Section**
- Employment type selector (employee/self-employed)
- Hours per week input
- Hourly wage input
- Calculation period selector (weekly/4-week/monthly)
- Calculate button

### C. **Initial Results Section**
Displays comparison table with:
- Current situation (UC only)
- In-work situation (earnings + reduced UC)
- Shows: Gross earnings, Net earnings (after tax), UC amount, Total income
- Better off amount with color-coded impact indicator

### D. **Costs of Work Section** (Expandable)
Organized into two subsections:

**Additional Spending:**
- Childcare costs
- School meals
- Prescriptions
- Work clothing
- Work travel
- Other work costs

**Savings from Working:**
- Energy savings
- Other savings

Each cost item has:
- Multiple period inputs (weekly, 4-weekly, monthly, annual)
- Period selector radio buttons
- Real-time calculation

### E. **Updated Results Section**
- Recalculates better-off amount incorporating all costs
- Displays final net benefit
- Color-coded impact (green for positive, red for negative)

---

## 3. Props/Inputs Required

The component accepts the following props:

```javascript
{
  currentUCAmount: number,        // Current UC entitlement (from main calculator)
  isVisible: boolean,             // Visibility toggle state
  onToggleVisibility: function,   // Callback to toggle visibility
  formData?: object,              // Optional - external form data (not used internally)
  onFormChange?: function         // Optional - callback for external changes (not used)
}
```

**Key Prop:**
- `currentUCAmount` (default: 0): The final UC amount calculated by the main calculator, passed from `calculation.finalAmount` in ResultsSection

---

## 4. State Management

The component uses React `useState` hooks for three main state objects:

### A. **workData**
```javascript
{
  employmentType: 'employee',     // 'employee' | 'self-employed'
  hoursPerWeek: 30,               // number
  hourlyWage: 12.21,              // number (default is National Living Wage)
  calculationPeriod: 'monthly'    // 'weekly' | '4-week' | 'monthly'
}
```

### B. **costsData**
Complex nested structure with multiple cost categories, each tracking four time periods:

```javascript
{
  childcare: {
    perWeek: 0,
    per4Weeks: 0,
    perMonth: 0,
    perYear: 0
  },
  schoolMeals: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
  prescriptions: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
  workClothing: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
  workTravel: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
  otherWorkCosts: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
  energySavings: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
  otherSavings: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 }
}
```

### C. **UI State**
```javascript
const [calculation, setCalculation] = useState(null);
const [showResults, setShowResults] = useState(false);
const [showCostsSection, setShowCostsSection] = useState(false);
```

---

## 5. Dependencies

### Internal Imports
```javascript
import React, { useState } from 'react';
import { formatCurrency } from '../../../shared/utils/formatters';
```

### External Dependencies
- **React**: useState hook for state management
- **formatters.js**: Currency formatting utility

### Formatter Details
The `formatCurrency` function from `src/shared/utils/formatters.js`:

```javascript
// Converts numeric amounts to "£0.00" format
// Uses Intl.NumberFormat with GBP currency
// Handles invalid inputs gracefully, returning "£0.00" for non-numeric values
formatCurrency(amount: number): string
```

Other formatters in the file (not used by BetterOffCalculator):
- `formatTaxYear(year: string): string` - Converts "YYYY_YY" to "YYYY/YY"
- `formatDate(date: string | Date): string` - Long format with en-GB locale
- `formatPercentage(value: number, decimals?: number): string`
- `formatNumber(value: number, decimals?: number): string`

---

## 6. Calculation Logic

### A. **Core Calculation Function: `calculateBetterOff()`**

This is the primary calculation engine with the following steps:

#### Step 1: Calculate Gross Earnings
```javascript
// Convert hourly wage and hours to monthly gross earnings
const weeklyGross = workData.hoursPerWeek * workData.hourlyWage;
const monthlyGross = weeklyGross * 4.33;  // weeks per month conversion
```

#### Step 2: Apply Simplified Tax Calculation
```javascript
// 20% basic rate tax deduction
const netEarnings = monthlyGross * 0.8;
```

**Note:** This is a simplified calculation. Real tax would consider:
- Personal allowance (£12,570/year = £1,047.50/month)
- National Insurance contributions
- Pension contributions

#### Step 3: Calculate UC Reduction
```javascript
const workAllowance = 379;  // Monthly work allowance (2025/26 rate)
const taperRate = 0.55;     // 55% taper rate

let earningsAboveAllowance = Math.max(0, netEarnings - workAllowance);
let ucReduction = earningsAboveAllowance * taperRate;
let newUC = Math.max(0, currentUCAmount - ucReduction);
```

**UC Reduction Formula:**
```
UC Reduction = (Net Earnings - Work Allowance) × Taper Rate
New UC = Current UC - UC Reduction
```

#### Step 4: Calculate Total Income Comparison
```javascript
const currentIncome = currentUCAmount;
const newIncome = netEarnings + newUC;
const betterOffAmount = newIncome - currentIncome;
```

#### Step 5: Store Initial Results
```javascript
setCalculation({
  grossEarnings: monthlyGross,
  netEarnings: netEarnings,
  currentUC: currentUCAmount,
  newUC: newUC,
  ucReduction: ucReduction,
  currentIncome: currentIncome,
  newIncome: newIncome,
  betterOffAmount: betterOffAmount
});
```

### B. **Cost Calculation Functions**

#### `calculateMonthlyCosts()`
Aggregates all work-related costs, converting to monthly equivalents:

```javascript
const monthlyCosts =
  (childcare.perWeek * 4.33) +
  (childcare.per4Weeks * 13 / 12) +
  (childcare.perMonth) +
  (childcare.perYear / 12) +
  // ... repeated for all cost categories except savings
```

**Conversion Factors:**
- Weekly: × 4.33
- 4-Weekly: × 13 ÷ 12
- Monthly: × 1
- Annual: ÷ 12

#### `calculateMonthlySavings()`
Similar logic for energy and other savings (only these two categories).

### C. **Work Allowance Context**

The hardcoded work allowance of £379 is the 2025/26 rate for claimants:
- **With housing costs:** £379/month
- **Without housing costs:** £684/month (not differentiated in this component)

This should ideally be:
1. Pulled from rates data
2. Conditional based on whether user has housing costs
3. Conditional on whether user has children or LCWRA status (work allowance eligibility)

---

## 7. UI Structure

### A. **Conditional Rendering**
The entire component is wrapped in a conditional:
```jsx
{isVisible && (
  <div className="better-off-module">
    {/* Component content */}
  </div>
)}
```

### B. **Component Hierarchy**

```
better-off-module (root div)
├── module-header
│   ├── h3 (title)
│   └── button (toggle visibility)
├── card
│   ├── Work Data Input Section
│   │   ├── form-row (employment type + hours)
│   │   │   ├── form-group (employment type select)
│   │   │   └── form-group (hours input)
│   │   ├── form-row (wage + period)
│   │   │   ├── form-group (wage input with £ prefix)
│   │   │   └── form-group (period radio buttons)
│   │   └── button (calculate)
│   │
│   ├── results-section (conditional: showResults)
│   │   ├── summary-statement (h4)
│   │   ├── breakdown-table
│   │   │   ├── thead (headers)
│   │   │   └── tbody
│   │   │       ├── tr (Gross earnings)
│   │   │       ├── tr (Net earnings after tax)
│   │   │       ├── tr (Universal Credit)
│   │   │       └── tr.total-row (Total monthly income)
│   │   ├── summary-item.better-off-amount
│   │   └── button (Show/Hide Costs of Work)
│   │
│   ├── costs-section (conditional: showCostsSection)
│   │   ├── costs-intro (explanation text)
│   │   ├── h4 (Additional Spending)
│   │   ├── costs-subsection (6 cost categories)
│   │   │   └── cost-item (for each category)
│   │   │       ├── label
│   │   │       ├── cost-input-group
│   │   │       │   ├── input-with-prefix (£)
│   │   │       │   └── period-selector (radio buttons)
│   │   ├── h4 (Savings from Working)
│   │   ├── costs-subsection (2 savings categories)
│   │   ├── total-costs summary
│   │   └── button (Update Calculation)
│   │
│   └── updated-results (conditional: costs entered)
│       ├── h4 (Updated Better Off Amount)
│       ├── final-better-off display
│       └── explanation text
```

### C. **Input Elements**

**Select Dropdown:**
```jsx
<select
  className="form-control"
  value={workData.employmentType}
  onChange={(e) => handleWorkDataChange('employmentType', e.target.value)}
>
  <option value="employee">Employee</option>
  <option value="self-employed">Self-employed</option>
</select>
```

**Number Input:**
```jsx
<input
  type="number"
  className="form-control"
  value={workData.hoursPerWeek}
  onChange={(e) => handleWorkDataChange('hoursPerWeek', parseFloat(e.target.value))}
  min="0"
  step="0.5"
/>
```

**Currency Input with Prefix:**
```jsx
<div className="input-with-prefix">
  <span className="input-prefix">£</span>
  <input
    type="number"
    className="form-control"
    value={workData.hourlyWage}
    onChange={(e) => handleWorkDataChange('hourlyWage', parseFloat(e.target.value))}
    min="0"
    step="0.01"
  />
</div>
```

**Radio Button Group:**
```jsx
<div className="radio-group">
  {['weekly', '4-week', 'monthly'].map(period => (
    <label key={period} className="radio-label">
      <input
        type="radio"
        className="radio-custom"
        checked={workData.calculationPeriod === period}
        onChange={() => handleWorkDataChange('calculationPeriod', period)}
      />
      {getPeriodText(period)}
    </label>
  ))}
</div>
```

---

## 8. Integration Points

### A. **Parent Component: ResultsSection**

**Location:** `src/features/uc-calculator/components/ResultsSection.js`

**Import:**
```javascript
import BetterOffCalculator from './BetterOffCalculator';
```

**Usage:**
```jsx
<BetterOffCalculator
  currentUCAmount={calculation.finalAmount}
  isVisible={showBetterOffModule}
  onToggleVisibility={() => setShowBetterOffModule(!showBetterOffModule)}
/>
```

**Parent State:**
```javascript
const [showBetterOffModule, setShowBetterOffModule] = useState(false);
```

**Toggle Button in ResultsSection:**
```jsx
<button
  className="btn btn-secondary"
  onClick={() => setShowBetterOffModule(!showBetterOffModule)}
>
  {showBetterOffModule ? 'Hide' : 'Show'} Better Off in Work Calculator
</button>
```

### B. **Data Flow**

```
CalculatorForm (user inputs)
    ↓
CalculatorPage (orchestration)
    ↓
UniversalCreditCalculator.calculate()
    ↓
ResultsSection (displays UC entitlement)
    ↓
BetterOffCalculator (currentUCAmount prop)
    ↓
Internal calculation + user work data
    ↓
Better-off results displayed
```

### C. **Main Calculator Integration**

The BetterOffCalculator is **independent** of the main calculator's calculation logic but **dependent** on its output (`currentUCAmount`). It does not:
- Share state with CalculatorForm
- Modify the main calculator's inputs
- Affect the UC calculation results

It's a **post-calculation analysis tool** that helps users understand work incentives.

---

## 9. Key Functions/Methods

### A. **State Update Handlers**

#### `handleWorkDataChange(field, value)`
```javascript
const handleWorkDataChange = (field, value) => {
  setWorkData(prev => ({
    ...prev,
    [field]: value
  }));
};
```
**Purpose:** Updates work data fields (employment type, hours, wage, period)

#### `handleCostsDataChange(category, period, value)`
```javascript
const handleCostsDataChange = (category, period, value) => {
  setCostsData(prev => ({
    ...prev,
    [category]: {
      ...prev[category],
      [period]: parseFloat(value) || 0
    }
  }));
};
```
**Purpose:** Updates cost/savings amounts for specific categories and periods

### B. **Calculation Functions**

#### `calculateBetterOff()`
**Purpose:** Main calculation function
**Process:**
1. Calculate gross monthly earnings from hourly wage × hours
2. Apply 20% tax to get net earnings
3. Calculate UC reduction using taper rate
4. Compare current vs. in-work income
5. Store results and show results section

**Returns:** void (updates state)

#### `calculateMonthlyCosts()`
**Purpose:** Aggregate all work-related costs to monthly amount
**Process:**
- Iterates through spending categories (excludes savings)
- Converts each period to monthly using conversion factors
- Sums all categories

**Returns:** number (total monthly costs)

#### `calculateMonthlySavings()`
**Purpose:** Aggregate energy and other savings to monthly amount
**Process:**
- Only processes energySavings and otherSavings categories
- Converts each period to monthly
- Sums both categories

**Returns:** number (total monthly savings)

### C. **Helper/Utility Functions**

#### `getPeriodText(period)`
**Purpose:** Convert period identifier to display text
```javascript
const periodMap = {
  'weekly': 'Weekly',
  '4-week': 'Every 4 weeks',
  'monthly': 'Monthly'
};
return periodMap[period] || period;
```

#### `formatAmount(amount)`
**Purpose:** Format number as currency string
```javascript
return formatCurrency(amount);
```
**Note:** Wrapper around imported formatCurrency function

#### `getImpactColor(amount)`
**Purpose:** Return CSS class for positive/negative impact
```javascript
if (amount > 0) return 'positive';
if (amount < 0) return 'negative';
return 'neutral';
```

#### `getImpactSign(amount)`
**Purpose:** Return + or - prefix for display
```javascript
return amount >= 0 ? '+' : '';
```
**Note:** Negative sign is automatic from the number, so only adds + for positive

---

## 10. Styling Approach

### A. **CSS Architecture**

**Type:** External CSS file with BEM-like class naming

**Location:** Styles are likely in `src/index.css` or a component-specific CSS file

**Approach:**
- Traditional CSS classes
- No CSS-in-JS
- No inline styles
- CSS custom properties (CSS variables) for theming
- Responsive design with media queries

### B. **CSS Custom Properties (Variables)**

```css
/* Spacing */
--spacing-3: 0.75rem
--spacing-4: 1rem
--spacing-6: 1.5rem
--spacing-8: 2rem

/* Colors */
--gray-200: #e2e8f0
--gray-50: #f8fafc

/* GOV.UK color scheme */
--primary-green: #00703c
--primary-dark-green: #004a2a
--border-gray: #b1b4b6
--text-black: #0b0c0c

/* Status colors */
--info-color: #2563eb
--success-color: #059669
--danger-color: #dc2626

/* Layout */
--radius-md: 0.375rem (but GOV.UK style uses border-radius: 0)
```

### C. **Key CSS Classes**

#### **Layout Classes**

`.better-off-module`
```css
margin-top: var(--spacing-8);
border-top: 1px solid var(--gray-200);
padding-top: var(--spacing-6);
```

`.card`
```css
background: white;
border: 1px solid #b1b4b6;
border-radius: 0;  /* GOV.UK style */
padding: var(--spacing-8);
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
```

`.module-header`
```css
display: flex;
justify-content: space-between;
align-items: flex-start;
gap: var(--spacing-3);
margin-bottom: var(--spacing-6);

/* Mobile */
@media (max-width: 768px) {
  flex-direction: column;
}
```

#### **Form Classes**

`.form-row`
```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: var(--spacing-4);

/* Mobile */
@media (max-width: 768px) {
  grid-template-columns: 1fr;
}
```

`.form-group`
```css
margin-bottom: var(--spacing-6);
text-align: left;
```

`.form-control`
```css
width: 100%;
padding: var(--spacing-3) var(--spacing-4);
border: 2px solid #0b0c0c;
border-radius: 0;
font-size: 1.1875rem;  /* 19px */
min-height: 44px;  /* Accessibility: min touch target */

/* Focus state */
focus {
  outline: 3px solid #ffdd00;  /* GOV.UK yellow */
  outline-offset: 0;
  box-shadow: inset 0 0 0 2px;
}
```

`.input-with-prefix`
```css
position: relative;
display: flex;
align-items: center;

.input-prefix {
  position: absolute;
  left: var(--spacing-3);
  pointer-events: none;
}

.form-control {
  padding-left: calc(var(--spacing-3) + 1ch + var(--spacing-2));
}
```

`.input-with-suffix`
```css
/* Similar structure for suffix on right side */
```

#### **Radio Button Classes**

`.radio-group`
```css
display: flex;
gap: var(--spacing-4);
flex-wrap: wrap;
```

`.radio-label`
```css
display: inline-flex;
align-items: center;
cursor: pointer;
padding: var(--spacing-2) var(--spacing-3);
border: 2px solid transparent;
border-radius: 0;

/* Selected state */
.radio-custom:checked + & {
  border-color: #0b0c0c;
  background: #f3f2f1;
}
```

`.radio-custom`
```css
margin-right: var(--spacing-2);
width: 1.5rem;
height: 1.5rem;
cursor: pointer;
```

#### **Button Classes**

`.btn`
```css
padding: var(--spacing-3) var(--spacing-6);
border: 2px solid transparent;
border-radius: 0;  /* GOV.UK */
font-size: 1.1875rem;
font-weight: 400;
font-family: "GDS Transport", Arial, sans-serif;
min-height: 44px;
cursor: pointer;
transition: background-color 0.3s, border-color 0.3s;
```

`.btn-primary`
```css
background-color: #00703c;  /* GOV.UK green */
color: white;
border-color: #00703c;

hover {
  background-color: #004a2a;
  border-color: #004a2a;
}
```

`.btn-secondary`
```css
background-color: white;
color: #00703c;
border-color: #00703c;

hover {
  background-color: #f8f9fa;
}
```

`.btn-outline`
```css
background-color: transparent;
color: #2563eb;
border-color: #2563eb;

hover {
  background-color: #eff6ff;
}
```

#### **Results Classes**

`.results-section`
```css
margin-top: var(--spacing-6);
padding-top: var(--spacing-6);
border-top: 1px solid #e2e8f0;
```

`.summary-statement`
```css
font-size: 1.25rem;
font-weight: 600;
margin-bottom: var(--spacing-4);
color: #1e293b;
```

`.breakdown-table`
```css
width: 100%;
border-collapse: collapse;
margin: var(--spacing-4) 0;

thead {
  background: #f3f2f1;
  border-bottom: 2px solid #0b0c0c;
}

th, td {
  padding: var(--spacing-3);
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

tbody tr:nth-child(even) {
  background: #f8fafc;
}
```

`.total-row`
```css
font-weight: 700;
border-top: 2px solid #0b0c0c;
background: #f3f2f1 !important;
```

`.impact`
```css
font-weight: 600;

&.positive {
  color: #059669;  /* Green */
}

&.negative {
  color: #dc2626;  /* Red */
}

&.neutral {
  color: #64748b;  /* Gray */
}
```

#### **Costs Section Classes**

`.costs-section`
```css
margin-top: var(--spacing-6);
padding-top: var(--spacing-6);
border-top: 1px solid #e2e8f0;
```

`.costs-intro`
```css
background: var(--gray-50);
padding: var(--spacing-4);
border-left: 4px solid #2563eb;
margin-bottom: var(--spacing-6);
font-size: 0.95rem;
line-height: 1.6;
```

`.costs-subsection`
```css
margin-bottom: var(--spacing-6);

h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: var(--spacing-4);
}
```

`.cost-item`
```css
display: flex;
flex-direction: column;
gap: var(--spacing-2);
padding: var(--spacing-3);
background: white;
border: 1px solid #e2e8f0;
border-radius: var(--radius-md);
margin-bottom: var(--spacing-3);

label {
  font-weight: 600;
  font-size: 0.95rem;
}
```

`.cost-input-group`
```css
display: flex;
flex-direction: column;
gap: var(--spacing-2);
```

`.period-selector`
```css
display: flex;
gap: var(--spacing-3);
flex-wrap: wrap;
margin-top: var(--spacing-2);
```

`.total-costs`
```css
background: #eff6ff;
padding: var(--spacing-4);
border-radius: var(--radius-md);
margin-top: var(--spacing-6);
font-size: 1.1rem;
font-weight: 600;
```

`.updated-results`
```css
margin-top: var(--spacing-6);
padding: var(--spacing-6);
background: #f8fafc;
border-radius: var(--radius-md);
border: 2px solid #e2e8f0;
```

`.final-better-off`
```css
font-size: 1.5rem;
font-weight: 700;
margin: var(--spacing-4) 0;

&.positive {
  color: #059669;
}

&.negative {
  color: #dc2626;
}
```

### D. **Responsive Breakpoints**

```css
/* Mobile-first approach */

/* Small screens */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .module-header {
    flex-direction: column;
  }

  .btn-group {
    flex-direction: column;
    width: 100%;
  }
}

/* Medium screens */
@media (min-width: 769px) and (max-width: 1024px) {
  /* Adjust spacing */
}

/* Large screens */
@media (min-width: 1025px) {
  /* Full desktop layout */
}
```

### E. **Design System: GOV.UK Influence**

The styling follows GOV.UK Design System principles:

1. **Zero border-radius** - Sharp corners, not rounded
2. **Bold borders** - 2px solid borders for form controls
3. **High contrast** - Black text (#0b0c0c) on white
4. **Large touch targets** - Minimum 44px height
5. **Yellow focus states** - #ffdd00 outline
6. **Green primary buttons** - #00703c GOV.UK green
7. **Font**: GDS Transport (falls back to Arial)
8. **Font sizes**: 19px (1.1875rem) for body text
9. **Spacing scale**: Consistent use of CSS variables
10. **Accessibility-first**: Focus visible, semantic HTML

---

## Migration Considerations for calculator-Andrei

### 1. **TypeScript Conversion**

Convert from JavaScript to TypeScript:

```typescript
// Define interfaces
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

interface BetterOffCalculatorProps {
  currentUCAmount: number;
  isVisible: boolean;
  onToggleVisibility: () => void;
  formData?: any;
  onFormChange?: (data: any) => void;
}
```

### 2. **Tailwind CSS Migration**

Replace CSS classes with Tailwind utilities:

**Before (CSS classes):**
```jsx
<div className="better-off-module">
  <div className="card">
    <div className="form-row">
      <div className="form-group">
        <input className="form-control" />
      </div>
    </div>
  </div>
</div>
```

**After (Tailwind):**
```jsx
<div className="mt-8 border-t border-gray-200 pt-6">
  <div className="bg-white border border-gray-300 p-8 shadow-sm">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="mb-6 text-left">
        <input className="w-full px-4 py-3 border-2 border-black text-lg min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
    </div>
  </div>
</div>
```

**Key Tailwind Mappings:**

| Original Class | Tailwind Equivalent |
|----------------|-------------------|
| `.better-off-module` | `mt-8 border-t border-gray-200 pt-6` |
| `.card` | `bg-white border border-gray-300 p-8 shadow-sm` |
| `.form-row` | `grid grid-cols-1 md:grid-cols-2 gap-4` |
| `.form-group` | `mb-6 text-left` |
| `.form-control` | `w-full px-4 py-3 border-2 border-black text-lg min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500` |
| `.btn-primary` | `px-6 py-3 bg-green-700 text-white text-lg min-h-[44px] hover:bg-green-800 transition-colors` |
| `.breakdown-table` | Use Tailwind table utilities with `divide-y divide-gray-200` |
| `.impact.positive` | `text-green-600 font-semibold` |
| `.impact.negative` | `text-red-600 font-semibold` |

### 3. **Form Component Integration**

Leverage existing Form components from calculator-Andrei:

```typescript
import { NumberInput, Select, Radio } from '@/components/Form';

// Replace raw inputs with form components
<NumberInput
  label="Hours per week"
  value={workData.hoursPerWeek}
  onChange={(value) => handleWorkDataChange('hoursPerWeek', value)}
  min={0}
  step={0.5}
/>

<Select
  label="Employment type"
  value={workData.employmentType}
  onChange={(value) => handleWorkDataChange('employmentType', value)}
  options={[
    { value: 'employee', label: 'Employee' },
    { value: 'self-employed', label: 'Self-employed' }
  ]}
/>
```

### 4. **TanStack Router Considerations**

Since the component is currently embedded in ResultsSection:

**Option A: Keep as embedded component**
- No routing changes needed
- Import and use within results page

**Option B: Make it a standalone route**
- Create route: `/benefits-calculator/:id/better-off`
- Use route parameters to pass current UC amount
- Store calculation state in router context or search params

### 5. **State Management**

Consider using TanStack Router's search params for persistence:

```typescript
import { useSearch, useNavigate } from '@tanstack/react-router';

const search = useSearch({ from: '/benefits-calculator/$id/better-off' });
const navigate = useNavigate();

// Store work data in URL
const handleWorkDataChange = (field: string, value: any) => {
  navigate({
    search: (prev) => ({
      ...prev,
      [field]: value
    })
  });
};
```

### 6. **Enhanced Tax Calculation**

Replace the simplified 20% tax with proper calculation:

```typescript
import { calculateIncomeTax, calculateNationalInsurance } from '@/utils/taxCalculations';

// More accurate calculation
const yearlyGross = monthlyGross * 12;
const incomeTax = calculateIncomeTax(yearlyGross);
const nationalInsurance = calculateNationalInsurance(yearlyGross);
const netEarnings = monthlyGross - (incomeTax / 12) - (nationalInsurance / 12);
```

### 7. **Integration with Existing Calculator**

The BetterOffCalculator should:

1. **Access rates data**: Pull work allowance and taper rates from existing rates files
2. **Check eligibility**: Verify user qualifies for work allowance based on:
   - Has children (from form data)
   - Has LCWRA status (from form data)
   - Has housing costs (from form data)
3. **Use housing data**: Adjust work allowance based on housing costs
4. **Reuse utilities**: Leverage existing calculator utilities where possible

### 8. **Accessibility Enhancements**

Ensure WCAG 2.1 AA compliance:

```typescript
// Add ARIA labels
<input
  type="number"
  aria-label="Hours worked per week"
  aria-describedby="hours-help"
/>
<span id="hours-help" className="text-sm text-gray-600">
  Enter the number of hours you expect to work each week
</span>

// Add live regions for calculation updates
<div role="status" aria-live="polite" aria-atomic="true">
  {calculation && (
    <p>You would be {formatCurrency(calculation.betterOffAmount)} better off per month</p>
  )}
</div>
```

### 9. **Testing Strategy**

Create comprehensive tests:

```typescript
// Unit tests for calculations
describe('calculateBetterOff', () => {
  it('should calculate correct net earnings with 20% tax', () => {
    const result = calculateBetterOff(30, 12.21, 1000);
    expect(result.netEarnings).toBeCloseTo(30 * 12.21 * 4.33 * 0.8);
  });

  it('should apply taper rate correctly', () => {
    const result = calculateBetterOff(30, 15, 1000);
    const expectedReduction = (result.netEarnings - 379) * 0.55;
    expect(result.ucReduction).toBeCloseTo(expectedReduction);
  });
});

// Integration tests
describe('BetterOffCalculator component', () => {
  it('should update results when calculate button is clicked', () => {
    // Test user interactions
  });
});
```

### 10. **Performance Optimization**

Use React optimization hooks:

```typescript
import { useMemo, useCallback } from 'react';

// Memoize expensive calculations
const monthlyCosts = useMemo(() =>
  calculateMonthlyCosts(costsData),
  [costsData]
);

// Memoize event handlers
const handleCalculate = useCallback(() => {
  calculateBetterOff();
}, [workData, currentUCAmount]);
```

### 11. **Data Persistence**

Add ability to save scenarios:

```typescript
// Save to localStorage or backend
const handleSaveScenario = () => {
  const scenario = {
    name: 'Full-time work at £12.21/hour',
    workData,
    costsData,
    calculation,
    createdAt: new Date().toISOString()
  };

  localStorage.setItem(
    `better-off-scenario-${Date.now()}`,
    JSON.stringify(scenario)
  );
};
```

---

## Summary Checklist for Migration

- [ ] Convert component to TypeScript with proper interfaces
- [ ] Replace CSS classes with Tailwind utilities
- [ ] Integrate with existing Form components
- [ ] Pull rates data from central rates service
- [ ] Implement proper tax/NI calculation (replace 20% simplification)
- [ ] Add work allowance eligibility checks
- [ ] Adjust work allowance based on housing costs
- [ ] Set up routing (if standalone page)
- [ ] Add search params for state persistence
- [ ] Implement accessibility features (ARIA labels, live regions)
- [ ] Write unit and integration tests
- [ ] Add performance optimizations (useMemo, useCallback)
- [ ] Create scenario save/load functionality
- [ ] Add print/export functionality for results
- [ ] Implement responsive design testing
- [ ] Add loading states and error handling
- [ ] Document component API in Storybook (if used)
- [ ] Create migration for any required database changes

---

## Additional Resources

**Original Repository:** https://github.com/PhilAgulnik/better-off-calculator-test

**Key Files to Reference:**
- `/src/features/uc-calculator/components/BetterOffCalculator.js`
- `/src/features/uc-calculator/components/ResultsSection.js`
- `/src/features/uc-calculator/utils/calculator.js`
- `/src/shared/utils/formatters.js`
- `/src/index.css`

**Related Documentation:**
- GOV.UK Design System: https://design-system.service.gov.uk/
- Universal Credit rates: https://www.gov.uk/universal-credit
- TanStack Router docs: https://tanstack.com/router
- Tailwind CSS docs: https://tailwindcss.com/docs
