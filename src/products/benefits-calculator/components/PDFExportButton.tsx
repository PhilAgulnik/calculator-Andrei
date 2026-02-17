/**
 * PDF Export Button Component
 * Provides a button to export UC calculation results as PDF
 */

import { useState } from 'react'
import { Button } from '~/components/Button'
import type { SavedScenario } from '../types/saved-scenarios'
import type { PDFExportOptions } from '../types/pdf-export'
import { DEFAULT_PDF_OPTIONS } from '../types/pdf-export'
import { generatePDF } from '../utils/pdfGenerator'

interface PDFExportButtonProps {
  scenario: SavedScenario
  options?: Partial<PDFExportOptions>
  className?: string
}

export function PDFExportButton({
  scenario,
  options = {},
  className = '',
}: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    setIsExporting(true)
    setError(null)

    try {
      const exportOptions: PDFExportOptions = {
        ...DEFAULT_PDF_OPTIONS,
        ...options,
      }

      await generatePDF(scenario, exportOptions)

      // Success feedback (brief)
      setTimeout(() => {
        setIsExporting(false)
      }, 1000)
    } catch (err) {
      console.error('PDF export failed:', err)
      setError('Failed to generate PDF. Please try again.')
      setIsExporting(false)
    }
  }

  return (
    <div>
      <Button
        onClick={handleExport}
        className={`${className} ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isExporting ? '📄 Generating PDF...' : '📄 Export to PDF'}
      </Button>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </div>
  )
}
