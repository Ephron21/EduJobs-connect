import crypto from 'crypto'
import User from '../models/User.js'
import { sendTokenResponse } from '../utils/jwt.js'
import { sendEmail } from '../services/emailService.js'

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phoneNumber }] 
    })

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email or phone number already exists'
      })
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password
    })

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    user.verificationToken = verificationToken
    await user.save()

    // Send verification email
    try {
      const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`
      
      await sendEmail({
        to: user.email,
        subject: 'Verify Your Email - EduJobs Connect',
        template: 'emailVerification',
        data: {
          name: user.firstName,
          verificationUrl
        }
      })

      res.status(201).json({
        status: 'success',
        message: 'User registered successfully. Please check your email to verify your account.',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isVerified: user.isVerified
        }
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      
      // Still return success but mention email issue
      res.status(201).json({
        status: 'success',
        message: 'User registered successfully, but verification email could not be sent. Please contact support.',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isVerified: user.isVerified
        }
      })
    }
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        status: 'error',
        message: messages.join('. ')
      })
    }

    res.status(500).json({
      status: 'error',
      message: 'Server error during registration'
    })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      })
    }

    // Check for user (include password for comparison)
    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      })
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({
        status: 'error',
        message: 'Please verify your email address before logging in'
      })
    }

    sendTokenResponse(user, 200, res)
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Server error during login'
    })
  }
}

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({
        status: 'error',
        message: 'Verification token is required'
      })
    }

    // Find user with verification token
    const user = await User.findOne({ verificationToken: token })

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired verification token'
      })
    }

    // Update user verification status
    user.isVerified = true
    user.verificationToken = undefined
    await user.save()

    sendTokenResponse(user, 200, res)
  } catch (error) {
    console.error('Email verification error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Server error during email verification'
    })
  }
}

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    res.status(200).json({
      status: 'success',
      user
    })
  } catch (error) {
    console.error('Get me error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    })
  }
}

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'No user found with that email address'
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetToken = resetToken
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000 // 10 minutes

    await user.save()

    // Send reset email
    try {
      const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`
      
      await sendEmail({
        to: user.email,
        subject: 'Password Reset - EduJobs Connect',
        template: 'passwordReset',
        data: {
          name: user.firstName,
          resetUrl
        }
      })

      res.status(200).json({
        status: 'success',
        message: 'Password reset email sent'
      })
    } catch (emailError) {
      console.error('Reset email sending failed:', emailError)
      
      user.resetToken = undefined
      user.resetTokenExpire = undefined
      await user.save()

      res.status(500).json({
        status: 'error',
        message: 'Email could not be sent'
      })
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    })
  }
}

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body

    // Find user by reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired reset token'
      })
    }

    // Set new password
    user.password = password
    user.resetToken = undefined
    user.resetTokenExpire = undefined
    await user.save()

    sendTokenResponse(user, 200, res)
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    })
  }
}

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })

  res.status(200).json({
    status: 'success',
    message: 'User logged out successfully'
  })
}
