const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Middleware to verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'No token provided or invalid format'
      })
    }
    
    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    if (!token) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'No token provided'
      })
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Find user and check if account is active
    const user = await User.findById(decoded.userId)
      .select('-password')
      .lean()
    
    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'User not found'
      })
    }
    
    if (user.status !== 'active') {
      return res.status(403).json({
        error: 'Account inactive',
        message: 'Account is inactive or suspended'
      })
    }
    
    if (user.isLocked) {
      const remainingLockTime = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000))
      return res.status(423).json({
        error: 'Account locked',
        message: `Account locked. Try again in ${remainingLockTime} minutes`
      })
    }
    
    // Add user to request object
    req.user = user
    req.token = token
    next()
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid token'
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Token has expired'
      })
    }
    
    console.error('Authentication error:', error)
    res.status(500).json({
      error: 'Authentication failed',
      message: 'An error occurred during authentication'
    })
  }
}

// Middleware to check if user has required role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please login to access this resource'
      })
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Unauthorized',
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
        error: 'Authentication required',
        message: 'Please login to access this resource'
      })
    }
    
    // Admin can access everything
    if (req.user.role === 'admin') {
      return next()
    }
    
    // Check if user owns the resource
    const resourceUserId = req.resource?.[resourceUserField]?.toString()
    const requestUserId = (req.params.userId || req.body.userId)?.toString()
    const currentUserId = req.user._id.toString()
    
    if (resourceUserId && resourceUserId !== currentUserId) {
      return res.status(403).json({
        error: 'Unauthorized',
        message: 'You can only access your own resources'
      })
    }
    
    if (requestUserId && requestUserId !== currentUserId) {
      return res.status(403).json({
        error: 'Unauthorized',
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
      error: 'Authentication required',
      message: 'Please login to access this resource'
    })
  }
  
  if (!req.user.verification?.isEmailVerified) {
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
      return next()
    }
    
    const token = authHeader.substring(7)
    
    if (!token) {
      return next()
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Find user
    const user = await User.findById(decoded.userId)
      .select('-password')
      .lean()
    
    if (user && user.status === 'active' && !user.isLocked) {
      req.user = user
    }
    
    next()
    
  } catch (error) {
    // Continue without authentication on token errors
    next()
  }
}

// Generate JWT token with enhanced security
const generateToken = (userId, additionalPayload = {}) => {
  return jwt.sign(
    { 
      userId,
      ...additionalPayload,
      iss: 'EduJobsConnect',
      iat: Math.floor(Date.now() / 1000)
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      algorithm: 'HS256'
    }
  )
}

// Generate refresh token with type distinction
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { 
      userId,
      type: 'refresh',
      iss: 'EduJobsConnect',
      iat: Math.floor(Date.now() / 1000)
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: '30d',
      algorithm: 'HS256'
    }
  )
}

// Verify refresh token with additional checks
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    })
    
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type')
    }
    
    if (decoded.iss !== 'EduJobsConnect') {
      throw new Error('Invalid token issuer')
    }
    
    return decoded
  } catch (error) {
    console.error('Refresh token verification failed:', error)
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