const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Applicant is required']
  },
  type: {
    type: String,
    enum: ['job', 'university'],
    required: [true, 'Application type is required']
  },
  // For job applications
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  // For university applications
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University'
  },
  program: {
    name: String,
    degree: String,
    faculty: String
  },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    nationality: { type: String, default: 'Rwandan' },
    address: {
      street: String,
      city: String,
      province: String,
      country: { type: String, default: 'Rwanda' },
      postalCode: String
    }
  },
  education: {
    highestLevel: {
      type: String,
      enum: ['secondary', 'diploma', 'bachelor', 'master', 'phd']
    },
    institution: String,
    graduationYear: Number,
    gpa: Number,
    grade: String,
    subjects: [String],
    certificates: [String]
  },
  experience: [{
    title: String,
    company: String,
    startDate: Date,
    endDate: Date,
    current: { type: Boolean, default: false },
    description: String,
    skills: [String]
  }],
  skills: [String],
  languages: [{
    language: String,
    proficiency: {
      type: String,
      enum: ['basic', 'intermediate', 'advanced', 'native']
    }
  }],
  documents: {
    cv: {
      filename: String,
      path: String,
      uploadDate: { type: Date, default: Date.now }
    },
    coverLetter: {
      filename: String,
      path: String,
      uploadDate: { type: Date, default: Date.now }
    },
    certificates: [{
      name: String,
      filename: String,
      path: String,
      uploadDate: { type: Date, default: Date.now }
    }],
    transcripts: [{
      name: String,
      filename: String,
      path: String,
      uploadDate: { type: Date, default: Date.now }
    }],
    portfolio: {
      filename: String,
      path: String,
      uploadDate: { type: Date, default: Date.now }
    },
    other: [{
      name: String,
      filename: String,
      path: String,
      uploadDate: { type: Date, default: Date.now }
    }]
  },
  motivation: {
    whyInterested: String,
    careerGoals: String,
    relevantExperience: String,
    additionalInfo: String
  },
  preferences: {
    startDate: Date,
    salaryExpectation: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'RWF' },
      negotiable: { type: Boolean, default: true }
    },
    workArrangement: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid', 'flexible']
    },
    relocate: { type: Boolean, default: false }
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under-review', 'shortlisted', 'interviewed', 'accepted', 'rejected', 'withdrawn'],
    default: 'draft'
  },
  timeline: {
    submittedAt: Date,
    reviewedAt: Date,
    interviewDate: Date,
    responseDeadline: Date,
    decisionDate: Date
  },
  feedback: {
    recruiterNotes: String,
    interviewFeedback: String,
    rejectionReason: String,
    rating: { type: Number, min: 1, max: 5 }
  },
  communication: [{
    from: {
      type: String,
      enum: ['applicant', 'recruiter', 'system']
    },
    message: String,
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }],
  metadata: {
    source: {
      type: String,
      enum: ['platform', 'referral', 'external'],
      default: 'platform'
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    ipAddress: String,
    userAgent: String,
    applicationNumber: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for application age in days
applicationSchema.virtual('daysSinceSubmitted').get(function() {
  if (!this.timeline.submittedAt) return null
  const diffTime = Math.abs(new Date() - this.timeline.submittedAt)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Virtual for full name
applicationSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`
})

// Virtual for application progress
applicationSchema.virtual('progress').get(function() {
  const statusOrder = ['draft', 'submitted', 'under-review', 'shortlisted', 'interviewed', 'accepted', 'rejected', 'withdrawn']
  const currentIndex = statusOrder.indexOf(this.status)
  const totalSteps = statusOrder.length - 2 // Exclude rejected and withdrawn from progress
  return Math.round((currentIndex / totalSteps) * 100)
})

// Index for better query performance
applicationSchema.index({ applicant: 1 })
applicationSchema.index({ job: 1 })
applicationSchema.index({ university: 1 })
applicationSchema.index({ type: 1 })
applicationSchema.index({ status: 1 })
applicationSchema.index({ 'timeline.submittedAt': -1 })
applicationSchema.index({ 'personalInfo.email': 1 })
applicationSchema.index({ 'metadata.applicationNumber': 1 })

// Compound indexes
applicationSchema.index({ applicant: 1, type: 1 })
applicationSchema.index({ status: 1, type: 1 })
applicationSchema.index({ job: 1, status: 1 })
applicationSchema.index({ university: 1, status: 1 })

// Pre-save middleware to generate application number
applicationSchema.pre('save', async function(next) {
  if (this.isNew && !this.metadata.applicationNumber) {
    const prefix = this.type === 'job' ? 'JOB' : 'UNI'
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substr(2, 4).toUpperCase()
    this.metadata.applicationNumber = `${prefix}-${timestamp}-${random}`
  }
  
  // Set submitted timestamp when status changes to submitted
  if (this.isModified('status') && this.status === 'submitted' && !this.timeline.submittedAt) {
    this.timeline.submittedAt = new Date()
  }
  
  next()
})

// Static method to find by application number
applicationSchema.statics.findByApplicationNumber = function(applicationNumber) {
  return this.findOne({ 'metadata.applicationNumber': applicationNumber })
}

// Static method to find pending applications
applicationSchema.statics.findPending = function() {
  return this.find({ status: { $in: ['submitted', 'under-review'] } })
}

// Static method to find applications by user
applicationSchema.statics.findByUser = function(userId) {
  return this.find({ applicant: userId }).sort({ createdAt: -1 })
}

// Static method to find applications for a job
applicationSchema.statics.findByJob = function(jobId) {
  return this.find({ job: jobId, type: 'job' }).sort({ 'timeline.submittedAt': -1 })
}

// Static method to find applications for a university
applicationSchema.statics.findByUniversity = function(universityId) {
  return this.find({ university: universityId, type: 'university' }).sort({ 'timeline.submittedAt': -1 })
}

// Method to add communication
applicationSchema.methods.addCommunication = function(from, message) {
  this.communication.push({
    from,
    message,
    timestamp: new Date(),
    read: false
  })
  return this.save()
}

// Method to update status with timestamp
applicationSchema.methods.updateStatus = function(newStatus, notes = '') {
  this.status = newStatus
  
  switch (newStatus) {
    case 'under-review':
      this.timeline.reviewedAt = new Date()
      break
    case 'accepted':
    case 'rejected':
      this.timeline.decisionDate = new Date()
      break
  }
  
  if (notes) {
    this.feedback.recruiterNotes = notes
  }
  
  return this.save()
}

// Method to check if application is editable
applicationSchema.methods.isEditable = function() {
  return ['draft'].includes(this.status)
}

// Method to check if application can be withdrawn
applicationSchema.methods.canWithdraw = function() {
  return ['submitted', 'under-review', 'shortlisted'].includes(this.status)
}

module.exports = mongoose.model('Application', applicationSchema)
