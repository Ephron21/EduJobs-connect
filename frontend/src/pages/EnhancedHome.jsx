import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  GraduationCap, Briefcase, Users, MessageSquare, Star, ArrowRight,
  CheckCircle, Clock, Target, Award, Shield, Zap, Globe, Heart,
  Sparkles, TrendingUp, BookOpen, Building, Phone, Mail, MapPin,
  Play, Calendar, ChevronRight, ExternalLink, AlertCircle, FileText,
  Download, Eye, Bookmark
} from 'lucide-react'
import CountdownTimer, { HeroCountdown, CountdownGrid } from '../components/common/CountdownTimer'
import AIChatbot from '../components/common/AIChatbot'

const EnhancedHome = () => {
  const [homepageData, setHomepageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('universities')
  const [stats, setStats] = useState({
    universities: { count: 0, target: 50 },
    jobs: { count: 0, target: 200 },
    students: { count: 0, target: 1000 },
    successRate: { count: 0, target: 85 }
  })

  // Fetch dynamic homepage content
  useEffect(() => {
    const fetchHomepageContent = async () => {
      try {
        const response = await fetch('/api/homepage/content')
        if (response.ok) {
          const data = await response.json()
          setHomepageData(data)
          
          // Update stats with real data
          setStats(prev => ({
            universities: { ...prev.universities, target: data.statistics.universities || 50 },
            jobs: { ...prev.jobs, target: data.statistics.jobs || 200 },
            students: { ...prev.students, target: data.statistics.studentsHelped || 1000 },
            successRate: { ...prev.successRate, target: data.statistics.successRate || 85 }
          }))
        }
      } catch (error) {
        console.error('Error fetching homepage content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHomepageContent()
    
    // Refresh content every 5 minutes
    const interval = setInterval(fetchHomepageContent, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Animate counters
  useEffect(() => {
    if (!homepageData) return

    const animateCounters = () => {
      Object.keys(stats).forEach(key => {
        const target = stats[key].target
        let current = 0
        const increment = target / 100
        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            current = target
            clearInterval(timer)
          }
          setStats(prev => ({
            ...prev,
            [key]: { ...prev[key], count: Math.floor(current) }
          }))
        }, 20)
      })
    }

    const timer = setTimeout(animateCounters, 1000)
    return () => clearTimeout(timer)
  }, [homepageData])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const { content, settings } = homepageData || {}

  // Enhanced Hero Section with Dynamic Content
  const HeroSection = () => {
    const nextDeadline = content?.universities?.find(u => u.applicationCountdown && !u.applicationCountdown.expired)
    
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {settings?.hero?.title || 'Your Gateway to Education and Career Success'}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {settings?.hero?.subtitle || 'Connect with top universities and job opportunities in Rwanda'}
            </p>
          </div>

          {/* Dynamic Stats Counter */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stats.universities.count}+
              </div>
              <div className="text-blue-200">Universities</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stats.jobs.count}+
              </div>
              <div className="text-blue-200">Job Opportunities</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stats.students.count}+
              </div>
              <div className="text-blue-200">Students Helped</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stats.successRate.count}%
              </div>
              <div className="text-blue-200">Success Rate</div>
            </div>
          </div>

          {/* Next Deadline Countdown */}
          {nextDeadline && (
            <div className="mb-8">
              <HeroCountdown
                deadline={nextDeadline.admissions?.applicationDeadline}
                title={`${nextDeadline.name} Application Deadline`}
                description="Don't miss out on this opportunity!"
              />
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/universities"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              <GraduationCap className="w-5 h-5 mr-2" />
              Explore Universities
            </Link>
            <Link
              to="/jobs"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              <Briefcase className="w-5 h-5 mr-2" />
              Find Jobs
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // Interactive Services Section with Dynamic Content
  const InteractiveServicesSection = () => {
    const tabContent = {
      universities: content?.universities || [],
      jobs: content?.jobs || [],
      consulting: content?.services || []
    }

    const renderUniversityCard = (university) => (
      <div key={university._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center mb-4">
          {university.logo && (
            <img src={university.logo} alt={university.name} className="w-12 h-12 rounded-lg mr-4" />
          )}
          <div>
            <h3 className="font-semibold text-lg">{university.name}</h3>
            <p className="text-gray-600">{university.location?.city}, {university.location?.country}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">{university.programs?.length || 0}</div>
            <div className="text-sm text-blue-800">Programs</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">{university.admissions?.scholarships?.length || 0}</div>
            <div className="text-sm text-green-800">Scholarships</div>
          </div>
        </div>

        {university.admissions?.scholarships?.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-800 mb-2">Active Scholarships:</h4>
            <div className="space-y-2">
              {university.admissions.scholarships.slice(0, 2).map((scholarship, index) => (
                <div key={index} className="bg-yellow-50 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-yellow-800">{scholarship.name}</p>
                      <p className="text-sm text-yellow-700">{scholarship.type} - {scholarship.coverage}</p>
                    </div>
                    <CountdownTimer 
                      deadline={scholarship.deadline}
                      size="small"
                      showIcon={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {university.applicationCountdown && (
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-blue-800">Application Deadline</span>
              <CountdownTimer 
                deadline={university.admissions?.applicationDeadline}
                size="small"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(university.rating?.overall || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {university.rating?.overall || 0}/5
            </span>
          </div>
          <Link
            to={`/universities/${university._id}`}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            Learn More <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    )

    const renderJobCard = (job) => (
      <div key={job._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center mb-4">
          {job.company?.logo && (
            <img src={job.company.logo} alt={job.company.name} className="w-12 h-12 rounded-lg mr-4" />
          )}
          <div>
            <h3 className="font-semibold text-lg">{job.title}</h3>
            <p className="text-gray-600">{job.company?.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-sm font-medium text-green-800">Salary Range</div>
            <div className="text-lg font-bold text-green-600">
              {job.salary?.min ? `${job.salary.min.toLocaleString()} - ${job.salary.max?.toLocaleString() || ''}` : 'Competitive'}
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm font-medium text-blue-800">Type</div>
            <div className="text-lg font-bold text-blue-600 capitalize">{job.employment?.type}</div>
          </div>
        </div>

        {job.applicationCountdown && (
          <div className="bg-red-50 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-red-800">Application Deadline</span>
              <CountdownTimer 
                deadline={job.timeline?.applicationDeadline}
                size="small"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
            {job.employment?.category}
          </span>
          <Link
            to={`/jobs/${job._id}`}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            Apply Now <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    )

    const renderServiceCard = (service) => (
      <div key={service._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="mb-4">
          <h3 className="font-semibold text-lg">{service.title}</h3>
          <p className="text-gray-600">{service.shortDescription}</p>
        </div>

        <div className="mb-4">
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-sm font-medium text-purple-800">Pricing</div>
            <div className="text-lg font-bold text-purple-600">
              {service.pricing?.type === 'free' ? 'Free' : 
               service.pricing?.amount ? `${service.pricing.amount.toLocaleString()} ${service.pricing.currency}` : 'Custom'}
            </div>
          </div>
        </div>

        {service.features?.slice(0, 3).map((feature, index) => (
          <div key={index} className="flex items-center mb-2">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-sm text-gray-700">{feature.title}</span>
          </div>
        ))}

        <div className="mt-4">
          <Link
            to={`/services/${service.slug}`}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
          >
            Learn More <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    )

    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover universities, jobs, and consulting services with real-time updates and countdown timers
            </p>
          </div>

          {/* Interactive Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-lg">
              {Object.keys(tabContent).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg font-medium capitalize transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {tab === 'consulting' ? 'Consulting Services' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTab === 'universities' && tabContent.universities.map(renderUniversityCard)}
            {activeTab === 'jobs' && tabContent.jobs.map(renderJobCard)}
            {activeTab === 'consulting' && tabContent.consulting.map(renderServiceCard)}
          </div>

          {tabContent[activeTab]?.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No {activeTab} available
              </h3>
              <p className="text-gray-600">
                Check back later for new opportunities
              </p>
            </div>
          )}
        </div>
      </section>
    )
  }

  // Recent Announcements Section
  const AnnouncementsSection = () => {
    if (!content?.announcements?.length) return null

    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Latest Announcements
            </h2>
            <p className="text-xl text-gray-600">
              Stay updated with the latest news and deadlines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.announcements.slice(0, 6).map((item, index) => (
              <div key={index} className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-3">
                  <img 
                    src={item.universityLogo} 
                    alt={item.universityName}
                    className="w-8 h-8 rounded mr-3"
                  />
                  <span className="text-sm text-gray-600">{item.universityName}</span>
                </div>

                <h3 className="font-semibold text-lg mb-2">{item.announcement.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {item.announcement.content}
                </p>

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.announcement.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    item.announcement.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {item.announcement.type}
                  </span>
                  
                  {item.announcement.deadline && (
                    <CountdownTimer 
                      deadline={item.announcement.deadline}
                      size="small"
                      showIcon={false}
                    />
                  )}
                </div>

                {item.announcement.attachments?.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center text-sm text-gray-600">
                      <FileText className="w-4 h-4 mr-1" />
                      {item.announcement.attachments.length} attachment(s)
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/announcements"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Announcements
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="min-h-screen">
      <HeroSection />
      <InteractiveServicesSection />
      <AnnouncementsSection />
      
      {/* AI Chatbot */}
      <AIChatbot />

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default EnhancedHome
