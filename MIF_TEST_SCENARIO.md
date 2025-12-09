# Minimum Income Floor (MIF) Test Scenario

This document provides a test scenario to demonstrate the new Minimum Income Floor functionality for self-employed UC claimants.

## Test Scenario: Self-Employed Freelancer with Low Income

### Background
Sarah is a 28-year-old self-employed graphic designer who has been running her business for 18 months. This month, her net self-employed income after business expenses was only £800. She's subject to all work-related requirements (35 hours/week).

### Step-by-Step Test Instructions

1. **Navigate to the calculator**
   - Go to: http://localhost:3000/calculator-Andrei/

2. **Where you live**
   - Area: England
   - Click "Next →"

3. **Your household**
   - Circumstances: Single
   - Children: 0
   - Click "Next →"

4. **Age and disability**
   - Your Age: **28**
   - Employment Status: **Self-employed** ⭐ (This is key!)
   - Are you sick or disabled?: No
   - Do you care for someone?: No
   - Click "Next →"

5. **Your earnings** (This is where the MIF section appears!)
   - Monthly net self-employed income: **£800** ⭐

   **You should now see the yellow "Minimum Income Floor" section appear!**

   - What are your Universal Credit work-related requirements?: **35 hours - All work requirements** ⭐
   - Does the Minimum Income Floor apply to you?: **Yes** ⭐

   **Notice the preview showing:**
   - "Your Minimum Income Floor: Based on 35 hours per week, your minimum income floor is approximately £2,239.09 per month"

   - Click "Next →"

6. **Benefits you currently receive**
   - Has other benefits: No
   - Has savings: No
   - Click "Next →"

7. **Net income**
   - Click "Next →"

8. **Housing costs**
   - Housing status: No housing costs
   - Click "Next →"

9. **Council Tax**
   - Council tax: £0
   - Click "Next →"

10. **Results** - See the MIF in action! 🎉

## Expected Results

### Without MIF Applied (if you select "No" for MIF applies)
- UC would calculate based on actual earnings: £800/month
- Higher UC entitlement because of lower earnings

### With MIF Applied (selecting "Yes" for MIF applies)
- UC calculates based on MIF: £2,239.09/month
- Lower UC entitlement because system assumes minimum earnings
- **Expandable "Minimum Income Floor Applied" section in results showing:**
  - Work hours conditionality: 35 hours/week
  - Minimum wage rate: £12.21/hour (for age 21+, 2025/26 rates)
  - MIF (monthly): £2,239.09
  - Actual self-employed earnings: £800.00
  - Income used in UC calculation: £2,239.09

### MIF Calculation Breakdown
```
Work hours: 35 hours/week
National Minimum Wage (age 21+): £12.21/hour
Weekly earnings: 35 × £12.21 = £427.35
Monthly MIF: £427.35 × 52 weeks ÷ 12 months = £2,239.09
```

## Test Scenario 2: Couple with One Self-Employed Partner

### Background
Mike (32) is employed earning £2,000/month. His partner Lisa (30) is self-employed earning £600/month with 16-hour work requirements (has a child aged 3).

### Test Steps
1. Follow steps 1-2 above
2. **Your household**
   - Circumstances: **Couple**
   - Children: 1
3. **Age and disability**
   - Your Age: 32
   - Employment Status: **Employed**
   - Partner's Age: 30
   - Partner's Employment Status: **Self-employed** ⭐
   - Continue through...
4. **Your earnings** (Mike's)
   - Gross earnings: £2,000
   - Use default pension settings
5. **Partner earnings** (Lisa's) - MIF section appears here!
   - Monthly net self-employed income: **£600** ⭐
   - Partner's work-related requirements: **16 hours - Limited work requirements** ⭐
   - Does MIF apply to partner?: **Yes** ⭐

   **Preview shows: £716.45/month MIF for Lisa**

6. Continue through remaining steps

### Expected Results
- Lisa's MIF: £716.45 (16 hours × £12.21 × 52 ÷ 12)
- Combined household earnings used in UC: £2,000 (Mike) + £716.45 (Lisa's MIF) = £2,716.45
- Results page shows separate MIF breakdowns for both partners

## Key Features to Observe

✅ **Dynamic Display**: MIF section only appears when:
   - Employment type is "Self-employed"
   - Earnings are below the MIF threshold

✅ **Live Preview**: MIF amount updates as you change work hours

✅ **Detailed Results**: Expandable accordion shows:
   - Individual MIF calculations
   - Comparison of actual vs assumed earnings
   - Combined totals for couples

✅ **Age-Based Rates**: MIF automatically uses correct minimum wage for person's age

## Testing Different Scenarios

### Scenario A: High Earner (MIF doesn't apply)
- Self-employed income: £3,000/month
- MIF section still appears but explains MIF is lower than actual earnings
- Actual earnings used in calculation

### Scenario B: Zero Work Requirements
- Self-employed with child under 1
- Work hours: 0 hours - No work requirements
- MIF = £0, actual earnings used

### Scenario C: 16 Hour Requirements
- Self-employed with LCWRA
- Work hours: 16 hours
- MIF = £716.45/month (for age 21+)

## Notes
- The calculator uses 2025/26 National Minimum Wage rates
- MIF only applies after 12 months of self-employment
- If actual earnings exceed MIF, actual earnings are used
- The feature handles both single and couple scenarios correctly
