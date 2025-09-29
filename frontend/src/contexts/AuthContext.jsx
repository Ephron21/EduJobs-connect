import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const clearError = () => {
    setError(null)
  }

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Verify token and get user data
      const response = await api.get('/auth/me')
      setUser(response.data.user)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Auth check failed:', error)
      // Remove invalid token
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setError(null)
      const response = await api.post('/auth/register', userData)
      
      // Don't auto-login after registration, user needs to verify email first
      return response.data
    } catch (error) {
      console.error('Registration failed:', error)
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.'
      setError(errorMessage)
      throw error
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      const response = await api.post('/auth/login', { email, password })
      const { token, user: userData } = response.data

      // Store token
      localStorage.setItem('token', token)
      
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Update state
      setUser(userData)
      setIsAuthenticated(true)

      return response.data
    } catch (error) {
      console.error('Login failed:', error)
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.'
      setError(errorMessage)
      throw error
    }
  }

  const logout = async () => {
    try {
      // Call logout endpoint to invalidate token on server
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout request failed:', error)
      // Continue with local logout even if server request fails
    } finally {
      // Clear local storage and state
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      setUser(null)
      setIsAuthenticated(false)
      setError(null)
    }
  }

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
  }

  const forgotPassword = async (email) => {
    try {
      setError(null)
      const response = await api.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      console.error('Forgot password failed:', error)
      const errorMessage = error.response?.data?.message || 'Failed to send reset email. Please try again.'
      setError(errorMessage)
      throw error
    }
  }

  const resetPassword = async (token, password) => {
    try {
      setError(null)
      const response = await api.post('/auth/reset-password', { token, password })
      return response.data
    } catch (error) {
      console.error('Reset password failed:', error)
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.'
      setError(errorMessage)
      throw error
    }
  }

  const verifyEmail = async (token) => {
    try {
      setError(null)
      const response = await api.post('/auth/verify-email', { token })
      
      if (response.data.token) {
        // Auto-login after email verification
        localStorage.setItem('token', response.data.token)
        api.defaults.headers.common['Authorization'] = `bearer ${response.data.token}`
        setUser(response.data.user)
        setIsAuthenticated(true)
      }
      
      return response.data
    } catch (error) {
      console.error('Email verification failed:', error)
      const errorMessage = error.response?.data?.message || 'Email verification failed. Please try again.'
      setError(errorMessage)
      throw error
    }
  }

  const resendVerification = async (email) => {
    try {
      setError(null)
      const response = await api.post('/auth/resend-verification', { email })
      return response.data
    } catch (error) {
      console.error('Resend verification failed:', error)
      const errorMessage = error.response?.data?.message || 'Failed to resend verification email. Please try again.'
      setError(errorMessage)
      throw error
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null)
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      })
      return response.data
    } catch (error) {
      console.error('Change password failed:', error)
      const errorMessage = error.response?.data?.message || 'Failed to change password. Please try again.'
      setError(errorMessage)
      throw error
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    error,
    clearError,
    register,
    login,
    logout,
    updateUser,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    changePassword,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
