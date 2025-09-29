import mongoose from 'mongoose'

const programSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Program name is required'],
    trim: true
  },
  degree: {
    type: String,
    required: [true, 'Degree type is required'],
    enum: ['Certificate', 'Diploma', 'Bachelor', 'Master', 'PhD']
  },
  duration: {
    type: String,
    required: [true, 'Program duration is required']
  },
  requirements: [{
    type: String,
    trim: true
  }]
})

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'University name is required'],
    trim: true,
    unique: true
  },
  type: {
    type: String,
    required: [true, 'University type is required'],
    enum: ['local', 'international']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  website: {
    type: String,
    match: [
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
      'Please provide a valid website URL'
    ]
  },
  logo: {
    type: String,
    default: null
  },
  programs: [programSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Indexes for better query performance
universitySchema.index({ name: 1 })
universitySchema.index({ type: 1 })
universitySchema.index({ country: 1 })
universitySchema.index({ isActive: 1 })

// Virtual for program count
universitySchema.virtual('programCount').get(function() {
  return this.programs.length
})

// Ensure virtual fields are serialized
universitySchema.set('toJSON', {
  virtuals: true
})

export default mongoose.model('University', universitySchema)
