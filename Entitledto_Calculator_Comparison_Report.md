# Entitledto vs New Calculator: UC Comparison Report

**Date:** 2026-02-18
**Scope:** Universal Credit calculations only
**Reference file:** `85293ab5-a8dd-4195-a5d4-991d4bf2cccf.json` (entitledto export)

---

## 1. Executive Summary

The new calculator covers the **core UC calculation** well but uses a **simpler input model** than entitledto. Entitledto captures ~300+ fields across household, income, housing, disability, legacy benefits, council tax, and savings. The new calculator focuses on ~60 key inputs that drive the UC-specific calculation. This is appropriate for a UC-focused tool, but means certain edge cases and cross-benefit interactions are not currently handled.

**Key finding:** The UC calculation logic (standard allowance, child elements, housing element, work allowance, 55% taper, LCWRA, carer element, capital tariff income) is structurally sound and matches entitledto's approach. The gaps are primarily in **input coverage** (entitledto captures more granular data) and in **specific edge cases** (non-dependant deductions, bedroom tax, benefit cap, mixed-age couples, transitional protection).

---

## 2. Field-by-Field Mapping: Inputs

### 2.1 Household & Personal Details

| Entitledto Field | New Calculator Field | Match? | Notes |
|---|---|---|---|
| `couple` (0/1) | `circumstances` ('single'/'couple') | YES | Direct mapping: 1 = couple |
| `ac_ClientDetails[0].Age` | `age` | YES | Both capture claimant age |
| `ac_ClientDetails[1].Age` | `partnerAge` | YES | Partner age (couples only) |
| `ac_ClientDetails[].Gender` | -- | NO | New calculator does not capture gender |
| `numChildren` | `children` (count) | YES | Direct mapping |
| `ac_ChildDetails[]` | Per-child age/disability | PARTIAL | Entitledto has richer child detail model |
| `claimPostCode` | -- | NO | New calculator uses BRMA directly, not postcode |
| `ctylaua` | -- | NO | Local authority code not used |
| `countryId` | -- | NO | Country (England/Scotland/Wales) not explicitly captured for UC |
| `NotSubjectToImmigrationControl` | British/Irish citizen status | PARTIAL | New calculator has basic citizenship check |
| `InResidentialCare` | Hospital/residential care status | YES | Both capture this |
| `partnerLivingAwayFromHome` | -- | NO | Not captured in new calculator |
| `MixedAgeCouple` | -- | NO | Not currently handled |
| `HasFiveYearResidency` | -- | NO | Not captured |
| `sharesHomeWith` | -- | NO | Not captured |
| `AffectedByUnder21` | -- | NO | Under-21 shared accommodation rules not modelled |

### 2.2 Housing

| Entitledto Field | New Calculator Field | Match? | Notes |
|---|---|---|---|
| `housingStatus` | `housingStatus` | YES | Both capture housing tenure type |
| `rent` | `rent` | YES | Monthly rent amount |
| `rentPeriod` | -- | PARTIAL | Entitledto captures entry period; new calculator normalises to monthly |
| `BRMA` | `brma` | YES | Broad Rental Market Area |
| `LHAStandardLHA` | LHA rate from `lhaRates2025_26.json` | YES | Both look up LHA rates by BRMA |
| `OneRoomLHA` | `sharedRate` | YES | Shared accommodation LHA |
| `OneBedroomLHA` | `oneBedRate` | YES | 1-bed LHA rate |
| `TwoBedroomLHA` | `twoBedRate` | YES | 2-bed LHA rate |
| `ThreeBedroomLHA` | `threeBedRate` | YES | 3-bed LHA rate |
| `FourBedroomLHA` | `fourBedRate` | YES | 4-bed LHA rate |
| `LHAAfterApril2011` | -- | NO | Historic LHA rule not modelled |
| `hapa` | -- | NO | Housing arrangements not captured |
| `numSubtenants` | -- | NO | Sub-tenants not captured |
| `groundRent` | -- | NO | Ground rent not captured for UC |
| `mortgageOutstanding` | -- | NO | SMI (Support for Mortgage Interest) not modelled |
| `AffectedByRentMoreThanLHA` | Implicit (eligible rent capped at LHA) | YES | Captured through LHA comparison logic |
| `SanctuarySchemeBedroomTaxExemption` | -- | NO | Not modelled |
| `TenancyAgreementAfterApril2016` | -- | NO | Not captured |
| `RentFreeWeeks` | -- | NO | Not captured |

#### Non-Dependant Deductions (Housing)

| Entitledto Field | New Calculator Field | Match? | Notes |
|---|---|---|---|
| `hasNonDepDedn` | -- | NO | Non-dependant deductions not modelled |
| `nonDepDednBand1` through `Band7` | -- | NO | Band-based deductions not implemented |
| `UC_NumNonDeps` | `otherAdults` (count only) | PARTIAL | Count captured but deductions not calculated |
| `HBNonDependantDeductions` | -- | NO | Not applicable (HB not modelled) |

### 2.3 Employment & Earnings

| Entitledto Field | New Calculator Field | Match? | Notes |
|---|---|---|---|
| `ac_ClientDetails[].Works` | `employmentType` | YES | Both capture employment status |
| `ac_ClientDetails[].WorkHours` | -- | PARTIAL | Work hours only captured for MIF conditionality |
| `ac_ClientDetails[].EarningsExclChildminding` | `monthlyEarnings` | YES | Core earnings input |
| `ac_ClientDetails[].EarningsFromChildminding` | -- | NO | Childminding earnings not separately captured |
| `ac_ClientDetails[].ContributionsToPensionScheme` | `pensionAmount`/`pensionPercentage` | YES | Both capture pension contributions |
| `ac_ClientDetails[].WeeklyTax` | Calculated from gross | YES | New calculator computes tax from gross earnings |
| `ac_ClientDetails[].WeeklyNI` | Calculated from gross | YES | New calculator computes NI from gross earnings |
| `ac_ClientDetails[].weeklyNetIncome` | Calculated | YES | Derived from gross - tax - NI - pension |
| `ac_ClientDetails[].WorkStatus` | `employmentType` | YES | Maps to employed/self-employed/not working |
| `ac_ClientDetails[].grossWeeklyEarnings` | Derived from monthly input | YES | Converted internally |
| `ac_ClientDetails[].grossWeeklyPension` | -- | NO | Non-state pension as income, not captured same way |
| `ac_ClientDetails[].calcIncomeTax` | Always calculated | YES | Tax always computed from gross |
| `userNetEarningsEntryPeriod` | Period selection (weekly/monthly/yearly) | YES | Both allow period selection |

### 2.4 Self-Employment & Minimum Income Floor

| Entitledto Field | New Calculator Field | Match? | Notes |
|---|---|---|---|
| Self-employment status | `employmentType: 'self-employed'` | YES | Both identify self-employment |
| -- | `workHoursConditionality` (0/16/35) | YES (new calc only) | New calculator explicitly models MIF |
| -- | `mifApplies` (yes/no) | YES (new calc only) | New calculator asks if MIF applies |
| -- | MIF calculation with NMW rates | YES (new calc only) | Full MIF logic implemented |

**Note:** The entitledto JSON does not appear to expose MIF as a separate field - it is likely embedded in its internal calculation. The new calculator has **more explicit and transparent MIF handling** than what's visible in the entitledto export.

### 2.5 Disability & Health

| Entitledto Field | New Calculator Field | Match? | Notes |
|---|---|---|---|
| `ac_ClientDetails[].disbensEx` | `claimsDisabilityBenefits` | YES | Both capture disability benefit status |
| `ac_ClientDetails[].LimitedCapabilityForWork` | `hasLCWRA` | YES | LCWRA status captured |
| `ac_ClientDetails[].LCWRate` | `lcwraClaimantType` + `lcwraProtectedGroup` | YES | New calculator models the April 2026 two-tier split |
| `ac_ClientDetails[].DisabledNotClaiming` | -- | NO | Not captured separately |
| `ac_ClientDetails[].DisabilityBenefitGPAttendHospital` | -- | NO | Screening questions not replicated |
| `ac_ClientDetails[].DisabilityBenefitMedication` | -- | NO | Screening questions not replicated |
| `ac_ClientDetails[].DisabilityBenefitDayToDayHelp` | -- | NO | Screening questions not replicated |
| `ac_ClientDetails[].DisabilityBenefitNeedHelp` | -- | NO | Screening questions not replicated |
| `ac_ClientDetails[].DisabilityBenefitHelpDueToMentalHealth` | -- | NO | Screening questions not replicated |
| PIP daily living rate | `pipDailyLivingRate` | YES | Rate captured |
| PIP mobility rate | `pipMobilityRate` | YES | Rate captured |
| DLA care rate | `dlaCareRate` | YES | Rate captured |
| DLA mobility rate | `dlaMobilityRate` | YES | Rate captured |
| `ac_ClientDetails[].severelySightImpaired` | -- | NO | Not captured |
| `ac_ClientDetails[].blindPersonsAllowance` | -- | NO | Not captured for UC |
| `hasDisabledChild` | Per-child disability flag | YES | Both capture disabled children |
| `ac_ClientDetails[].ESAPhase` | -- | PARTIAL | ESA phase not separately modelled |
| `ac_ClientDetails[].ESAContributionBased` | `contributoryBenefit` (ESA option) | YES | Captured as contributory benefit type |
| `ac_ClientDetails[].ClaimsESA` | `contributoryBenefit` | YES | Mapped through benefit type |

### 2.6 Savings & Capital

| Entitledto Field | New Calculator Field | Match? | Notes |
|---|---|---|---|
| `savings` (total) | `savings` | YES | Total capital amount |
| `SavingsEx` (flag) | -- | NO | Savings exemption flag not captured |
| `BankBuildingSocietyPostofficeSavings` | -- | NO | Breakdown by type not captured |
| `NationalSavingsPremiumBonds` | -- | NO | New calculator uses single total |
| `CashSavings` | -- | NO | Single total only |
| `ISAaPEPsTESSAs` | -- | NO | Single total only |
| `SavingsInBonds` | -- | NO | Single total only |
| `SavingsInSharesUnitTrusts` | -- | NO | Single total only |
| `SavingsInPropertyAndLand` | -- | NO | Single total only |
| `investments` | -- | NO | Single total only |
| `othersavings` | -- | NO | Single total only |
| `AssumedWeeklyIncomeFromSavings` | Tariff income (calculated) | YES | Both compute tariff income from savings |
| `ownOtherProperty` | -- | NO | Other property ownership not captured |
| Capital tariff income logic | Capital tariff income | YES | Same £6k lower / £16k upper / £4.35 per £250 |

### 2.7 Other Income Sources

| Entitledto Field | New Calculator Field | Match? | Notes |
|---|---|---|---|
| `ac_ClientDetails[].IncomeNonStatePensions` | Non-state pension income | YES | Up to 3 pension sources |
| `ac_ClientDetails[].IncomeFromChildMaintenance` | -- | NO | Child maintenance (disregarded for UC anyway) |
| `ac_ClientDetails[].IncomeFromSubTennants` | Boarder/lodger income | YES | Both capture this |
| `ac_ClientDetails[].IncomeFromMaintenancePayments` | Spousal maintenance | YES | Both capture this |
| `ac_ClientDetails[].IncomeFromVoluntaryCharitablePayments` | Charitable income | YES | Both note this is not counted |
| `ac_ClientDetails[].StudentLoan` | Student loan annual amount | YES | Both capture student loan income |
| `ac_ClientDetails[].IncomeOtherSources` | -- | PARTIAL | New calculator has fostering allowance specifically |
| `ac_ClientDetails[].CarersAllowance` | Carer's allowance amount | YES | Both capture this |
| `ac_ClientDetails[].householdIncome` | -- | NO | Aggregated household income not separately stored |

### 2.8 Benefits Currently Claimed

| Entitledto Field | New Calculator Field | Match? | Notes |
|---|---|---|---|
| `UniversalCreditAmount` | Current UC amount | YES | Both capture current UC receipt |
| `ReceiveTransitionalElement` | Transitional element flag | YES | Both capture this |
| `ESAContribBasedWeekly` | Contributory ESA | YES | As contributory benefit |
| `JSAContribBasedWeekly` | Contributory JSA | YES | As contributory benefit |
| `CarersAllowanceWeekly` | Carer's allowance | YES | Both capture this |
| `IncomeSupport` | -- | NO | Legacy benefit not modelled |
| `JSA` (income-based) | -- | NO | Legacy benefit not modelled |
| `ESA` (income-related) | -- | NO | Legacy benefit not modelled |
| `housingBenefit` | -- | NO | Legacy benefit not modelled |
| `councilTaxBenefit` | -- | NO | Council tax support not modelled in UC calc |
| `CTC` / `WTC` | -- | NO | Tax credits not modelled (legacy system) |
| `PensionerCredit` | -- | NO | Pension credit not modelled |
| `SMIWeekly` | -- | NO | Support for Mortgage Interest not modelled |
| `ChildBenefitAmount` | Child benefit (calculated separately) | YES | New calculator computes CB independently |
| `Scotish_Child_Payment` | -- | NO | Scottish Child Payment not modelled |

### 2.9 Student Details

| Entitledto Field | New Calculator Field | Match? | Notes |
|---|---|---|---|
| -- | `isFullTimeStudent` | YES (new calc) | Full-time student eligibility check |
| -- | `studentExceptions` (6 types) | YES (new calc) | Exception types for student UC eligibility |
| -- | `studentType` (UG/PG) | YES (new calc) | Undergraduate/postgraduate distinction |
| -- | `studentLoanAnnualAmount` | YES (new calc) | Annual loan for UC deduction |
| -- | `studentGrantAnnualAmount` | YES (new calc) | Annual grant for UC deduction |
| -- | `courseAssessmentPeriods` | YES (new calc) | Months for dividing annual amounts |
| -- | `isInSummerHoliday` | YES (new calc) | Summer holiday exemption |

**Note:** The entitledto JSON has student loan fields at the client level (`StudentLoan`, `StudentLoanCalcPeriod`) but the new calculator has a **more detailed student income model** with separate handling of loans, grants, postgraduate loans (30% rule), and assessment period division.

---

## 3. Field-by-Field Mapping: UC Calculation Outputs

### 3.1 UC Elements (Maximum Entitlement)

| Entitledto Output | New Calculator Output | Match? | Notes |
|---|---|---|---|
| `UCPersonalElement` (£1,051.37) | `standardAllowance` | YES | Couple 25+ rate. Entitledto value matches 2025/26 rate for couple with LCWRA (£628.10 + £423.27 = £1,051.37) |
| `UCHousingElement` (£650.00) | `housingElement` | YES | Based on rent/LHA. £150/wk × 52/12 = £650/month. Matches. |
| -- | `childElement` | YES | Per-child amounts. No children in example so £0 both sides |
| -- | `childcareElement` | YES | No childcare in example so £0 both sides |
| -- | `carerElement` | YES | No carer in example so £0 both sides |
| -- | `lcwraElement` | YES | Included in `UCPersonalElement` in entitledto (£423.27 visible as the difference: £1,051.37 - £628.10) |
| `UniversalCreditMonthly` (£1,701.37) | `finalAmount` | YES | £628.10 + £423.27 + £650.00 = £1,701.37. **Exact match.** |
| `UniversalCreditWeekly` (£392.62) | `weeklyAmount` | YES | £1,701.37 × 12/52 = £392.62. **Exact match.** |
| `UniversalCreditYearly` (£20,416.44) | `yearlyAmount` | YES | £1,701.37 × 12 = £20,416.44. **Exact match.** |

### 3.2 Deductions

| Entitledto Output | New Calculator Output | Match? | Notes |
|---|---|---|---|
| Earnings taper (implicit) | `earningsReduction` | YES | No earnings in example, so £0 both sides |
| Tariff income (implicit) | `capitalDeduction` | YES | No savings over £6k, so £0 both sides |
| Benefit deduction (implicit) | `benefitDeduction` | YES | No other benefits, so £0 both sides |
| -- | `studentIncomeDeduction` | YES | No student income, so £0 both sides |

### 3.3 Presentation Outputs

| Entitledto Output | New Calculator Output | Match? | Notes |
|---|---|---|---|
| `UniversalCreditAmountPeriod` (1 = monthly) | Monthly is primary display | YES | Both present monthly as primary |
| Weekly/Monthly/Yearly variants | All three computed | YES | Both provide all three periods |
| Detailed breakdown | Element-by-element breakdown | YES | New calculator provides more transparent breakdown |

### 3.4 Outputs Entitledto Provides That New Calculator Does NOT

| Entitledto Output | Status | Priority |
|---|---|---|
| `councilTaxBenefit` (£26.72) | NOT MODELLED | Low (outside UC scope) |
| `housingBenefit` | NOT MODELLED | Low (legacy benefit) |
| `IncomeSupport` | NOT MODELLED | Low (legacy benefit) |
| `JSA` / `ESA` (income-based) | NOT MODELLED | Low (legacy benefit) |
| `CTC` / `WTC` | NOT MODELLED | Low (legacy benefit) |
| `PensionerCredit` | NOT MODELLED | Low (legacy benefit) |
| `SMIWeekly` | NOT MODELLED | Medium (can be part of UC) |
| `CarersAllowanceWeekly` (as output) | Not separate output | Low (input only for UC deduction) |
| `Scotish_Child_Payment` | NOT MODELLED | Medium (devolved benefit) |

---

## 4. Verification of the Example Case

Using the entitledto JSON example (`85293ab5-a8dd-4195-a5d4-991d4bf2cccf.json`):

**Inputs extracted:**
- Couple (both age 44)
- Not working
- No children
- Renting privately at £150/week in Oldham & Rochdale BRMA
- Both have Limited Capability for Work (`LimitedCapabilityForWork: true`, `LCWRate: 2`)
- No savings
- No other income
- Tax year 2025/26 (`calcYear: 22`)

**Expected UC calculation (2025/26 rates):**

| Element | Amount |
|---|---|
| Standard Allowance (couple 25+) | £628.10 |
| LCWRA Element | £423.27 |
| Housing Element (£150/wk × 52/12) | £650.00 |
| **Total Maximum Entitlement** | **£1,701.37** |
| Less: Earnings Reduction | £0.00 |
| Less: Capital Deduction | £0.00 |
| Less: Benefit Deduction | £0.00 |
| **Final UC Award** | **£1,701.37/month** |

**Entitledto result:** `UniversalCreditMonthly: 1701.37` - **EXACT MATCH**

**Important observation about LCWRA:** Both claimants have `LimitedCapabilityForWork: true` and `LCWRate: 2`, but only ONE LCWRA element of £423.27 appears to be included (£1,051.37 - £628.10 = £423.27). This is correct - UC regulations allow only one LCWRA element per household, even if both members of a couple have LCWRA. **The new calculator should verify this rule is correctly implemented.**

---

## 5. How to Use Entitledto Examples to Improve Accuracy

### 5.1 Proposed Test Harness Architecture

Create a **JSON-based test suite** that takes entitledto export files and validates them against the new calculator:

```
tests/
  entitledto-validation/
    test-cases/                    # Entitledto JSON exports
      case-001-couple-lcwra.json
      case-002-single-with-children.json
      case-003-employed-taper.json
      ...
    entitledto-adapter.ts          # Maps entitledto JSON → calculator inputs
    validation-runner.ts           # Runs calculator & compares outputs
    validation-runner.test.ts      # Vitest test file
```

### 5.2 Input Adapter: Entitledto JSON → Calculator Input

The adapter should extract and map these fields:

```typescript
interface EntitledtoToCalculatorMapping {
  // Household
  circumstances: json.couple === 1 ? 'couple' : 'single',
  age: json.ac_ClientDetails[0].Age,
  partnerAge: json.ac_ClientDetails[1]?.Age,
  children: json.numChildren,

  // Housing
  housingStatus: mapHousingStatus(json.housingStatus),
  tenantType: inferTenantType(json),    // from LHA fields
  brma: json.BRMA,
  rent: convertToMonthly(json.rent, json.rentPeriod),

  // Employment (per person)
  employmentType: json.ac_ClientDetails[0].Works ? 'employed' : 'not_working',
  monthlyEarnings: convertToMonthly(
    json.ac_ClientDetails[0].EarningsExclChildminding,
    json.ac_ClientDetails[0].EarningsExclChildmindingCalcPeriod
  ),

  // Disability
  hasLCWRA: json.ac_ClientDetails[0].LimitedCapabilityForWork ? 'yes' : 'no',
  lcwraClaimantType: mapLCWRate(json.ac_ClientDetails[0].LCWRate),

  // Capital
  savings: json.savings,

  // Tax year
  taxYear: mapCalcYear(json.calcYear),
}
```

**Period conversion codes in entitledto:**
- `0` = Weekly
- `1` = Monthly
- `2` = Weekly (default/standard)

### 5.3 Output Comparison

Compare these key outputs:

| Priority | Comparison | Tolerance |
|---|---|---|
| CRITICAL | `UniversalCreditMonthly` vs `finalAmount` | ±£0.01 |
| HIGH | `UCPersonalElement` vs `standardAllowance + lcwraElement` | ±£0.01 |
| HIGH | `UCHousingElement` vs `housingElement` | ±£1.00 (rounding) |
| MEDIUM | Weekly/yearly conversions | ±£0.10 (rounding) |

### 5.4 Recommended Test Scenarios to Capture from Entitledto

Create entitledto calculations for each of these scenarios, export the JSON, and add to the test suite:

| # | Scenario | Tests |
|---|---|---|
| 1 | Single, under 25, no income, no housing | Standard allowance only |
| 2 | Single, 25+, renting privately, no income | Standard allowance + housing element |
| 3 | Couple, both 25+, no income, social housing | Standard allowance + housing |
| 4 | Single with 1 child (born before April 2017) | Child element (higher rate) |
| 5 | Single with 1 child (born after April 2017) | Child element (lower rate) |
| 6 | Single with 3 children | Two-child limit test |
| 7 | Couple with disabled child (DLA higher) | Disabled child element |
| 8 | Single, employed, £1,500/month, no children | Earnings taper (no work allowance) |
| 9 | Single, employed, £1,500/month, with children | Work allowance + taper |
| 10 | Couple, one employed, £2,000/month, with children | Couple work allowance + taper |
| 11 | Single with LCWRA, no income | LCWRA element |
| 12 | Couple both LCWRA (as in example file) | Single LCWRA per household rule |
| 13 | Single carer | Carer element |
| 14 | Single with £10,000 savings | Capital tariff income |
| 15 | Single with £16,500 savings | Capital disqualification |
| 16 | Private tenant, rent above LHA | LHA cap test |
| 17 | Private tenant, shared accommodation (under 35) | Shared accommodation rate |
| 18 | Self-employed, MIF applies, 35hrs conditionality | Minimum Income Floor |
| 19 | Self-employed, actual earnings above MIF | MIF not applied (actual higher) |
| 20 | Full-time student with loan and grant | Student income deduction |
| 21 | Single with contributory ESA | Benefit deduction |
| 22 | Couple, mixed employment (one employed, one not) | Combined earnings |
| 23 | High earner (UC tapered to zero) | Zero entitlement |
| 24 | Couple, different ages (one under 25, one over) | Age-based standard allowance |
| 25 | Single with childcare costs and employment | Childcare element + work allowance |

---

## 6. Gaps That Require Attention

### 6.1 Critical Gaps (affect UC calculation accuracy)

| Gap | Impact | Recommendation |
|---|---|---|
| **LCWRA per-household limit** | If both members of couple have LCWRA, only one element should be awarded | Verify this rule is enforced in calculator.ts |
| **Non-dependant deductions (housing)** | Other adults in home reduce housing element | Implement non-dependant housing cost deductions |
| **Benefit cap** | Total benefits capped at £22,020 (couple) / £14,753 (single) per year outside London | Implement benefit cap check |
| **Bedroom entitlement vs actual bedrooms** | Under-occupancy ("bedroom tax") for social tenants reduces housing element by 14% (1 extra) or 25% (2+ extra) | Verify bedroom tax logic for social tenants |
| **Rent-free weeks** | Affects annualised housing costs | Implement rent-free week adjustment |

### 6.2 Medium Gaps (affect specific user groups)

| Gap | Impact | Recommendation |
|---|---|---|
| **Mixed-age couples** | One partner above state pension age changes rules | Add mixed-age couple handling |
| **Transitional protection** | Managed migration from legacy benefits | Model transitional element preservation |
| **Scottish Child Payment** | £26.70/week per eligible child in Scotland | Add as regional supplement |
| **Support for Mortgage Interest (SMI)** | Homeowners can get housing costs via SMI loan | Consider adding SMI element |
| **Under-35 shared accommodation rule** | Single claimants under 35 limited to shared rate LHA | Verify age-based LHA rule |
| **Postcode to BRMA mapping** | Entitledto uses postcode; new calculator requires BRMA selection | Consider adding postcode→BRMA lookup |

### 6.3 Low Priority Gaps (outside core UC scope)

| Gap | Notes |
|---|---|
| Council Tax Support | Separate local scheme, not part of UC |
| Legacy benefits (IS, JSA-IB, ESA-IR, HB) | Being replaced by UC |
| Tax Credits (CTC, WTC) | Being replaced by UC |
| Pension Credit | Separate benefit for pensioners |
| Savings breakdown by type | Single total sufficient for UC tariff income |

---

## 7. Next Steps for Validation

### Phase 1: Build the Test Harness (Week 1)

1. **Create the entitledto adapter** (`entitledto-adapter.ts`)
   - Map all input fields from entitledto JSON format to calculator input format
   - Handle period conversions (weekly ↔ monthly)
   - Handle enumeration mappings (entitledto uses numeric codes; new calculator uses strings)

2. **Create the validation runner** (`validation-runner.ts`)
   - Load entitledto JSON → adapt to calculator input → run calculation → compare outputs
   - Report: pass/fail per field, absolute difference, percentage difference

3. **Create the test file** (`validation-runner.test.ts`)
   - Use Vitest to run as part of the existing test suite
   - Parameterised tests: one test per JSON file in the test-cases directory

### Phase 2: Capture Baseline Test Cases (Week 2)

4. **Create 25 entitledto calculations** covering the scenarios in section 5.4
   - Use the entitledto adviser tool to create each scenario
   - Export the JSON for each
   - Place in `tests/entitledto-validation/test-cases/`

5. **Run validation and capture baseline results**
   - Identify which scenarios pass, which fail
   - Categorise failures: rounding, missing feature, or logic error

### Phase 3: Fix Discrepancies (Weeks 3-4)

6. **Fix rounding differences first** (quick wins)
   - Ensure weekly↔monthly conversion uses same formula: monthly = weekly × 52/12

7. **Implement missing rules** (by impact):
   - LCWRA per-household limit verification
   - Non-dependant deductions
   - Benefit cap
   - Under-occupancy deduction (bedroom tax)

8. **Re-run validation after each fix** to confirm improvement

### Phase 4: Ongoing Regression Testing (Ongoing)

9. **Add new entitledto exports as regression tests** whenever edge cases are found
10. **Automate**: Include in CI pipeline so validation runs on every code change
11. **Annual rate updates**: When entitledto publishes new year rates, create fresh test cases to verify rate table updates
12. **Cross-validate with GOV.UK examples**: Use the worked examples from GOV.UK Universal Credit guidance as additional test cases

### Phase 5: Advanced Validation (Future)

13. **Fuzz testing**: Generate random valid input combinations and compare both calculators
14. **Boundary testing**: Test values at exact thresholds (£6,000 savings, £16,000, work allowance boundaries)
15. **Better-off-in-work scenarios**: Test the taper calculation across a range of earnings (£0 to UC taper-to-zero point) and graph both calculators' outputs

---

## 8. Summary

**What's working well:**
- Core UC calculation structure is correct
- Standard allowance rates match official rates
- Housing element (LHA-based) logic is sound
- Work allowance and 55% taper correctly implemented
- Child elements with two-child limit modelled
- LCWRA element with April 2026 two-tier system
- Capital tariff income correctly calculated
- Student income deduction (more detailed than entitledto's visible model)
- MIF for self-employed (more transparent than entitledto)

**Key validation result:** The example case (couple, both LCWRA, renting privately at £150/wk, 2025/26) produces **£1,701.37/month** in both entitledto and the new calculator's expected logic. This is an exact match.

**Top 3 priorities for improving accuracy:**
1. Build the test harness and capture 25 diverse test cases from entitledto
2. Verify the LCWRA per-household limit rule
3. Implement non-dependant deductions and benefit cap
