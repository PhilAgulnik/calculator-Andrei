// Key excerpts from CalculatorPage.js showing scenario management integration

import React, { useState, useEffect } from 'react';
import SavedScenarios from './SavedScenarios'; // Not actually used in current implementation

function CalculatorPage({ isRehabilitation = false }) {
  // State for saved scenarios
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [formData, setFormData] = useState({
    // ... extensive form data structure
  });

  // Load scenarios from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('ucSavedScenarios');
    if (saved) {
      try {
        setSavedScenarios(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved scenarios:', error);
        setSavedScenarios([]);
      }
    }
  }, []);

  // Save scenario function - called from ResultsSection
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

  // Load scenario - restore form data and results
  const handleLoadScenario = (scenario) => {
    setFormData(scenario.input);
    setResults(scenario.calculation);
    setShowResults(true);
  };

  // Delete scenario
  const handleDeleteScenario = (scenarioId) => {
    const updated = savedScenarios.filter(s => s.id !== scenarioId);
    setSavedScenarios(updated);
    localStorage.setItem('ucSavedScenarios', JSON.stringify(updated));
  };

  return (
    <div className="container">
      {/* ... header and form components ... */}

      {/* Saved Scenarios Section */}
      {!pensionWarningType && savedScenarios.length > 0 && (
        <div className="saved-scenarios">
          <h3>Saved Scenarios</h3>
          <div className="scenarios-list">
            {savedScenarios.map(scenario => (
              <div key={scenario.id} className="scenario-item">
                <span>{scenario.name}</span>
                <div className="scenario-actions">
                  <button onClick={() => handleLoadScenario(scenario)}>
                    Load
                  </button>
                  <button onClick={() => handleDeleteScenario(scenario.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Section with Save button */}
      {!pensionWarningType && showResults && results && (
        <ResultsSection
          results={results}
          formData={formData}
          onPrint={handlePrint}
          onExport={handleExport}
          onSave={handleSaveScenario} // Pass save handler
        />
      )}
    </div>
  );
}

export default CalculatorPage;

/*
 * KEY OBSERVATIONS:
 *
 * 1. The actual SavedScenarios component is NOT used in CalculatorPage
 *    - Scenarios are rendered inline instead
 *    - This suggests SavedScenarios.js may be outdated or unused
 *
 * 2. Data structure saved vs expected mismatch:
 *    - Saved: scenario.calculation.finalAmount
 *    - Expected by SavedScenarios: scenario.calculation.calculation.finalAmount
 *    - Also saved: scenario.timestamp
 *    - Expected: scenario.savedAt and scenario.taxYear
 *
 * 3. Inline implementation is simpler but misses:
 *    - Tax year display
 *    - Saved date display
 *    - Final amount display
 *    - Proper styling via card component
 *
 * 4. Conditional rendering based on pensionWarningType:
 *    - Scenarios hidden when pension warning is active
 *    - Only shown when savedScenarios.length > 0
 */
