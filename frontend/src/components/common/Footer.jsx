import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, Globe, ArrowUp, Sun, Moon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import EduJobsLogo from './EduJobsLogo'

const Footer = () => {
  const { t } = useTranslation()
  const { isDark, toggleTheme } = useTheme()
  const [email, setEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState('idle') // idle, loading, success, error
  const [showBackToTop, setShowBackToTop] = useState(false)

  const quickLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/services', label: t('nav.services') },
    { path: '/contact', label: t('nav.contact') }
  ]

  const services = [
    { label: 'University Applications', path: '/universities' },
    { label: 'Job Vacancies', path: '/jobs' },
    { label: 'CV Writing', path: '/services/cv-writing' },
    { label: 'University Guidance', path: '/services/guidance' }
  ]

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/edujobsconnect', label: 'Facebook', color: 'hover:text-blue-500' },
    { icon: Twitter, href: 'https://twitter.com/edujobsconnect', label: 'Twitter', color: 'hover:text-sky-500' },
    { icon: Instagram, href: 'https://instagram.com/edujobsconnect', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: Linkedin, href: 'https://linkedin.com/company/edujobs-connect', label: 'LinkedIn', color: 'hover:text-blue-600' },
    { icon: Youtube, href: 'https://youtube.com/@edujobsconnect', label: 'YouTube', color: 'hover:text-red-500' },
    { icon: Globe, href: 'https://edujobsconnect.rw', label: 'Website', color: 'hover:text-green-500' }
  ]

  // Back to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setNewsletterStatus('loading')
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setNewsletterStatus('success')
      setEmail('')
      setTimeout(() => setNewsletterStatus('idle'), 3000)
    } catch (error) {
      setNewsletterStatus('error')
      setTimeout(() => setNewsletterStatus('idle'), 3000)
    }
  }

  return (
    <>
      <footer className={`relative ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2 animate-fadeIn">
              <div className="flex items-center space-x-2 mb-4">
                <EduJobsLogo size="large" animated={true} />
              </div>
              <p className={`mb-6 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Connecting Rwandan students with university opportunities and career paths. 
                Your bridge to educational and professional success in Rwanda and beyond.
              </p>

              {/* Live Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="text-2xl font-bold text-primary-600">1,000+</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Students Helped</div>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="text-2xl font-bold text-secondary-600">50+</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Partner Universities</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-opacity-10 hover:bg-primary-500 cursor-pointer transition-all group ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
                  <Mail className="w-5 h-5 text-primary-500 group-hover:scale-110 transition-transform" />
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} group-hover:text-primary-600`}>info@edujobsconnect.com</span>
                </div>
                <div className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-opacity-10 hover:bg-primary-500 cursor-pointer transition-all group ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
                  <Phone className="w-5 h-5 text-primary-500 group-hover:scale-110 transition-transform" />
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} group-hover:text-primary-600`}>+250 787 846 344</span>
                </div>
                <div className={`flex items-center space-x-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <MapPin className="w-5 h-5 text-primary-500" />
                  <span>Kigali, Rwanda</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="animate-slideUp">
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={link.path} className="transform hover:translate-x-1 transition-transform" style={{ animationDelay: `${index * 0.1}s` }}>
                    <Link
                      to={link.path}
                      className={`block py-2 px-3 rounded-lg hover:bg-primary-500 hover:text-white transition-all group ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Services</h3>
              <ul className="space-y-2">
                {services.map((service, index) => (
                  <li key={service.path} className="transform hover:translate-x-1 transition-transform" style={{ animationDelay: `${index * 0.1}s` }}>
                    <Link
                      to={service.path}
                      className={`block py-2 px-3 rounded-lg hover:bg-primary-500 hover:text-white transition-all group ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Social */}
            <div className="animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Stay Connected</h3>
              <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Subscribe to our newsletter for the latest opportunities and updates.
              </p>
              
              {/* Newsletter Signup */}
              <form onSubmit={handleNewsletterSubmit} className="mb-6">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                        isDark
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:bg-gray-700'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-gray-50'
                      }`}
                      disabled={newsletterStatus === 'loading'}
                    />
                    {newsletterStatus === 'success' && (
                      <CheckCircle className="absolute right-3 top-3 w-5 h-5 text-green-500" />
                    )}
                    {newsletterStatus === 'error' && (
                      <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={newsletterStatus === 'loading' || !email}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {newsletterStatus === 'loading' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </div>
                {newsletterStatus === 'success' && (
                  <p className="text-green-500 text-sm mt-2 animate-fadeIn">Successfully subscribed! 🎉</p>
                )}
                {newsletterStatus === 'error' && (
                  <p className="text-red-500 text-sm mt-2 animate-fadeIn">Something went wrong. Please try again.</p>
                )}
              </form>

              {/* Social Links */}
              <div>
                <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Follow Us</h4>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm ${social.color}`}
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} mt-12 pt-8`}>
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                © {new Date().getFullYear()} EduJobs Connect. All rights reserved.
              </div>

              <div className="flex items-center gap-6">
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-full ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-all hover:scale-110`}
                  aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                >
                  {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
                </button>

                <div className="flex flex-wrap gap-4 text-sm">
                  <Link to="/privacy" className={`${isDark ? 'text-gray-400 hover:text-primary-400' : 'text-gray-600 hover:text-primary-600'} transition-colors`}>
                    Privacy Policy
                  </Link>
                  <Link to="/terms" className={`${isDark ? 'text-gray-400 hover:text-primary-400' : 'text-gray-600 hover:text-primary-600'} transition-colors`}>
                    Terms of Service
                  </Link>
                  <Link to="/cookies" className={`${isDark ? 'text-gray-400 hover:text-primary-400' : 'text-gray-600 hover:text-primary-600'} transition-colors`}>
                    Cookie Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 z-50 flex items-center justify-center"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </>
  )
}

export default Footer