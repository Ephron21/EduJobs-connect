import { useTranslation } from 'react-i18next'
import { Target, Users, Award, Globe } from 'lucide-react'

const About = () => {
  const { t } = useTranslation()

  const stats = [
    { number: '50+', label: 'Partner Universities', icon: Globe },
    { number: '1000+', label: 'Students Helped', icon: Users },
    { number: '200+', label: 'Job Placements', icon: Award },
    { number: '95%', label: 'Success Rate', icon: Target }
  ]

  const team = [
    {
      name: 'Jean Claude Uwimana',
      role: 'Founder & CEO',
      image: '/api/placeholder/150/150',
      description: 'Educational consultant with 10+ years experience in Rwanda\'s education sector.'
    },
    {
      name: 'Marie Mukamana',
      role: 'Head of University Relations',
      image: '/api/placeholder/150/150',
      description: 'Former university admissions officer with extensive knowledge of scholarship programs.'
    },
    {
      name: 'Patrick Niyonzima',
      role: 'Career Counselor',
      image: '/api/placeholder/150/150',
      description: 'HR professional specializing in career development and job placement services.'
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              About EduJobs Connect
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We are dedicated to bridging the gap between Rwandan students and their educational and career aspirations, 
              providing comprehensive support for university applications and job opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To empower Rwandan secondary school graduates by providing comprehensive access to university opportunities, 
                scholarship information, and career guidance. We strive to make quality education and meaningful employment 
                accessible to all, regardless of economic background.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-full flex items-center justify-center mr-4">
                  <Globe className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To become Rwanda's leading platform for educational and career opportunities, creating a future where 
                every student has the tools and support needed to achieve their academic and professional goals, 
                contributing to the nation's development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Impact
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Numbers that reflect our commitment to student success
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
              Our Story
            </h2>
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                EduJobs Connect was founded in 2023 with a simple yet powerful vision: to ensure that no talented 
                Rwandan student is held back by lack of information or guidance when pursuing higher education or 
                career opportunities.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Our founders, having experienced firsthand the challenges of navigating university applications and 
                job searches, recognized the need for a centralized platform that could provide comprehensive support 
                to students across Rwanda.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Today, we work with over 50 universities locally and internationally, maintain partnerships with 
                leading employers, and have helped more than 1,000 students achieve their educational and career goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Dedicated professionals committed to your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 text-center">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Accessibility',
                description: 'Making education and career opportunities accessible to all Rwandan students, regardless of their background.'
              },
              {
                title: 'Excellence',
                description: 'Providing high-quality guidance and support to ensure the best outcomes for our students.'
              },
              {
                title: 'Integrity',
                description: 'Operating with transparency, honesty, and ethical practices in all our interactions.'
              }
            ].map((value, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
