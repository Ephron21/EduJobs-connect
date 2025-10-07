import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Target, Users, Award, Globe, Heart, Sparkles, ArrowRight,
  CheckCircle, Star, Zap, Shield, BookOpen, Building, Lightbulb,
  TrendingUp, Mail, ExternalLink
} from 'lucide-react'
import EduJobsLogo from '../components/common/EduJobsLogo'
import AIChatbot from '../components/common/AIChatbot'

const About = () => {
  const [stats, setStats] = useState({
    universities: { count: 0, target: 50 },
    students: { count: 0, target: 1000 },
    placements: { count: 0, target: 200 },
    successRate: { count: 0, target: 95 }
  })

  useEffect(() => {
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

  const statsData = [
    { number: `${stats.universities.count}+`, label: 'Partner Universities', icon: Globe, color: 'from-blue-500 to-blue-600' },
    { number: `${stats.students.count}+`, label: 'Students Helped', icon: Users, color: 'from-green-500 to-green-600' },
    { number: `${stats.placements.count}+`, label: 'Job Placements', icon: Award, color: 'from-purple-500 to-purple-600' },
    { number: `${stats.successRate.count}%`, label: 'Success Rate', icon: Target, color: 'from-orange-500 to-orange-600' }
  ]

  const team = [
    {
      name: 'Jean Claude Uwimana',
      role: 'Founder & CEO',
      avatar: '👨‍💼',
      description: 'Educational consultant with 10+ years experience in Rwanda\'s education sector.',
      expertise: ['Education Policy', 'Strategic Planning', 'Leadership'],
      achievements: '500+ students guided'
    },
    {
      name: 'Marie Mukamana',
      role: 'Head of University Relations',
      avatar: '👩‍🎓',
      description: 'Former university admissions officer with extensive scholarship knowledge.',
      expertise: ['University Partnerships', 'Scholarships', 'Admissions'],
      achievements: '50+ partnerships'
    },
    {
      name: 'Patrick Niyonzima',
      role: 'Career Counselor',
      avatar: '👨‍💻',
      description: 'HR professional specializing in career development and job placement.',
      expertise: ['Career Counseling', 'Job Placement', 'Skills Development'],
      achievements: '200+ placements'
    }
  ]

  const values = [
    { title: 'Accessibility', description: 'Making education accessible to all Rwandan students.', icon: Heart, color: 'from-pink-500 to-pink-600' },
    { title: 'Excellence', description: 'Providing high-quality guidance for best outcomes.', icon: Star, color: 'from-yellow-500 to-yellow-600' },
    { title: 'Integrity', description: 'Operating with transparency and ethical practices.', icon: Shield, color: 'from-green-500 to-green-600' },
    { title: 'Innovation', description: 'Continuously improving with modern technology.', icon: Lightbulb, color: 'from-blue-500 to-blue-600' }
  ]

  const milestones = [
    { year: '2023', title: 'EduJobs Connect Founded', description: 'Started with a vision to bridge the education-career gap', icon: Building },
    { year: '2023', title: 'First Partnerships', description: 'Established partnerships with 10 leading universities', icon: BookOpen },
    { year: '2024', title: '1000+ Students', description: 'Successfully helped over 1000 students achieve goals', icon: Users },
    { year: '2024', title: 'Platform Modernization', description: 'Launched AI-powered platform with enhanced UX', icon: Zap }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        </div>
        
        <div className="text-center mb-16">
          {/* <EduJobsLogo size="xl" animated={true} className="mb-8" /> */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About EduJobs Connect
          </h1>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium mb-6 animate-bounce">
            <Sparkles className="w-4 h-4 mr-2" />
            Empowering Rwanda's Future Leaders
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              About EduJobs Connect
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Bridging the gap between Rwandan students and their educational and career aspirations with comprehensive support.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
              Join Our Mission
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/services" className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1 transition-all duration-200">
              Our Services
              <ExternalLink className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Animated Statistics */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact in Numbers</h2>
            <p className="text-lg text-gray-600">Real results that reflect our commitment</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`bg-gradient-to-r ${stat.color} rounded-2xl p-6 mb-4 group-hover:scale-105 transition-transform duration-300`}>
                  <stat.icon className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white">{stat.number}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50 dark:bg-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                To empower Rwandan secondary school graduates by providing comprehensive access to university opportunities, 
                scholarship information, and career guidance accessible to all.
              </p>
              <div className="mt-6 flex items-center text-blue-600 font-medium">
                <CheckCircle className="w-5 h-5 mr-2" />
                Empowering through education
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                To become Rwanda's leading platform for educational and career opportunities, creating a future where 
                every student has the tools needed to achieve their goals.
              </p>
              <div className="mt-6 flex items-center text-purple-600 font-medium">
                <CheckCircle className="w-5 h-5 mr-2" />
                Building Rwanda's future
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600">Key milestones in our mission</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <milestone.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{milestone.year}</div>
                <div className="text-lg font-semibold text-blue-600 mb-2">{milestone.title}</div>
                <p className="text-gray-600 text-sm">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50 dark:bg-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">Dedicated professionals committed to your success</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center transform hover:-translate-y-2 transition-all duration-300">
                <div className="text-6xl mb-6">{member.avatar}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-600 mb-6 leading-relaxed">{member.description}</p>
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-900 mb-2">Expertise:</div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.map((skill, skillIndex) => (
                      <span key={skillIndex} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-green-600 font-medium">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  {member.achievements}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${value.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl text-blue-100 mb-8">Be part of Rwanda's educational transformation.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
              <Mail className="mr-2 w-5 h-5" />
              Get in Touch
            </Link>
            <Link to="/services" className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transform hover:-translate-y-1 transition-all duration-200">
              <Sparkles className="mr-2 w-5 h-5" />
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      <AIChatbot />
    </div>
  )
}

export default About