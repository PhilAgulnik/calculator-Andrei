# Free School Meals (FSM) — Developer Implementation Guide

This guide documents the FSM feature built in the React prototype calculator and is intended to help a .NET 4.6 developer implement the same logic in the main calculator. It covers business rules, data structures, eligibility logic, value calculations, and integration points.

---

## Table of Contents

1. [Overview and Scope](#1-overview-and-scope)
2. [Key Business Concepts](#2-key-business-concepts)
3. [Data Structures](#3-data-structures)
4. [Eligibility Rules by Country](#4-eligibility-rules-by-country)
5. [The Assessment Function](#5-the-assessment-function)
6. [London Detection](#6-london-detection)
7. [September 2026 Rule Change (England)](#7-september-2026-rule-change-england)
8. [Value Calculation](#8-value-calculation)
9. [Integration Points](#9-integration-points)
10. [Edge Cases and Gotchas](#10-edge-cases-and-gotchas)
11. [Reference: Prototype Files](#11-reference-prototype-files)

---

## 1. Overview and Scope

Free School Meals (FSM) is a means-tested benefit available across all four UK nations, but with significantly different rules in each. The calculator determines:

- Whether any of the household's school-age children are eligible
- Whether eligibility is universal (automatic, income-independent) or means-tested
- The estimated annual/monthly monetary value of FSM entitlement
- Whether a household not currently eligible will become eligible under England's September 2026 rule change

FSM eligibility is separate from Universal Credit calculation but depends on its output (UC entitlement > £0).

---

## 2. Key Business Concepts

### Universal vs Means-Tested FSM

Some children receive FSM **universally** — with no income or UC test. Others receive it **means-tested** — only if the household has UC and earns below a threshold.

| Country | Universal Provision | Means-Tested Provision |
|---------|--------------------|-----------------------|
| England | Reception–Year 2 (ages 4–6) via UIFSM | UC > £0 AND net earned income ≤ £7,400/year |
| England (London) | All primary (ages 4–11) via Mayor's scheme | As England above |
| Scotland | P1–P5 (ages 4–10) | UC > £0 AND net earned income ≤ £10,200/year |
| Wales | All primary (ages 4–11) | UC > £0 AND net earned income ≤ £7,400/year |
| Northern Ireland | None | UC > £0 AND net earned income ≤ £14,000/year |

### School Age

A child is "school age" for FSM purposes if they are aged **4 to 18** inclusive.

### Net Earned Income

The income test uses **net earned income** (after tax, National Insurance, and pension contributions) from employment only. It does not include UC itself or other benefits. It covers both the claimant and their partner.

The threshold applies to the **annual** figure: monthly net earnings × 12.

### Has Universal Credit

The household "has Universal Credit" if their UC monthly entitlement is **greater than £0**. A zero UC award (e.g. because income is too high) does not satisfy this condition.

---

## 3. Data Structures

Translate these TypeScript types directly into C# classes or structs.

### Input: Assessment Data

```csharp
public class FsmAssessmentInput
{
    public string Area { get; set; }              // "england", "scotland", "wales", "northern_ireland"
    public int Children { get; set; }             // Total number of children
    public List<ChildInfo> ChildrenInfo { get; set; }  // One per child with age
    public decimal MonthlyNetEarnings { get; set; }    // Claimant's monthly net earned income
    public decimal PartnerMonthlyNetEarnings { get; set; }  // Partner's monthly net earned income (0 if none)
    public string Postcode { get; set; }          // Used only for London detection in England
    public string TaxYear { get; set; }           // e.g. "2025_26", "2026_27"
}

public class ChildInfo
{
    public int Age { get; set; }
}
```

### Input: UC Result (from existing UC calculation)

```csharp
public class UcCalculationResult
{
    public decimal FinalAmount { get; set; }  // Monthly UC entitlement in £
    // ... other UC fields
}
```

### Output: Per-Child Result

```csharp
public class FsmChildResult
{
    public int Age { get; set; }
    public bool Eligible { get; set; }
    public bool EligibleFromSeptember2026 { get; set; }  // England only
    public bool UniversalProvision { get; set; }          // True if not income-tested
    public string Reason { get; set; }                    // Human-readable explanation
}
```

### Output: Household-Level Result

```csharp
public class FsmAssessmentResult
{
    public bool Eligible { get; set; }                         // Any child eligible now
    public bool EligibleFromSeptember2026 { get; set; }        // Any child eligible from Sept 2026
    public bool AnyChildEligible { get; set; }
    public bool AnyChildEligibleFromSeptember2026 { get; set; }
    public string Reason { get; set; }                         // Household-level reason
    public string Country { get; set; }
    public decimal Threshold { get; set; }                     // Annual income threshold in £
    public decimal? FutureThreshold { get; set; }              // England future threshold (null = abolished)
    public decimal NetEarnedIncome { get; set; }               // Annual net earned income used in test
    public List<FsmChildResult> EligibleChildren { get; set; }
    public bool HasUniversalCredit { get; set; }
    public bool MeetsIncomeThreshold { get; set; }
    public bool MeetsFutureIncomeThreshold { get; set; }       // England only
}
```

---

## 4. Eligibility Rules by Country

### England (2025/26)

```
Threshold: £7,400 / year net earned income

For each school-age child (4–18):
  IF London postcode AND age 4–11:
    → Universal (no income test)
  ELSE IF age 4–6 (Reception–Year 2):
    → Universal (UIFSM — no income test)
  ELSE IF has_UC AND annual_net_income <= 7400:
    → Means-tested eligible
  ELSE IF has_UC AND annual_net_income > 7400:
    → Not eligible NOW, but eligible_from_september_2026 = true
  ELSE:
    → Not eligible
```

### England (from September 2026, tax year 2026/27 onwards)

```
Threshold: ABOLISHED

For each school-age child (4–18):
  IF London postcode AND age 4–11:
    → Universal
  ELSE IF age 4–6:
    → Universal (UIFSM)
  ELSE IF has_UC:           ← income no longer matters
    → Means-tested eligible
  ELSE:
    → Not eligible
```

### Scotland

```
Threshold: £10,200 / year net earned income

For each school-age child (4–18):
  IF age 4–10 (P1–P5):
    → Universal (no income test, no UC required)
  ELSE IF has_UC AND annual_net_income <= 10200:
    → Means-tested eligible
  ELSE:
    → Not eligible
```

### Wales

```
Threshold: £7,400 / year net earned income

For each school-age child (4–18):
  IF age 4–11 (primary):
    → Universal (no income test, no UC required)
  ELSE IF has_UC AND annual_net_income <= 7400:
    → Means-tested eligible
  ELSE:
    → Not eligible
```

### Northern Ireland

```
Threshold: £14,000 / year net earned income

For each school-age child (4–18):
  No universal provision.
  IF has_UC AND annual_net_income <= 14000:
    → Means-tested eligible
  ELSE:
    → Not eligible
```

---

## 5. The Assessment Function

The core function in the prototype is `assessFreeSchoolMealsEligibility()` in
[src/products/benefits-calculator/utils/freeSchoolMealsEligibility.ts](src/products/benefits-calculator/utils/freeSchoolMealsEligibility.ts).

In pseudocode (for direct translation to C#):

```
FUNCTION AssessFsm(input: FsmAssessmentInput, ucResult: UcCalculationResult):

  IF input.Children == 0 OR input.ChildrenInfo is empty:
    RETURN NotApplicable result

  // 1. Normalise country
  country = NormaliseArea(input.Area)
  // "england", "scotland", "wales", "northern_ireland"

  // 2. Set thresholds
  threshold = GetThreshold(country)
  // England: 7400, Scotland: 10200, Wales: 7400, NI: 14000

  // 3. Detect London (England only)
  isLondon = (country == "england") AND IsLondonPostcode(input.Postcode)

  // 4. Determine if September 2026 rule is active (England only)
  isSept2026Active = (country == "england") AND (input.TaxYear >= "2026_27")

  // 5. Calculate annual net earned income
  annualIncome = (input.MonthlyNetEarnings + input.PartnerMonthlyNetEarnings) * 12

  // 6. Check UC
  hasUC = ucResult.FinalAmount > 0

  // 7. Check income threshold
  meetsThreshold = annualIncome <= threshold
  meetsFutureThreshold = true  // England Sept 2026: threshold abolished, any UC qualifies

  // 8. Assess each child
  childResults = []
  FOR each child IN input.ChildrenInfo:
    IF child.Age < 4 OR child.Age > 18:
      childResults.Add(NotSchoolAge)
      CONTINUE

    isUniversal = false
    currentlyEligible = false
    futureEligible = false

    // Universal provision checks
    IF country == "england":
      IF isLondon AND child.Age >= 4 AND child.Age <= 11:
        isUniversal = true
        currentlyEligible = true
      ELSE IF child.Age >= 4 AND child.Age <= 6:
        isUniversal = true
        currentlyEligible = true

    ELSE IF country == "scotland":
      IF child.Age >= 4 AND child.Age <= 10:
        isUniversal = true
        currentlyEligible = true

    ELSE IF country == "wales":
      IF child.Age >= 4 AND child.Age <= 11:
        isUniversal = true
        currentlyEligible = true

    // Means-tested check (only if not already eligible universally)
    IF NOT currentlyEligible:
      IF hasUC AND (meetsThreshold OR (country == "england" AND isSept2026Active)):
        currentlyEligible = true
      ELSE IF country == "england" AND hasUC AND NOT isSept2026Active:
        // Will become eligible when September 2026 rule kicks in
        futureEligible = true

    childResults.Add({
      Age: child.Age,
      Eligible: currentlyEligible,
      EligibleFromSeptember2026: futureEligible,
      UniversalProvision: isUniversal
    })

  // 9. Aggregate to household level
  anyEligibleNow = childResults.Any(c => c.Eligible)
  anyEligibleFuture = childResults.Any(c => c.EligibleFromSeptember2026)

  RETURN FsmAssessmentResult {
    Eligible: anyEligibleNow,
    EligibleFromSeptember2026: anyEligibleFuture,
    AnyChildEligible: anyEligibleNow,
    AnyChildEligibleFromSeptember2026: anyEligibleFuture,
    Country: country,
    Threshold: threshold,
    NetEarnedIncome: annualIncome,
    EligibleChildren: childResults,
    HasUniversalCredit: hasUC,
    MeetsIncomeThreshold: meetsThreshold,
    MeetsFutureIncomeThreshold: meetsFutureThreshold
  }
```

---

## 6. London Detection

London children are entitled to universal FSM for all primary ages (4–11) through the Mayor of London scheme, regardless of income or UC status. This overrides England's standard UIFSM (which only covers ages 4–6).

Detection is based on the **outward code** (the first part of the postcode, before the space).

**London postcode prefixes:** E, EC, N, NW, SE, SW, W, WC — followed by a digit.

```csharp
public static bool IsLondonPostcode(string postcode)
{
    if (string.IsNullOrWhiteSpace(postcode))
        return false;

    // Take only the outward code (part before the space)
    var outward = postcode.Trim().ToUpper().Split(' ')[0];

    // Match E, EC, N, NW, SE, SW, W, WC followed by a digit
    return Regex.IsMatch(outward, @"^(E|EC|N|NW|SE|SW|W|WC)\d");
}
```

**Examples:**
- `E1 4NS` → outward = `E1` → London ✓
- `SW1A 2AA` → outward = `SW1A` → London ✓
- `M1 1AE` → outward = `M1` → not London ✗
- `WD17 1LJ` → outward = `WD17` → not London ✗ (WD is Watford, not London)

The regex correctly handles `WD` (Watford) because it requires `W` to be followed by a digit, and `WD` starts with `WD` (a letter after W).

---

## 7. September 2026 Rule Change (England)

This is the most significant business rule change to implement correctly.

**Current rule (tax years up to and including 2025/26):**
- Household must have UC > £0
- AND annual net earned income must be ≤ £7,400

**From September 2026 (tax year 2026/27 onwards):**
- Household must have UC > £0
- Income threshold is **abolished** — any UC award qualifies

**Activation condition:**

```csharp
bool isSept2026Active = (country == "england") &&
    string.Compare(taxYear, "2026_27", StringComparison.Ordinal) >= 0;
```

Tax year strings are formatted as `"YYYY_YY"` (e.g. `"2025_26"`, `"2026_27"`). String comparison works correctly for ordering because the format is consistent.

**Showing future eligibility in the UI:**

Households in England with UC but income above £7,400 should be flagged with `EligibleFromSeptember2026 = true`. This is used to show an advisory message (amber badge, not a hard "not eligible") explaining that they will qualify once the rule changes.

---

## 8. Value Calculation

### Default Rate

The default value per child per year is **£500**.

This is derived from the 2025/26 government UIFSM funding rate:
- £2.61 per meal × 190 school days = £495.90 ≈ £500

### Flexible Input

The prototype allows users to override this with:
- A custom **annual amount per child**, or
- A **daily cost × number of school days** calculation

For the main calculator, start with the £500 default. Add user override if the system supports custom inputs.

### Calculation

```csharp
decimal annualPerChild = 500.00m;  // or user input

int universalCount = eligibleChildren.Count(c => c.Eligible && c.UniversalProvision);
int meansTestedCount = eligibleChildren.Count(c => c.Eligible && !c.UniversalProvision);

decimal universalAnnual = annualPerChild * universalCount;
decimal meansTestedAnnual = annualPerChild * meansTestedCount;
decimal totalAnnual = universalAnnual + meansTestedAnnual;

decimal totalMonthly = totalAnnual / 12;
decimal totalWeekly = totalAnnual / 52;
```

### Separating Universal and Means-Tested

Track these separately because:
- In a Better Off Calculator, universal provision is not affected by employment status (it is always received)
- Means-tested FSM can be lost if earnings rise above the threshold

---

## 9. Integration Points

### Inputs Required from Other Parts of the Calculator

| Input | Source | Notes |
|-------|--------|-------|
| `area` | Where-you-live step | Normalise to lowercase: "england", "scotland", "wales", "northern_ireland" |
| `postcode` | Where-you-live step | Optional; only used for London detection in England |
| `taxYear` | Where-you-live step or system | Format: "2025_26". Determines Sept 2026 rule activation |
| `childrenInfo[].age` | Children step | One record per child |
| `monthlyNetEarnings` | Earnings step (after tax/NI/pension) | **Net**, not gross |
| `partnerMonthlyNetEarnings` | Partner earnings step | 0 if no partner or partner has no earnings |
| `ucFinalAmount` | UC calculation output | The monthly UC entitlement in £ |

### Net Earnings Calculation

The prototype calls `UniversalCreditCalculator.calculateUINetEarnings()` before passing earnings to the FSM assessment. This function:

1. Deducts income tax at the applicable rate
2. Deducts National Insurance contributions
3. Deducts pension contributions

In the main calculator, use the same net earnings figure already computed for the UC calculation — do not use gross. The FSM assessment function does **not** deduct tax/NI internally; it expects the caller to provide already-net figures.

### Where FSM Fits in the Calculation Pipeline

```
1. Collect inputs (area, postcode, taxYear, children ages, earnings, pension)
2. Calculate UC entitlement → get FinalAmount
3. Calculate net earnings (same function used for UC)
4. Call AssessFsm(input, ucResult)
5. Display FSM eligibility result
6. (Optional) Add FSM monetary value to total entitlement
```

### Better Off Calculator

In the prototype, FSM also feeds into a Better Off Calculator (BOC). The key data needed:

- Is the household eligible for **means-tested** FSM while out of work? (i.e. has UC > £0 and earnings = £0)
- Would they lose means-tested FSM if they took employment above the threshold?

Universal provision children are not affected by work status and should be excluded from this comparison.

---

## 10. Edge Cases and Gotchas

### No Children

If `children == 0` or `childrenInfo` is empty, return a null/not-applicable result immediately. Do not attempt to run the assessment.

### No School-Age Children

A household may have children but none in the 4–18 age range (e.g. all under 4 or all adults). Return not applicable in this case.

### Mixed Universal and Means-Tested Children

A Scotland household may have a P3 child (age 7, universal) and a P6 child (age 11, means-tested). Both can appear in the same result with different eligibility types. The household is eligible overall if any child is eligible.

### Scotland P5/P6 Boundary

The universal provision in Scotland covers ages **4–10** (P1–P5). Age 11 falls in P6 and is means-tested. The boundary is strictly by age, not year group.

### Wales Secondary

Wales universal provision covers ages **4–11** (primary). Ages 12–18 are means-tested with the £7,400 threshold.

### London + England Rules Stack

A London child aged 5 is covered by both:
- England UIFSM (ages 4–6), and
- Mayor of London scheme (ages 4–11)

Treat them as universally eligible (the reason shown can reference the Mayor's scheme since it covers the broader age range).

### Zero UC Awards

If `ucFinalAmount == 0`, `hasUC` is `false`. The household is NOT eligible for means-tested FSM even if their income is below the threshold. Universal provision children are still eligible (no UC requirement).

### Income Threshold is Annual, Earnings Are Monthly

The input is **monthly** net earnings; the threshold is **annual**. Always multiply monthly × 12 before comparing. Do not compare monthly earnings to the annual threshold directly.

### Tax Year Format

Use string comparison for tax year ordering (`"2026_27" >= "2026_27"` etc.). Do not parse as a number. The underscore format is intentional for correct lexicographic ordering.

### Area Name Normalisation

Inputs from the UI may come in various forms. Normalise before applying rules:

```csharp
private static string NormaliseArea(string area)
{
    if (area == null) return "";
    switch (area.ToLower().Trim().Replace(" ", "_").Replace("-", "_"))
    {
        case "england": return "england";
        case "scotland": return "scotland";
        case "wales": return "wales";
        case "northern_ireland": return "northern_ireland";
        default: return area.ToLower().Trim();
    }
}
```

---

## 11. Reference: Prototype Files

All prototype source files are in the React calculator project. The most important for implementation reference:

| File | Purpose |
|------|---------|
| [src/products/benefits-calculator/utils/freeSchoolMealsEligibility.ts](src/products/benefits-calculator/utils/freeSchoolMealsEligibility.ts) | Complete eligibility logic — the authoritative source of truth for all rules |
| [src/products/benefits-calculator/types/free-school-meals.ts](src/products/benefits-calculator/types/free-school-meals.ts) | All type definitions and constants (thresholds, school age bounds) |
| [src/products/benefits-calculator/utils/freeSchoolMealsEligibility.test.ts](src/products/benefits-calculator/utils/freeSchoolMealsEligibility.test.ts) | Test cases — invaluable for verifying your implementation against known scenarios |
| [src/products/benefits-calculator/components/FreeSchoolMealsModule.tsx](src/products/benefits-calculator/components/FreeSchoolMealsModule.tsx) | UI component — reference for display logic and value calculation |
| [src/products/benefits-calculator/components/SchoolMealCostsModal.tsx](src/products/benefits-calculator/components/SchoolMealCostsModal.tsx) | Local authority meal cost data used to justify the £500 default |

### Test Cases to Replicate

The test file (`freeSchoolMealsEligibility.test.ts`) contains the following scenarios that your implementation should pass:

| Scenario | Expected |
|----------|----------|
| England, income £6,000, UC > £0, child age 9 | Eligible (means-tested) |
| England, income £12,000, UC > £0, child age 9, 2025/26 | Not eligible, future-eligible |
| England, income £12,000, UC > £0, child age 9, 2026/27 | Eligible (Sept 2026 rule) |
| England, child age 5, no UC, income £0 | Eligible (universal UIFSM) |
| London postcode (E1), child age 9, no UC | Eligible (London universal) |
| Scotland, income £24,000, child ages 6 & 9, no UC | Eligible (P1–P5 universal) |
| Scotland, income £9,600, UC > £0, child age 13 | Eligible (means-tested) |
| Scotland, income £12,000, UC > £0, child age 13 | Not eligible (exceeds £10,200) |
| Wales, income £36,000, child ages 5 & 11, no UC | Eligible (universal primary) |
| Wales, income £6,000, UC > £0, child age 14 | Eligible (means-tested) |
| Northern Ireland, income £18,000, UC > £0, child age 10 | Not eligible (exceeds £14,000) |
| Northern Ireland, income £6,000, UC > £0, child age 10 | Eligible |
| No children | Not applicable |

---

*Guide last updated: March 2026. For questions about the prototype implementation, refer to the source files above.*
