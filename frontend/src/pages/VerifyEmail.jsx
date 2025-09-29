import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import Loading from '../components/common/Loading'

const VerifyEmail = () => {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [resending, setResending] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    // Get email from location state (from registration) or URL params
    const emailFromState = location.state?.email
    const tokenFromUrl = searchParams.get('token')
    
    if (emailFromState) {
      setEmail(emailFromState)
    }

    // If there's a token in URL, verify it automatically
    if (tokenFromUrl) {
      verifyEmailToken(tokenFromUrl)
    }
  }, [searchParams, location.state])

  const verifyEmailToken = async (token) => {
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/auth/verify-email', { token })
      
      // Auto-login the user after successful verification
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        await login(response.data.user)
        setSuccess(true)
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      }
    } catch (error) {
      console.error('Email verification error:', error)
      setError(
        error.response?.data?.message || 
        t('auth.emailVerificationFailed')
      )
    } finally {
      setLoading(false)
    }
  }

  const resendVerificationEmail = async () => {
    if (!email) {
      setError(t('auth.emailRequiredForResend'))
      return
    }

    setResending(true)
    setError('')

    try {
      await api.post('/auth/resend-verification', { email })
      alert(t('auth.verificationEmailResent'))
    } catch (error) {
      console.error('Resend verification error:', error)
      setError(
        error.response?.data?.message || 
        t('auth.resendVerificationFailed')
      )
    } finally {
      setResending(false)
    }
  }

  if (loading) {
    return <Loading message={t('auth.verifyingEmail')} />
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-6">
              <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
              {t('auth.emailVerified')}
            </h2>
            
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4 mb-6">
              <p className="text-sm text-green-700 dark:text-green-300">
                {t('auth.emailVerificationSuccess')}
              </p>
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>{t('auth.redirectingToDashboard')}</span>
            </div>

            <Link
              to="/dashboard"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              {t('auth.goToDashboard')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-6">
            <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
            {t('auth.verifyYourEmail')}
          </h2>
          
          {email && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {t('auth.verificationEmailSentTo', { email })}
            </p>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                {t('auth.verificationInstructions')}
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <ul className="list-disc list-inside space-y-1">
                  <li>{t('auth.checkEmailInbox')}</li>
                  <li>{t('auth.checkSpamFolder')}</li>
                  <li>{t('auth.clickVerificationLink')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4">
          {/* Resend Email Button */}
          <button
            onClick={resendVerificationEmail}
            disabled={resending || !email}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {resending ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                {t('auth.resendingEmail')}
              </div>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('auth.resendVerificationEmail')}
              </>
            )}
          </button>

          {/* Manual Entry */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {t('auth.haveVerificationCode')}
            </p>
            <Link
              to="/verify-email-manual"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
            >
              {t('auth.enterCodeManually')}
            </Link>
          </div>

          {/* Back to Login */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
            >
              ← {t('auth.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
