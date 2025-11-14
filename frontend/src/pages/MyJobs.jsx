import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  Briefcase, MapPin, DollarSign, Calendar, Users, Clock, Star,
  Search, Filter, Download, RefreshCw, Eye, Edit, Trash2, Plus,
  TrendingUp, TrendingDown, Building, Award, Target, MoreVertical,
  CheckCircle, XCircle, AlertCircle, BarChart3
} from 'lucide-react'
import api from '../services/api'

const MyJobs = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [selectedJob, setSelectedJob] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    filled: 0,
    closed: 0,
    totalApplicants: 0
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    filterAndSortJobs()
  }, [jobs, searchQuery, filterStatus, filterType, sortBy])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/jobs?limit=1000')
      const jobsData = response.data.jobs || generateMockJobs()
      setJobs(jobsData)
      calculateStats(jobsData)
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
      const mockJobs = generateMockJobs()
      setJobs(mockJobs)
      calculateStats(mockJobs)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (jobsData) => {
    const newStats = {
      total: jobsData.length,
      active: jobsData.filter(j => j.status === 'active').length,
      filled: jobsData.filter(j => j.status === 'filled').length,
      closed: jobsData.filter(j => j.status === 'closed').length,
      totalApplicants: jobsData.reduce((sum, j) => sum + (j.applicants || 0), 0)
    }
    setStats(newStats)
  }

  const filterAndSortJobs = () => {
    let filtered = [...jobs]

    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(job => job.status === filterStatus)
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(job => job.type === filterType)
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'title':
          return a.title.localeCompare(b.title)
        case 'applicants':
          return (b.applicants || 0) - (a.applicants || 0)
        default:
          return 0
      }
    })

    setFilteredJobs(filtered)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchJobs()
    setRefreshing(false)
  }

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await api.put(`/admin/jobs/${jobId}`, { status: newStatus })
      setJobs(jobs.map(job =>
        job._id === jobId ? { ...job, status: newStatus } : job
      ))
      alert('Job status updated successfully!')
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update status')
    }
  }

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return
    
    try {
      await api.delete(`/admin/jobs/${jobId}`)
      setJobs(jobs.filter(job => job._id !== jobId))
      alert('Job deleted successfully!')
    } catch (error) {
      console.error('Failed to delete job:', error)
      alert('Failed to delete job')
    }
  }

  const generateMockJobs = () => {
    return [
      {
        _id: '1',
        title: 'Senior Software Engineer',
        company: 'Tech Corp Rwanda',
        location: 'Kigali',
        salary: '$60,000 - $80,000',
        type: 'Full-time',
        status: 'active',
        applicants: 45,
        createdAt: new Date('2024-11-01'),
        skills: ['React', 'Node.js', 'MongoDB'],
        experience: '3-5 years'
      },
      {
        _id: '2',
        title: 'Data Analyst',
        company: 'Analytics Inc',
        location: 'Kigali',
        salary: '$40,000 - $55,000',
        type: 'Full-time',
        status: 'active',
        applicants: 32,
        createdAt: new Date('2024-11-03'),
        skills: ['Python', 'SQL', 'Excel'],
        experience: '2-4 years'
      },
      {
        _id: '3',
        title: 'Marketing Manager',
        company: 'Market Pro',
        location: 'Kigali',
        salary: '$45,000 - $65,000',
        type: 'Full-time',
        status: 'filled',
        applicants: 28,
        createdAt: new Date('2024-10-28'),
        skills: ['Digital Marketing', 'SEO', 'Content Strategy'],
        experience: '4-6 years'
      },
      {
        _id: '4',
        title: 'UI/UX Designer',
        company: 'Design Studio',
        location: 'Remote',
        salary: '$35,000 - $50,000',
        type: 'Contract',
        status: 'active',
        applicants: 18,
        createdAt: new Date('2024-11-05'),
        skills: ['Figma', 'Adobe XD', 'User Research'],
        experience: '2-3 years'
      },
      {
        _id: '5',
        title: 'DevOps Engineer',
        company: 'Cloud Systems',
        location: 'Kigali',
        salary: '$55,000 - $75,000',
        type: 'Full-time',
        status: 'closed',
        applicants: 22,
        createdAt: new Date('2024-10-20'),
        skills: ['AWS', 'Docker', 'Kubernetes'],
        experience: '3-5 years'
      }
    ]
  }

  const getStatusConfig = (status) => {
    const configs = {
      active: {
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        icon: CheckCircle,
        label: 'Active'
      },
      filled: {
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        icon: Award,
        label: 'Filled'
      },
      closed: {
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        icon: XCircle,
        label: 'Closed'
      }
    }
    return configs[status] || configs.active
  }

  const StatCard = ({ title, value, icon: Icon, color, trend, onClick }) => (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
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

  const JobCard = ({ job }) => {
    const statusConfig = getStatusConfig(job.status)
    const StatusIcon = statusConfig.icon

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{job.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Building className="w-4 h-4 mr-1" />
                  {job.company}
                </p>
              </div>
            </div>
            <div className="relative group">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button
                  onClick={() => {
                    setSelectedJob(job)
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
                  onClick={() => handleDelete(job._id)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 mr-2" />
              {job.location}
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <DollarSign className="w-4 h-4 mr-2" />
              {job.salary}
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(job.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Skills */}
          {job.skills && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {job.skills.slice(0, 3).map((skill, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-700 dark:text-gray-300">
                    {skill}
                  </span>
                ))}
                {job.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-700 dark:text-gray-300">
                    +{job.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Status and Applicants */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </span>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4 mr-1" />
              <span className="font-semibold">{job.applicants || 0}</span>
              <span className="ml-1">applicants</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            {job.status === 'active' && (
              <>
                <button
                  onClick={() => handleStatusChange(job._id, 'filled')}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Mark Filled
                </button>
                <button
                  onClick={() => handleStatusChange(job._id, 'closed')}
                  className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </>
            )}
            {job.status !== 'active' && (
              <button
                onClick={() => handleStatusChange(job._id, 'active')}
                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Reopen
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
          <p className="text-gray-600 dark:text-gray-400">Loading jobs...</p>
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
                <Briefcase className="w-8 h-8 mr-3 text-primary-600" />
                My Jobs
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Manage job postings and track applications
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
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Post Job</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Jobs"
            value={stats.total}
            icon={Briefcase}
            color="bg-blue-600"
            onClick={() => setFilterStatus('all')}
          />
          <StatCard
            title="Active Jobs"
            value={stats.active}
            icon={CheckCircle}
            color="bg-green-600"
            trend={15}
            onClick={() => setFilterStatus('active')}
          />
          <StatCard
            title="Filled Positions"
            value={stats.filled}
            icon={Award}
            color="bg-purple-600"
            onClick={() => setFilterStatus('filled')}
          />
          <StatCard
            title="Total Applicants"
            value={stats.totalApplicants}
            icon={Users}
            color="bg-orange-600"
            trend={23}
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="filled">Filled</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="title">By Title</option>
              <option value="applicants">Most Applicants</option>
            </select>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">No jobs found</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Job Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Job Title</label>
                <p className="text-gray-900 dark:text-white font-medium text-lg">{selectedJob.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Company</label>
                <p className="text-gray-900 dark:text-white">{selectedJob.company}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Location</label>
                <p className="text-gray-900 dark:text-white">{selectedJob.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Salary Range</label>
                <p className="text-gray-900 dark:text-white">{selectedJob.salary}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Job Type</label>
                <p className="text-gray-900 dark:text-white capitalize">{selectedJob.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusConfig(selectedJob.status).color}`}>
                  {selectedJob.status}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Applicants</label>
                <p className="text-gray-900 dark:text-white">{selectedJob.applicants || 0} applicants</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Required Skills</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedJob.skills?.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyJobs