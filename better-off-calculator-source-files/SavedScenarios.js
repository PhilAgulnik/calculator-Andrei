import React from 'react';

function SavedScenarios({ scenarios, onLoadScenario, onDeleteScenario }) {
  if (scenarios.length === 0) {
    return (
      <section className="saved-scenarios">
        <div className="card">
          <h2>Saved Scenarios</h2>
          <div className="scenarios-list">
            <p className="no-scenarios">
              No saved scenarios yet. Save your first calculation to compare different scenarios.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="saved-scenarios">
      <div className="card">
        <h2>Saved Scenarios</h2>
        <div className="scenarios-list">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="scenario-item">
              <div className="scenario-info">
                <h4>{scenario.name}</h4>
                <p>Tax Year: {scenario.taxYear.replace('_', '/')}</p>
                <p>Saved: {new Date(scenario.savedAt).toLocaleDateString()}</p>
                <p>Amount: £{scenario.calculation.calculation.finalAmount.toFixed(2)}/month</p>
              </div>
              <div className="scenario-actions">
                <button
                  onClick={() => onLoadScenario(scenario)}
                  className="btn btn-primary"
                >
                  Load
                </button>
                <button
                  onClick={() => onDeleteScenario(scenario.id)}
                  className="btn btn-outline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SavedScenarios;
