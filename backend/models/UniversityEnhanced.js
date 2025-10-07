const mongoose = require('mongoose')

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'University name is required'],
    trim: true,
    maxlength: [200, 'University name cannot exceed 200 characters']
  },
  shortName: {
    type: String,
    trim: true,
    maxlength: [20, 'Short name cannot exceed 20 characters']
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  logo: String,
  images: [String],
  website: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: String,
  location: {
    address: String,
    city: {
      type: String,
      required: [true, 'City is required']
    },
    province: String,
    country: {
      type: String,
      default: 'Rwanda'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  programs: [{
    name: {
      type: String,
      required: [true, 'Program name is required']
    },
    degree: {
      type: String,
      enum: ['certificate', 'diploma', 'bachelor', 'master', 'phd'],
      required: [true, 'Degree level is required']
    },
    faculty: String,
    duration: {
      years: Number,
      months: Number
    },
    tuitionFee: {
      amount: Number,
      currency: { type: String, default: 'RWF' },
      period: { type: String, enum: ['semester', 'year'], default: 'year' }
    },
    requirements: {
      minimumGrade: String,
      subjects: [String],
      additionalRequirements: [String]
    },
    description: String,
    isActive: { type: Boolean, default: true }
  }],
  admissions: {
    applicationDeadline: Date,
    startDate: Date,
    requirements: {
      documents: [String],
      minimumAge: Number,
      languageRequirements: [String]
    },
    applicationFee: {
      amount: Number,
      currency: { type: String, default: 'RWF' }
    },
    scholarships: [{
      name: String,
      description: String,
      eligibility: [String],
      coverage: String,
      deadline: Date,
      amount: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'RWF'
      },
      type: {
        type: String,
        enum: ['full', 'partial', 'merit-based', 'need-based'],
        default: 'partial'
      },
      requirements: [String],
      applicationProcess: String,
      contactInfo: {
        email: String,
        phone: String,
        website: String
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }],
    financialAid: [{
      name: String,
      description: String,
      type: {
        type: String,
        enum: ['loan', 'grant', 'work-study', 'installment'],
        required: true
      },
      amount: {
        min: Number,
        max: Number,
        currency: { type: String, default: 'RWF' }
      },
      interestRate: Number,
      repaymentTerms: String,
      eligibility: [String],
      deadline: Date,
      provider: String,
      contactInfo: {
        email: String,
        phone: String,
        website: String
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }],
    paymentOptions: [{
      type: {
        type: String,
        enum: ['self-paid', 'installment', 'scholarship', 'loan', 'sponsor'],
        required: true
      },
      description: String,
      requirements: [String],
      deadline: Date,
      isActive: {
        type: Boolean,
        default: true
      }
    }]
  },
  announcements: [{
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['general', 'admission', 'scholarship', 'event', 'deadline', 'emergency'],
      default: 'general'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    deadline: Date,
    attachments: [{
      filename: String,
      originalName: String,
      path: String,
      mimetype: String,
      size: Number,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    targetAudience: {
      type: String,
      enum: ['all', 'students', 'applicants', 'staff'],
      default: 'all'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    publishedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: Date
  }],
  facilities: [String],
  accreditation: {
    body: String,
    status: {
      type: String,
      enum: ['accredited', 'pending', 'not-accredited'],
      default: 'accredited'
    },
    validUntil: Date
  },
  statistics: {
    totalStudents: Number,
    internationalStudents: Number,
    facultyCount: Number,
    graduationRate: Number,
    employmentRate: Number
  },
  rating: {
    overall: { type: Number, min: 0, max: 5, default: 0 },
    academic: { type: Number, min: 0, max: 5, default: 0 },
    facilities: { type: Number, min: 0, max: 5, default: 0 },
    studentLife: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, default: 0 }
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    youtube: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  featured: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for program count
universitySchema.virtual('programCount').get(function() {
  return this.programs ? this.programs.filter(p => p.isActive).length : 0
})

// Virtual for active programs
universitySchema.virtual('activePrograms').get(function() {
  return this.programs ? this.programs.filter(p => p.isActive) : []
})

// Virtual for active scholarships
universitySchema.virtual('activeScholarships').get(function() {
  return this.admissions?.scholarships ? this.admissions.scholarships.filter(s => s.isActive) : []
})

// Virtual for active announcements
universitySchema.virtual('activeAnnouncements').get(function() {
  const now = new Date()
  return this.announcements ? this.announcements.filter(a => 
    a.isActive && (!a.expiresAt || a.expiresAt > now)
  ) : []
})

// Index for better query performance
universitySchema.index({ name: 1 })
universitySchema.index({ 'location.city': 1 })
universitySchema.index({ 'location.province': 1 })
universitySchema.index({ status: 1 })
universitySchema.index({ featured: 1 })
universitySchema.index({ verified: 1 })
universitySchema.index({ 'rating.overall': -1 })
universitySchema.index({ createdAt: -1 })
universitySchema.index({ 'admissions.scholarships.deadline': 1 })
universitySchema.index({ 'announcements.deadline': 1 })

// Text index for search
universitySchema.index({
  name: 'text',
  shortName: 'text',
  description: 'text',
  'programs.name': 'text',
  'programs.faculty': 'text',
  'announcements.title': 'text',
  'announcements.content': 'text'
})

// Static method to find featured universities
universitySchema.statics.findFeatured = function() {
  return this.find({ featured: true, status: 'active' })
}

// Static method to find by location
universitySchema.statics.findByLocation = function(city, province) {
  const query = { status: 'active' }
  if (city) query['location.city'] = new RegExp(city, 'i')
  if (province) query['location.province'] = new RegExp(province, 'i')
  return this.find(query)
}

// Method to calculate average rating
universitySchema.methods.calculateAverageRating = function() {
  const ratings = [this.rating.academic, this.rating.facilities, this.rating.studentLife]
  const validRatings = ratings.filter(r => r > 0)
  return validRatings.length > 0 ? validRatings.reduce((a, b) => a + b) / validRatings.length : 0
}

// Pre-save middleware to update overall rating
universitySchema.pre('save', function(next) {
  if (this.isModified('rating.academic') || this.isModified('rating.facilities') || this.isModified('rating.studentLife')) {
    this.rating.overall = this.calculateAverageRating()
  }
  next()
})

module.exports = mongoose.model('University', universitySchema)
