const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  
  // Registration Information (Visible - NOT hashed)
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password/PIN is required'],
    minlength: [4, 'Password must be at least 4 characters']
    // Note: Stored as plaintext for visibility
  },
  
  // Personal Details
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', '']
  },
  nationalId: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  
  // Academic Information
  level: {
    type: String,
    enum: ['Level 1', 'Level 2', 'Level 3', 'Level 4'],
    default: 'Level 1'
  },
  institution: {
    type: String,
    trim: true
  },
  admissionDate: {
    type: Date
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'pending', 'suspended', 'graduated'],
    default: 'active'
  },
  
  // Parent/Guardian Information
  guardianName: {
    type: String,
    trim: true
  },
  guardianPhone: {
    type: String,
    trim: true
  },
  guardianEmail: {
    type: String,
    lowercase: true,
    trim: true
  },
  
  // Additional Information
  profilePhoto: {
    type: String
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  notes: {
    type: String
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for full name
studentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`
})

// Indexes for better query performance
studentSchema.index({ email: 1 })
studentSchema.index({ registrationNumber: 1 })
studentSchema.index({ status: 1 })
studentSchema.index({ level: 1 })
studentSchema.index({ createdAt: -1 })

// Static method to find by registration number
studentSchema.statics.findByRegNumber = function(regNumber) {
  return this.findOne({ registrationNumber: regNumber })
}

// Static method to find by email
studentSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() })
}

module.exports = mongoose.model('Student', studentSchema)