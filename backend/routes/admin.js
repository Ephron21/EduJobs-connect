import express from 'express'
import { protect, authorize } from '../middleware/auth.js'
import User from '../models/User.js'
import University from '../models/University.js'
import Application from '../models/Application.js'
import Job from '../models/Job.js'
import Consultation from '../models/Consultation.js'
import Student from '../models/Student.js'

const router = express.Router()

// All admin routes require authentication and admin role
router.use(protect)
router.use(authorize('admin'))

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalUniversities,
      totalApplications,
      totalJobs,
      totalConsultations,
      recentUsers,
      pendingConsultations,
      activeJobs
    ] = await Promise.all([
      User.countDocuments(),
      University.countDocuments(),
      Application.countDocuments(),
      Job.countDocuments(),
      Consultation.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select('firstName lastName email createdAt'),
      Consultation.countDocuments({ status: 'pending' }),
      Job.countDocuments({ isActive: true, deadline: { $gt: new Date() } })
    ])

    // Calculate growth percentages (mock data for now)
    const stats = {
      users: totalUsers,
      universities: totalUniversities,
      applications: totalApplications,
      jobs: totalJobs,
      consultations: totalConsultations,
      recentUsers,
      pendingConsultations,
      activeJobs,
      growth: {
        users: 12,
        universities: 5,
        applications: -3,
        jobs: 8,
        consultations: 15
      }
    }

    res.status(200).json({
      status: 'success',
      stats
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch admin statistics'
    })
  }
})

// @desc    Get all users with pagination and search
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ''
    const role = req.query.role || ''
    const status = req.query.status || ''

    // Build search query
    let query = {}
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (role) {
      query.role = role
    }
    
    if (status === 'verified') {
      query.isVerified = true
    } else if (status === 'unverified') {
      query.isVerified = false
    }

    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query)
    ])

    const totalPages = Math.ceil(total / limit)

    res.status(200).json({
      status: 'success',
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    })
  } catch (error) {
    console.error('Admin get users error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users'
    })
  }
})

// @desc    Update user status or role
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
router.put('/users/:id', async (req, res) => {
  try {
    const { role, isVerified, isActive } = req.body
    const userId = req.params.id

    const updateData = {}
    if (role !== undefined) updateData.role = role
    if (isVerified !== undefined) updateData.isVerified = isVerified
    if (isActive !== undefined) updateData.isActive = isActive

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      })
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    })
  } catch (error) {
    console.error('Admin update user error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user'
    })
  }
})

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete your own account'
      })
    }

    const user = await User.findByIdAndDelete(userId)

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      })
    }

    // Also delete associated student profile if exists
    await Student.findOneAndDelete({ userId })

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Admin delete user error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete user'
    })
  }
})

// @desc    Get all universities
// @route   GET /api/admin/universities
// @access  Private/Admin
router.get('/universities', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ''

    let query = {}
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (page - 1) * limit

    const [universities, total] = await Promise.all([
      University.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      University.countDocuments(query)
    ])

    res.status(200).json({
      status: 'success',
      data: {
        universities,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    })
  } catch (error) {
    console.error('Admin get universities error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch universities'
    })
  }
})

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private/Admin
router.get('/jobs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ''
    const status = req.query.status || ''

    let query = {}
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ]
    }

    if (status === 'active') {
      query.isActive = true
      query.deadline = { $gt: new Date() }
    } else if (status === 'expired') {
      query.deadline = { $lt: new Date() }
    } else if (status === 'inactive') {
      query.isActive = false
    }

    const skip = (page - 1) * limit

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Job.countDocuments(query)
    ])

    res.status(200).json({
      status: 'success',
      data: {
        jobs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    })
  } catch (error) {
    console.error('Admin get jobs error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch jobs'
    })
  }
})

// @desc    Get all consultations
// @route   GET /api/admin/consultations
// @access  Private/Admin
router.get('/consultations', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const status = req.query.status || ''
    const serviceType = req.query.serviceType || ''

    let query = {}
    if (status) {
      query.status = status
    }
    if (serviceType) {
      query.serviceType = serviceType
    }

    const skip = (page - 1) * limit

    const [consultations, total] = await Promise.all([
      Consultation.find(query)
        .populate('userId', 'firstName lastName email')
        .populate('assignedTo', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Consultation.countDocuments(query)
    ])

    res.status(200).json({
      status: 'success',
      data: {
        consultations,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    })
  } catch (error) {
    console.error('Admin get consultations error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch consultations'
    })
  }
})

// @desc    Update consultation status
// @route   PUT /api/admin/consultations/:id
// @access  Private/Admin
router.put('/consultations/:id', async (req, res) => {
  try {
    const { status, assignedTo, priority, notes } = req.body
    const consultationId = req.params.id

    const consultation = await Consultation.findById(consultationId)
    
    if (!consultation) {
      return res.status(404).json({
        status: 'error',
        message: 'Consultation not found'
      })
    }

    // Update consultation
    if (status) consultation.status = status
    if (assignedTo) consultation.assignedTo = assignedTo
    if (priority) consultation.priority = priority

    // Add admin note if provided
    if (notes) {
      consultation.notes.push({
        author: req.user.id,
        content: notes,
        isInternal: true
      })
    }

    await consultation.save()

    res.status(200).json({
      status: 'success',
      data: { consultation }
    })
  } catch (error) {
    console.error('Admin update consultation error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Failed to update consultation'
    })
  }
})

// @desc    Get system health status
// @route   GET /api/admin/health
// @access  Private/Admin
router.get('/health', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = await checkDatabaseHealth()
    
    // Check email service (mock for now)
    const emailStatus = { status: 'healthy', message: 'Operational' }
    
    // Check file storage (mock for now)
    const storageStatus = { status: 'warning', message: 'High usage' }

    res.status(200).json({
      status: 'success',
      health: {
        database: dbStatus,
        email: emailStatus,
        storage: storageStatus,
        overall: 'healthy'
      }
    })
  } catch (error) {
    console.error('Admin health check error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Health check failed'
    })
  }
})

// Helper function to check database health
const checkDatabaseHealth = async () => {
  try {
    await User.findOne().limit(1)
    return { status: 'healthy', message: 'Connected' }
  } catch (error) {
    return { status: 'error', message: 'Connection failed' }
  }
}

export default router
