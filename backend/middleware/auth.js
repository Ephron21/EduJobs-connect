const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Middleware to verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided or invalid format'
      })
    }
    
    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      })
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Find user and check if account is active
    const user = await User.findById(decoded.userId).select('-password')
    
    if (!user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Invalid token - user not found'
      })
    }
    
    if (user.status !== 'active') {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Account is inactive or suspended'
      })
    }
    
    if (user.isLocked) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Account is temporarily locked due to multiple failed login attempts'
      })
    }
    
    // Add user to request object
    req.user = user
    next()
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Invalid token'
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Token has expired'
      })
    }
    
    console.error('Authentication error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Authentication failed'
    })
  }
}

// Middleware to check if user has required role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required'
      })
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Required role: ${roles.join(' or ')}`
      })
    }
    
    next()
  }
}

// Middleware to check if user is admin
const requireAdmin = authorize('admin')

// Middleware to check if user is employer or admin
const requireEmployer = authorize('employer', 'admin')

// Middleware to check if user owns the resource or is admin
const requireOwnershipOrAdmin = (resourceUserField = 'user') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required'
      })
    }
    
    // Admin can access everything
    if (req.user.role === 'admin') {
      return next()
    }
    
    // Check if user owns the resource
    const resourceUserId = req.resource && req.resource[resourceUserField]
    const requestUserId = req.params.userId || req.body.userId
    
    if (resourceUserId && resourceUserId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only access your own resources'
      })
    }
    
    if (requestUserId && requestUserId !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only access your own resources'
      })
    }
    
    next()
  }
}

// Middleware to validate email verification
const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'Authentication required'
    })
  }
  
  if (!req.user.verification.isEmailVerified) {
    return res.status(403).json({
      error: 'Email verification required',
      message: 'Please verify your email address to access this resource'
    })
  }
  
  next()
}

// Optional authentication - doesn't fail if no token provided
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next() // Continue without authentication
    }
    
    const token = authHeader.substring(7)
    
    if (!token) {
      return next() // Continue without authentication
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password')
    
    if (user && user.status === 'active' && !user.isLocked) {
      req.user = user
    }
    
    next()
    
  } catch (error) {
    // Continue without authentication on token errors
    next()
  }
}

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// Generate refresh token (longer expiry)
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  )
}

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type')
    }
    return decoded
  } catch (error) {
    throw error
  }
}

module.exports = {
  authenticate,
  authorize,
  requireAdmin,
  requireEmployer,
  requireOwnershipOrAdmin,
  requireEmailVerification,
  optionalAuth,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken
}
