import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Job type is required'],
    enum: ['full_time', 'part_time', 'contract', 'internship']
  },
  category: {
    type: String,
    required: [true, 'Job category is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  requirements: [{
    type: String,
    trim: true
  }],
  responsibilities: [{
    type: String,
    trim: true
  }],
  salary: {
    type: String,
    trim: true
  },
  deadline: {
    type: Date,
    required: [true, 'Application deadline is required'],
    validate: {
      validator: function(value) {
        return value > new Date()
      },
      message: 'Deadline must be in the future'
    }
  },
  applicationUrl: {
    type: String,
    match: [
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
      'Please provide a valid application URL'
    ]
  },
  documents: [{
    type: String,
    trim: true
  }],
  contactEmail: {
    type: String,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  contactPhone: {
    type: String
  },
  experience: {
    type: String,
    enum: ['entry', 'junior', 'mid', 'senior', 'executive']
  },
  education: {
    type: String,
    enum: ['high_school', 'certificate', 'diploma', 'bachelor', 'master', 'phd']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  applications: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Indexes for better query performance
jobSchema.index({ title: 'text', company: 'text', description: 'text' })
jobSchema.index({ type: 1 })
jobSchema.index({ category: 1 })
jobSchema.index({ location: 1 })
jobSchema.index({ deadline: 1 })
jobSchema.index({ isActive: 1 })
jobSchema.index({ featured: 1 })
jobSchema.index({ createdAt: -1 })

// Virtual for days remaining
jobSchema.virtual('daysRemaining').get(function() {
  const now = new Date()
  const deadline = new Date(this.deadline)
  const diffTime = deadline - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
})

// Virtual for status
jobSchema.virtual('status').get(function() {
  const now = new Date()
  const deadline = new Date(this.deadline)
  
  if (!this.isActive) return 'inactive'
  if (deadline < now) return 'expired'
  
  const daysRemaining = this.daysRemaining
  if (daysRemaining <= 3) return 'urgent'
  if (daysRemaining <= 7) return 'closing_soon'
  
  return 'open'
})

// Ensure virtual fields are serialized
jobSchema.set('toJSON', {
  virtuals: true
})

export default mongoose.model('Job', jobSchema)
