import { useState, useEffect } from 'react'
import { Clock, MapPin, ExternalLink, Filter } from 'lucide-react'
import Loading from '../common/Loading'

const UniversityApplications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  // Mock data for now - will be replaced with API call
  useEffect(() => {
    const mockApplications = [
      {
        id: 1,
        title: 'Full Scholarship - University of Rwanda',
        type: 'scholarship',
        university: 'University of Rwanda',
        location: 'Kigali, Rwanda',
        deadline: '2024-12-15',
        daysRemaining: 45,
        status: 'open'
      },
      {
        id: 2,
        title: 'Student Loan Program - AUCA',
        type: 'loan',
        university: 'Adventist University of Central Africa',
        location: 'Kigali, Rwanda',
        deadline: '2024-11-30',
        daysRemaining: 30,
        status: 'closing_soon'
      },
      {
        id: 3,
        title: 'Self-Paid Admission - Carnegie Mellon',
        type: 'self_paid',
        university: 'Carnegie Mellon University Africa',
        location: 'Kigali, Rwanda',
        deadline: '2024-12-31',
        daysRemaining: 60,
        status: 'open'
      }
    ]

    setTimeout(() => {
      setApplications(mockApplications)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredApplications = applications.filter(app => 
    filter === 'all' || app.type === filter
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'closing_soon': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'open': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'scholarship': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'loan': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'self_paid': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (loading) {
    return <Loading size="large" />
  }

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All Applications
        </button>
        <button
          onClick={() => setFilter('scholarship')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'scholarship'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Scholarships
        </button>
        <button
          onClick={() => setFilter('loan')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'loan'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Loans
        </button>
        <button
          onClick={() => setFilter('self_paid')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'self_paid'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Self-Paid
        </button>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApplications.map((application) => (
          <div
            key={application.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(application.type)}`}>
                {application.type.replace('_', ' ').toUpperCase()}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                {application.daysRemaining} days left
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {application.title}
            </h3>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{application.location}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">Deadline: {new Date(application.deadline).toLocaleDateString()}</span>
              </div>
            </div>

            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
              View Details
              <ExternalLink className="w-4 h-4 ml-2" />
            </button>
          </div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">
            No applications found for the selected filter.
          </p>
        </div>
      )}
    </div>
  )
}

export default UniversityApplications
