import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, GraduationCap, Briefcase, Users } from 'lucide-react'
import axios from 'axios'

const HeroSection = () => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/homepage/content')
      setSettings(response.data.settings)
    } catch (error) {
      console.error('Failed to fetch homepage settings:', error)
      // Use default settings if fetch fails
      setSettings({
        hero: {
          title: 'Your Gateway to Education and Career Success',
          subtitle: 'Connect with top universities and job opportunities in Rwanda',
          ctaText: 'Get Started',
          ctaLink: '/login'
        },
        stats: {
          universities: { number: '50+', label: 'Universities' },
          jobs: { number: '200+', label: 'Job Opportunities' },
          students: { number: '1000+', label: 'Students Helped' }
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const getIconComponent = (category) => {
    const icons = {
      universities: GraduationCap,
      jobs: Briefcase,
      students: Users
    }
    return icons[category] || Users
  }

  const getIconColor = (category) => {
    const colors = {
      universities: 'text-blue-600',
      jobs: 'text-green-600',
      students: 'text-purple-600'
    }
    return colors[category] || 'text-gray-600'
  }

  if (loading) {
    return (
      <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-secondary-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="block">{settings?.hero?.title || 'Your Gateway to Education and Career Success'}</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            {settings?.hero?.subtitle || 'Connect with top universities and job opportunities in Rwanda'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to={settings?.hero?.ctaLink || '/login'}
              className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {settings?.hero?.ctaText || 'Get Started'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            
            <Link
              to="/about"
              className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {settings?.stats && Object.entries(settings.stats).map(([category, stat]) => {
              const IconComponent = getIconComponent(category)
              const iconColor = getIconColor(category)
              
              return (
                <div
                  key={category}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 ${iconColor}`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection