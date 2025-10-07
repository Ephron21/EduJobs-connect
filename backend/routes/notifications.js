const express = require('express')
const { authenticate } = require('../middleware/auth')
const router = express.Router()

// Apply authentication to all routes
router.use(authenticate)

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', async (req, res) => {
  try {
    // For now, return empty array
    // You can implement full notification system later
    res.json({ notifications: [] })
  } catch (error) {
    console.error('Notifications error:', error)
    res.status(500).json({
      error: 'Failed to fetch notifications',
      message: 'An error occurred while fetching notifications'
    })
  }
})

module.exports = router