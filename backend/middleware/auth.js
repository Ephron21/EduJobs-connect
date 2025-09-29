import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Protect routes - require authentication
export const protect = async (req, res, next) => {
  try {
    let token

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.'
      })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // Get user from token
      const user = await User.findById(decoded.id).select('-password')
      
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Token is valid but user no longer exists'
        })
      }

      if (!user.isVerified) {
        return res.status(401).json({
          status: 'error',
          message: 'Please verify your email address to access this resource'
        })
      }

      // Add user to request object
      req.user = user
      next()
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token'
      })
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error in authentication middleware'
    })
  }
}

// Authorize specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. Please log in first.'
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Access denied. ${req.user.role} role is not authorized to access this resource.`
      })
    }

    next()
  }
}

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select('-password')
        
        if (user && user.isVerified) {
          req.user = user
        }
      } catch (error) {
        // Token is invalid, but we don't fail the request
        console.log('Invalid token in optional auth:', error.message)
      }
    }

    next()
  } catch (error) {
    next()
  }
}
