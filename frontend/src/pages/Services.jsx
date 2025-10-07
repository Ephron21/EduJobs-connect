import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  GraduationCap, Briefcase, Users, MessageSquare, 
  CheckCircle, Star, ArrowRight, Clock, Target,
  Award, Shield, Zap, Globe, Heart, Sparkles,
  Play, Calendar
} from 'lucide-react'
import AIChatbot from '../components/common/AIChatbot'

const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedService, setSelectedService] = useState(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      // For now, use default services (you can implement API later)
      setServices(defaultServices)
    } catch (error) {
      console.error('Services fetch error:', error)
      setServices(defaultServices)
    } finally {
      setLoading(false)
    }
  }

  // Default services
  const defaultServices = [
    {
      _id: '1',
      title: 'University Application Support',
      slug: 'university-application-support',
      shortDescription: 'Complete guidance for university applications, scholarships, and admissions',
      description: 'Get comprehensive support for your university application journey with our expert team.',
      icon: 'graduation-cap',
      category: 'education',
      pricing: { type: 'free', amount: 0 },
      isFeatured: true,
      features: [
        { title: 'Application Review', description: 'Expert review of your applications', included: true },
        { title: 'Scholarship Guidance', description: 'Find and apply for scholarships', included: true },
        { title: 'Interview Preparation', description: 'Mock interviews and tips', included: true }
      ],
      benefits: [
        { title: 'Higher Success Rate', description: '85% of our students get accepted', icon: 'target' },
        { title: 'Expert Guidance', description: 'Professional counselors with years of experience', icon: 'award' },
        { title: 'Comprehensive Support', description: 'End-to-end application assistance', icon: 'shield' }
      ]
    },
    {
      _id: '2',
      title: 'Career Placement Services',
      slug: 'career-placement-services',
      shortDescription: 'Professional job placement and career development support',
      description: 'Find your dream job with our comprehensive career placement services.',
      icon: 'briefcase',
      category: 'career',
      pricing: { type: 'free', amount: 0 },
      isFeatured: true,
      features: [
        { title: 'Job Matching', description: 'AI-powered job recommendations', included: true },
        { title: 'Resume Building', description: 'Professional resume creation', included: true },
        { title: 'Interview Coaching', description: 'One-on-one interview preparation', included: true }
      ],
      benefits: [
        { title: 'Fast Placement', description: 'Average placement time: 30 days', icon: 'zap' },
        { title: 'Top Companies', description: 'Partnerships with leading employers', icon: 'globe' },
        { title: 'Ongoing Support', description: 'Career guidance even after placement', icon: 'heart' }
      ]
    },
    {
      _id: '3',
      title: 'Personal Consulting',
      slug: 'personal-consulting',
      shortDescription: 'One-on-one career and education consulting sessions',
      description: 'Get personalized advice from our expert consultants.',
      icon: 'users',
      category: 'consulting',
      pricing: { type: 'paid', amount: 25000, currency: 'RWF' },
      isFeatured: false,
      features: [
        { title: '1-Hour Session', description: 'Dedicated consultation time', included: true },
        { title: 'Personalized Plan', description: 'Custom roadmap for your goals', included: true },
        { title: 'Follow-up Support', description: '30 days of email support', included: true }
      ],
      benefits: [
        { title: 'Expert Advice', description: 'Industry professionals with proven track records', icon: 'award' },
        { title: 'Tailored Solutions', description: 'Solutions designed specifically for you', icon: 'target' },
        { title: 'Actionable Insights', description: 'Clear next steps and strategies', icon: 'sparkles' }
      ]
    }
  ]

  const categories = [
    { id: 'all', name: 'All Services', icon: Globe },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'career', name: 'Career', icon: Briefcase },
    { id: 'consulting', name: 'Consulting', icon: Users },
    { id: 'support', name: 'Support', icon: MessageSquare }
  ]

  const getIcon = (iconName) => {
    const icons = {
      'graduation-cap': GraduationCap,
      'briefcase': Briefcase,
      'users': Users,
      'message-square': MessageSquare,
      'target': Target,
      'award': Award,
      'shield': Shield,
      'zap': Zap,
      'globe': Globe,
      'heart': Heart,
      'sparkles': Sparkles
    }
    return icons[iconName] || Star
  }

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => service.category === activeCategory)

  const featuredServices = services.filter(service => service.isFeatured)

  if (loading) {
    return (
      // Find the main container div and add dark mode classes
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading our amazing services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium mb-6 animate-bounce">
            <Sparkles className="w-4 h-4 mr-2" />
            Comprehensive Services for Your Success
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Our Services
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            From university applications to career placement, we provide comprehensive support for your educational and professional journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            
            <button
              onClick={() => document.getElementById('services-grid').scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-xl border border-gray-200 transform hover:-translate-y-1 transition-all duration-200"
            >
              <Play className="mr-2 w-5 h-5" />
              Explore Services
            </button>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      {featuredServices.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Services
              </h2>
              <p className="text-lg text-gray-600">
                Our most popular and comprehensive services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredServices.map((service) => {
                const IconComponent = getIcon(service.icon)
                return (
                  <div
                    key={service._id}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
                    onClick={() => setSelectedService(service)}
                  >
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {service.title}
                      </h3>
                      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6">
                      {service.shortDescription}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-gray-900">
                        {service.pricing.type === 'free' ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          <span>
                            {service.pricing.amount.toLocaleString()} {service.pricing.currency}
                          </span>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Service Categories */}
      <section id="services-grid" className="py-16 bg-gray-50 dark:bg-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              All Services
            </h2>
            <p className="text-lg text-gray-600">
              Choose from our comprehensive range of services
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => {
              const IconComponent = getIcon(service.icon)
              return (
                <div
                  key={service._id}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                  onClick={() => setSelectedService(service)}
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    {service.shortDescription}
                  </p>

                  <div className="space-y-2 mb-6">
                    {service.features?.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature.title}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-gray-900">
                      {service.pricing.type === 'free' ? (
                        <span className="text-green-600">FREE</span>
                      ) : service.pricing.type === 'custom' ? (
                        <span className="text-blue-600">Custom</span>
                      ) : (
                        <span>
                          {service.pricing.amount.toLocaleString()} {service.pricing.currency}
                        </span>
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Service Details */}
      {selectedService && (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <div className="flex items-center mb-6">
                    {(() => {
                      const IconComponent = getIcon(selectedService.icon)
                      return (
                        <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mr-6">
                          <IconComponent className="w-10 h-10 text-white" />
                        </div>
                      )
                    })()}
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {selectedService.title}
                      </h2>
                      <p className="text-lg text-gray-600">
                        {selectedService.category.charAt(0).toUpperCase() + selectedService.category.slice(1)} Service
                      </p>
                    </div>
                  </div>

                  <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                    {selectedService.description}
                  </p>

                  {selectedService.benefits && selectedService.benefits.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Key Benefits</h3>
                      <div className="space-y-4">
                        {selectedService.benefits.map((benefit, index) => {
                          const BenefitIcon = getIcon(benefit.icon)
                          return (
                            <div key={index} className="flex items-start">
                              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mr-4 flex-shrink-0">
                                <BenefitIcon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                                <p className="text-gray-600">{benefit.description}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {selectedService.pricing.type === 'free' ? (
                          <span className="text-green-600">FREE</span>
                        ) : selectedService.pricing.type === 'custom' ? (
                          <span className="text-blue-600">Custom Pricing</span>
                        ) : (
                          <span>
                            {selectedService.pricing.amount.toLocaleString()} {selectedService.pricing.currency}
                          </span>
                        )}
                      </div>
                    </div>

                    {selectedService.features && selectedService.features.length > 0 && (
                      <div className="space-y-3 mb-8">
                        {selectedService.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            <div>
                              <span className="font-medium text-gray-900">{feature.title}</span>
                              {feature.description && (
                                <p className="text-sm text-gray-600">{feature.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <Link
                      to="/contact"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center transform hover:-translate-y-1 hover:shadow-lg"
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                      <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900 mb-1">24h</div>
                      <div className="text-sm text-gray-600">Response Time</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                      <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900 mb-1">4.9</div>
                      <div className="text-sm text-gray-600">Client Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  )
}

export default Services