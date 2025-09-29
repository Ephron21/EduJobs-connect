import mongoose from 'mongoose'

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Announcement title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Announcement content is required'],
    maxlength: [5000, 'Content cannot be more than 5000 characters']
  },
  type: {
    type: String,
    required: [true, 'Announcement type is required'],
    enum: ['general', 'university', 'job', 'urgent', 'maintenance', 'event']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  targetAudience: {
    type: String,
    enum: ['all', 'students', 'admins', 'new_users', 'verified_users'],
    default: 'all'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  showOnHomepage: {
    type: Boolean,
    default: false
  },
  scheduledFor: {
    type: Date,
    default: null
  },
  expiresAt: {
    type: Date,
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String
  }],
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isHidden: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
})

// Indexes for better query performance
announcementSchema.index({ type: 1 })
announcementSchema.index({ priority: 1 })
announcementSchema.index({ isActive: 1 })
announcementSchema.index({ isPinned: 1 })
announcementSchema.index({ showOnHomepage: 1 })
announcementSchema.index({ scheduledFor: 1 })
announcementSchema.index({ expiresAt: 1 })
announcementSchema.index({ createdAt: -1 })
announcementSchema.index({ tags: 1 })
announcementSchema.index({ targetAudience: 1 })

// Virtual for read count
announcementSchema.virtual('readCount').get(function() {
  return this.readBy.length
})

// Virtual for like count
announcementSchema.virtual('likeCount').get(function() {
  return this.likes.length
})

// Virtual for comment count
announcementSchema.virtual('commentCount').get(function() {
  return this.comments.filter(comment => !comment.isHidden).length
})

// Virtual for status
announcementSchema.virtual('status').get(function() {
  const now = new Date()
  
  if (!this.isActive) return 'inactive'
  if (this.expiresAt && this.expiresAt < now) return 'expired'
  if (this.scheduledFor && this.scheduledFor > now) return 'scheduled'
  
  return 'active'
})

// Method to mark as read by user
announcementSchema.methods.markAsRead = function(userId) {
  const alreadyRead = this.readBy.some(read => read.user.toString() === userId.toString())
  
  if (!alreadyRead) {
    this.readBy.push({ user: userId, readAt: new Date() })
    return this.save()
  }
  
  return Promise.resolve(this)
}

// Method to toggle like
announcementSchema.methods.toggleLike = function(userId) {
  const likeIndex = this.likes.indexOf(userId)
  
  if (likeIndex > -1) {
    this.likes.splice(likeIndex, 1)
  } else {
    this.likes.push(userId)
  }
  
  return this.save()
}

// Method to add comment
announcementSchema.methods.addComment = function(userId, content) {
  this.comments.push({
    author: userId,
    content,
    createdAt: new Date()
  })
  
  return this.save()
}

// Method to increment views
announcementSchema.methods.incrementViews = function() {
  this.views += 1
  return this.save()
}

// Static method to get active announcements
announcementSchema.statics.getActive = function(targetAudience = 'all') {
  const now = new Date()
  
  const query = {
    isActive: true,
    $or: [
      { scheduledFor: null },
      { scheduledFor: { $lte: now } }
    ],
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: now } }
    ]
  }
  
  if (targetAudience !== 'all') {
    query.$or = [
      { targetAudience: 'all' },
      { targetAudience }
    ]
  }
  
  return this.find(query)
    .sort({ isPinned: -1, priority: -1, createdAt: -1 })
    .populate('author', 'firstName lastName')
}

// Static method to get homepage announcements
announcementSchema.statics.getHomepageAnnouncements = function(limit = 5) {
  const now = new Date()
  
  return this.find({
    isActive: true,
    showOnHomepage: true,
    $or: [
      { scheduledFor: null },
      { scheduledFor: { $lte: now } }
    ],
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: now } }
    ]
  })
    .sort({ isPinned: -1, priority: -1, createdAt: -1 })
    .limit(limit)
    .populate('author', 'firstName lastName')
}

// Static method to get announcement statistics
announcementSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        pinned: {
          $sum: { $cond: [{ $eq: ['$isPinned', true] }, 1, 0] }
        },
        totalViews: { $sum: '$views' },
        totalLikes: { $sum: { $size: '$likes' } },
        totalComments: { $sum: { $size: '$comments' } }
      }
    }
  ])
  
  return stats[0] || {
    total: 0,
    active: 0,
    pinned: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0
  }
}

// Pre-save middleware to handle scheduling
announcementSchema.pre('save', function(next) {
  // If scheduled for future, set as inactive until scheduled time
  if (this.scheduledFor && this.scheduledFor > new Date()) {
    this.isActive = false
  }
  
  next()
})

// Populate author by default
announcementSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'firstName lastName email'
  })
  next()
})

// Ensure virtual fields are serialized
announcementSchema.set('toJSON', {
  virtuals: true
})

export default mongoose.model('Announcement', announcementSchema)
