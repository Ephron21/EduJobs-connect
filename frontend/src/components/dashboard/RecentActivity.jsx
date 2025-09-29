import { useState } from 'react'
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  MoreHorizontal,
  FileText,
  ExternalLink,
  Calendar,
  User
} from 'lucide-react'

const RecentActivity = () => {
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [showAllActivities, setShowAllActivities] = useState(false)

  const activities = [
    {
      id: 1,
      type: 'application',
      title: 'Applied for University of Rwanda Scholarship',
      description: 'Computer Science Program - Bachelor\'s Degree',
      date: '2 days ago',
      status: 'pending',
      priority: 'high',
      icon: FileText,
      actions: ['View Details', 'Track Status', 'Edit Application'],
      details: {
        university: 'University of Rwanda',
        program: 'Computer Science',
        deadline: '2024-01-15',
        requirements: 'Completed'
      }
    },
    {
      id: 2,
      type: 'job',
      title: 'Submitted CV for Software Developer position',
      description: 'Full-stack Developer at Tech Solutions Ltd',
      date: '1 week ago',
      status: 'reviewed',
      priority: 'medium',
      icon: User,
      actions: ['View Job', 'Check Status', 'Withdraw'],
      details: {
        company: 'Tech Solutions Ltd',
        position: 'Software Developer',
        salary: '$2,000 - $3,000',
        location: 'Kigali, Rwanda'
      }
    },
    {
      id: 3,
      type: 'consultation',
      title: 'Completed university guidance consultation',
      description: 'Career guidance session with Dr. Sarah Johnson',
      date: '2 weeks ago',
      status: 'completed',
      priority: 'low',
      icon: Calendar,
      actions: ['View Summary', 'Book Follow-up', 'Rate Session'],
      details: {
        consultant: 'Dr. Sarah Johnson',
        duration: '45 minutes',
        rating: '5 stars',
        nextSteps: 'Apply to 3 universities'
      }
    },
    {
      id: 4,
      type: 'profile',
      title: 'Updated profile information',
      description: 'Added work experience and skills',
      date: '3 weeks ago',
      status: 'completed',
      priority: 'low',
      icon: User,
      actions: ['View Profile', 'Edit Again'],
      details: {
        changes: 'Work experience, Skills',
        completeness: '85%',
        lastUpdate: '2024-01-01'
      }
    },
    {
      id: 5,
      type: 'application',
      title: 'Application deadline reminder',
      description: 'KIST Engineering Program deadline in 3 days',
      date: '4 days ago',
      status: 'urgent',
      priority: 'high',
      icon: AlertCircle,
      actions: ['Apply Now', 'Set Reminder', 'View Requirements'],
      details: {
        university: 'KIST',
        program: 'Engineering',
        deadline: '2024-01-20',
        status: 'Not Started'
      }
    }
  ]

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        icon: Clock,
        label: 'Pending'
      },
      reviewed: {
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        icon: Eye,
        label: 'Reviewed'
      },
      completed: {
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        icon: CheckCircle,
        label: 'Completed'
      },
      urgent: {
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        icon: AlertCircle,
        label: 'Urgent'
      }
    }
    return configs[status] || configs.pending
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'border-l-red-500',
      medium: 'border-l-yellow-500',
      low: 'border-l-green-500'
    }
    return colors[priority] || colors.low
  }

  const displayedActivities = showAllActivities ? activities : activities.slice(0, 3)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <div className="flex items-center space-x-2">
            <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
              Filter
            </button>
            <button 
              onClick={() => setShowAllActivities(!showAllActivities)}
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
            >
              {showAllActivities ? 'Show Less' : 'View All'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {displayedActivities.map((activity) => {
            const statusConfig = getStatusConfig(activity.status)
            const StatusIcon = statusConfig.icon
            const ActivityIcon = activity.icon

            return (
              <div
                key={activity.id}
                className={`relative p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 ${getPriorityColor(activity.priority)} hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer`}
                onClick={() => setSelectedActivity(selectedActivity === activity.id ? null : activity.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                      <ActivityIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {activity.title}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {activity.date}
                      </p>
                    </div>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Expanded Details */}
                {selectedActivity === activity.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {Object.entries(activity.details).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <p className="text-sm text-gray-900 dark:text-white mt-1">{value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activity.actions.map((action, index) => (
                        <button
                          key={index}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          {action}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Start by applying to universities or jobs
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecentActivity
