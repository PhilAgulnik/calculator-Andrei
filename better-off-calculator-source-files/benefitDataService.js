// Benefit Data Service - Saves benefit calculator results for use in budgeting tool

export const saveBenefitCalculatorData = (formData, results) => {
  try {
    const benefitData = {
      // Form data
      formData: {
        ...formData
      },
      // Calculated results
      results: {
        ucAmount: results?.ucAmount || 0,
        otherBenefits: results?.otherBenefits || 0,
        childcareCosts: formData?.childcareCosts || 0,
        // Add other relevant data
        totalIncome: results?.totalIncome || 0,
        totalDeductions: results?.totalDeductions || 0,
        netIncome: results?.netIncome || 0
      },
      // Metadata
      timestamp: new Date().toISOString(),
      source: 'benefit-calculator'
    };

    localStorage.setItem('benefitCalculatorData', JSON.stringify(benefitData));
    return true;
  } catch (error) {
    console.error('Error saving benefit calculator data:', error);
    return false;
  }
};

export const getBenefitCalculatorData = () => {
  try {
    const data = localStorage.getItem('benefitCalculatorData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving benefit calculator data:', error);
    return null;
  }
};

export const clearBenefitCalculatorData = () => {
  try {
    localStorage.removeItem('benefitCalculatorData');
    return true;
  } catch (error) {
    console.error('Error clearing benefit calculator data:', error);
    return false;
  }
};

export const hasBenefitCalculatorData = () => {
  const data = getBenefitCalculatorData();
  return data !== null && data.results && data.results.ucAmount > 0;
};
