import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  nationalId: {
    type: String,
    required: [true, 'National ID is required'],
    unique: true,
    match: [/^[0-9]{16}$/, 'Please provide a valid 16-digit National ID']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(value) {
        const age = Math.floor((new Date() - value) / (365.25 * 24 * 60 * 60 * 1000))
        return age >= 16 && age <= 35
      },
      message: 'Age must be between 16 and 35 years'
    }
  },
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    trim: true,
    unique: true
  },
  address: {
    province: {
      type: String,
      required: [true, 'Province is required'],
      enum: ['Kigali', 'Northern', 'Southern', 'Eastern', 'Western']
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true
    },
    sector: {
      type: String,
      required: [true, 'Sector is required'],
      trim: true
    },
    cell: {
      type: String,
      trim: true
    },
    village: {
      type: String,
      trim: true
    }
  },
  guardianNames: {
    type: String,
    required: [true, 'Guardian names are required'],
    trim: true,
    maxlength: [100, 'Guardian names cannot be more than 100 characters']
  },
  guardianPhoneNumber: {
    type: String,
    required: [true, 'Guardian phone number is required'],
    match: [/^(\+250|0)[0-9]{9}$/, 'Please provide a valid Rwandan phone number']
  },
  institutionApplying: {
    type: String,
    trim: true
  },
  applicationStatus: {
    type: String,
    enum: ['pending', 'admitted', 'not_admitted', 'waitlisted'],
    default: 'pending'
  },
  documents: {
    passportPhoto: {
      type: String,
      default: null
    },
    nationalIdCopy: {
      type: String,
      default: null
    },
    diploma: {
      type: String,
      default: null
    },
    transcripts: {
      type: String,
      default: null
    },
    recommendationLetter: {
      type: String,
      default: null
    }
  },
  academicInfo: {
    schoolName: {
      type: String,
      required: [true, 'School name is required'],
      trim: true
    },
    graduationYear: {
      type: Number,
      required: [true, 'Graduation year is required'],
      min: [2015, 'Graduation year must be 2015 or later'],
      max: [new Date().getFullYear(), 'Graduation year cannot be in the future']
    },
    combination: {
      type: String,
      required: [true, 'Subject combination is required'],
      enum: ['PCM', 'PCB', 'MPC', 'HEG', 'HGL', 'MEG', 'MCB', 'Other']
    },
    grades: {
      type: Map,
      of: String,
      default: new Map()
    }
  },
  preferences: {
    preferredUniversities: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University'
    }],
    preferredPrograms: [{
      type: String,
      trim: true
    }],
    fundingPreference: {
      type: String,
      enum: ['scholarship', 'loan', 'self_paid', 'sponsor', 'any'],
      default: 'any'
    }
  },
  profileCompletion: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Indexes for better query performance
studentSchema.index({ userId: 1 })
studentSchema.index({ nationalId: 1 })
studentSchema.index({ registrationNumber: 1 })
studentSchema.index({ applicationStatus: 1 })
studentSchema.index({ 'academicInfo.graduationYear': 1 })
studentSchema.index({ 'academicInfo.combination': 1 })

// Virtual for age
studentSchema.virtual('age').get(function() {
  return Math.floor((new Date() - this.dateOfBirth) / (365.25 * 24 * 60 * 60 * 1000))
})

// Virtual for full address
studentSchema.virtual('fullAddress').get(function() {
  const parts = [
    this.address.village,
    this.address.cell,
    this.address.sector,
    this.address.district,
    this.address.province
  ].filter(Boolean)
  
  return parts.join(', ')
})

// Method to calculate profile completion
studentSchema.methods.calculateProfileCompletion = function() {
  const requiredFields = [
    'nationalId',
    'dateOfBirth',
    'registrationNumber',
    'address.province',
    'address.district',
    'address.sector',
    'guardianNames',
    'guardianPhoneNumber',
    'academicInfo.schoolName',
    'academicInfo.graduationYear',
    'academicInfo.combination'
  ]

  const documentFields = [
    'documents.passportPhoto',
    'documents.nationalIdCopy',
    'documents.diploma'
  ]

  let completedFields = 0
  const totalFields = requiredFields.length + documentFields.length

  // Check required fields
  requiredFields.forEach(field => {
    const value = field.split('.').reduce((obj, key) => obj?.[key], this)
    if (value) completedFields++
  })

  // Check document fields
  documentFields.forEach(field => {
    const value = field.split('.').reduce((obj, key) => obj?.[key], this)
    if (value) completedFields++
  })

  const completion = Math.round((completedFields / totalFields) * 100)
  this.profileCompletion = completion
  return completion
}

// Pre-save middleware to calculate profile completion
studentSchema.pre('save', function(next) {
  this.calculateProfileCompletion()
  next()
})

// Populate user data by default
studentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'userId',
    select: 'firstName lastName email phoneNumber'
  })
  next()
})

// Ensure virtual fields are serialized
studentSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.nationalId // Don't expose full national ID in JSON
    ret.nationalIdMasked = doc.nationalId ? `****${doc.nationalId.slice(-4)}` : null
    return ret
  }
})

export default mongoose.model('Student', studentSchema)
