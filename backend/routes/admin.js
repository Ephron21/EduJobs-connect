const express = require('express')
const User = require('../models/User')
const University = require('../models/University')
const Job = require('../models/Job')
const Application = require('../models/Application')
const { authenticate, requireAdmin } = require('../middleware/auth')
const bcrypt = require('bcryptjs')
const router = express.Router()

// Apply authentication and admin authorization to all routes
router.use(authenticate)
router.use(requireAdmin)
// Mount students sub-router  
router.use('/students', require('./students'))

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalUniversities,
      totalJobs,
      totalApplications,
      recentUsers,
      pendingApplications
    ] = await Promise.all([
      User.countDocuments(),
      University.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select('firstName lastName email role createdAt'),
      Application.countDocuments({ status: { $in: ['submitted', 'under-review'] } })
    ])

    // Calculate growth (mock data for now)
    const stats = {
      users: totalUsers,
      universities: totalUniversities,
      jobs: totalJobs,
      applications: totalApplications,
      consultations: pendingApplications,
      growth: {
        users: Math.floor(Math.random() * 20) + 5, // Mock growth percentage
        universities: Math.floor(Math.random() * 15) + 2,
        jobs: Math.floor(Math.random() * 25) + 10,
        applications: Math.floor(Math.random() * 30) + 15
      },
      recentUsers: recentUsers.map(user => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      })),
      pendingConsultations: pendingApplications
    }

    res.json({ stats })

  } catch (error) {
    console.error('Admin stats error:', error)
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: 'An error occurred while fetching dashboard statistics'
    })
  }
})

// @route   GET /api/admin/health
// @desc    Get system health status
// @access  Private (Admin only)
router.get('/health', async (req, res) => {
  try {
    const health = {
      database: {
        status: 'healthy',
        responseTime: '12ms'
      },
      email: {
        status: 'operational',
        queue: Math.floor(Math.random() * 10)
      },
      storage: {
        status: 'warning',
        usage: '85%',
        available: '2.1 GB'
      }
    }

    res.json({ health })

  } catch (error) {
    console.error('Health check error:', error)
    res.status(500).json({
      error: 'Health check failed',
      message: 'An error occurred while checking system health'
    })
  }
})

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private (Admin only)
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const search = req.query.search || ''
    const role = req.query.role || ''
    const status = req.query.status || ''

    // Build query
    const query = {}
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }
    if (role) query.role = role
    if (status) query.status = status

    const users = await User.find(query)
      .select('-password -verification')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await User.countDocuments(query)

    // Transform _id to id for frontend compatibility
    const transformedUsers = users.map(user => {
      const userObj = user.toObject()
      userObj.id = userObj._id
      delete userObj._id
      return userObj
    })

    res.json({
      users: transformedUsers,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    })
  } catch (error) {
    console.error('Admin users error:', error)
    res.status(500).json({
      error: 'Failed to fetch users',
      message: 'An error occurred while fetching users'
    })
  }
})

// @route   POST /api/admin/users
// @desc    Create new user
// @access  Private (Admin only)
router.post('/users', async (req, res) => {
  try {
    const { firstName, lastName, email, role, status, password } = req.body

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'First name, last name, and email are required'
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'A user with this email already exists'
      })
    }

    // Generate default password if not provided
    const userPassword = password || 'Password123!'
    
    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(userPassword, salt)

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'student',
      status: status || 'active',
      verification: {
        isVerified: true, // Admin-created users are auto-verified
        verifiedAt: new Date()
      }
    })

    await user.save()

    // Return user without password and transform _id to id
    const userResponse = user.toObject()
    delete userResponse.password
    delete userResponse.verification
    userResponse.id = userResponse._id
    delete userResponse._id

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    })

  } catch (error) {
    console.error('Admin create user error:', error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        error: 'Validation failed',
        message: messages.join(', ')
      })
    }

    res.status(500).json({
      error: 'Failed to create user',
      message: 'An error occurred while creating the user'
    })
  }
})

// @route   GET /api/admin/universities
// @desc    Get all universities
// @access  Private (Admin only)
router.get('/universities', async (req, res) => {
  try {
    const universities = await University.find()
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 })

    res.json({ universities })

  } catch (error) {
    console.error('Admin universities error:', error)
    res.status(500).json({
      error: 'Failed to fetch universities',
      message: 'An error occurred while fetching universities'
    })
  }
})

// @route   POST /api/admin/universities
// @desc    Create new university
// @access  Private (Admin only)
router.post('/universities', async (req, res) => {
  try {
    const { name, shortName, description, website, email, phone, logo, location } = req.body

    if (!name || !shortName || !description) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, short name, and description are required'
      })
    }

    const existingUniversity = await University.findOne({ name: name.toLowerCase() })
    if (existingUniversity) {
      return res.status(400).json({
        error: 'University already exists',
        message: 'A university with this name already exists'
      })
    }

    const university = new University({
      name,
      shortName,
      description,
      website,
      email,
      phone,
      logo,
      location,
      createdBy: req.user._id
    })

    await university.save()

    const universityResponse = university.toObject()
    delete universityResponse.createdBy

    res.status(201).json({
      message: 'University created successfully',
      university: universityResponse
    })

  } catch (error) {
    console.error('Admin create university error:', error)
    res.status(500).json({
      error: 'Failed to create university',
      message: 'An error occurred while creating the university'
    })
  }
})

// @route   PUT /api/admin/universities/:id
// @desc    Update university
// @access  Private (Admin only)
router.put('/universities/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    delete updates.createdBy

    const university = await University.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstName lastName email')

    if (!university) {
      return res.status(404).json({
        error: 'University not found',
        message: 'The specified university does not exist'
      })
    }

    res.json({
      message: 'University updated successfully',
      university
    })

  } catch (error) {
    console.error('Admin update university error:', error)
    res.status(500).json({
      error: 'Failed to update university',
      message: 'An error occurred while updating the university'
    })
  }
})

// @route   DELETE /api/admin/universities/:id
// @desc    Delete university
// @access  Private (Admin only)
router.delete('/universities/:id', async (req, res) => {
  try {
    const { id } = req.params

    const university = await University.findByIdAndDelete(id)

    if (!university) {
      return res.status(404).json({
        error: 'University not found',
        message: 'The specified university does not exist'
      })
    }

    res.json({
      message: 'University deleted successfully'
    })

  } catch (error) {
    console.error('Admin delete university error:', error)
    res.status(500).json({
      error: 'Failed to delete university',
      message: 'An error occurred while deleting the university'
    })
  }
})

// @route   GET /api/admin/universities/stats
// @desc    Get universities statistics
// @access  Private (Admin only)
router.get('/universities/stats', async (req, res) => {
  try {
    const [
      total,
      active,
      featured,
      byStatus
    ] = await Promise.all([
      University.countDocuments(),
      University.countDocuments({ status: 'active' }),
      University.countDocuments({ featured: true }),
      University.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ])

    res.json({
      total,
      active,
      featured,
      byStatus
    })

  } catch (error) {
    console.error('Admin universities stats error:', error)
    res.status(500).json({
      error: 'Failed to fetch universities statistics',
      message: 'An error occurred while fetching universities statistics'
    })
  }
})
// @route   GET /api/universities/featured
// @desc    Get featured universities for homepage
// @access  Public
router.get('/universities/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3
    const universities = await University.find({ featured: true, status: 'active' })
      .sort({ createdAt: -1 })
      .limit(limit)

    res.json({ universities })

  } catch (error) {
    console.error('Public universities error:', error)
    res.status(500).json({
      error: 'Failed to fetch universities',
      message: 'An error occurred while fetching universities'
    })
  }
})

// @route   GET /api/universities
// @desc    Get all universities for public access
// @access  Public
router.get('/universities', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ''

    // Build query
    const query = { status: 'active' }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    const universities = await University.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await University.countDocuments(query)

    res.json({
      universities,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    })

  } catch (error) {
    console.error('Public universities list error:', error)
    res.status(500).json({
      error: 'Failed to fetch universities',
      message: 'An error occurred while fetching universities'
    })
  }
})

// @route   GET /api/admin/jobs
// @desc    Get all jobs
// @access  Private (Admin only)
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('postedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })

    res.json({ jobs })

  } catch (error) {
    console.error('Admin jobs error:', error)
    res.status(500).json({
      error: 'Failed to fetch jobs',
      message: 'An error occurred while fetching jobs'
    })
  }
})

// @route   GET /api/admin/applications
// @desc    Get all applications
// @access  Private (Admin only)
router.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('applicant', 'firstName lastName email')
      .populate('job', 'title company.name')
      .populate('university', 'name')
      .sort({ createdAt: -1 })

    res.json({ applications })

  } catch (error) {
    console.error('Admin applications error:', error)
    res.status(500).json({
      error: 'Failed to fetch applications',
      message: 'An error occurred while fetching applications'
    })
  }
})

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private (Admin only)
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Don't allow password updates through this endpoint
    delete updates.password
    // Remove id field if present to avoid conflicts
    delete updates.id
    delete updates._id

    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -verification')

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The specified user does not exist'
      })
    }

    // Transform _id to id for frontend compatibility
    const userResponse = user.toObject()
    userResponse.id = userResponse._id
    delete userResponse._id

    res.json({
      message: 'User updated successfully',
      user: userResponse
    })

  } catch (error) {
    console.error('Admin update user error:', error)
    res.status(500).json({
      error: 'Failed to update user',
      message: 'An error occurred while updating the user'
    })
  }
})

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params

    // Don't allow admin to delete themselves
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        error: 'Cannot delete own account',
        message: 'You cannot delete your own admin account'
      })
    }

    const user = await User.findByIdAndDelete(id)

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The specified user does not exist'
      })
    }

    res.json({
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('Admin delete user error:', error)
    res.status(500).json({
      error: 'Failed to delete user',
      message: 'An error occurred while deleting the user'
    })
  }
})

// @route   POST /api/admin/users/bulk-delete
// @desc    Delete multiple users
// @access  Private (Admin only)
router.post('/users/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Please provide an array of user IDs'
      })
    }

    // Don't allow admin to delete themselves
    if (ids.includes(req.user._id.toString())) {
      return res.status(400).json({
        error: 'Cannot delete own account',
        message: 'You cannot delete your own admin account'
      })
    }

    const result = await User.deleteMany({ _id: { $in: ids } })

    res.json({
      message: `Successfully deleted ${result.deletedCount} users` 
    })

  } catch (error) {
    console.error('Admin bulk delete error:', error)
    res.status(500).json({
      error: 'Failed to delete users',
      message: 'An error occurred while deleting users'
    })
  }
})

// @route   GET /api/admin/homepage
// @desc    Get homepage settings
// @access  Private (Admin only)
router.get('/homepage', async (req, res) => {
  try {
    const HomepageSettings = require('../models/HomepageSettings')
    
    let settings = await HomepageSettings.findOne({ isActive: true })
      .populate('lastUpdatedBy', 'firstName lastName email')

    // If no settings exist, create default
    if (!settings) {
      settings = new HomepageSettings({
        features: [
          {
            title: 'University Applications',
            description: 'Find and apply to universities across Rwanda',
            icon: 'graduation-cap',
            enabled: true
          },
          {
            title: 'Job Opportunities',
            description: 'Discover career opportunities that match your skills',
            icon: 'briefcase',
            enabled: true
          },
          {
            title: 'Expert Guidance',
            description: 'Get professional advice for your career journey',
            icon: 'users',
            enabled: true
          }
        ],
        testimonials: [
          {
            name: 'Jean Baptiste',
            role: 'Student',
            content: 'EduJobs Connect helped me find the perfect university program.',
            avatar: '',
            rating: 5,
            enabled: true
          }
        ]
      })
      await settings.save()
    }

    res.json({ settings })

  } catch (error) {
    console.error('Admin homepage error:', error)
    res.status(500).json({
      error: 'Failed to fetch homepage settings',
      message: 'An error occurred while fetching homepage settings'
    })
  }
})

// @route   PUT /api/admin/homepage
// @desc    Update homepage settings
// @access  Private (Admin only)
router.put('/homepage', async (req, res) => {
  try {
    const HomepageSettings = require('../models/HomepageSettings')
    const updates = req.body

    console.log('Updating homepage settings:', updates)

    let settings = await HomepageSettings.findOne({ isActive: true })

    if (!settings) {
      updates.lastUpdatedBy = req.user._id
      updates.isActive = true
      settings = new HomepageSettings(updates)
    } else {
      // Update fields explicitly
      if (updates.hero) settings.hero = updates.hero
      if (updates.stats) settings.stats = updates.stats
      if (updates.features) settings.features = updates.features
      if (updates.testimonials) settings.testimonials = updates.testimonials
      if (updates.about) settings.about = updates.about
      if (updates.cta) settings.cta = updates.cta
      if (updates.seo) settings.seo = updates.seo
      settings.lastUpdatedBy = req.user._id
    }

    await settings.save()
    await settings.populate('lastUpdatedBy', 'firstName lastName email')

    res.json({
      message: 'Homepage settings updated successfully',
      settings
    })

  } catch (error) {
    console.error('Admin update homepage error:', error)
    console.error('Error details:', error.message)
    res.status(500).json({
      error: 'Failed to update homepage settings',
      message: error.message || 'An error occurred while updating homepage settings',
      details: error.errors || {}
    })
  }
})

// @route   GET /api/homepage
// @desc    Get public homepage settings
// @access  Public
router.get('/public/homepage', async (req, res) => {
  try {
    const HomepageSettings = require('../models/HomepageSettings')
    
    const settings = await HomepageSettings.findOne({ isActive: true })
      .select('-lastUpdatedBy -__v')

    if (!settings) {
      return res.status(404).json({
        error: 'Settings not found',
        message: 'Homepage settings not configured'
      })
    }

    res.json({ settings })

  } catch (error) {
    console.error('Public homepage error:', error)
    res.status(500).json({
      error: 'Failed to fetch homepage settings',
      message: 'An error occurred while fetching homepage settings'
    })
  }
})

// @route   GET /api/admin/messages
// @desc    Get all contact messages
// @access  Private (Admin only)
router.get('/messages', async (req, res) => {
  try {
    const Contact = require('../models/Contact')
    const { page = 1, limit = 20, status } = req.query

    const query = {}
    if (status && status !== 'all') {
      query.status = status
    }

    const messages = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))

    const total = await Contact.countDocuments(query)

    res.json({
      messages,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    })

  } catch (error) {
    console.error('Get messages error:', error)
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to fetch messages'
    })
  }
})

// @route   PUT /api/admin/messages/:id
// @desc    Update message status
// @access  Private (Admin only)
router.put('/messages/:id', async (req, res) => {
  try {
    const Contact = require('../models/Contact')
    const { status, reply } = req.body

    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, reply, updatedAt: Date.now() },
      { new: true }
    )

    if (!message) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Message not found'
      })
    }

    res.json({
      message: 'Message updated successfully',
      data: message
    })

  } catch (error) {
    console.error('Update message error:', error)
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to update message'
    })
  }
})

// @route   DELETE /api/admin/messages/:id
// @desc    Delete message
// @access  Private (Admin only)
router.delete('/messages/:id', async (req, res) => {
  try {
    const Contact = require('../models/Contact')
    
    const message = await Contact.findByIdAndDelete(req.params.id)

    if (!message) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Message not found'
      })
    }

    res.json({ message: 'Message deleted successfully' })

  } catch (error) {
    console.error('Delete message error:', error)
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to delete message'
    })
  }
})

module.exports = router