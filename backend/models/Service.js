const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 200
  },
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['education', 'career', 'consulting', 'support']
  },
  features: [{
    title: String,
    description: String,
    included: { type: Boolean, default: true }
  }],
  pricing: {
    type: {
      type: String,
      enum: ['free', 'paid', 'custom'],
      default: 'free'
    },
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'RWF'
    },
    period: {
      type: String,
      enum: ['one-time', 'monthly', 'yearly'],
      default: 'one-time'
    }
  },
  benefits: [{
    title: String,
    description: String,
    icon: String
  }],
  process: [{
    step: Number,
    title: String,
    description: String,
    duration: String
  }],
  requirements: [String],
  deliverables: [String],
  testimonials: [{
    name: String,
    role: String,
    company: String,
    content: String,
    rating: { type: Number, min: 1, max: 5, default: 5 },
    avatar: String,
    enabled: { type: Boolean, default: true }
  }],
  faq: [{
    question: String,
    answer: String,
    order: { type: Number, default: 0 }
  }],
  cta: {
    title: {
      type: String,
      default: 'Get Started Today'
    },
    buttonText: {
      type: String,
      default: 'Contact Us'
    },
    buttonLink: {
      type: String,
      default: '/contact'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

// Create slug from title before saving
serviceSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
  next()
})

module.exports = mongoose.model('Service', serviceSchema)