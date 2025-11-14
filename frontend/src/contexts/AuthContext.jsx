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
      
      if (!response.data?.user) {
        throw new Error('Invalid user data received')
      }

      setUser(response.data.user)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Auth check failed:', error)
      // Remove invalid token
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      setUser(null)
      setIsAuthenticated(false)
      
      // Set specific error message
      setError(
        error.response?.data?.message || 
        'Session expired. Please login again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setError(null)
      const response = await api.post('/auth/register', userData)
      
      if (!response.data) {
        throw new Error('No response data received')
      }

      return response.data
    } catch (error) {
      console.error('Registration failed:', error)
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         'Registration failed. Please try again.'
      setError(errorMessage)
      throw error
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      const response = await api.post('/auth/login', { email, password })
      
      if (response.status !== 200) {
        throw new Error(response.data?.message || 'Login failed')
      }

      // Store token and user data
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      
      // Update state
      setUser(response.data.user)
      setIsAuthenticated(true)

      return response.data
    } catch (error) {
      console.error('Login failed:', error)
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         'Login failed. Please check your credentials.'
      setError(errorMessage)
      throw error
    }
  }

  const logout = async () => {
    try {
      // Only call logout endpoint if authenticated
      if (isAuthenticated) {
        await api.post('/auth/logout')
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Continue with logout even if API call fails
    } finally {
      // Always clear auth state
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete api.defaults.headers.common['Authorization']
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const updateUser = (userData) => {
    // Update local state
    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    
    // Update localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser))
    
    return updatedUser
  }

  const forgotPassword = async (email) => {
    try {
      setError(null)
      const response = await api.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      console.error('Forgot password failed:', error)
      const errorMessage = error.response?.data?.message || 
                         'Failed to send reset email. Please try again.'
      setError(errorMessage)
      throw error
    }
  }

  const resetPassword = async (token, password) => {
    try {
      setError(null)
      const response = await api.post('/auth/reset-password', { token, password })
      
      if (response.data.token) {
        // Auto-login after password reset
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}` 
        setUser(response.data.user)
        setIsAuthenticated(true)
      }
      
      return response.data
    } catch (error) {
      console.error('Reset password failed:', error)
      const errorMessage = error.response?.data?.message || 
                         'Failed to reset password. Please try again.'
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
        localStorage.setItem('user', JSON.stringify(response.data.user))
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}` 
        setUser(response.data.user)
        setIsAuthenticated(true)
      }
      
      return response.data
    } catch (error) {
      console.error('Email verification failed:', error)
      const errorMessage = error.response?.data?.message || 
                         'Email verification failed. Please try again.'
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
      const errorMessage = error.response?.data?.message || 
                         'Failed to resend verification email. Please try again.'
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
      const errorMessage = error.response?.data?.message || 
                         'Failed to change password. Please try again.'
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
      {!loading && children}
    </AuthContext.Provider>
  )
}