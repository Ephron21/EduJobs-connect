import express from 'express'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// All routes are protected
router.use(protect)

// @desc    Get all students (Admin only)
// @route   GET /api/students
// @access  Private/Admin
router.get('/', authorize('admin'), async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Get all students endpoint - To be implemented'
  })
})

// @desc    Create student profile
// @route   POST /api/students
// @access  Private
router.post('/', async (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'Create student profile endpoint - To be implemented'
  })
})

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private
router.get('/profile', async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Get student profile endpoint - To be implemented'
  })
})

// @desc    Update student profile
// @route   PUT /api/students/profile
// @access  Private
router.put('/profile', async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Update student profile endpoint - To be implemented'
  })
})

export default router
