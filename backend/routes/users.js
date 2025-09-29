import express from 'express'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// All routes are protected
router.use(protect)

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', authorize('admin'), async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Get all users endpoint - To be implemented'
  })
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Get user profile endpoint - To be implemented'
  })
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Update user profile endpoint - To be implemented'
  })
})

export default router
