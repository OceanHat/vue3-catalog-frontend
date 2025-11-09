export const formatDate = (date, format = 'short') => {
  if (!date) return ''
  
  const d = new Date(date)
  
  if (format === 'short') {
    return d.toLocaleDateString()
  } else if (format === 'long') {
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  } else if (format === 'time') {
    return d.toLocaleTimeString()
  } else if (format === 'datetime') {
    return d.toLocaleString()
  }
  
  return d.toLocaleDateString()
}

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

export const formatNumber = (number, decimals = 0) => {
  return Number(number).toFixed(decimals)
}

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}
