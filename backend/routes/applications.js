import express from 'express'
import { protect, authorize, optionalAuth } from '../middleware/auth.js'

const router = express.Router()

// @desc    Get all applications
// @route   GET /api/applications
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Get all applications endpoint - To be implemented'
  })
})

// @desc    Get active applications
// @route   GET /api/applications/active
// @access  Public
router.get('/active', optionalAuth, async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Get active applications endpoint - To be implemented'
  })
})

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Get single application endpoint - To be implemented'
  })
})

// @desc    Create application
// @route   POST /api/applications
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'Create application endpoint - To be implemented'
  })
})

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Update application endpoint - To be implemented'
  })
})

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Delete application endpoint - To be implemented'
  })
})

export default router
