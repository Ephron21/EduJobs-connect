import express from 'express'
import {
  register,
  login,
  verifyEmail,
  getMe,
  forgotPassword,
  resetPassword,
  logout
} from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)
router.post('/verify-email', verifyEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

// Protected routes
router.get('/me', protect, getMe)
router.post('/logout', protect, logout)

export default router
