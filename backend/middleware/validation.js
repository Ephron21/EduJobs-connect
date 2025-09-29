import Joi from 'joi'

// Common validation schemas
const commonSchemas = {
  objectId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ID format'),
  email: Joi.string().email().lowercase().required(),
  phone: Joi.string().regex(/^(\+250|0)[0-9]{9}$/).message('Please provide a valid Rwandan phone number'),
  password: Joi.string().min(6).max(128).required(),
  name: Joi.string().trim().min(2).max(50).required(),
  nationalId: Joi.string().regex(/^[0-9]{16}$/).message('National ID must be 16 digits'),
  date: Joi.date().iso(),
  url: Joi.string().uri()
}

// User validation schemas
export const userValidation = {
  register: Joi.object({
    firstName: commonSchemas.name,
    lastName: commonSchemas.name,
    email: commonSchemas.email,
    phoneNumber: commonSchemas.phone,
    password: commonSchemas.password
  }),

  login: Joi.object({
    email: commonSchemas.email,
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    firstName: Joi.string().trim().min(2).max(50),
    lastName: Joi.string().trim().min(2).max(50),
    phoneNumber: commonSchemas.phone
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: commonSchemas.password,
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
  }),

  forgotPassword: Joi.object({
    email: commonSchemas.email
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: commonSchemas.password
  })
}

// Student validation schemas
export const studentValidation = {
  create: Joi.object({
    nationalId: commonSchemas.nationalId,
    dateOfBirth: commonSchemas.date.max('now').required(),
    registrationNumber: Joi.string().trim().required(),
    address: Joi.object({
      province: Joi.string().valid('Kigali', 'Northern', 'Southern', 'Eastern', 'Western').required(),
      district: Joi.string().trim().required(),
      sector: Joi.string().trim().required(),
      cell: Joi.string().trim(),
      village: Joi.string().trim()
    }).required(),
    guardianNames: Joi.string().trim().max(100).required(),
    guardianPhoneNumber: commonSchemas.phone,
    academicInfo: Joi.object({
      schoolName: Joi.string().trim().required(),
      graduationYear: Joi.number().integer().min(2015).max(new Date().getFullYear()).required(),
      combination: Joi.string().valid('PCM', 'PCB', 'MPC', 'HEG', 'HGL', 'MEG', 'MCB', 'Other').required(),
      grades: Joi.object().pattern(Joi.string(), Joi.string())
    }).required()
  }),

  update: Joi.object({
    address: Joi.object({
      province: Joi.string().valid('Kigali', 'Northern', 'Southern', 'Eastern', 'Western'),
      district: Joi.string().trim(),
      sector: Joi.string().trim(),
      cell: Joi.string().trim(),
      village: Joi.string().trim()
    }),
    guardianNames: Joi.string().trim().max(100),
    guardianPhoneNumber: commonSchemas.phone,
    institutionApplying: Joi.string().trim(),
    academicInfo: Joi.object({
      schoolName: Joi.string().trim(),
      graduationYear: Joi.number().integer().min(2015).max(new Date().getFullYear()),
      combination: Joi.string().valid('PCM', 'PCB', 'MPC', 'HEG', 'HGL', 'MEG', 'MCB', 'Other'),
      grades: Joi.object().pattern(Joi.string(), Joi.string())
    }),
    preferences: Joi.object({
      preferredUniversities: Joi.array().items(commonSchemas.objectId),
      preferredPrograms: Joi.array().items(Joi.string().trim()),
      fundingPreference: Joi.string().valid('scholarship', 'loan', 'self_paid', 'sponsor', 'any')
    })
  })
}

// University validation schemas
export const universityValidation = {
  create: Joi.object({
    name: Joi.string().trim().required(),
    type: Joi.string().valid('local', 'international').required(),
    location: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    description: Joi.string().max(2000).required(),
    website: commonSchemas.url,
    programs: Joi.array().items(
      Joi.object({
        name: Joi.string().trim().required(),
        degree: Joi.string().valid('Certificate', 'Diploma', 'Bachelor', 'Master', 'PhD').required(),
        duration: Joi.string().required(),
        requirements: Joi.array().items(Joi.string().trim())
      })
    )
  }),

  update: Joi.object({
    name: Joi.string().trim(),
    type: Joi.string().valid('local', 'international'),
    location: Joi.string().trim(),
    country: Joi.string().trim(),
    description: Joi.string().max(2000),
    website: commonSchemas.url,
    programs: Joi.array().items(
      Joi.object({
        name: Joi.string().trim().required(),
        degree: Joi.string().valid('Certificate', 'Diploma', 'Bachelor', 'Master', 'PhD').required(),
        duration: Joi.string().required(),
        requirements: Joi.array().items(Joi.string().trim())
      })
    ),
    isActive: Joi.boolean()
  })
}

// Application validation schemas
export const applicationValidation = {
  create: Joi.object({
    universityId: commonSchemas.objectId.required(),
    title: Joi.string().trim().max(200).required(),
    type: Joi.string().valid('scholarship', 'loan', 'self_paid', 'sponsor').required(),
    description: Joi.string().max(3000).required(),
    requirements: Joi.array().items(Joi.string().trim()),
    deadline: commonSchemas.date.greater('now').required(),
    applicationUrl: commonSchemas.url,
    documents: Joi.array().items(Joi.string().trim()),
    eligibilityCriteria: Joi.array().items(Joi.string().trim()),
    benefits: Joi.array().items(Joi.string().trim()),
    contactEmail: Joi.string().email(),
    contactPhone: Joi.string()
  }),

  update: Joi.object({
    title: Joi.string().trim().max(200),
    type: Joi.string().valid('scholarship', 'loan', 'self_paid', 'sponsor'),
    description: Joi.string().max(3000),
    requirements: Joi.array().items(Joi.string().trim()),
    deadline: commonSchemas.date.greater('now'),
    applicationUrl: commonSchemas.url,
    documents: Joi.array().items(Joi.string().trim()),
    eligibilityCriteria: Joi.array().items(Joi.string().trim()),
    benefits: Joi.array().items(Joi.string().trim()),
    contactEmail: Joi.string().email(),
    contactPhone: Joi.string(),
    isActive: Joi.boolean(),
    featured: Joi.boolean()
  })
}

// Job validation schemas
export const jobValidation = {
  create: Joi.object({
    title: Joi.string().trim().max(200).required(),
    company: Joi.string().trim().max(100).required(),
    location: Joi.string().trim().required(),
    type: Joi.string().valid('full_time', 'part_time', 'contract', 'internship').required(),
    category: Joi.string().trim().required(),
    description: Joi.string().max(5000).required(),
    requirements: Joi.array().items(Joi.string().trim()),
    responsibilities: Joi.array().items(Joi.string().trim()),
    salary: Joi.string().trim(),
    deadline: commonSchemas.date.greater('now').required(),
    applicationUrl: commonSchemas.url,
    documents: Joi.array().items(Joi.string().trim()),
    contactEmail: Joi.string().email(),
    contactPhone: Joi.string(),
    experience: Joi.string().valid('entry', 'junior', 'mid', 'senior', 'executive'),
    education: Joi.string().valid('high_school', 'certificate', 'diploma', 'bachelor', 'master', 'phd')
  }),

  update: Joi.object({
    title: Joi.string().trim().max(200),
    company: Joi.string().trim().max(100),
    location: Joi.string().trim(),
    type: Joi.string().valid('full_time', 'part_time', 'contract', 'internship'),
    category: Joi.string().trim(),
    description: Joi.string().max(5000),
    requirements: Joi.array().items(Joi.string().trim()),
    responsibilities: Joi.array().items(Joi.string().trim()),
    salary: Joi.string().trim(),
    deadline: commonSchemas.date.greater('now'),
    applicationUrl: commonSchemas.url,
    documents: Joi.array().items(Joi.string().trim()),
    contactEmail: Joi.string().email(),
    contactPhone: Joi.string(),
    experience: Joi.string().valid('entry', 'junior', 'mid', 'senior', 'executive'),
    education: Joi.string().valid('high_school', 'certificate', 'diploma', 'bachelor', 'master', 'phd'),
    isActive: Joi.boolean(),
    featured: Joi.boolean()
  }),

  search: Joi.object({
    q: Joi.string().trim(),
    type: Joi.string().valid('full_time', 'part_time', 'contract', 'internship'),
    category: Joi.string().trim(),
    location: Joi.string().trim(),
    experience: Joi.string().valid('entry', 'junior', 'mid', 'senior', 'executive'),
    education: Joi.string().valid('high_school', 'certificate', 'diploma', 'bachelor', 'master', 'phd'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid('newest', 'oldest', 'deadline', 'salary', 'relevance').default('newest')
  })
}

// Consultation validation schemas
export const consultationValidation = {
  create: Joi.object({
    serviceType: Joi.string().valid('cv_writing', 'university_guidance', 'mifotra_setup', 'career_counseling', 'interview_prep', 'other').required(),
    fullName: Joi.string().trim().max(100).required(),
    email: commonSchemas.email,
    phoneNumber: commonSchemas.phone,
    subject: Joi.string().trim().max(200).required(),
    message: Joi.string().max(2000).required(),
    urgency: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
    preferredContactMethod: Joi.string().valid('email', 'phone', 'whatsapp', 'video_call').default('email'),
    availableTime: Joi.string().valid('morning', 'afternoon', 'evening', 'weekend', 'anytime').default('anytime')
  }),

  update: Joi.object({
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled'),
    assignedTo: commonSchemas.objectId,
    priority: Joi.number().integer().min(1).max(5),
    estimatedDuration: Joi.string().valid('30min', '1hour', '2hours', '1day', '2-3days', '1week'),
    actualDuration: Joi.string(),
    cost: Joi.object({
      amount: Joi.number().min(0),
      currency: Joi.string().default('RWF'),
      paymentStatus: Joi.string().valid('pending', 'paid', 'refunded', 'waived')
    }),
    followUpRequired: Joi.boolean(),
    followUpDate: commonSchemas.date,
    tags: Joi.array().items(Joi.string().trim())
  }),

  addNote: Joi.object({
    content: Joi.string().max(1000).required(),
    isInternal: Joi.boolean().default(false)
  }),

  feedback: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().max(500)
  })
}

// Announcement validation schemas
export const announcementValidation = {
  create: Joi.object({
    title: Joi.string().trim().max(200).required(),
    content: Joi.string().max(5000).required(),
    type: Joi.string().valid('general', 'university', 'job', 'urgent', 'maintenance', 'event').required(),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium'),
    targetAudience: Joi.string().valid('all', 'students', 'admins', 'new_users', 'verified_users').default('all'),
    isPinned: Joi.boolean().default(false),
    showOnHomepage: Joi.boolean().default(false),
    scheduledFor: commonSchemas.date,
    expiresAt: commonSchemas.date,
    tags: Joi.array().items(Joi.string().trim().lowercase())
  }),

  update: Joi.object({
    title: Joi.string().trim().max(200),
    content: Joi.string().max(5000),
    type: Joi.string().valid('general', 'university', 'job', 'urgent', 'maintenance', 'event'),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical'),
    targetAudience: Joi.string().valid('all', 'students', 'admins', 'new_users', 'verified_users'),
    isActive: Joi.boolean(),
    isPinned: Joi.boolean(),
    showOnHomepage: Joi.boolean(),
    scheduledFor: commonSchemas.date,
    expiresAt: commonSchemas.date,
    tags: Joi.array().items(Joi.string().trim().lowercase())
  }),

  addComment: Joi.object({
    content: Joi.string().max(500).required()
  })
}

// Query validation schemas
export const queryValidation = {
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  }),

  search: Joi.object({
    q: Joi.string().trim(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().default('newest')
  }),

  dateRange: Joi.object({
    startDate: commonSchemas.date,
    endDate: commonSchemas.date,
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  })
}

// Validation middleware factory
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = source === 'query' ? req.query : 
                  source === 'params' ? req.params : 
                  req.body

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    })

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }))

      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      })
    }

    // Replace the original data with validated and sanitized data
    if (source === 'query') {
      req.query = value
    } else if (source === 'params') {
      req.params = value
    } else {
      req.body = value
    }

    next()
  }
}

// Specific validation middlewares
export const validateUserRegistration = validate(userValidation.register)
export const validateUserLogin = validate(userValidation.login)
export const validateStudentCreate = validate(studentValidation.create)
export const validateStudentUpdate = validate(studentValidation.update)
export const validateUniversityCreate = validate(universityValidation.create)
export const validateUniversityUpdate = validate(universityValidation.update)
export const validateApplicationCreate = validate(applicationValidation.create)
export const validateApplicationUpdate = validate(applicationValidation.update)
export const validateJobCreate = validate(jobValidation.create)
export const validateJobUpdate = validate(jobValidation.update)
export const validateJobSearch = validate(jobValidation.search, 'query')
export const validateConsultationCreate = validate(consultationValidation.create)
export const validateConsultationUpdate = validate(consultationValidation.update)
export const validateAnnouncementCreate = validate(announcementValidation.create)
export const validateAnnouncementUpdate = validate(announcementValidation.update)
export const validatePagination = validate(queryValidation.pagination, 'query')
export const validateSearch = validate(queryValidation.search, 'query')
export const validateObjectId = validate(Joi.object({ id: commonSchemas.objectId.required() }), 'params')
