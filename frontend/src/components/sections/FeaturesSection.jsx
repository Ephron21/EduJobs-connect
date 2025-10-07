import { useState, useEffect } from 'react'
import { GraduationCap, Briefcase, Users, Star, Award } from 'lucide-react'
import axios from 'axios'

const FeaturesSection = () => {
  const [features, setFeatures] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeatures()
  }, [])

  const fetchFeatures = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/homepage/content')
      const enabledFeatures = response.data.settings.features?.filter(f => f.enabled) || []
      setFeatures(enabledFeatures)
    } catch (error) {
      console.error('Failed to fetch features:', error)
      // Fallback to default features
      setFeatures([
        {
          title: 'University Applications',
          description: 'Find and apply to universities across Rwanda',
          icon: 'graduation-cap',
          enabled: true
        },
        {
          title: 'Job Opportunities',
          description: 'Discover career opportunities that match your skills',
          icon: 'briefcase',
          enabled: true
        },
        {
          title: 'Career Guidance',
          description: 'Get expert advice on your career path',
          icon: 'users',
          enabled: true
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (iconName) => {
    const icons = {
      'graduation-cap': GraduationCap,
      'briefcase': Briefcase,
      'users': Users,
      'star': Star,
      'award': Award
    }
    return icons[iconName] || Star
  }

  if (loading || features.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose EduJobs Connect?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need to succeed in your educational and career journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = getIcon(feature.icon)
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mx-auto mb-6">
                  <IconComponent className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection