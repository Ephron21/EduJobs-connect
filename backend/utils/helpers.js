import crypto from 'crypto'
import path from 'path'

// Generate random string
export const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex')
}

// Generate OTP
export const generateOTP = (length = 6) => {
  const digits = '0123456789'
  let otp = ''
  
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)]
  }
  
  return otp
}

// Format phone number to international format
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return null
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '')
  
  // If starts with 0, replace with +250
  if (cleaned.startsWith('0')) {
    return `+250${cleaned.slice(1)}`
  }
  
  // If starts with 250, add +
  if (cleaned.startsWith('250')) {
    return `+${cleaned}`
  }
  
  // If already starts with +250, return as is
  if (cleaned.startsWith('+250')) {
    return cleaned
  }
  
  return phoneNumber
}

// Validate Rwandan National ID
export const validateNationalId = (nationalId) => {
  if (!nationalId || typeof nationalId !== 'string') return false
  
  // Remove spaces and check if it's 16 digits
  const cleaned = nationalId.replace(/\s/g, '')
  return /^[0-9]{16}$/.test(cleaned)
}

// Calculate age from date of birth
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null
  
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

// Format currency (Rwandan Francs)
export const formatCurrency = (amount, currency = 'RWF') => {
  if (!amount && amount !== 0) return null
  
  const formatter = new Intl.NumberFormat('rw-RW', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
  
  return formatter.format(amount)
}

// Slugify text for URLs
export const slugify = (text) => {
  if (!text) return ''
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '')             // Trim - from end of text
}

// Sanitize filename
export const sanitizeFilename = (filename) => {
  if (!filename) return 'file'
  
  const ext = path.extname(filename)
  const name = path.basename(filename, ext)
  
  const sanitized = name
    .replace(/[^a-zA-Z0-9]/g, '_')  // Replace special chars with underscore
    .replace(/_+/g, '_')            // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '')        // Remove leading/trailing underscores
    .toLowerCase()
  
  return `${sanitized || 'file'}${ext}`
}

// Generate unique filename
export const generateUniqueFilename = (originalFilename) => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const ext = path.extname(originalFilename)
  const name = path.basename(originalFilename, ext)
  
  return `${sanitizeFilename(name)}_${timestamp}_${random}${ext}`
}

// Validate file type
export const validateFileType = (mimetype, allowedTypes) => {
  if (!mimetype || !allowedTypes) return false
  
  return allowedTypes.includes(mimetype)
}

// Convert bytes to human readable format
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Pagination helper
export const getPaginationData = (page = 1, limit = 10, total = 0) => {
  const currentPage = Math.max(1, parseInt(page))
  const itemsPerPage = Math.max(1, Math.min(100, parseInt(limit))) // Max 100 items per page
  const totalPages = Math.ceil(total / itemsPerPage)
  const skip = (currentPage - 1) * itemsPerPage
  
  return {
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems: total,
    skip,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null
  }
}

// Search query builder
export const buildSearchQuery = (searchTerm, fields = []) => {
  if (!searchTerm || !fields.length) return {}
  
  const searchRegex = new RegExp(searchTerm, 'i')
  
  return {
    $or: fields.map(field => ({
      [field]: searchRegex
    }))
  }
}

// Date range query builder
export const buildDateRangeQuery = (startDate, endDate, field = 'createdAt') => {
  const query = {}
  
  if (startDate || endDate) {
    query[field] = {}
    
    if (startDate) {
      query[field].$gte = new Date(startDate)
    }
    
    if (endDate) {
      query[field].$lte = new Date(endDate)
    }
  }
  
  return query
}

// Remove sensitive data from object
export const removeSensitiveData = (obj, sensitiveFields = []) => {
  if (!obj || typeof obj !== 'object') return obj
  
  const cleaned = { ...obj }
  
  sensitiveFields.forEach(field => {
    delete cleaned[field]
  })
  
  return cleaned
}

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  return emailRegex.test(email)
}

// Validate Rwandan phone number
export const isValidRwandanPhone = (phone) => {
  const phoneRegex = /^(\+250|0)[0-9]{9}$/
  return phoneRegex.test(phone)
}

// Generate application/consultation reference number
export const generateReferenceNumber = (prefix = 'REF', length = 8) => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, length - 4).toUpperCase()
  
  return `${prefix}-${timestamp}${random}`
}

// Calculate deadline status
export const getDeadlineStatus = (deadline) => {
  if (!deadline) return 'no_deadline'
  
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'expired'
  if (diffDays === 0) return 'today'
  if (diffDays <= 3) return 'urgent'
  if (diffDays <= 7) return 'closing_soon'
  if (diffDays <= 30) return 'open'
  
  return 'plenty_time'
}

// Mask sensitive information
export const maskSensitiveInfo = (value, visibleChars = 4) => {
  if (!value || typeof value !== 'string') return value
  
  if (value.length <= visibleChars) {
    return '*'.repeat(value.length)
  }
  
  const masked = '*'.repeat(value.length - visibleChars)
  return masked + value.slice(-visibleChars)
}

// Deep clone object
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const cloned = {}
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key])
    })
    return cloned
  }
}

// Retry function with exponential backoff
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (i === maxRetries - 1) break
      
      const delay = baseDelay * Math.pow(2, i)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError
}
