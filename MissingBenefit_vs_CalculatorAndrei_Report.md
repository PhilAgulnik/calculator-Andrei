# Comparison Report: missingbenefit.com vs calculator-Andrei (localhost:3000)

**Date:** February 17, 2026
**Method:** JavaScript bundle analysis of missingbenefit.com + source code analysis of calculator-Andrei
**Note:** missingbenefit.com is a JavaScript SPA; analysis was performed by downloading and parsing the production JavaScript bundle (`index-D9sS639J.js`, ~403KB).

---

## Executive Summary

**missingbenefit.com** is a comprehensive, multi-benefit calculator using the GOV.UK Design System that calculates **19+ different benefits** with full user authentication, API access, and saved assessments. It uses a task-list style journey and covers the entire UK benefits landscape including pensions, disability benefits, devolved benefits, and energy/heating support.

**calculator-Andrei** (localhost:3000) is a focused Universal Credit calculator with a modern tech stack (React 19, TypeScript, Vite, TanStack Router, Tailwind CSS) that calculates **3 primary benefits** (UC, Child Benefit, Free School Meals) with several integrated analysis tools (better-off calculator, carer module, net earnings calculator, PDF export).

**The core difference:** missingbenefit.com is a *benefits discovery platform* ("what could you get?") while calculator-Andrei is a *UC calculation tool* ("how much UC will you get?").

---

## Part 1: Architecture & Design Comparison

| Aspect | missingbenefit.com | calculator-Andrei |
|--------|-------------------|-------------------|
| **Design system** | GOV.UK Design System (govuk-frontend) | Tailwind CSS 4.x custom design |
| **Navigation pattern** | Task-list / check-your-answers (GDS pattern) | Linear wizard workflow with sidebar |
| **User accounts** | Full auth: register, login, email verification, password reset | Admin-only login (password protection) |
| **API** | Backend API (`/api/calculate`, `/api/assessments`, `/api/auth/*`) | Client-side only (no backend) |
| **API documentation** | `/api-docs` route + API key management | None |
| **Data persistence** | Server-side (user accounts + saved assessments) | localStorage only |
| **Benefit cap** | Fully implemented (Step 5 in UC calculation) | Not implemented |
| **Location awareness** | Postcode-based, detects London boroughs for benefit cap rates | Area selection (England/Scotland/Wales/NI) |

---

## Part 2: Benefits Calculated

### missingbenefit.com calculates 19+ benefits:

| # | Benefit | Present in calculator-Andrei? |
|---|---------|-------------------------------|
| 1 | **Universal Credit** | YES |
| 2 | **Pension Credit** (Guarantee + Savings Credit) | NO |
| 3 | **State Pension** (including deferral, SERPS/S2P) | NO |
| 4 | **Personal Independence Payment (PIP)** | Partial (input only, not calculated) |
| 5 | **Attendance Allowance** | Partial (input only, not calculated) |
| 6 | **Carer's Allowance** | YES (via Carer Module) |
| 7 | **Child Benefit** | YES |
| 8 | **Employment and Support Allowance (ESA)** | NO |
| 9 | **New Style JSA** | NO |
| 10 | **Housing Benefit (Pension Age)** | NO |
| 11 | **Council Tax Reduction** | NO (council tax page exists but no CTR calculation) |
| 12 | **Support for Mortgage Interest (SMI)** | NO |
| 13 | **Winter Fuel Payment** | NO |
| 14 | **Free TV Licence** | NO |
| 15 | **Warm Home Discount** | NO |
| 16 | **NHS Low Income Scheme** | NO |
| 17 | **Scottish benefits** (Scottish Child Payment, Best Start, etc.) | NO |
| 18 | **Welsh benefits** | NO |
| 19 | **Northern Ireland benefits** | NO |
| 20 | **Free School Meals** | YES |

**Summary: calculator-Andrei covers 4 out of 19+ benefits (21%)**

---

## Part 3: Input Questions / Assessment Pages Comparison

### missingbenefit.com assessment sections:

| Section | Key Questions | calculator-Andrei equivalent |
|---------|--------------|------------------------------|
| **About you** | Date of birth (not just age), relationship status, nationality/immigration status | Partial - uses age number, no DOB, no immigration check |
| **Your partner** | Partner DOB, employment status, disability, immigration status (NRPF check) | Partial - has partner age/employment/disability but no immigration check |
| **Your housing** | Housing situation (rent/own/mortgage/hostel/no fixed address/rent-free), rent amount, service charges, ground rent, mortgage details, bedrooms, non-dependant income bands | Partial - has housing but missing: mortgage details, ground rent, hostel/no fixed address, non-dependant income bands |
| **Your work and income** | Employment status (employed FT/PT, self-employed, student, not working, retired, carer), gross annual income, net monthly income, self-employment income, pension contributions, other income, private pensions | Partial - has employment/earnings but missing: FT/PT distinction, student status, retirement status, annual income |
| **Health and disability** | Full PIP-style assessment questions (9 daily living questions + mobility), WCA status (LCW/LCWRA/fit for work/waiting/not assessed), terminal illness, night-time care needs | Partial - has disability/LCWRA but missing: PIP-style activity questions, LCW (separate from LCWRA), terminal illness |
| **Caring responsibilities** | Hours of care, qualifying benefit of person cared for, receiving Carer's Allowance already? | YES - covered via Carer Module |
| **Children and young people** | Number, ages, sex, DLA/PIP, disabled child bedroom need | Partial - has children but missing: sex of children, disabled child bedroom need |
| **Childcare costs** | Monthly childcare costs | YES |
| **Pensions and retirement** | State Pension receipt, amount, deferral, NI qualifying years, SERPS/S2P, Pension Credit receipt | NO - pension questions are entirely missing |
| **Heating and household costs** | Heating type (gas/electric/oil/solid fuel), council tax band, CT exemptions, domestic rates (NI) | Partial - has council tax band but missing: heating type, CT exemptions, NI domestic rates |
| **Check your answers** | Full summary page before calculating | NO - no review page |

---

## Part 4: Calculation Logic Differences

### 4a. Universal Credit Calculation

| Feature | missingbenefit.com | calculator-Andrei |
|---------|-------------------|-------------------|
| Standard Allowance | YES | YES |
| Child Element | YES (with two-child limit) | YES (with two-child limit) |
| Housing Element (rent) | YES | YES |
| Housing Element (mortgage/SMI) | YES | NO |
| Childcare Element | YES (with work requirement check) | YES (but no work requirement check) |
| Carer Element | YES | YES |
| LCWRA Element | YES | YES |
| LCW Element | YES (separate from LCWRA) | NO (no LCW distinction) |
| Work Allowance | YES | YES |
| Taper Rate (55%) | YES | YES |
| Capital/Savings deductions | YES | YES |
| **Benefit Cap** | **YES (London/non-London, exemptions)** | **NO** |
| **Non-dependant deductions** | **YES (6 income bands)** | **NO** |
| Transitional Protection | Referenced | Partial |
| Postcode-based London detection | YES | NO |
| MIF (Minimum Income Floor) | Not clear from bundle | YES (detailed implementation) |

### 4b. Pension Credit (missing entirely from calculator-Andrei)

missingbenefit.com calculates Pension Credit in 5 steps:
1. Calculate Guarantee Credit level (standard + additions)
2. Calculate weekly income
3. Calculate Guarantee Credit = Max(0, Guarantee level - Total weekly income)
4. Calculate Savings Credit (if eligible - pre-April 2016 pension age only)
5. Total Pension Credit = Guarantee Credit + Savings Credit

Monthly conversion: `Total weekly x 52 / 12`

### 4c. Housing Benefit for Pensioners (missing from calculator-Andrei)

missingbenefit.com references Housing Benefit (Pension Age) with:
- National prescribed scheme
- 20% taper rate (vs UC's 55%)
- Non-dependant deductions
- Separate from UC housing element

### 4d. Council Tax Reduction (missing from calculator-Andrei)

missingbenefit.com calculates CTR with:
- Pension-age scheme (national prescribed, 20% taper)
- Working-age scheme
- Council tax exemptions (severe mental impairment, supported housing, student)

### 4e. PIP Assessment (missing from calculator-Andrei)

missingbenefit.com includes detailed PIP activity questions:

**Daily Living Activities:**
1. Preparing and cooking food
2. Eating and drinking
3. Managing treatments/medication
4. Washing and bathing
5. Dressing and undressing
6. Communicating verbally
7. Reading and understanding
8. Mixing with other people
9. Managing money

**Mobility Activities:**
1. Planning and following journeys
2. Moving around (walking distance assessment: >200m, 20-200m, <20m, wheelchair)

These are used to estimate PIP entitlement - calculator-Andrei only asks which rate the user already receives.

### 4f. Other Benefit Calculations (all missing from calculator-Andrei)

- **ESA**: Contributory ESA assessment based on NI record
- **New Style JSA**: Based on NI contributions, pension deduction rules (>£50/week)
- **SMI**: Support for Mortgage Interest (loan-based support for mortgage payments)
- **Winter Fuel Payment**: Based on age, living arrangement, qualifying benefits
- **Free TV Licence**: Based on age (75+) and Pension Credit receipt
- **Warm Home Discount**: Based on heating type and qualifying benefits
- **NHS Low Income Scheme**: Based on income assessment
- **Devolved benefits**: Scottish Child Payment, Best Start Grant, Welsh/NI specific benefits

---

## Part 5: User Experience Differences

| Feature | missingbenefit.com | calculator-Andrei |
|---------|-------------------|-------------------|
| **Design pattern** | GOV.UK task list ("Check what benefits you could get") | Custom wizard with progress sidebar |
| **Input method** | One question per page (GDS pattern) | Multiple questions per page |
| **Check answers** | Full review page before calculation | No review page |
| **Date of birth** | Actual DOB input (day/month/year) | Age as number |
| **Postcode** | Used for London detection, LHA rates | Available but limited use |
| **Results format** | Per-benefit cards with monthly amounts | UC-focused with element breakdown |
| **Saved assessments** | Server-side with user accounts | localStorage with scenario naming |
| **Better-off comparison** | Dedicated `/betteroffcomparison` route | Embedded in results page |
| **Calculation logic** | Dedicated `/calculation-logic` page explaining methodology | No methodology page |
| **About page** | `/about` explaining the service | No about page |
| **Privacy policy** | `/privacy` route | No privacy policy |
| **API access** | `/api-docs` with API keys for integration | No API |

---

## Part 6: Features calculator-Andrei Has That missingbenefit.com Does Not

calculator-Andrei has several features that appear absent or less developed in missingbenefit.com:

| Feature | calculator-Andrei | missingbenefit.com |
|---------|-------------------|-------------------|
| **Minimum Income Floor (MIF)** | Detailed MIF calculation with work hours conditionality, age-based NMW rates, accordion breakdown | Not clearly present |
| **Self-employment tools hub** | Stub page with 6 planned tools (invoices, tax form, etc.) | Not present |
| **Net Earnings Module** | Interactive tax/NI/pension/student loan breakdown calculator | Asks for net income directly |
| **PDF Export** | Professional PDF generation with jsPDF | Not present in bundle analysis |
| **LHA Rate Display** | Expandable panel showing all BRMA rates for selected area | Not clearly present |
| **Multi-year tax rates** | Supports 2023/24 through 2026/27 | Not clear from bundle |
| **Admin panel** | Full admin with themes, text management, settings | Has `/admin` route (unclear scope) |
| **Theme/skin system** | Multiple themes with route-based switching | Uses GOV.UK fixed design |
| **Benefit rates comparison page** | `/benefit-rates` showing 2025/26 vs 2026/27 side-by-side | Not present |
| **Example scenarios** | Pre-built scenarios for testing | Not present in bundle analysis |
| **Scenario comparison** | Side-by-side scenario comparison tool | Has `/betteroffcomparison` |

---

## Part 7: Summary of Critical Gaps in calculator-Andrei

### Tier 1: Major Missing Benefits (high user impact)

1. **Pension Credit** - Critical for anyone at/near State Pension Age. missingbenefit.com has full Guarantee + Savings Credit calculation.
2. **Housing Benefit (Pension Age)** - Pensioners cannot get UC housing element; they get HB instead.
3. **Council Tax Reduction** - Significant household cost reduction available to most UC claimants.
4. **ESA (New Style)** - Contributory benefit for those with NI record and health conditions.
5. **New Style JSA** - Contributory benefit for those with NI record seeking work.
6. **Support for Mortgage Interest** - For homeowners on UC/Pension Credit.

### Tier 2: Missing Calculation Features (accuracy impact)

7. **Benefit Cap** - Can reduce UC by over $1,000/month. missingbenefit.com applies it; calculator-Andrei does not.
8. **Non-dependant deductions** - Reduces housing element by $44-$173/month per non-dependant.
9. **LCW distinction** - LCW (Limited Capability for Work) is different from LCWRA; affects work allowance eligibility.
10. **Childcare eligibility check** - Must be working to claim childcare element.
11. **Mortgage housing costs** - No support for homeowner mortgage interest in UC.

### Tier 3: Missing Supplementary Benefits (breadth impact)

12. **Winter Fuel Payment** - Up to $300/year for pensioners.
13. **Warm Home Discount** - $150/year energy rebate.
14. **Free TV Licence** - For over-75s on Pension Credit.
15. **NHS Low Income Scheme** - Help with health costs.
16. **PIP estimation** - Activity-based PIP assessment rather than just entering known rate.
17. **Devolved benefits** - Scottish Child Payment ($27.15/week per child), Welsh benefits, NI benefits.

### Tier 4: Missing UX/Platform Features

18. **User accounts and server-side storage** - Registration, login, email verification.
19. **API for integrations** - `/api/calculate` endpoint with API keys.
20. **Check-your-answers page** - GDS-pattern review page before results.
21. **Calculation logic explanation** - Transparency page explaining methodology.
22. **Privacy policy** - Required for production use.
23. **Date of birth input** - More accurate than age number for pension age calculations.
24. **Postcode-based London detection** - For benefit cap rates and LHA lookup.
25. **Immigration/NRPF check** - "No Recourse to Public Funds" screening.

---

# Recommended Changes

## Priority 1: Critical Calculation Fixes (Essential for Accuracy)

These should be implemented before any new features as they affect the correctness of existing UC calculations:

### 1.1 Implement Benefit Cap
- **Why:** Without this, calculator-Andrei can overstate UC by over $1,000/month for larger families
- **What:** Add benefit cap calculation (London: $2,110/month family, $1,414/month single; Outside London: $1,835/month family, $1,229/month single)
- **Include:** Exemptions for LCWRA, carer element, earnings over $846/month, grace period
- **Requires:** London/non-London detection (postcode-based or manual selection)
- **Files:** `src/products/benefits-calculator/utils/calculator.ts`

### 1.2 Add Non-Dependant Deductions
- **Why:** Adult household members reduce the housing element; without this, housing costs are overstated
- **What:** Add income-banded deductions ($44-$173/month based on non-dependant's weekly income)
- **Requires:** New questions about non-dependant adults' income levels
- **Files:** `src/products/benefits-calculator/utils/calculator.ts`, housing-costs page

### 1.3 Add LCW Status (Separate from LCWRA)
- **Why:** LCW and LCWRA are different; LCW qualifies for work allowance but not the LCWRA element. Currently only LCWRA is asked about.
- **What:** Add "Limited Capability for Work" option alongside LCWRA
- **Files:** `src/products/benefits-calculator/age-and-disability.tsx`, `calculator.ts`

### 1.4 Add Childcare Eligibility Check
- **Why:** Childcare element requires the claimant (and partner in a couple) to be in paid work
- **What:** Validate employment status before allowing childcare costs
- **Files:** `src/products/benefits-calculator/utils/calculator.ts`, children page

---

## Priority 2: Major Missing Benefits (Significantly Expand Coverage)

### 2.1 Add Pension Credit Calculator
- **Why:** Critical for anyone at/near State Pension Age; often unclaimed
- **What:** Implement Guarantee Credit + Savings Credit calculation
- **Includes:** Standard minimum guarantee, severe disability addition, carer addition, housing costs addition, income assessment
- **New files:** `utils/pensionCreditCalculator.ts`, `types/pension-credit.ts`
- **New page/section:** Either a new assessment page or integrated into results when age >= State Pension Age

### 2.2 Add Council Tax Reduction
- **Why:** Significant cost - can save $100+/month; missingbenefit.com calculates this
- **What:** Implement CTR for both working-age (simplified) and pension-age (national prescribed scheme with 20% taper)
- **Requires:** Council tax band, exemption status, income assessment
- **Note:** Working-age schemes vary by local authority; consider a simplified/typical scheme with a disclaimer

### 2.3 Add Housing Benefit (Pension Age)
- **Why:** Pensioners get HB not UC; needed alongside Pension Credit
- **What:** Implement pensioner HB with national prescribed scheme, 65% taper (or 20% for pension-age CTR)
- **Note:** Can reuse some LHA logic from UC housing element

### 2.4 Add Support for Mortgage Interest (SMI)
- **Why:** Homeowners on UC can get help with mortgage interest; currently calculator-Andrei ignores homeowners
- **What:** Add mortgage questions (outstanding amount, monthly payment) and calculate SMI loan
- **Requires:** New housing situation option and input fields

### 2.5 Add ESA and JSA (New Style)
- **Why:** Contributory benefits that can be paid alongside UC; missingbenefit.com shows these
- **What:** Basic eligibility indication based on NI record and work status
- **Note:** These are not means-tested in the same way; can show eligibility indicator rather than exact amount

---

## Priority 3: Supplementary Benefits (Increase Coverage Breadth)

### 3.1 Add Winter Fuel Payment
- **Why:** Up to $300/year for pensioners on qualifying benefits
- **What:** Simple eligibility check based on age and Pension Credit receipt

### 3.2 Add Warm Home Discount
- **Why:** $150/year energy rebate; missingbenefit.com asks about heating type
- **What:** Eligibility based on Pension Credit Guarantee Credit or low income

### 3.3 Add NHS Low Income Scheme
- **Why:** Helps with prescription costs, dental, eye tests, travel to hospital
- **What:** Eligibility indicator when on UC or low income

### 3.4 Add Free TV Licence
- **Why:** For over-75s on Pension Credit
- **What:** Simple eligibility check

### 3.5 Add Devolved Benefits
- **Why:** Scottish Child Payment alone is worth $117/month per child for Scottish families on UC
- **What:**
  - Scotland: Scottish Child Payment, Best Start Grant, Best Start Foods, School Clothing Grant
  - Wales: Welsh-specific FSM rules (universal primary), Council Tax Reduction (standardised scheme)
  - Northern Ireland: Domestic rates (not council tax), different FSM thresholds ($14,000 vs $7,400)

### 3.6 Add PIP Estimation Tool
- **Why:** missingbenefit.com has detailed PIP activity questions to estimate entitlement
- **What:** Add optional PIP activity assessment (9 daily living + 2 mobility questions) to estimate PIP rate
- **Note:** This is a significant UX addition; could be a separate tool linked from the main calculator

---

## Priority 4: UX and Platform Improvements

### 4.1 Add Check-Your-Answers Page
- **Why:** GOV.UK standard pattern; lets users review all inputs before calculating
- **What:** Summary page showing all entered data with "Change" links back to each section

### 4.2 Add Calculation Logic Page
- **Why:** Transparency; missingbenefit.com has a dedicated `/calculation-logic` page
- **What:** Page explaining how each benefit is calculated, rates used, data sources

### 4.3 Switch to Date of Birth Input
- **Why:** More accurate for State Pension Age calculation and benefit eligibility
- **What:** Replace age number input with DOB fields (day/month/year)

### 4.4 Add Postcode-Based London Detection
- **Why:** Benefit cap rates differ for London/non-London; LHA rates are postcode-based
- **What:** Use postcode to auto-detect London borough status and suggest correct BRMA

### 4.5 Add Immigration/NRPF Check
- **Why:** People with "No Recourse to Public Funds" cannot claim most benefits
- **What:** Add question about immigration status with appropriate signposting

### 4.6 Add Privacy Policy and About Pages
- **Why:** Required for any production deployment
- **What:** Add `/privacy` and `/about` routes

---

## Priority 5: API and Integration (Future Platform)

### 5.1 Add Backend API
- **Why:** missingbenefit.com has `/api/calculate` for programmatic access
- **What:** Create API endpoint that accepts assessment data and returns benefit calculations
- **Note:** This is a significant architectural change; assess need before implementing

### 5.2 Add User Accounts
- **Why:** Server-side storage of assessments, shareable results
- **What:** Registration, login, email verification, saved assessments
- **Note:** Requires backend infrastructure

### 5.3 Add API Documentation
- **Why:** Enable third-party integrations
- **What:** Swagger/OpenAPI documentation for calculation API

---

## Implementation Roadmap Summary

| Phase | Items | Impact | Effort Estimate |
|-------|-------|--------|----------------|
| **Phase 1: Accuracy Fixes** | Benefit cap, non-dependant deductions, LCW status, childcare eligibility | Prevents incorrect calculations | 2-3 days |
| **Phase 2: Major Benefits** | Pension Credit, Council Tax Reduction, Housing Benefit (pension), SMI, ESA/JSA indicators | Covers 80%+ of what missingbenefit.com offers | 2-3 weeks |
| **Phase 3: Supplementary** | Winter Fuel, Warm Home, NHS, TV Licence, devolved benefits, PIP estimation | Full benefit coverage | 1-2 weeks |
| **Phase 4: UX Polish** | Check answers page, calculation logic page, DOB input, postcode detection, NRPF, policies | Production-ready UX | 1-2 weeks |
| **Phase 5: Platform** | Backend API, user accounts, API docs | Enterprise-grade platform | 4-8 weeks |

---

## Appendix: Complete Route Comparison

| missingbenefit.com Route | Purpose | calculator-Andrei Equivalent |
|--------------------------|---------|------------------------------|
| `/` | Landing page | `/` (home) |
| `/about` | About the service | None |
| `/admin` | Admin panel | `/admin` (implemented) |
| `/api-keys` | API key management | None |
| `/assessment/:id` | View/edit assessment | `/benefits-calculator/$id/$slug` |
| `/betteroffcomparison` | Better-off comparison | Embedded in results page |
| `/calculation-logic` | How calculations work | None |
| `/forgot-password` | Password recovery | None |
| `/login` | User login | `/login` (admin only) |
| `/privacy` | Privacy policy | None |
| `/register` | User registration | None |
| `/reset-password` | Password reset | None |
| `/results/:id` | Calculation results | `/benefits-calculator/$id/results` |
| `/saved` | Saved assessments | Embedded in results (localStorage) |
| `/verify-email` | Email verification | None |

---

**End of Report**
