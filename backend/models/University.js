const mongoose = require('mongoose')

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  shortName: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  website: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  logo: {
    type: String
  },
  location: {
    address: String,
    city: {
      type: String,
      required: true
    },
    province: String,
    country: {
      type: String,
      default: 'Rwanda'
    }
  },
  programs: [{
    name: {
      type: String,
      required: true
    },
    degree: {
      type: String,
      enum: ['certificate', 'diploma', 'bachelor', 'master', 'phd'],
      required: true
    },
    duration: {
      years: Number,
      months: Number
    },
    description: String,
    requirements: [String],
    tuitionFee: {
      amount: Number,
      currency: { type: String, default: 'RWF' }
    }
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
      paymentTerms: String,
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
  rating: {
    overall: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    academics: Number,
    facilities: Number,
    studentLife: Number,
    employability: Number
  },
  statistics: {
    totalStudents: {
      type: Number,
      default: 0
    },
    graduationRate: {
      type: Number,
      default: 0
    },
    employmentRate: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

// Indexes for better performance
universitySchema.index({ name: 'text', description: 'text' })
universitySchema.index({ 'location.city': 1 })
universitySchema.index({ status: 1 })
universitySchema.index({ featured: 1 })

module.exports = mongoose.model('University', universitySchema)