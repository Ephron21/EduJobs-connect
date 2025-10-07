const express = require('express')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const { authenticate, requireOwnershipOrAdmin } = require('../middleware/auth')

const router = express.Router()

// Apply authentication to all routes
router.use(authenticate)

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -verification')

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        profile: user.profile,
        preferences: user.preferences,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })

  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      error: 'Failed to fetch profile',
      message: 'An error occurred while fetching your profile'
    })
  }
})

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
  body('profile.phone').optional().isMobilePhone(),
  body('profile.dateOfBirth').optional().isISO8601(),
  body('profile.gender').optional().isIn(['male', 'female', 'other'])
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const updates = req.body
    
    // Don't allow updating sensitive fields
    delete updates.email
    delete updates.password
    delete updates.role
    delete updates.status
    delete updates.verification

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -verification')

    res.json({
      message: 'Profile updated successfully',
      user
    })

  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      error: 'Failed to update profile',
      message: 'An error occurred while updating your profile'
    })
  }
})

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', [
  body('jobAlerts').optional().isBoolean(),
  body('universityAlerts').optional().isBoolean(),
  body('emailNotifications').optional().isBoolean(),
  body('language').optional().isIn(['en', 'fr', 'rw'])
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferences: req.body },
      { new: true, runValidators: true }
    ).select('-password -verification')

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    })

  } catch (error) {
    console.error('Update preferences error:', error)
    res.status(500).json({
      error: 'Failed to update preferences',
      message: 'An error occurred while updating your preferences'
    })
  }
})

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const { currentPassword, newPassword } = req.body

    // Get user with password
    const user = await User.findById(req.user._id).select('+password')

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'Current password is incorrect'
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({
      error: 'Failed to change password',
      message: 'An error occurred while changing your password'
    })
  }
})

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id)

    res.json({
      message: 'Account deleted successfully'
    })

  } catch (error) {
    console.error('Delete account error:', error)
    res.status(500).json({
      error: 'Failed to delete account',
      message: 'An error occurred while deleting your account'
    })
  }
})

module.exports = router
