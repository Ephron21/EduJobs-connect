import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  GraduationCap, Briefcase, Clock, CheckCircle, XCircle, AlertCircle,
  Search, Filter, Download, RefreshCw, Eye, Edit, Trash2, MoreVertical,
  TrendingUp, TrendingDown, Calendar, MapPin, DollarSign, Users,
  FileText, Send, Archive, Star, BarChart3, PieChart, Activity
} from 'lucide-react'
import api from '../services/api'

const MyApplications = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // State management
  const [applications, setApplications] = useState([])
  const [filteredApplications, setFilteredApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    approved: 0,
    rejected: 0,
    university: 0,
    job: 0,
    consultation: 0
  })

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    filterAndSortApplications()
  }, [applications, searchQuery, filterStatus, filterType, sortBy])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/applications?limit=1000')
      const apps = response.data.applications || generateMockApplications()
      setApplications(apps)
      calculateStats(apps)
    } catch (error) {
      console.error('Failed to fetch applications:', error)
      const mockApps = generateMockApplications()
      setApplications(mockApps)
      calculateStats(mockApps)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (apps) => {
    const newStats = {
      total: apps.length,
      pending: apps.filter(a => a.status === 'pending').length,
      reviewing: apps.filter(a => a.status === 'reviewing').length,
      approved: apps.filter(a => a.status === 'approved').length,
      rejected: apps.filter(a => a.status === 'rejected').length,
      university: apps.filter(a => a.type === 'university').length,
      job: apps.filter(a => a.type === 'job').length,
      consultation: apps.filter(a => a.type === 'consultation').length
    }
    setStats(newStats)
  }

  const filterAndSortApplications = () => {
    let filtered = [...applications]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(app =>
        app.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.status === filterStatus)
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(app => app.type === filterType)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'name':
          return a.studentName.localeCompare(b.studentName)
        default:
          return 0
      }
    })

    setFilteredApplications(filtered)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchApplications()
    setRefreshing(false)
  }

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.put(`/admin/applications/${applicationId}`, { status: newStatus })
      setApplications(applications.map(app =>
        app._id === applicationId ? { ...app, status: newStatus } : app
      ))
      alert('Application status updated successfully!')
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update status')
    }
  }

  const handleDelete = async (applicationId) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return
    
    try {
      await api.delete(`/admin/applications/${applicationId}`)
      setApplications(applications.filter(app => app._id !== applicationId))
      alert('Application deleted successfully!')
    } catch (error) {
      console.error('Failed to delete application:', error)
      alert('Failed to delete application')
    }
  }

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        icon: Clock,
        label: 'Pending',
        borderColor: 'border-yellow-500'
      },
      reviewing: {
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        icon: Activity,
        label: 'Reviewing',
        borderColor: 'border-blue-500'
      },
      approved: {
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        icon: CheckCircle,
        label: 'Approved',
        borderColor: 'border-green-500'
      },
      rejected: {
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        icon: XCircle,
        label: 'Rejected',
        borderColor: 'border-red-500'
      }
    }
    return configs[status] || configs.pending
  }

  const getTypeConfig = (type) => {
    const configs = {
      university: { icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900' },
      job: { icon: Briefcase, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900' },
      consultation: { icon: Users, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900' }
    }
    return configs[type] || configs.university
  }

  const generateMockApplications = () => {
    return [
      {
        _id: '1',
        studentName: 'John Doe',
        email: 'john@example.com',
        title: 'Computer Science - University of Rwanda',
        type: 'university',
        status: 'pending',
        createdAt: new Date('2024-11-01'),
        score: 85,
        experience: '2 years'
      },
      {
        _id: '2',
        studentName: 'Jane Smith',
        email: 'jane@example.com',
        title: 'Software Developer - Tech Corp',
        type: 'job',
        status: 'reviewing',
        createdAt: new Date('2024-11-03'),
        score: 92,
        experience: '3 years'
      },
      {
        _id: '3',
        studentName: 'Bob Wilson',
        email: 'bob@example.com',
        title: 'Career Guidance Session',
        type: 'consultation',
        status: 'approved',
        createdAt: new Date('2024-11-05'),
        score: 78,
        experience: '1 year'
      },
      {
        _id: '4',
        studentName: 'Alice Brown',
        email: 'alice@example.com',
        title: 'Business Administration - KIST',
        type: 'university',
        status: 'rejected',
        createdAt: new Date('2024-10-28'),
        score: 65,
        experience: '1 year'
      },
      {
        _id: '5',
        studentName: 'Charlie Davis',
        email: 'charlie@example.com',
        title: 'Data Analyst - Analytics Inc',
        type: 'job',
        status: 'approved',
        createdAt: new Date('2024-11-06'),
        score: 88,
        experience: '2 years'
      }
    ]
  }

  const StatCard = ({ title, value, icon: Icon, color, trend, onClick }) => (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${onClick ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <div className="flex items-center space-x-2 mt-2">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            {trend && (
              <span className={`text-sm flex items-center ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  const ApplicationCard = ({ application }) => {
    const statusConfig = getStatusConfig(application.status)
    const typeConfig = getTypeConfig(application.type)
    const StatusIcon = statusConfig.icon
    const TypeIcon = typeConfig.icon

    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 ${statusConfig.borderColor}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${typeConfig.bg}`}>
                <TypeIcon className={`w-5 h-5 ${typeConfig.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{application.studentName}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{application.email}</p>
              </div>
            </div>
            <div className="relative group">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button
                  onClick={() => {
                    setSelectedApplication(application)
                    setShowDetailModal(true)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2">
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(application._id)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{application.title}</h4>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(application.createdAt).toLocaleDateString()}</span>
              </div>
              {application.score && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Score: {application.score}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {application.type}
            </span>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            {application.status === 'pending' && (
              <>
                <button
                  onClick={() => handleStatusChange(application._id, 'reviewing')}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Start Review
                </button>
                <button
                  onClick={() => handleStatusChange(application._id, 'approved')}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Approve
                </button>
              </>
            )}
            {application.status === 'reviewing' && (
              <>
                <button
                  onClick={() => handleStatusChange(application._id, 'approved')}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusChange(application._id, 'rejected')}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Reject
                </button>
              </>
            )}
            {(application.status === 'approved' || application.status === 'rejected') && (
              <button
                onClick={() => handleStatusChange(application._id, 'pending')}
                className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Reset to Pending
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <FileText className="w-8 h-8 mr-3 text-primary-600" />
                My Applications
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Manage and track all student applications
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Applications"
            value={stats.total}
            icon={FileText}
            color="bg-blue-600"
            onClick={() => setFilterStatus('all')}
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={Clock}
            color="bg-yellow-600"
            trend={12}
            onClick={() => setFilterStatus('pending')}
          />
          <StatCard
            title="Approved"
            value={stats.approved}
            icon={CheckCircle}
            color="bg-green-600"
            trend={8}
            onClick={() => setFilterStatus('approved')}
          />
          <StatCard
            title="Reviewing"
            value={stats.reviewing}
            icon={Activity}
            color="bg-purple-600"
            onClick={() => setFilterStatus('reviewing')}
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="university">University</option>
              <option value="job">Job</option>
              <option value="consultation">Consultation</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="name">By Name</option>
            </select>
          </div>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">No applications found</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <ApplicationCard key={application._id} application={application} />
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Application Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Student Name</label>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedApplication.studentName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                  <p className="text-gray-900 dark:text-white">{selectedApplication.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Title</label>
                  <p className="text-gray-900 dark:text-white">{selectedApplication.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Type</label>
                  <p className="text-gray-900 dark:text-white capitalize">{selectedApplication.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusConfig(selectedApplication.status).color}`}>
                    {selectedApplication.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Applied Date</label>
                  <p className="text-gray-900 dark:text-white">{new Date(selectedApplication.createdAt).toLocaleString()}</p>
                </div>
                {selectedApplication.score && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Score</label>
                    <p className="text-gray-900 dark:text-white">{selectedApplication.score}/100</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyApplications