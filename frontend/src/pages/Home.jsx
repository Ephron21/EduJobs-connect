
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  GraduationCap, Briefcase, Users, MessageSquare, Star, ArrowRight,
  CheckCircle, Clock, Target, Award, Shield, Zap, Globe, Heart,
  Sparkles, TrendingUp, BookOpen, Building, Phone, Mail, MapPin,
  Play, Calendar, ChevronRight, ExternalLink
} from 'lucide-react'

import HeroSection from '../components/sections/HeroSection'
import FeaturesSection from '../components/sections/FeaturesSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import AIChatbot from '../components/common/AIChatbot'
import api from '../services/api'

const Home = () => {
  const [stats, setStats] = useState({
    universities: { count: 0, target: 50 },
    jobs: { count: 0, target: 200 },
    students: { count: 0, target: 1000 },
    placements: { count: 0, target: 85 }
  })
  const [isVisible, setIsVisible] = useState({})
  const [activeTab, setActiveTab] = useState('universities')
  const [featuredUniversities, setFeaturedUniversities] = useState([])

  useEffect(() => {
    fetchFeaturedUniversities()
  }, [])

  const fetchFeaturedUniversities = async () => {
    try {
      const response = await api.get('/universities?featured=true&limit=3')
      if (response.data) {
        const data = response.data
        const transformedUniversities = data.universities.map(uni => ({
          id: uni._id,
          name: uni.name,
          logo: uni.logo || '🎓',
          programs: uni.programs?.length || 25,
          scholarships: uni.admissions?.scholarships?.length || 8,
          rating: uni.rating?.overall || 4.7,
          description: uni.description,
          location: uni.location?.city || 'Kigali',
          tuition: 'From 500,000 RWF/year',
          deadline: uni.admissions?.applicationDeadline ?
            new Date(uni.admissions.applicationDeadline).toLocaleDateString() : '2024-03-15'
        }))
        setFeaturedUniversities(transformedUniversities)
      } else {
        // Fallback to static data
        setFeaturedUniversities([
          {
            id: 1,
            name: 'University of Rwanda',
            logo: '🎓',
            programs: 45,
            scholarships: 12,
            rating: 4.8,
            description: 'Leading public university with comprehensive programs',
            location: 'Kigali, Rwanda',
            tuition: 'From 500,000 RWF/year',
            deadline: '2024-03-15'
          },
          {
            id: 2,
            name: 'African Leadership University',
            logo: '🏛️',
            programs: 25,
            scholarships: 8,
            rating: 4.9,
            description: 'Innovative university focused on leadership development',
            location: 'Kigali, Rwanda',
            tuition: 'From 2,500,000 RWF/year',
            deadline: '2024-04-01'
          },
          {
            id: 3,
            name: 'KIST - Kigali Institute of Science',
            logo: '🔬',
            programs: 30,
            scholarships: 15,
            rating: 4.7,
            description: 'Premier institution for science and technology',
            location: 'Kigali, Rwanda',
            tuition: 'From 800,000 RWF/year',
            deadline: '2024-03-30'
          }
        ])
      }
    } catch (error) {
      console.error('Failed to fetch featured universities:', error)
      // Fallback to static data
      setFeaturedUniversities([
        {
          id: 1,
          name: 'University of Rwanda',
          logo: '🎓',
          programs: 45,
          scholarships: 12,
          rating: 4.8,
          description: 'Leading public university with comprehensive programs',
          location: 'Kigali, Rwanda',
          tuition: 'From 500,000 RWF/year',
          deadline: '2024-03-15'
        },
        {
          id: 2,
          name: 'African Leadership University',
          logo: '🏛️',
          programs: 25,
          scholarships: 8,
          rating: 4.9,
          description: 'Innovative university focused on leadership development',
          location: 'Kigali, Rwanda',
          tuition: 'From 2,500,000 RWF/year',
          deadline: '2024-04-01'
        },
        {
          id: 3,
          name: 'KIST - Kigali Institute of Science',
          logo: '🔬',
          programs: 30,
          scholarships: 15,
          rating: 4.7,
          description: 'Premier institution for science and technology',
          location: 'Kigali, Rwanda',
          tuition: 'From 800,000 RWF/year',
          deadline: '2024-03-30'
        }
      ])
    }
  }

  useEffect(() => {
    // Animate counters
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
  }, [])

  const featuredJobs = [
    {
      id: 1,
      title: 'Software Developer',
      company: 'Tech Rwanda Ltd',
      logo: '💻',
      location: 'Kigali, Rwanda',
      type: 'Full-time',
      salary: '800,000 - 1,200,000 RWF',
      experience: '2-4 years',
      skills: ['React', 'Node.js', 'MongoDB'],
      posted: '2 days ago',
      applicants: 45
    },
    {
      id: 2,
      title: 'Marketing Manager',
      company: 'Rwanda Development Bank',
      logo: '🏦',
      location: 'Kigali, Rwanda',
      type: 'Full-time',
      salary: '1,000,000 - 1,500,000 RWF',
      experience: '3-5 years',
      skills: ['Digital Marketing', 'Strategy', 'Analytics'],
      posted: '1 week ago',
      applicants: 32
    },
    {
      id: 3,
      title: 'Data Analyst',
      company: 'NISR - National Institute',
      logo: '📊',
      location: 'Kigali, Rwanda',
      type: 'Full-time',
      salary: '600,000 - 900,000 RWF',
      experience: '1-3 years',
      skills: ['Python', 'SQL', 'Tableau'],
      posted: '3 days ago',
      applicants: 28
    }
  ]

  const consultingServices = [
    {
      id: 1,
      title: 'Career Counseling',
      icon: Target,
      description: 'Personalized career guidance and planning',
      duration: '1 hour',
      price: 'Free',
      features: ['Career Assessment', 'Goal Setting', 'Action Plan'],
      rating: 4.9,
      sessions: 150
    },
    {
      id: 2,
      title: 'CV & Resume Writing',
      icon: Award,
      description: 'Professional CV creation and optimization',
      duration: '2-3 days',
      price: '25,000 RWF',
      features: ['ATS Optimization', 'Industry Specific', 'Cover Letter'],
      rating: 4.8,
      sessions: 200
    },
    {
      id: 3,
      title: 'Interview Preparation',
      icon: MessageSquare,
      description: 'Mock interviews and coaching sessions',
      duration: '1.5 hours',
      price: '30,000 RWF',
      features: ['Mock Interview', 'Feedback', 'Tips & Strategies'],
      rating: 4.9,
      sessions: 120
    }
  ]

  const successStories = [
    {
      id: 1,
      name: 'Marie Uwimana',
      achievement: 'Got scholarship to University of Rwanda',
      image: '👩‍🎓',
      story: 'Thanks to EduJobs Connect, I received a full scholarship for my Computer Science degree.',
      program: 'Computer Science',
      year: '2024'
    },
    {
      id: 2,
      name: 'Jean Baptiste',
      achievement: 'Landed Software Developer job',
      image: '👨‍💻',
      story: 'Found my dream job as a Software Developer within 2 weeks of using the platform.',
      company: 'Tech Rwanda Ltd',
      salary: '1,000,000 RWF'
    },
    {
      id: 3,
      name: 'Grace Mukamana',
      achievement: 'Promoted to Team Lead',
      image: '👩‍💼',
      story: 'The career counseling helped me get promoted to Team Lead in just 6 months.',
      company: 'Rwanda Development Bank',
      promotion: 'Team Lead'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Hero Section */}
      <HeroSection />
     

      {/* Dynamic Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 mb-4 group-hover:scale-105 transition-transform duration-300">
                <GraduationCap className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-3xl font-bold text-white">{stats.universities.count}+</div>
                <div className="text-blue-100 text-sm">Universities</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 mb-4 group-hover:scale-105 transition-transform duration-300">
                <Briefcase className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-3xl font-bold text-white">{stats.jobs.count}+</div>
                <div className="text-green-100 text-sm">Job Opportunities</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 mb-4 group-hover:scale-105 transition-transform duration-300">
                <Users className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-3xl font-bold text-white">{stats.students.count}+</div>
                <div className="text-purple-100 text-sm">Students Helped</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 mb-4 group-hover:scale-105 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-3xl font-bold text-white">{stats.placements.count}%</div>
                <div className="text-orange-100 text-sm">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <FeaturesSection />

      {/* Interactive Services Showcase */}
      <section className="py-16 bg-gray-50 dark:bg-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Explore Our Services
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose what interests you most and get started on your journey
            </p>
          </div>

          {/* Service Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { id: 'universities', name: 'Universities', icon: GraduationCap },
              { id: 'jobs', name: 'Jobs', icon: Briefcase },
              { id: 'consulting', name: 'Consulting', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Universities Tab */}
          {activeTab === 'universities' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredUniversities.map((university) => (
                <div
                  key={university.id}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  <div className="flex items-center mb-6">
                    <div className="text-4xl mr-4">{university.logo}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {university.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {university.location}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{university.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{university.programs}</div>
                      <div className="text-xs text-blue-600">Programs</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{university.scholarships}</div>
                      <div className="text-xs text-green-600">Scholarships</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{university.rating}</span>
                    </div>
                    <div className="text-sm text-gray-600">{university.tuition}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Deadline: {university.deadline}
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  <div className="flex items-center mb-6">
                    <div className="text-4xl mr-4">{job.logo}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {job.title}
                      </h3>
                      <div className="text-sm text-gray-600">{job.company}</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{job.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{job.type}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Salary:</span>
                      <span className="font-medium text-green-600">{job.salary}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium">{job.experience}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-2">Required Skills:</div>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {job.applicants} applicants • {job.posted}
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Consulting Tab */}
          {activeTab === 'consulting' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {consultingServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 mb-6">{service.description}</p>

                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-gray-900">{service.price}</div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      {service.rating}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {service.sessions} sessions completed
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              View All Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real achievements from students and professionals who used our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <div
                key={story.id}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-6">
                  <div className="text-4xl mr-4">{story.image}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {story.name}
                    </h3>
                    <div className="text-sm text-green-600 font-medium">
                      ✓ {story.achievement}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 italic">"{story.story}"</p>

                <div className="space-y-2 text-sm text-gray-600">
                  {story.program && (
                    <div><strong>Program:</strong> {story.program}</div>
                  )}
                  {story.company && (
                    <div><strong>Company:</strong> {story.company}</div>
                  )}
                  {story.salary && (
                    <div><strong>Salary:</strong> {story.salary}</div>
                  )}
                  {story.year && (
                    <div><strong>Year:</strong> {story.year}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <TestimonialsSection />

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students and professionals who have achieved their dreams with EduJobs Connect
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              
              <Link
                to="/services"
                className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transform hover:-translate-y-1 transition-all duration-200"
              >
                Explore Services
                <ExternalLink className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  )
}

export default Home