import mongoose from 'mongoose'

const consultationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Allow anonymous consultations
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: ['cv_writing', 'university_guidance', 'mifotra_setup', 'career_counseling', 'interview_prep', 'other']
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^(\+250|0)[0-9]{9}$/, 'Please provide a valid Rwandan phone number']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot be more than 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [2000, 'Message cannot be more than 2000 characters']
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  preferredContactMethod: {
    type: String,
    enum: ['email', 'phone', 'whatsapp', 'video_call'],
    default: 'email'
  },
  availableTime: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'weekend', 'anytime'],
    default: 'anytime'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  estimatedDuration: {
    type: String,
    enum: ['30min', '1hour', '2hours', '1day', '2-3days', '1week'],
    default: '1hour'
  },
  actualDuration: {
    type: String,
    default: null
  },
  cost: {
    amount: {
      type: Number,
      min: 0,
      default: 0
    },
    currency: {
      type: String,
      default: 'RWF'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'waived'],
      default: 'pending'
    }
  },
  notes: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [1000, 'Note cannot be more than 1000 characters']
    },
    isInternal: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Feedback comment cannot be more than 500 characters']
    },
    submittedAt: Date
  },
  completedAt: Date,
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
})

// Indexes for better query performance
consultationSchema.index({ userId: 1 })
consultationSchema.index({ email: 1 })
consultationSchema.index({ serviceType: 1 })
consultationSchema.index({ status: 1 })
consultationSchema.index({ assignedTo: 1 })
consultationSchema.index({ urgency: 1 })
consultationSchema.index({ priority: -1 })
consultationSchema.index({ createdAt: -1 })

// Virtual for consultation ID (formatted)
consultationSchema.virtual('consultationId').get(function() {
  return `CONS-${this._id.toString().slice(-8).toUpperCase()}`
})

// Virtual for response time (in hours)
consultationSchema.virtual('responseTime').get(function() {
  if (this.status === 'pending') return null
  
  const firstNote = this.notes.find(note => !note.isInternal)
  if (!firstNote) return null
  
  const responseTime = (firstNote.createdAt - this.createdAt) / (1000 * 60 * 60)
  return Math.round(responseTime * 10) / 10 // Round to 1 decimal place
})

// Method to add note
consultationSchema.methods.addNote = function(author, content, isInternal = false) {
  this.notes.push({
    author,
    content,
    isInternal,
    createdAt: new Date()
  })
  return this.save()
}

// Method to update status
consultationSchema.methods.updateStatus = function(newStatus, userId) {
  const oldStatus = this.status
  this.status = newStatus
  
  if (newStatus === 'completed' && oldStatus !== 'completed') {
    this.completedAt = new Date()
  }
  
  // Add status change note
  this.addNote(
    userId,
    `Status changed from ${oldStatus} to ${newStatus}`,
    true
  )
  
  return this.save()
}

// Method to assign consultant
consultationSchema.methods.assignConsultant = function(consultantId, assignedBy) {
  this.assignedTo = consultantId
  this.status = 'in_progress'
  
  this.addNote(
    assignedBy,
    `Consultation assigned to consultant`,
    true
  )
  
  return this.save()
}

// Static method to get consultation statistics
consultationSchema.statics.getStats = async function(dateRange = {}) {
  const matchStage = {}
  
  if (dateRange.start && dateRange.end) {
    matchStage.createdAt = {
      $gte: new Date(dateRange.start),
      $lte: new Date(dateRange.end)
    }
  }
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
        },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        avgRating: { $avg: '$feedback.rating' },
        totalRevenue: { $sum: '$cost.amount' }
      }
    }
  ])
  
  return stats[0] || {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    avgRating: 0,
    totalRevenue: 0
  }
}

// Populate related data by default
consultationSchema.pre(/^find/, function(next) {
  this.populate([
    {
      path: 'userId',
      select: 'firstName lastName email'
    },
    {
      path: 'assignedTo',
      select: 'firstName lastName email'
    },
    {
      path: 'notes.author',
      select: 'firstName lastName'
    }
  ])
  next()
})

// Ensure virtual fields are serialized
consultationSchema.set('toJSON', {
  virtuals: true
})

export default mongoose.model('Consultation', consultationSchema)
