// Excerpt from ResultsSection.js showing the MIF comparison table
// This serves as a good pattern for implementing scenario comparison

function ResultsSection({ results, formData }) {
  // Calculate UC with and without MIF for comparison
  const calculateUCComparison = () => {
    const mifAmounts = calculateMifAmounts();

    // Without MIF (current calculation)
    const withoutMif = {
      grossEarnings: mifAmounts.currentWeeklyEarnings,
      netEarnings: mifAmounts.currentWeeklyEarnings * 0.8,
      universalCredit: calculation.finalAmount / 4.33,
      totalBenefits: calculation.finalAmount / 4.33,
      totalIncome: (mifAmounts.currentWeeklyEarnings * 0.8) + (calculation.finalAmount / 4.33)
    };

    // With MIF
    const withMif = {
      grossEarnings: mifAmounts.mifWeekly,
      netEarnings: mifAmounts.mifWeekly * 0.8,
      universalCredit: Math.max(0, (calculation.totalElements / 4.33) - (mifAmounts.mifWeekly * 0.8 * 0.55)),
      totalBenefits: Math.max(0, (calculation.totalElements / 4.33) - (mifAmounts.mifWeekly * 0.8 * 0.55)),
      totalIncome: (mifAmounts.mifWeekly * 0.8) + Math.max(0, (calculation.totalElements / 4.33) - (mifAmounts.mifWeekly * 0.8 * 0.55))
    };

    // Calculate impacts (difference between scenarios)
    const impact = {
      grossEarnings: withMif.grossEarnings - withoutMif.grossEarnings,
      netEarnings: withMif.netEarnings - withoutMif.netEarnings,
      universalCredit: withMif.universalCredit - withoutMif.universalCredit,
      totalBenefits: withMif.totalBenefits - withoutMif.totalBenefits,
      totalIncome: withMif.totalIncome - withoutMif.totalIncome
    };

    return { withoutMif, withMif, impact };
  };

  return (
    <div className="mif-comparison-table">
      <h5>How MIF affects your Universal Credit</h5>
      <div className="table-container">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Your Benefits</th>
              <th>Without MIF</th>
              <th>With MIF</th>
              <th>Impact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Gross Earnings</strong></td>
              <td>£{calculateUCComparison().withoutMif.grossEarnings.toFixed(2)}</td>
              <td>£{calculateUCComparison().withMif.grossEarnings.toFixed(2)}</td>
              <td className={calculateUCComparison().impact.grossEarnings >= 0 ? 'positive' : 'negative'}>
                {calculateUCComparison().impact.grossEarnings >= 0 ? '+' : ''}£{calculateUCComparison().impact.grossEarnings.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td><strong>Net Earnings</strong></td>
              <td>£{calculateUCComparison().withoutMif.netEarnings.toFixed(2)}</td>
              <td>£{calculateUCComparison().withMif.netEarnings.toFixed(2)}</td>
              <td className={calculateUCComparison().impact.netEarnings >= 0 ? 'positive' : 'negative'}>
                {calculateUCComparison().impact.netEarnings >= 0 ? '+' : ''}£{calculateUCComparison().impact.netEarnings.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td><strong>Universal Credit</strong></td>
              <td>£{calculateUCComparison().withoutMif.universalCredit.toFixed(2)}</td>
              <td>£{calculateUCComparison().withMif.universalCredit.toFixed(2)}</td>
              <td className={calculateUCComparison().impact.universalCredit >= 0 ? 'positive' : 'negative'}>
                {calculateUCComparison().impact.universalCredit >= 0 ? '+' : ''}£{calculateUCComparison().impact.universalCredit.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td><strong>Total Benefits</strong></td>
              <td>£{calculateUCComparison().withoutMif.totalBenefits.toFixed(2)}</td>
              <td>£{calculateUCComparison().withMif.totalBenefits.toFixed(2)}</td>
              <td className={calculateUCComparison().impact.totalBenefits >= 0 ? 'positive' : 'negative'}>
                {calculateUCComparison().impact.totalBenefits >= 0 ? '+' : ''}£{calculateUCComparison().impact.totalBenefits.toFixed(2)}
              </td>
            </tr>
            <tr className="total-row">
              <td><strong>Total Income</strong></td>
              <td>£{calculateUCComparison().withoutMif.totalIncome.toFixed(2)}</td>
              <td>£{calculateUCComparison().withMif.totalIncome.toFixed(2)}</td>
              <td className={calculateUCComparison().impact.totalIncome >= 0 ? 'positive' : 'negative'}>
                {calculateUCComparison().impact.totalIncome >= 0 ? '+' : ''}£{calculateUCComparison().impact.totalIncome.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/*
 * PATTERN ANALYSIS FOR SCENARIO COMPARISON:
 *
 * 1. Table Structure:
 *    - Row labels in first column (metric names)
 *    - Scenario columns (Without MIF, With MIF)
 *    - Impact column showing difference
 *
 * 2. Impact Calculation:
 *    - Subtract first scenario from second
 *    - Show sign (+ or -) explicitly
 *    - Apply color coding (positive/negative classes)
 *
 * 3. Data Organization:
 *    - Group related metrics
 *    - Use .total-row for summary rows
 *    - Calculate all values before rendering
 *
 * 4. UI Features:
 *    - Conditional CSS classes for positive/negative
 *    - Consistent currency formatting
 *    - Clear hierarchy with bold labels
 *
 * 5. For Multi-Scenario Comparison, adapt this to:
 *    - Dynamic number of scenario columns
 *    - Optional baseline selection
 *    - Multiple impact columns (vs Scenario 1, vs Scenario 2, etc.)
 *    - Expandable rows for detailed breakdowns
 *
 * 6. Responsive Considerations:
 *    - Table may need horizontal scroll on mobile
 *    - Consider card view for narrow screens
 *    - Sticky first column for better usability
 */
