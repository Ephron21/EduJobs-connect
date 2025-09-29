import { useState, useEffect } from 'react'
import { Briefcase, MapPin, Clock, Building, ExternalLink } from 'lucide-react'
import Loading from '../common/Loading'

const JobVacancies = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock data for now - will be replaced with API call
  useEffect(() => {
    const mockJobs = [
      {
        id: 1,
        title: 'Software Developer',
        company: 'Rwanda ICT Chamber',
        location: 'Kigali, Rwanda',
        type: 'full_time',
        category: 'Technology',
        deadline: '2024-11-25',
        salary: '500,000 - 800,000 RWF',
        description: 'Join our team as a software developer working on innovative projects...'
      },
      {
        id: 2,
        title: 'Marketing Intern',
        company: 'Bank of Kigali',
        location: 'Kigali, Rwanda',
        type: 'internship',
        category: 'Marketing',
        deadline: '2024-12-01',
        salary: '150,000 RWF',
        description: 'Exciting internship opportunity in digital marketing...'
      },
      {
        id: 3,
        title: 'Data Analyst',
        company: 'MTN Rwanda',
        location: 'Kigali, Rwanda',
        type: 'contract',
        category: 'Analytics',
        deadline: '2024-11-30',
        salary: '600,000 - 900,000 RWF',
        description: 'Analyze data to drive business insights and decisions...'
      }
    ]

    setTimeout(() => {
      setJobs(mockJobs)
      setLoading(false)
    }, 1000)
  }, [])

  const getTypeColor = (type) => {
    switch (type) {
      case 'full_time': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'part_time': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'contract': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'internship': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (loading) {
    return <Loading size="large" />
  }

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search jobs by title, company, or keyword..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <select className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <option value="">All Categories</option>
            <option value="technology">Technology</option>
            <option value="marketing">Marketing</option>
            <option value="finance">Finance</option>
            <option value="healthcare">Healthcare</option>
            <option value="education">Education</option>
          </select>
          <select className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <option value="">All Types</option>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {job.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(job.type)}`}>
                    {job.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300 text-sm">
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    <span>{job.category}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 md:ml-6">
                <div className="text-right">
                  <div className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">
                    {job.salary}
                  </div>
                  <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center">
                    Apply Now
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {job.description}
            </p>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-8">
        <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg font-medium transition-colors">
          Load More Jobs
        </button>
      </div>
    </div>
  )
}

export default JobVacancies
