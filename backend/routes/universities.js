import express from 'express'
import { protect, authorize, optionalAuth } from '../middleware/auth.js'

const router = express.Router()

// @desc    Get all universities
// @route   GET /api/universities
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Get all universities endpoint - To be implemented'
  })
})

// @desc    Get single university
// @route   GET /api/universities/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Get single university endpoint - To be implemented'
  })
})

// @desc    Create university
// @route   POST /api/universities
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'Create university endpoint - To be implemented'
  })
})

// @desc    Update university
// @route   PUT /api/universities/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Update university endpoint - To be implemented'
  })
})

// @desc    Delete university
// @route   DELETE /api/universities/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Delete university endpoint - To be implemented'
  })
})

export default router
