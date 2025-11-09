export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined
}

export const minLength = (value, length) => {
  if (typeof value === 'string') {
    return value.length >= length
  }
  return false
}

export const maxLength = (value, length) => {
  if (typeof value === 'string') {
    return value.length <= length
  }
  return false
}

export const isNumeric = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value)
}
