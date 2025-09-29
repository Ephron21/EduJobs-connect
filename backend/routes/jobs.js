import express from 'express'
import { protect, authorize, optionalAuth } from '../middleware/auth.js'

const router = express.Router()

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Get all jobs endpoint - To be implemented'
  })
})

// @desc    Search jobs
// @route   GET /api/jobs/search
// @access  Public
router.get('/search', optionalAuth, async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Search jobs endpoint - To be implemented'
  })
})

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Get single job endpoint - To be implemented'
  })
})

// @desc    Create job
// @route   POST /api/jobs
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'Create job endpoint - To be implemented'
  })
})

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Update job endpoint - To be implemented'
  })
})

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Delete job endpoint - To be implemented'
  })
})

export default router
