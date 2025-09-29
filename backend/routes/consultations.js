import express from 'express'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// @desc    Create consultation request
// @route   POST /api/consultations
// @access  Public
router.post('/', async (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'Create consultation request endpoint - To be implemented'
  })
})

// @desc    Get all consultations (Admin only)
// @route   GET /api/consultations
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Get all consultations endpoint - To be implemented'
  })
})

// @desc    Get user consultations
// @route   GET /api/consultations/my
// @access  Private
router.get('/my', protect, async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Get user consultations endpoint - To be implemented'
  })
})

// @desc    Update consultation status
// @route   PUT /api/consultations/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Update consultation status endpoint - To be implemented'
  })
})

export default router
