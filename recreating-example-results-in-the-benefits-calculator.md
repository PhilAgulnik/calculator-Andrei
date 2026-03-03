# Recreating Example Results in the Benefits Calculator

## Overview

This document records the results of recreating the **Real World 3** example scenario from the benefits calculator demo site on the staging entitledto platform. The purpose is to compare the outputs of both calculators using identical inputs and identify any differences.

- **Source:** https://philagulniktest.github.io/benefits-calculator/ (Real World 3 example)
- - **Recreation:** https://www.stagingentitledto.co.uk/ (Reference: Real-World-example-3)
  - - **Calculation year:** 2025/26
    - - **Date of comparison:** 3 March 2026
     
      - ---

      ## Scenario: Real World 3 — Working parent with childcare

      Single parent working full-time with high childcare costs.

      ### Inputs Used

      | Parameter | Value |
      |---|---|
      | Area | England |
      | Household | Single |
      | Age | 33 |
      | Employment status | Employed |
      | Hours worked per week | 37 |
      | Gross earnings | £1,800 / month |
      | Pension contributions | £0 |
      | Children | 2 (ages 2 and 4) |
      | Childcare costs | £1,200 / month (total) |
      | Housing status | Private tenant |
      | BRMA | Bristol |
      | Monthly rent | £900 |
      | Disability/sickness | None |
      | Savings over £6,000 | No |
      | Current benefits | None |
      | Council Tax band | Not specified (original) / C (staging) |

      ---

      ## Results Comparison (Monthly Amounts, Excluding Council Tax Reduction)

      | Benefit | Original (Demo Site) | Staging (entitledto) | Difference |
      |---|---|---|---|
      | **Universal Credit** | £2,278.79 | £2,257.61 | -£21.18 |
      | **Child Benefit** | £187.49 | £187.63 | +£0.14 |
      | **Total** | **£2,466.28** | **£2,445.24** | **-£21.04** |

      ---

      ## Universal Credit Breakdown

      | Element | Original | Staging | Match |
      |---|---|---|---|
      | Standard Allowance | £400.14 | £400.14 | Yes |
      | Housing Element | £900.00 | £900.00 | Yes |
      | Child Element | £585.62 | £585.62 | Yes |
      | Childcare Element | £1,020.00 | £1,020.00 | Yes |
      | **Total Elements** | **£2,905.76** | **£2,905.76** | **Yes** |
      | Earnings Reduction | -£626.97 | -£648.15 | No (-£21.18) |
      | Other Deductions | -£0.00 | -£0.00 | Yes |
      | **Final Universal Credit** | **£2,278.79** | **£2,257.61** | **No (-£21.18)** |

      ---

      ## Child Benefit Breakdown

      | Component | Original | Staging |
      |---|---|---|
      | First child | £112.88 / month | — |
      | Additional child | £74.75 / month | — |
      | Weekly rate (first child) | £26.05 | £26.05 |
      | Weekly rate (second child) | £17.25 | £17.25 |
      | **Monthly total** | **£187.49** | **£187.63** |

      The £0.14 monthly difference is due to a minor rounding variation when converting the identical weekly rates to monthly amounts.

      ---

      ## Analysis of Differences

      ### 1. Earnings Reduction Difference (£21.18)

      The UC earnings reduction is calculated as 55% of net earnings above the work allowance (£411.00). The two calculators arrive at slightly different net earnings figures:

      | Step | Original | Staging |
      |---|---|---|
      | Gross earnings | £1,800.00 | £1,800.00 |
      | Income Tax | -£150.50 | -£150.35 |
      | National Insurance | -£60.20 | -£60.20 |
      | Net earnings (after tax/NI) | £1,589.30 | £1,589.45 |
      | Adjustment (e.g. pension) | -£38.36 | £0.00 |
      | **Net earnings used for UC** | **£1,550.94** | **£1,589.45** |

      The original calculator applies an additional deduction of approximately £38.36 (possibly an auto-enrolment pension contribution) that reduces net earnings from £1,589.30 to £1,550.94. The staging calculator does not apply this deduction.

      This leads to different earnings reductions:
      - **Original:** 55% × (£1,550.94 − £411.00) = 55% × £1,139.94 = **£626.97**
      - - **Staging:** 55% × (£1,589.45 − £411.00) = 55% × £1,178.45 = **£648.15**
       
        - ### 2. Income Tax Difference (£0.15)
       
        - A minor difference in income tax calculation: £150.50 (original) vs £150.35 (staging). This is a very small variance that may be due to different rounding approaches in the tax calculation.
       
        - ### 3. Child Benefit Rounding (£0.14)

        Both calculators use the same weekly Child Benefit rates (£26.05 and £17.25) but arrive at slightly different monthly totals (£187.49 vs £187.63), indicating a minor difference in the weekly-to-monthly conversion method.

        ---

        ## Summary

        The two calculators produce very closely aligned results. All UC maximum elements match exactly at £2,905.76. The total difference of £21.04 per month is primarily driven by the original calculator's application of an additional earnings deduction (likely auto-enrolment pension) that the staging calculator does not apply when pension contributions are entered as £0. The remaining £0.14 difference comes from Child Benefit rounding.
