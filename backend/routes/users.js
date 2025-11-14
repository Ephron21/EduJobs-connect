const express = require('express');

const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const { authenticate, requireOwnershipOrAdmin } = require('../middleware/auth');
const { uploadAvatar, deleteAvatarFile } = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Helper function to initialize profile
function initializeProfile() {
  return {
    phone: '',
    gender: '',
    dateOfBirth: null,
    address: {
      street: '',
      city: '',
      province: '',
      country: ''
    },
    avatar: null
  };
}

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    let user = await User.findById(req.user._id).select('-password -verification');

    // If user doesn't have a profile, initialize it
    if (!user.profile) {
      user.profile = initializeProfile();
      user = await user.save();
    }

    // Add full URL to avatar if it exists
    const userObj = user.toObject();
    if (userObj.profile?.avatar) {
      userObj.profile.avatar = `${req.protocol}://${req.get('host')}/uploads/avatars/${userObj.profile.avatar}`;
    }

    res.json({
      success: true,
      user: {
        id: userObj._id,
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        fullName: userObj.fullName,
        email: userObj.email,
        role: userObj.role,
        status: userObj.status,
        profile: userObj.profile || initializeProfile(),
        preferences: userObj.preferences || {},
        createdAt: userObj.createdAt,
        updatedAt: userObj.updatedAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile',
      message: 'An error occurred while fetching your profile',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', 
  uploadAvatar,
  [
    body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
    body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
    body('profile.phone').optional().trim().isMobilePhone(),
    body('profile.dateOfBirth').optional().isISO8601(),
    body('profile.gender').optional().isIn(['male', 'female', 'other', 'prefer not to say'])
  ], 
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        if (req.file) {
          deleteAvatarFile(req.file.filename);
        }
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      // Get the current user
      let user = await User.findById(req.user._id);
      if (!user) {
        if (req.file) deleteAvatarFile(req.file.filename);
        return res.status(404).json({ 
          success: false,
          error: 'User not found' 
        });
      }

      // Initialize profile if it doesn't exist
      if (!user.profile) {
        user.profile = initializeProfile();
        await user.save();
      }

      // Create updates object
      const updates = {};

      // Handle direct field updates
      if (req.body.firstName !== undefined) updates.firstName = req.body.firstName;
      if (req.body.lastName !== undefined) updates.lastName = req.body.lastName;

      // Handle profile updates
      if (req.body.profile) {
        updates.profile = user.profile.toObject ? user.profile.toObject() : { ...user.profile };

        // Update basic profile fields
        if (req.body.profile.phone !== undefined) updates.profile.phone = req.body.profile.phone;
        if (req.body.profile.dateOfBirth !== undefined) updates.profile.dateOfBirth = req.body.profile.dateOfBirth;
        if (req.body.profile.gender !== undefined) updates.profile.gender = req.body.profile.gender;

        // Handle nested address
        if (req.body.profile.address) {
          updates.profile.address = updates.profile.address || {};
          if (req.body.profile.address.street !== undefined) updates.profile.address.street = req.body.profile.address.street;
          if (req.body.profile.address.city !== undefined) updates.profile.address.city = req.body.profile.address.city;
          if (req.body.profile.address.province !== undefined) updates.profile.address.province = req.body.profile.address.province;
          if (req.body.profile.address.country !== undefined) updates.profile.address.country = req.body.profile.address.country;
        }
      }

      // Handle file upload
      if (req.file) {
        // Delete old avatar if exists
        if (user.profile?.avatar) {
          deleteAvatarFile(user.profile.avatar);
        }
        updates.profile = updates.profile || {};
        updates.profile.avatar = req.file.filename;
      }

      // Debug logging
      console.log('Applying updates:', JSON.stringify(updates, null, 2));

      // Update the user
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { 
          new: true, 
          runValidators: true, 
          context: 'query',
          setDefaultsOnInsert: true
        }
      ).select('-password -verification');

      if (!updatedUser) {
        throw new Error('Failed to update user');
      }

      // Prepare response
      const userResponse = updatedUser.toObject();
      if (userResponse.profile?.avatar) {
        userResponse.profile.avatar = `${req.protocol}://${req.get('host')}/uploads/avatars/${userResponse.profile.avatar}`;
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: userResponse
      });

    } catch (error) {
      console.error('Update profile error:', error);
      if (req.file) {
        deleteAvatarFile(req.file.filename);
      }
      res.status(500).json({
        success: false,
        error: 'Failed to update profile',
        message: 'An error occurred while updating your profile',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);


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
    // Delete user's avatar if exists
    const user = await User.findById(req.user._id)
    if (user.profile?.avatar) {
      deleteAvatarFile(user.profile.avatar)
    }

    await User.findByIdAndDelete(req.user._id)

    res.json({
      success: true,
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