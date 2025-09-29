import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { 
  User, BookOpen, Briefcase, MessageSquare, Settings, Bell, TrendingUp,
  Calendar, Clock, CheckCircle, AlertCircle, Eye, Plus, RefreshCw, MoreHorizontal, Target, Star
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  // State management
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(updateStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    setTimeout(() => {
      setNotifications([
        { id: 1, message: 'New scholarship opportunity available', type: 'info', unread: true },
        { id: 2, message: 'Application deadline in 3 days', type: 'warning', unread: true },
        { id: 3, message: 'Interview scheduled for tomorrow', type: 'success', unread: false }
      ])
      setIsLoading(false)
    }, 1000)
  }

  const updateStats = async () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  const stats = [
    { label: 'Applications Submitted', value: '3', icon: BookOpen, color: 'text-blue-600', trend: '+15%', trendUp: true, onClick: () => navigate('/applications') },
    { label: 'Job Applications', value: '5', icon: Briefcase, color: 'text-green-600', trend: '+25%', trendUp: true, onClick: () => navigate('/jobs') },
    { label: 'Consultations', value: '2', icon: MessageSquare, color: 'text-purple-600', trend: '0%', trendUp: null, onClick: () => navigate('/consultations') },
    { label: 'Profile Completion', value: '85%', icon: User, color: 'text-orange-600', trend: '+10%', trendUp: true, onClick: () => navigate('/profile') }
  ]

  const recentActivity = [
    { id: 1, action: 'Applied for University of Rwanda Scholarship', date: '2 days ago', status: 'pending', type: 'application', priority: 'high' },
    { id: 2, action: 'Submitted CV for Software Developer position', date: '1 week ago', status: 'reviewed', type: 'job', priority: 'medium' },
    { id: 3, action: 'Completed university guidance consultation', date: '2 weeks ago', status: 'completed', type: 'consultation', priority: 'low' }
  ]

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock, label: 'Pending' },
      reviewed: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: Eye, label: 'Reviewed' },
      completed: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle, label: 'Completed' }
    }
    return configs[status] || configs.pending
  }

  const getPriorityColor = (priority) => {
    const colors = { high: 'border-l-red-500', medium: 'border-l-yellow-500', low: 'border-l-green-500' }
    return colors[priority] || colors.low
  }

  const unreadNotifications = notifications.filter(n => n.unread).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.firstName}! 👋</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Here's what's happening with your applications and profile.</p>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={updateStats} disabled={refreshing} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 relative transition-colors">
                  <Bell className="w-6 h-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                          <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>{notification.type}</span>
                            {notification.unread && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Profile views increased by 23%</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>All systems operational</span>
            </div>
          </div>
        </div>

        {/* Interactive Stats Grid with Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105" onClick={stat.onClick}>
              <div className="flex items-center">
                <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${stat.color}`}>
                  {isLoading ? <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div> : <stat.icon className="w-6 h-6" />}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.label}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {isLoading ? <div className="w-12 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div> : stat.value}
                    </p>
                    {stat.trend && !isLoading && (
                      <span className={`text-xs flex items-center ${stat.trendUp ? 'text-green-600' : stat.trendUp === false ? 'text-red-600' : 'text-gray-500'}`}>
                        {stat.trendUp && <TrendingUp className="w-3 h-3 mr-1" />}
                        {stat.trend}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                  <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium">View All</button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const statusConfig = getStatusConfig(activity.status)
                    const StatusIcon = statusConfig.icon
                    const isSelected = selectedActivity === activity.id
                    return (
                      <div key={activity.id} className={`p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 ${getPriorityColor(activity.priority)} cursor-pointer transition-all duration-200 ${isSelected ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-100 dark:hover:bg-gray-600'}`} onClick={() => setSelectedActivity(isSelected ? null : activity.id)}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig.label}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.date} • {activity.type}</p>
                          </div>
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </div>
                        {isSelected && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex space-x-2">
                              <button className="px-3 py-1 text-xs bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">View Details</button>
                              <button className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Track Status</button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Smart Profile Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Complete Your Profile</h3>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">2/5 Steps</span>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span>Profile Completion</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 relative" style={{ width: '85%' }}>
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Good progress! Complete a few more sections.</p>
              <button onClick={() => navigate('/profile')} className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">Complete Profile</button>
            </div>

            {/* Advanced Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
                <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium">View All</button>
              </div>
              <div className="space-y-3">
                {[
                  { icon: BookOpen, label: 'Browse Universities', desc: '50+ Universities', route: '/universities' },
                  { icon: Briefcase, label: 'Find Jobs', desc: '120+ Jobs', route: '/jobs' },
                  { icon: MessageSquare, label: 'Request Consultation', desc: 'Free Session', route: '/consultations' },
                  { icon: Settings, label: 'Account Settings', desc: 'Profile & Privacy', route: '/settings' }
                ].map((action, index) => (
                  <button key={index} onClick={() => navigate(action.route)} className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <action.icon className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 group-hover:scale-110 transition-transform" />
                        <div>
                          <span className="text-gray-900 dark:text-white font-medium">{action.label}</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{action.desc}</p>
                        </div>
                      </div>
                      <Plus className="w-4 h-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Dynamic Sections */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Deadlines */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              Upcoming Deadlines
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">KIST Engineering Application</p>
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Due in 3 days
                  </p>
                </div>
                <button className="text-xs bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors">Apply Now</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Software Developer Interview</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Tomorrow at 2:00 PM
                  </p>
                </div>
                <button className="text-xs bg-yellow-600 text-white px-3 py-1 rounded-md hover:bg-yellow-700 transition-colors">Prepare</button>
              </div>
            </div>
          </div>

          {/* Personalized Recommendations */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              Recommended for You
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Computer Science Scholarship</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Based on your profile and interests</p>
                <button className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-2 hover:underline">Learn More →</button>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors cursor-pointer">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">Junior Developer Position</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">Perfect match for your skills</p>
                <button className="text-xs text-green-600 dark:text-green-400 font-medium mt-2 hover:underline">Apply Now →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard