/**
 * PDF Generator Utility
 * Handles PDF generation for UC calculation results
 */

import jsPDF from 'jspdf'
import type { SavedScenario } from '../types/saved-scenarios'
import type { PDFExportOptions } from '../types/pdf-export'

/**
 * Generate PDF from scenario data
 */
export async function generatePDF(
  scenario: SavedScenario,
  options: PDFExportOptions
): Promise<void> {
  const doc = new jsPDF()
  let yPosition = 20

  // Add title
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Universal Credit Calculation', 105, yPosition, { align: 'center' })
  yPosition += 10

  // Add subtitle
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.text(scenario.name, 105, yPosition, { align: 'center' })
  yPosition += 15

  // Add generation date
  doc.setFontSize(10)
  doc.text(
    `Generated: ${new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })}`,
    20,
    yPosition
  )
  yPosition += 10

  // Add horizontal line
  doc.setLineWidth(0.5)
  doc.line(20, yPosition, 190, yPosition)
  yPosition += 10

  // Add household composition if enabled
  if (options.includeHouseholdDetails) {
    yPosition = addHouseholdSection(doc, scenario, yPosition)
  }

  // Add UC breakdown if enabled
  if (options.includeCalculationBreakdown) {
    yPosition = addUCBreakdownSection(doc, scenario, yPosition)
  }

  // Add disclaimer if enabled
  if (options.includeDisclaimer) {
    yPosition = addDisclaimerSection(doc, yPosition)
  }

  // Generate filename
  const filename =
    options.filename ||
    `uc-calculation-${scenario.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`

  // Save the PDF
  doc.save(filename)
}

/**
 * Add household composition section
 */
function addHouseholdSection(
  doc: jsPDF,
  scenario: SavedScenario,
  startY: number
): number {
  let y = startY

  // Check if we need a new page
  if (y > 250) {
    doc.addPage()
    y = 20
  }

  // Section heading
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Household Composition', 20, y)
  y += 8

  // Household details
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  const formData = scenario.formData

  // Adults
  const adults = formData.numberOfAdults || 1
  doc.text(`• Adults: ${adults} (${formData.relationshipStatus || 'Single'})`, 25, y)
  y += 6

  // Children
  const children = formData.numberOfChildren || 0
  if (children > 0) {
    doc.text(`• Children: ${children}`, 25, y)
    y += 6
  }

  // Location
  if (formData.location) {
    doc.text(`• Location: ${formData.location}`, 25, y)
    y += 6
  }

  y += 5
  return y
}

/**
 * Add UC breakdown section
 */
function addUCBreakdownSection(
  doc: jsPDF,
  scenario: SavedScenario,
  startY: number
): number {
  let y = startY

  // Check if we need a new page
  if (y > 220) {
    doc.addPage()
    y = 20
  }

  // Section heading
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Universal Credit Breakdown', 20, y)
  y += 10

  const calc = scenario.results.calculation

  // Create breakdown table data
  const tableData: Array<[string, string]> = [
    ['Standard Allowance', formatCurrency(calc.standardAllowance)],
  ]

  if (calc.housingElement > 0) {
    tableData.push(['Housing Element', formatCurrency(calc.housingElement)])
  }

  if (calc.childElement > 0) {
    tableData.push(['Child Element', formatCurrency(calc.childElement)])
  }

  if (calc.childcareElement > 0) {
    tableData.push(['Childcare Element', formatCurrency(calc.childcareElement)])
  }

  if (calc.carerElement > 0) {
    tableData.push(['Carer Element', formatCurrency(calc.carerElement)])
  }

  if (calc.lcwraElement > 0) {
    tableData.push(['LCWRA Element', formatCurrency(calc.lcwraElement)])
  }

  // Add deductions if any
  if (calc.earningsReduction > 0) {
    tableData.push(['Less: Earnings Reduction', `-${formatCurrency(calc.earningsReduction)}`])
  }

  if (calc.capitalDeduction > 0) {
    tableData.push(['Less: Capital Deduction', `-${formatCurrency(calc.capitalDeduction)}`])
  }

  // Draw table
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  tableData.forEach(([label, value]) => {
    if (y > 270) {
      doc.addPage()
      y = 20
    }

    doc.text(label, 25, y)
    doc.text(value, 160, y, { align: 'right' })
    y += 7
  })

  // Add separator line
  y += 2
  doc.setLineWidth(0.3)
  doc.line(25, y, 185, y)
  y += 7

  // Add total
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Total UC (monthly)', 25, y)
  doc.text(formatCurrency(calc.finalAmount), 160, y, { align: 'right' })
  y += 10

  return y
}

/**
 * Add disclaimer section
 */
function addDisclaimerSection(doc: jsPDF, startY: number): number {
  let y = startY

  // Check if we need a new page
  if (y > 240) {
    doc.addPage()
    y = 20
  }

  y += 5

  // Disclaimer box
  doc.setLineWidth(0.3)
  doc.setDrawColor(200, 200, 200)
  doc.rect(20, y, 170, 30)

  y += 7
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Important:', 25, y)
  y += 5

  doc.setFont('helvetica', 'normal')
  const disclaimerText =
    'This is an estimate only. Your actual Universal Credit entitlement may vary based on your individual circumstances. For official calculations, please contact the Department for Work and Pensions or use the official gov.uk benefits calculator.'

  const splitText = doc.splitTextToSize(disclaimerText, 160)
  doc.text(splitText, 25, y)

  y += 30
  return y
}

/**
 * Format currency for PDF
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
