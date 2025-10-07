const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [200, 'Job title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [5000, 'Job description cannot exceed 5000 characters']
  },
  company: {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [200, 'Company name cannot exceed 200 characters']
    },
    logo: String,
    website: String,
    description: String,
    size: {
      type: String,
      enum: ['startup', 'small', 'medium', 'large', 'enterprise']
    },
    industry: String
  },
  location: {
    type: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      default: 'onsite'
    },
    address: String,
    city: String,
    province: String,
    country: { type: String, default: 'Rwanda' },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  employment: {
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'],
      required: [true, 'Employment type is required']
    },
    level: {
      type: String,
      enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'executive'],
      default: 'entry'
    },
    category: {
      type: String,
      required: [true, 'Job category is required'],
      enum: [
        'technology', 'healthcare', 'education', 'finance', 'marketing',
        'sales', 'operations', 'human-resources', 'customer-service',
        'manufacturing', 'construction', 'agriculture', 'hospitality',
        'transportation', 'government', 'non-profit', 'other'
      ]
    }
  },
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'RWF' },
    period: {
      type: String,
      enum: ['hour', 'day', 'week', 'month', 'year'],
      default: 'month'
    },
    negotiable: { type: Boolean, default: false }
  },
  requirements: {
    education: {
      level: {
        type: String,
        enum: ['none', 'secondary', 'diploma', 'bachelor', 'master', 'phd']
      },
      field: String
    },
    experience: {
      min: { type: Number, default: 0 },
      max: Number,
      description: String
    },
    skills: {
      required: [String],
      preferred: [String]
    },
    languages: [{
      language: String,
      proficiency: {
        type: String,
        enum: ['basic', 'intermediate', 'advanced', 'native']
      },
      required: { type: Boolean, default: false }
    }],
    certifications: [String],
    other: [String]
  },
  responsibilities: [String],
  benefits: [String],
  applicationProcess: {
    method: {
      type: String,
      enum: ['platform', 'email', 'website', 'phone'],
      default: 'platform'
    },
    instructions: String,
    externalUrl: String,
    email: String,
    phone: String,
    documents: [{
      type: String,
      enum: ['cv', 'cover-letter', 'portfolio', 'certificates', 'references', 'other'],
      required: { type: Boolean, default: false }
    }]
  },
  timeline: {
    postedDate: { type: Date, default: Date.now },
    applicationDeadline: Date,
    startDate: Date,
    duration: String
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'closed', 'filled'],
    default: 'active'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'premium'],
    default: 'public'
  },
  featured: { type: Boolean, default: false },
  urgent: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  statistics: {
    views: { type: Number, default: 0 },
    applications: { type: Number, default: 0 },
    saves: { type: Number, default: 0 }
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for salary range display
jobSchema.virtual('salaryRange').get(function() {
  if (!this.salary.min && !this.salary.max) return 'Competitive'
  if (this.salary.negotiable) return 'Negotiable'
  
  const formatAmount = (amount) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`
    return amount.toString()
  }
  
  if (this.salary.min && this.salary.max) {
    return `${formatAmount(this.salary.min)} - ${formatAmount(this.salary.max)} ${this.salary.currency}/${this.salary.period}`
  } else if (this.salary.min) {
    return `From ${formatAmount(this.salary.min)} ${this.salary.currency}/${this.salary.period}`
  } else if (this.salary.max) {
    return `Up to ${formatAmount(this.salary.max)} ${this.salary.currency}/${this.salary.period}`
  }
  
  return 'Competitive'
})

// Virtual for application status
jobSchema.virtual('isActive').get(function() {
  return this.status === 'active' && (!this.timeline.applicationDeadline || this.timeline.applicationDeadline > new Date())
})

// Virtual for days since posted
jobSchema.virtual('daysSincePosted').get(function() {
  const diffTime = Math.abs(new Date() - this.timeline.postedDate)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Index for better query performance
jobSchema.index({ title: 1 })
jobSchema.index({ 'company.name': 1 })
jobSchema.index({ 'employment.type': 1 })
jobSchema.index({ 'employment.category': 1 })
jobSchema.index({ 'employment.level': 1 })
jobSchema.index({ 'location.city': 1 })
jobSchema.index({ 'location.province': 1 })
jobSchema.index({ 'location.type': 1 })
jobSchema.index({ status: 1 })
jobSchema.index({ featured: 1 })
jobSchema.index({ urgent: 1 })
jobSchema.index({ 'timeline.postedDate': -1 })
jobSchema.index({ 'timeline.applicationDeadline': 1 })
jobSchema.index({ 'salary.min': 1 })
jobSchema.index({ 'salary.max': 1 })

// Text index for search
jobSchema.index({
  title: 'text',
  description: 'text',
  'company.name': 'text',
  'company.description': 'text',
  'requirements.skills.required': 'text',
  'requirements.skills.preferred': 'text',
  tags: 'text'
})

// Static method to find active jobs
jobSchema.statics.findActive = function() {
  return this.find({
    status: 'active',
    $or: [
      { 'timeline.applicationDeadline': { $exists: false } },
      { 'timeline.applicationDeadline': { $gte: new Date() } }
    ]
  })
}

// Static method to find featured jobs
jobSchema.statics.findFeatured = function() {
  return this.findActive().where({ featured: true })
}

// Static method to find by category
jobSchema.statics.findByCategory = function(category) {
  return this.findActive().where({ 'employment.category': category })
}

// Static method to find by location
jobSchema.statics.findByLocation = function(city, province, type) {
  const query = { status: 'active' }
  if (city) query['location.city'] = new RegExp(city, 'i')
  if (province) query['location.province'] = new RegExp(province, 'i')
  if (type) query['location.type'] = type
  return this.find(query)
}

// Method to increment view count
jobSchema.methods.incrementViews = function() {
  return this.updateOne({ $inc: { 'statistics.views': 1 } })
}

// Method to increment application count
jobSchema.methods.incrementApplications = function() {
  return this.updateOne({ $inc: { 'statistics.applications': 1 } })
}

// Method to increment saves count
jobSchema.methods.incrementSaves = function() {
  return this.updateOne({ $inc: { 'statistics.saves': 1 } })
}

module.exports = mongoose.model('Job', jobSchema)
