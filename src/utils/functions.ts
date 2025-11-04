export function formatCurrency(amount: any, currency: string = 'GBP') {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '£0.00'
  }

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
