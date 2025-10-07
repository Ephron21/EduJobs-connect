const express = require('express')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const User = require('../models/User')
const { generateToken, generateRefreshToken, verifyRefreshToken, authenticate } = require('../middleware/auth')

const router = express.Router()

// Validation middleware
const validateRegister = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('role')
    .optional()
    .isIn(['student', 'employer'])
    .withMessage('Role must be either student or employer')
]

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
]

const validateForgotPassword = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
]

const validateResetPassword = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
]

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Please check your input data',
      details: errors.array()
    })
  }
  next()
}

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegister, handleValidationErrors, async (req, res) => {
  try {
    const { firstName, lastName, email, password, role = 'student' } = req.body

    // Check if user already exists
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      return res.status(400).json({
        error: 'Registration failed',
        message: 'A user with this email address already exists'
      })
    }

    // Create email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex')
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
      verification: {
        emailVerificationToken,
        emailVerificationExpires,
        isEmailVerified: false
      }
    })

    await user.save()

    // Generate tokens
    const token = generateToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    // Remove sensitive data from response
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      isEmailVerified: user.verification.isEmailVerified,
      createdAt: user.createdAt
    }

    res.status(201).json({
      message: 'Registration successful',
      user: userResponse,
      token,
      refreshToken,
      emailVerificationRequired: true
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      error: 'Registration failed',
      message: 'An error occurred during registration'
    })
  }
})

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body
    console.log('🔐 Login attempt for:', email)

    // Find user and include password for comparison
    const user = await User.findByEmail(email).select('+password')
    
    if (!user) {
      console.log('❌ User not found:', email)
      return res.status(401).json({
        error: 'Login failed',
        message: 'Invalid email or password'
      })
    }

    console.log('✅ User found:', email, 'Role:', user.role, 'Status:', user.status)
    console.log('🔒 Password hash exists:', !!user.password)

    // Check if account is locked
    if (user.isLocked) {
      console.log('🔒 Account is locked:', email)
      return res.status(423).json({
        error: 'Account locked',
        message: 'Account is temporarily locked due to multiple failed login attempts'
      })
    }

    // Check if account is active
    if (user.status !== 'active') {
      console.log('⚠️ Account not active:', email, 'Status:', user.status)
      return res.status(401).json({
        error: 'Login failed',
        message: 'Account is inactive or suspended'
      })
    }

    // Compare password
    console.log('🔍 Comparing password for:', email)
    const isPasswordValid = await user.comparePassword(password)
    console.log('🔑 Password valid:', isPasswordValid)
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email)
      // Increment login attempts
      await user.incLoginAttempts()
      
      return res.status(401).json({
        error: 'Login failed',
        message: 'Invalid email or password'
      })
    }

    console.log('✅ Login successful for:', email)
    
    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts()
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate tokens
    const token = generateToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    // Remove sensitive data from response
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      isEmailVerified: user.verification.isEmailVerified,
      lastLogin: user.lastLogin,
      profile: user.profile,
      preferences: user.preferences
    }

    res.json({
      message: 'Login successful',
      user: userResponse,
      token,
      refreshToken
    })

  } catch (error) {
    console.error('❌ Login error:', error)
    res.status(500).json({
      error: 'Login failed',
      message: 'An error occurred during login'
    })
  }
})
// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({
        error: 'Token required',
        message: 'Refresh token is required'
      })
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken)
    
    // Find user
    const user = await User.findById(decoded.userId)
    
    if (!user || user.status !== 'active') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'User not found or account inactive'
      })
    }

    // Generate new tokens
    const newToken = generateToken(user._id)
    const newRefreshToken = generateRefreshToken(user._id)

    res.json({
      message: 'Token refreshed successfully',
      token: newToken,
      refreshToken: newRefreshToken
    })

  } catch (error) {
    console.error('Token refresh error:', error)
    res.status(401).json({
      error: 'Invalid token',
      message: 'Failed to refresh token'
    })
  }
})

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', validateForgotPassword, handleValidationErrors, async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findByEmail(email)
    
    if (!user) {
      // Don't reveal if email exists for security
      return res.json({
        message: 'If an account with that email exists, a password reset link has been sent'
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    user.verification.passwordResetToken = resetToken
    user.verification.passwordResetExpires = resetExpires
    await user.save()

    // In production, send email here
    console.log(`Password reset token for ${email}: ${resetToken}`)

    res.json({
      message: 'If an account with that email exists, a password reset link has been sent'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({
      error: 'Request failed',
      message: 'An error occurred while processing your request'
    })
  }
})

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', validateResetPassword, handleValidationErrors, async (req, res) => {
  try {
    const { token, password } = req.body

    const user = await User.findOne({
      'verification.passwordResetToken': token,
      'verification.passwordResetExpires': { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        error: 'Invalid token',
        message: 'Password reset token is invalid or has expired'
      })
    }

    // Update password
    user.password = password
    user.verification.passwordResetToken = undefined
    user.verification.passwordResetExpires = undefined
    
    // Reset login attempts
    user.loginAttempts = 0
    user.lockUntil = undefined

    await user.save()

    res.json({
      message: 'Password has been reset successfully'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({
      error: 'Reset failed',
      message: 'An error occurred while resetting your password'
    })
  }
})

// @route   POST /api/auth/verify-email
// @desc    Verify email address
// @access  Public
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({
        error: 'Token required',
        message: 'Verification token is required'
      })
    }

    const user = await User.findOne({
      'verification.emailVerificationToken': token,
      'verification.emailVerificationExpires': { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        error: 'Invalid token',
        message: 'Email verification token is invalid or has expired'
      })
    }

    // Verify email
    user.verification.isEmailVerified = true
    user.verification.emailVerificationToken = undefined
    user.verification.emailVerificationExpires = undefined

    await user.save()

    res.json({
      message: 'Email verified successfully'
    })

  } catch (error) {
    console.error('Email verification error:', error)
    res.status(500).json({
      error: 'Verification failed',
      message: 'An error occurred while verifying your email'
    })
  }
})

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticate, async (req, res) => {
  try {
    const userResponse = {
      id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
      status: req.user.status,
      isEmailVerified: req.user.verification.isEmailVerified,
      lastLogin: req.user.lastLogin,
      profile: req.user.profile,
      preferences: req.user.preferences,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt
    }

    res.json({
      user: userResponse
    })

  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      error: 'Request failed',
      message: 'An error occurred while fetching user data'
    })
  }
})

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authenticate, (req, res) => {
  res.json({
    message: 'Logged out successfully'
  })
})

module.exports = router
