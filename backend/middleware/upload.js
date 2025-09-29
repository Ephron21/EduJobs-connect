import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { generateUniqueFilename, validateFileType } from '../utils/helpers.js'

// Ensure upload directory exists
const ensureUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// File type configurations
const fileTypeConfigs = {
  images: {
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    maxSize: 5 * 1024 * 1024, // 5MB
    destination: 'uploads/images'
  },
  documents: {
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ],
    maxSize: 10 * 1024 * 1024, // 10MB
    destination: 'uploads/documents'
  },
  profiles: {
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    maxSize: 2 * 1024 * 1024, // 2MB
    destination: 'uploads/profiles'
  },
  certificates: {
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ],
    maxSize: 5 * 1024 * 1024, // 5MB
    destination: 'uploads/certificates'
  }
}

// Create multer storage configuration
const createStorage = (config) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      ensureUploadDir(config.destination)
      cb(null, config.destination)
    },
    filename: (req, file, cb) => {
      const uniqueFilename = generateUniqueFilename(file.originalname)
      cb(null, uniqueFilename)
    }
  })
}

// Create file filter
const createFileFilter = (config) => {
  return (req, file, cb) => {
    if (validateFileType(file.mimetype, config.allowedTypes)) {
      cb(null, true)
    } else {
      cb(new Error(`Invalid file type. Allowed types: ${config.allowedTypes.join(', ')}`), false)
    }
  }
}

// Create upload middleware
const createUploadMiddleware = (type, fieldConfig) => {
  const config = fileTypeConfigs[type]
  
  if (!config) {
    throw new Error(`Unknown upload type: ${type}`)
  }

  const upload = multer({
    storage: createStorage(config),
    fileFilter: createFileFilter(config),
    limits: {
      fileSize: config.maxSize,
      files: fieldConfig.maxCount || 1
    }
  })

  // Return appropriate multer method based on field configuration
  if (typeof fieldConfig === 'string') {
    // Single file upload
    return upload.single(fieldConfig)
  } else if (Array.isArray(fieldConfig)) {
    // Multiple files with same field name
    return upload.array(fieldConfig[0], fieldConfig[1] || 5)
  } else if (typeof fieldConfig === 'object') {
    // Multiple fields
    return upload.fields(Object.entries(fieldConfig).map(([name, maxCount]) => ({
      name,
      maxCount: maxCount || 1
    })))
  }

  throw new Error('Invalid field configuration')
}

// Predefined upload middlewares
export const uploadImage = createUploadMiddleware('images', 'image')
export const uploadDocument = createUploadMiddleware('documents', 'document')
export const uploadProfile = createUploadMiddleware('profiles', 'profile')

// Student document uploads
export const uploadStudentDocuments = createUploadMiddleware('documents', {
  passportPhoto: 1,
  nationalIdCopy: 1,
  diploma: 1,
  transcripts: 1,
  recommendationLetter: 1
})

// Certificate uploads
export const uploadCertificates = createUploadMiddleware('certificates', ['certificates', 5])

// Multiple image uploads
export const uploadMultipleImages = createUploadMiddleware('images', ['images', 10])

// CV and cover letter uploads
export const uploadCVDocuments = createUploadMiddleware('documents', {
  cv: 1,
  coverLetter: 1,
  portfolio: 1
})

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    let message = 'File upload error'
    
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File size too large'
        break
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files uploaded'
        break
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected file field'
        break
      case 'LIMIT_PART_COUNT':
        message = 'Too many parts in multipart form'
        break
      default:
        message = error.message
    }
    
    return res.status(400).json({
      status: 'error',
      message,
      code: error.code
    })
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      status: 'error',
      message: error.message
    })
  }
  
  next(error)
}

// File cleanup utility
export const cleanupFiles = (files) => {
  if (!files) return
  
  const filesToDelete = []
  
  if (Array.isArray(files)) {
    filesToDelete.push(...files.map(file => file.path))
  } else if (typeof files === 'object') {
    Object.values(files).forEach(fileArray => {
      if (Array.isArray(fileArray)) {
        filesToDelete.push(...fileArray.map(file => file.path))
      } else {
        filesToDelete.push(fileArray.path)
      }
    })
  } else if (files.path) {
    filesToDelete.push(files.path)
  }
  
  filesToDelete.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  })
}

// Get file URL helper
export const getFileUrl = (filename, type = 'documents') => {
  if (!filename) return null
  
  const config = fileTypeConfigs[type]
  if (!config) return null
  
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000'
  return `${baseUrl}/${config.destination}/${filename}`
}

// Validate uploaded file
export const validateUploadedFile = (file, type) => {
  if (!file) return { isValid: false, error: 'No file provided' }
  
  const config = fileTypeConfigs[type]
  if (!config) return { isValid: false, error: 'Invalid upload type' }
  
  // Check file type
  if (!validateFileType(file.mimetype, config.allowedTypes)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed: ${config.allowedTypes.join(', ')}`
    }
  }
  
  // Check file size
  if (file.size > config.maxSize) {
    return {
      isValid: false,
      error: `File too large. Maximum size: ${Math.round(config.maxSize / 1024 / 1024)}MB`
    }
  }
  
  return { isValid: true }
}

// Create upload response
export const createUploadResponse = (files, type) => {
  if (!files) return null
  
  const processFile = (file) => ({
    filename: file.filename,
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    url: getFileUrl(file.filename, type),
    uploadedAt: new Date()
  })
  
  if (Array.isArray(files)) {
    return files.map(processFile)
  } else if (typeof files === 'object' && files.filename) {
    return processFile(files)
  } else if (typeof files === 'object') {
    const result = {}
    Object.entries(files).forEach(([key, fileArray]) => {
      if (Array.isArray(fileArray)) {
        result[key] = fileArray.map(processFile)
      } else {
        result[key] = processFile(fileArray)
      }
    })
    return result
  }
  
  return null
}
