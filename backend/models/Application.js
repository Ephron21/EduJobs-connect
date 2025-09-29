import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema({
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: [true, 'University is required']
  },
  title: {
    type: String,
    required: [true, 'Application title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  type: {
    type: String,
    required: [true, 'Application type is required'],
    enum: ['scholarship', 'loan', 'self_paid', 'sponsor']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [3000, 'Description cannot be more than 3000 characters']
  },
  requirements: [{
    type: String,
    trim: true
  }],
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
  eligibilityCriteria: [{
    type: String,
    trim: true
  }],
  benefits: [{
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
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Indexes for better query performance
applicationSchema.index({ universityId: 1 })
applicationSchema.index({ type: 1 })
applicationSchema.index({ deadline: 1 })
applicationSchema.index({ isActive: 1 })
applicationSchema.index({ featured: 1 })

// Virtual for days remaining
applicationSchema.virtual('daysRemaining').get(function() {
  const now = new Date()
  const deadline = new Date(this.deadline)
  const diffTime = deadline - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
})

// Virtual for status
applicationSchema.virtual('status').get(function() {
  const now = new Date()
  const deadline = new Date(this.deadline)
  
  if (!this.isActive) return 'inactive'
  if (deadline < now) return 'expired'
  
  const daysRemaining = this.daysRemaining
  if (daysRemaining <= 7) return 'urgent'
  if (daysRemaining <= 30) return 'closing_soon'
  
  return 'open'
})

// Populate university data by default
applicationSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'universityId',
    select: 'name type location country logo'
  })
  next()
})

// Ensure virtual fields are serialized
applicationSchema.set('toJSON', {
  virtuals: true
})

export default mongoose.model('Application', applicationSchema)
