import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CalculatorForm from './CalculatorForm';
import ResultsSection from './ResultsSection';
import AdminPanel from '../../../shared/components/AdminPanel';
import ExamplesSection from '../../../shared/components/ExamplesSection';
import StatePensionAgeWarning from './StatePensionAgeWarning';
import { getPensionAgeWarningType } from '../utils/pensionAgeCalculator';
import { applySkinForRoute } from '../../../shared/utils/skinManager';
import { UniversalCreditCalculator } from '../utils/calculator';
import Navigation from '../../../shared/components/Navigation';
import Logo from '../../../shared/components/Logo';

function CalculatorPage({ isRehabilitation = false }) {
  const location = useLocation();
  const [formData, setFormData] = useState({
    // Tax Year and Circumstances
    taxYear: '2025_26',
    circumstances: 'single',
    age: 25,
    partnerAge: 25,
    
    // Housing
    housingStatus: 'no_housing_costs',
    tenantType: 'social',
    brma: '',
    rent: 0,
    rentPeriod: 'per_month',
    serviceCharges: 0,
    serviceChargesPeriod: 'per_month',
    bedrooms: 1,
    nonDependants: 0,
    
    // Employment and Disability - Main Person
    employmentType: 'not_working',
    monthlyEarnings: 0,
    monthlyEarningsPeriod: 'per_month',
    pensionAmount: 0,
    pensionAmountPeriod: 'per_month',
    pensionType: 'amount',
    pensionPercentage: 3,
    isDisabled: 'no',
    claimsDisabilityBenefits: 'no',
    disabilityBenefitType: '',
    pipDailyLivingRate: 'none',
    pipMobilityRate: 'none',
    dlaCareRate: 'none',
    dlaMobilityRate: 'none',
    aaRate: 'none',
    hasLCWRA: 'no',
    
    // Employment and Disability - Partner
    partnerEmploymentType: 'not_working',
    partnerMonthlyEarnings: 0,
    partnerMonthlyEarningsPeriod: 'per_month',
    partnerPensionAmount: 0,
    partnerPensionAmountPeriod: 'per_month',
    partnerPensionType: 'amount',
    partnerPensionPercentage: 3,
    partnerIsDisabled: 'no',
    partnerClaimsDisabilityBenefits: 'no',
    partnerDisabilityBenefitType: '',
    partnerPipDailyLivingRate: 'none',
    partnerPipMobilityRate: 'none',
    partnerDlaCareRate: 'none',
    partnerDlaMobilityRate: 'none',
    partnerAaRate: 'none',
    partnerHasLCWRA: 'no',
    
    // Children
    hasChildren: false,
    children: 0,
    childAges: [],
    childDisabilities: [],
    childGenders: [],
    childcareCosts: 0,
    childcareCostsPeriod: 'per_month',
    
    // Carer Status
    isCarer: 'no',
    isPartnerCarer: 'no',
    
    // Other Benefits
    hasOtherBenefits: 'no',
    otherBenefitsList: [],
    
    // Savings
    hasSavings: 'no',
    hasSavingsOver6000: 'no',
    savingsAmount: 0,
    savings: 0,
    savingsPeriod: 'per_month',
    
    // Area
    area: 'england'
  });

  const [results, setResults] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [pensionWarningType, setPensionWarningType] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Initialize calculator
  const [calculator] = useState(() => new UniversalCreditCalculator());

  // Apply skin for current route
  useEffect(() => {
    applySkinForRoute(location.pathname);
  }, [location.pathname]);

  // Load saved scenarios from localStorage on component mount
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

  // Expose current calculation data for Examples component
  useEffect(() => {
    window.currentCalculatorData = {
      formData: formData,
      results: results
    };
  }, [formData, results]);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear validation error for this field when user makes a change
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCalculate = async () => {
    // Validate BRMA selection for private tenants
    const errors = {};
    if (formData.housingStatus === 'renting' && formData.tenantType === 'private' && !formData.brma) {
      errors.brma = 'Please select your Broad Rental Market Area';
    }
    setValidationErrors(errors);

    // If there are validation errors, don't proceed
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      setHasCalculated(false);
      return;
    }

    setLoading(true);
    setHasCalculated(true);
    const warningType = getPensionAgeWarningType(formData);
    setPensionWarningType(warningType);
    if (warningType) {
      // Show warning only; hide results
      setShowResults(false);
      setLoading(false);
      return;
    }
    try {
      // Convert period-based amounts to monthly amounts for calculation
      const calculationInput = {
        ...formData,
        // Convert amounts to monthly
        rent: convertToMonthly(formData.rent, formData.rentPeriod),
        serviceCharges: convertToMonthly(formData.serviceCharges, formData.serviceChargesPeriod),
        monthlyEarnings: convertToMonthly(formData.monthlyEarnings, formData.monthlyEarningsPeriod),
        pensionAmount: convertToMonthly(formData.pensionAmount, formData.pensionAmountPeriod),
        partnerMonthlyEarnings: convertToMonthly(formData.partnerMonthlyEarnings, formData.partnerMonthlyEarningsPeriod),
        partnerPensionAmount: convertToMonthly(formData.partnerPensionAmount, formData.partnerPensionAmountPeriod),
        childcareCosts: convertToMonthly(formData.childcareCosts, formData.childcareCostsPeriod),
        savings: convertToMonthly(formData.savings, formData.savingsPeriod),
        // Add missing fields that the calculator expects
        age: formData.age || 25, // Use actual age if provided, otherwise default
        partnerAge: formData.partnerAge || 25, // Use actual partner age if provided, otherwise default
        otherBenefits: formData.hasOtherBenefits === 'yes' ? 
          (formData.otherBenefitsList.reduce((sum, benefit) => sum + (benefit.amount || 0), 0)) : 0,
        otherBenefitsPeriod: 'per_month'
      };

      console.log('Calculation input:', calculationInput);
      console.log('Net earnings in form data:', {
        netMonthlyEarningsCalculated: formData.netMonthlyEarningsCalculated,
        netMonthlyEarningsOverride: formData.netMonthlyEarningsOverride,
        monthlyEarnings: formData.monthlyEarnings
      });
      console.log('LCWRA Debug - formData:', { 
        hasLCWRA: formData.hasLCWRA, 
        partnerHasLCWRA: formData.partnerHasLCWRA,
        circumstances: formData.circumstances 
      });
      console.log('LCWRA Debug - calculationInput:', { 
        hasLCWRA: calculationInput.hasLCWRA, 
        partnerHasLCWRA: calculationInput.partnerHasLCWRA,
        circumstances: calculationInput.circumstances 
      });
      console.log('LCWRA Values - hasLCWRA:', formData.hasLCWRA, 'partnerHasLCWRA:', formData.partnerHasLCWRA, 'circumstances:', formData.circumstances);

      // Initialize calculator if needed
      if (!calculator.initialized) {
        await calculator.initialize();
      }

      // Perform actual calculation
      const calculationResult = await calculator.calculate(calculationInput);
      
      console.log('Calculation result:', calculationResult);
      
      if (calculationResult.success) {
        setResults(calculationResult);
        setShowResults(true);
      } else {
        console.error('Calculation failed:', calculationResult.errors);
        // Set error results
        setResults({
          success: false,
          errors: calculationResult.errors,
          calculation: {
            standardAllowance: 0,
            housingElement: 0,
            childElement: 0,
            childcareElement: 0,
            carerElement: 0,
            totalElements: 0,
            earningsReduction: 0,
            capitalDeduction: 0,
            benefitDeduction: 0,
            capitalDeductionDetails: {
              tariffIncome: 0,
              explanation: 'Calculation failed'
            },
            finalAmount: 0
          }
        });
        setShowResults(true);
      }
    } catch (error) {
      console.error('Calculation failed:', error);
      setResults({
        success: false,
        errors: [error.message],
        calculation: {
          standardAllowance: 0,
          childElement: 0,
          childcareElement: 0,
          carerElement: 0,
          totalElements: 0,
          earningsReduction: 0,
          capitalDeduction: 0,
          benefitDeduction: 0,
          capitalDeductionDetails: {
            tariffIncome: 0,
            explanation: 'Calculation error occurred'
          },
          finalAmount: 0
        }
      });
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert amounts to monthly
  const convertToMonthly = (amount, period) => {
    if (!amount || amount === 0) return 0;
    
    switch (period) {
      case 'per_week':
        return amount * 4.33; // 52 weeks / 12 months
      case 'per_month':
        return amount;
      case 'per_year':
        return amount / 12;
      default:
        return amount;
    }
  };

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

    // Save to localStorage
    localStorage.setItem('ucSavedScenarios', JSON.stringify(updated));
  };

  const handleLoadExample = (exampleFormData, exampleResults) => {
    // Load the form data
    setFormData({ ...exampleFormData });

    // If we have results (user-created examples), load them too
    if (exampleResults) {
      setResults(exampleResults);
      setShowResults(true);
    } else {
      // For pre-defined examples, clear results to force recalculation
      setResults(null);
      setShowResults(false);
    }

    // Reset calculation state
    setHasCalculated(false);
    setPensionWarningType(null);
  };

  const handleReset = () => {
    setFormData({
      // Tax Year and Circumstances
      taxYear: '2025_26',
      circumstances: 'single',
      age: 25,
      partnerAge: 25,
      
      // Housing
      housingStatus: 'no_housing_costs',
      tenantType: 'social',
      brma: '',
      rent: 0,
      rentPeriod: 'per_month',
      serviceCharges: 0,
      serviceChargesPeriod: 'per_month',
      bedrooms: 1,
      nonDependants: 0,
      
      // Employment and Disability - Main Person
      employmentType: 'not_working',
      monthlyEarnings: 0,
      monthlyEarningsPeriod: 'per_month',
      pensionAmount: 0,
      pensionAmountPeriod: 'per_month',
      pensionType: 'amount',
      pensionPercentage: 3,
      isDisabled: 'no',
      claimsDisabilityBenefits: 'no',
      disabilityBenefitType: '',
      pipDailyLivingRate: 'none',
      pipMobilityRate: 'none',
      dlaCareRate: 'none',
      dlaMobilityRate: 'none',
      aaRate: 'none',
      hasLCWRA: 'no',
      
      // Employment and Disability - Partner
      partnerEmploymentType: 'not_working',
      partnerMonthlyEarnings: 0,
      partnerMonthlyEarningsPeriod: 'per_month',
      partnerPensionAmount: 0,
      partnerPensionAmountPeriod: 'per_month',
      partnerPensionType: 'amount',
      partnerPensionPercentage: 3,
      partnerIsDisabled: 'no',
      partnerClaimsDisabilityBenefits: 'no',
      partnerDisabilityBenefitType: '',
      partnerPipDailyLivingRate: 'none',
      partnerPipMobilityRate: 'none',
      partnerDlaCareRate: 'none',
      partnerDlaMobilityRate: 'none',
      partnerAaRate: 'none',
      partnerHasLCWRA: 'no',
      
      // Children
      hasChildren: false,
      children: 0,
      childAges: [],
      childDisabilities: [],
      childGenders: [],
      childcareCosts: 0,
      childcareCostsPeriod: 'per_month',
      
      // Carer Status
      isCarer: 'no',
      isPartnerCarer: 'no',
      
      // Other Benefits
      hasOtherBenefits: 'no',
      otherBenefitsList: [],
      
      // Savings
      hasSavings: 'no',
      hasSavingsOver6000: 'no',
      savingsAmount: 0,
      savings: 0,
      savingsPeriod: 'per_month',
      
      // Area
      area: 'england'
    });
    setResults(null);
    setShowResults(false);
    // Clear pension-age warning and calculation gate
    setHasCalculated(false);
    setPensionWarningType(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    if (!results) return;
    
    // Import jsPDF dynamically to avoid SSR issues
    import('jspdf').then(({ default: jsPDF }) => {
      const doc = new jsPDF();
      
      // Set up the PDF
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let yPosition = margin;
      
      // Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Universal Credit Calculation Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;
      
      // Date
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, margin, yPosition);
      yPosition += 10;
      
      // Tax Year
      doc.text(`Tax Year: ${formData.taxYear.replace('_', '/')}`, margin, yPosition);
      yPosition += 15;
      
      // Final Result
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Your Universal Credit Entitlement', margin, yPosition);
      yPosition += 10;
      
      doc.setFontSize(20);
      doc.text(`£${results.calculation.finalAmount.toFixed(2)} per month`, margin, yPosition);
      yPosition += 20;
      
      // Breakdown Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Calculation Breakdown', margin, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      // Elements
      const elements = [
        { label: 'Standard Allowance', value: results.calculation.standardAllowance },
        { label: 'Housing Element', value: results.calculation.housingElement },
        { label: 'Child Element', value: results.calculation.childElement },
        { label: 'Childcare Element', value: results.calculation.childcareElement }
      ];
      
      // Add conditional elements
      if (results.calculation.carerElement > 0) {
        elements.push({ label: 'Carer Element', value: results.calculation.carerElement });
      }
      if (results.calculation.lcwraElement > 0) {
        elements.push({ label: 'LCWRA Element', value: results.calculation.lcwraElement });
      }
      
      elements.push({ label: 'Total Elements', value: results.calculation.totalElements });
      
      // Display elements
      elements.forEach(element => {
        const isTotal = element.label === 'Total Elements';
        if (isTotal) {
          doc.setFont('helvetica', 'bold');
          yPosition += 5;
        }
        
        doc.text(element.label, margin, yPosition);
        doc.text(`£${element.value.toFixed(2)}`, margin + contentWidth - 30, yPosition, { align: 'right' });
        yPosition += 6;
        
        if (isTotal) {
          doc.setFont('helvetica', 'normal');
          yPosition += 5;
        }
      });
      
      // Deductions
      yPosition += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Deductions', margin, yPosition);
      yPosition += 8;
      doc.setFont('helvetica', 'normal');
      
      if (results.calculation.earningsReduction > 0) {
        const label = results.calculation.workAllowance > 0 
          ? `Earnings Reduction after work allowance of £${results.calculation.workAllowance.toFixed(2)}`
          : 'Earnings Reduction';
        doc.text(label, margin, yPosition);
        doc.text(`-£${results.calculation.earningsReduction.toFixed(2)}`, margin + contentWidth - 30, yPosition, { align: 'right' });
        yPosition += 6;
      }
      
      const totalOtherDeductions = results.calculation.capitalDeduction + results.calculation.benefitDeduction;
      if (totalOtherDeductions > 0) {
        doc.text('Other Deductions', margin, yPosition);
        doc.text(`-£${totalOtherDeductions.toFixed(2)}`, margin + contentWidth - 30, yPosition, { align: 'right' });
        yPosition += 6;
      }
      
      // Final amount
      yPosition += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Final Universal Credit', margin, yPosition);
      doc.text(`£${results.calculation.finalAmount.toFixed(2)}`, margin + contentWidth - 30, yPosition, { align: 'right' });
      yPosition += 15;
      
      // Check if we need a new page for form data
      if (yPosition > 250) {
        doc.addPage();
        yPosition = margin;
      }
      
      // Form Data Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Your Details', margin, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      // Personal details
      const personalDetails = [
        { label: 'Circumstances', value: formData.circumstances === 'single' ? 'Single' : 'Couple' },
        { label: 'Age', value: formData.age || 'Not specified' },
        { label: 'Housing Status', value: formData.housingStatus === 'no_housing_costs' ? 'No Housing Costs' : 
          formData.housingStatus === 'renting' ? 'Renting' : 
          formData.housingStatus === 'mortgage' ? 'Mortgage' : 
          formData.housingStatus === 'in_prison' ? 'In Prison' : formData.housingStatus }
      ];
      
      if (formData.circumstances === 'couple') {
        personalDetails.push({ label: 'Partner Age', value: formData.partnerAge || 'Not specified' });
      }
      
      personalDetails.forEach(detail => {
        doc.text(detail.label, margin, yPosition);
        doc.text(detail.value.toString(), margin + 80, yPosition);
        yPosition += 6;
      });
      
      // Employment details
      yPosition += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Employment & Income', margin, yPosition);
      yPosition += 8;
      doc.setFont('helvetica', 'normal');
      
      if (formData.employmentType !== 'not_working') {
        const employmentDetails = [
          { label: 'Employment Type', value: formData.employmentType === 'employed' ? 'Employed' : 'Self-employed' },
          { label: 'Monthly Earnings', value: `£${formData.monthlyEarnings.toFixed(2)} (${formData.monthlyEarningsPeriod.replace('_', ' ')})` }
        ];
        
        employmentDetails.forEach(detail => {
          doc.text(detail.label, margin, yPosition);
          doc.text(detail.value.toString(), margin + 80, yPosition);
          yPosition += 6;
        });
      }
      
      if (formData.circumstances === 'couple' && formData.partnerEmploymentType !== 'not_working') {
        yPosition += 2;
        doc.text('Partner Employment:', margin, yPosition);
        yPosition += 6;
        
        const partnerDetails = [
          { label: 'Employment Type', value: formData.partnerEmploymentType === 'employed' ? 'Employed' : 'Self-employed' },
          { label: 'Monthly Earnings', value: `£${formData.partnerMonthlyEarnings.toFixed(2)} (${formData.partnerMonthlyEarningsPeriod.replace('_', ' ')})` }
        ];
        
        partnerDetails.forEach(detail => {
          doc.text(detail.label, margin + 10, yPosition);
          doc.text(detail.value.toString(), margin + 90, yPosition);
          yPosition += 6;
        });
      }
      
      // Housing details
      if (formData.housingStatus === 'renting') {
        yPosition += 5;
        doc.setFont('helvetica', 'bold');
        doc.text('Housing Costs', margin, yPosition);
        yPosition += 8;
        doc.setFont('helvetica', 'normal');
        
        const housingDetails = [
          { label: 'Rent', value: `£${formData.rent.toFixed(2)} (${formData.rentPeriod.replace('_', ' ')})` },
          { label: 'Service Charges', value: `£${formData.serviceCharges.toFixed(2)} (${formData.serviceChargesPeriod.replace('_', ' ')})` }
        ];
        
        housingDetails.forEach(detail => {
          doc.text(detail.label, margin, yPosition);
          doc.text(detail.value.toString(), margin + 80, yPosition);
          yPosition += 6;
        });
      }
      
      // Children
      if (formData.hasChildren && formData.children > 0) {
        yPosition += 5;
        doc.setFont('helvetica', 'bold');
        doc.text('Children', margin, yPosition);
        yPosition += 8;
        doc.setFont('helvetica', 'normal');
        
        doc.text(`Number of children: ${formData.children}`, margin, yPosition);
        yPosition += 6;
        
        if (formData.childcareCosts > 0) {
          doc.text('Childcare Costs', margin, yPosition);
          doc.text(`£${formData.childcareCosts.toFixed(2)} (${formData.childcareCostsPeriod.replace('_', ' ')})`, margin + 80, yPosition);
          yPosition += 6;
        }
      }
      
      // Savings
      if (formData.hasSavings === 'yes') {
        yPosition += 5;
        doc.setFont('helvetica', 'bold');
        doc.text('Savings', margin, yPosition);
        yPosition += 8;
        doc.setFont('helvetica', 'normal');
        
        doc.text('Savings Amount', margin, yPosition);
        doc.text(`£${formData.savings.toFixed(2)} (${formData.savingsPeriod.replace('_', ' ')})`, margin + 80, yPosition);
        yPosition += 6;
      }
      
      // Save the PDF
      const filename = `uc-calculation-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
    }).catch(error => {
      console.error('Error generating PDF:', error);
      // Fallback to JSON export if PDF generation fails
      const exportData = {
        formData,
        results,
        exportedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `uc-calculation-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <Logo route={location.pathname} />
          <div className="header-text">
            <h1>{isRehabilitation ? 'Benefits Calculator' : 'Better Off In Work Calculator'}</h1>
            <p className="subtitle">{isRehabilitation ? 'Use this calculator to maximise your income and see how changes in circumstance might affect you' : 'Use this calculator to check your finances if you move into work, claim all your entitlements and get help with self employment'}</p>
          </div>
          <div className="header-buttons">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setShowExamples(!showExamples)}
            >
              {showExamples ? 'Hide Examples' : 'Examples'}
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm admin-toggle"
              onClick={() => setShowAdminPanel(!showAdminPanel)}
            >
              {showAdminPanel ? 'Hide Admin' : 'Admin Panel'}
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="calculator-grid">
          <CalculatorForm
            formData={formData}
            onFormChange={handleFormChange}
            onCalculate={handleCalculate}
            onReset={handleReset}
            isRehabilitation={isRehabilitation}
            validationErrors={validationErrors}
          />
        </div>

        {hasCalculated && pensionWarningType && (
          <StatePensionAgeWarning type={pensionWarningType} />
        )}

        {!pensionWarningType && savedScenarios.length > 0 && (
          <div className="saved-scenarios">
            <h3>Saved Scenarios</h3>
            <div className="scenarios-list">
              {savedScenarios.map(scenario => (
                <div key={scenario.id} className="scenario-item">
                  <span>{scenario.name}</span>
                  <div className="scenario-actions">
                    <button onClick={() => {
                      setFormData(scenario.input);
                      setResults(scenario.calculation);
                      setShowResults(true);
                    }}>Load</button>
                    <button onClick={() => {
                      const updated = savedScenarios.filter(s => s.id !== scenario.id);
                      setSavedScenarios(updated);
                      localStorage.setItem('ucSavedScenarios', JSON.stringify(updated));
                    }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!pensionWarningType && showResults && results && (
          <ResultsSection
            results={results}
            formData={formData}
            onPrint={handlePrint}
            onExport={handleExport}
            onSave={handleSaveScenario}
          />
        )}
      </main>

      {/* Examples Section */}
      <ExamplesSection
        isVisible={showExamples}
        onToggleVisibility={() => setShowExamples(false)}
        onLoadExample={handleLoadExample}
      />

      {/* Admin Panel */}
      <AdminPanel
        isVisible={showAdminPanel}
        onToggleVisibility={() => setShowAdminPanel(false)}
        currentRoute={location.pathname}
        formData={formData}
        results={results}
      />

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Calculating...</div>
        </div>
      )}
      
      <Navigation showRelatedTools={false} />
    </div>
  );
}

export default CalculatorPage;
