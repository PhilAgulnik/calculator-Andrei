// Excerpt from ResultsSection.js showing the Save Scenario button integration

import React from 'react';

function ResultsSection({ results, formData, onPrint, onExport, onSave }) {
  const { calculation, taxYear } = results;

  return (
    <section className="results-section">
      <div className="card">
        <h2>Your Universal Credit Calculation</h2>

        {/* Results Display */}
        <div className="results-container">
          <div className="result-summary">
            <h3>Your Universal Credit Entitlement</h3>
            <div className="final-amount">{formatCurrency(calculation.finalAmount)}</div>
            <p className="result-note">per month</p>
            <p className="tax-year">Tax Year: {taxYear.replace('_', '/')}</p>
          </div>
        </div>

        {/* ... detailed breakdown sections ... */}

        {/* Action Buttons including Save */}
        <div className="action-buttons">
          <button type="button" onClick={onSave} className="btn btn-secondary">
            Save Scenario
          </button>
          <button type="button" onClick={onPrint} className="btn btn-outline">
            Print Results
          </button>
          <button type="button" onClick={onExport} className="btn btn-outline">
            Export PDF
          </button>
          <button
            type="button"
            onClick={() => setShowBetterOffModule(!showBetterOffModule)}
            className="btn btn-primary"
          >
            {showBetterOffModule ? 'Hide' : 'Show'} Better Off in Work Calculator
          </button>
        </div>
      </div>

      {/* Better Off in Work Module */}
      <BetterOffCalculator
        currentUCAmount={calculation.finalAmount}
        isVisible={showBetterOffModule}
        onToggleVisibility={() => setShowBetterOffModule(!showBetterOffModule)}
      />
    </section>
  );
}

export default ResultsSection;

/*
 * KEY OBSERVATIONS:
 *
 * 1. Save Scenario button is just another action button
 *    - No special UI or confirmation
 *    - No feedback after save (no toast/notification)
 *    - No ability to customize name before saving
 *
 * 2. Button placement:
 *    - First in the action buttons group
 *    - Uses 'btn-secondary' styling (different from primary)
 *    - Same visual weight as Print and Export
 *
 * 3. onSave prop:
 *    - Simple callback with no parameters
 *    - Assumes parent has all necessary data
 *    - No validation or error handling at this level
 *
 * 4. Related features in same section:
 *    - Print functionality
 *    - PDF export with full report
 *    - Better Off calculator toggle
 */
