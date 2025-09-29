import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { 
  Users, GraduationCap, Briefcase, MessageSquare, Settings, BarChart3, FileText, Shield,
  TrendingUp, TrendingDown, Activity, Database, Mail, HardDrive, Globe, Calendar,
  Plus, Search, Filter, Download, Eye, Edit, Trash2, CheckCircle, XCircle, Clock,
  AlertTriangle, RefreshCw, MapPin, Building, DollarSign, Star, Bell, Home,
  Image, Type, Layout, Palette, Monitor, Save, Upload, X, Lock, Key, User
} from 'lucide-react'
import api from '../services/api'

const AdminDashboard = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    users: 0, universities: 0, jobs: 0, applications: 0, consultations: 0, growth: {},
    recentUsers: [], pendingConsultations: 0
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [systemHealth, setSystemHealth] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedItems, setSelectedItems] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [editingItem, setEditingItem] = useState(null)

  // Data states for different tabs
  const [users, setUsers] = useState([])
  const [universities, setUniversities] = useState([])
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [homepageSettings, setHomepageSettings] = useState({
    heroTitle: 'Welcome to EduJobs Connect',
    heroSubtitle: 'Your gateway to education and career opportunities in Rwanda',
    heroImage: '',
    features: [],
    testimonials: []
  })

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (activeTab !== 'overview') {
      fetchTabData(activeTab)
    }
  }, [activeTab])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, healthResponse] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/health')
      ])
      setStats(statsResponse.data.stats || mockStats)
      setSystemHealth(healthResponse.data.health || {})
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      // Mock data for development
      setStats(mockStats)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const mockStats = {
    users: 142, universities: 28, jobs: 87, applications: 234, consultations: 45,
    growth: { users: 15, universities: 8, jobs: 22, applications: 18 },
    recentUsers: [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', createdAt: new Date(), role: 'Student', status: 'active' },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', createdAt: new Date(), role: 'Student', status: 'active' },
      { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', createdAt: new Date(), role: 'Employer', status: 'active' }
    ],
    pendingConsultations: 12
  }

  const fetchTabData = async (tab) => {
    setLoading(true)
    try {
      let response
      switch(tab) {
        case 'users':
          response = await api.get('/admin/users')
          setUsers(response.data.users || mockUsers)
          break
        case 'universities':
          response = await api.get('/admin/universities')
          setUniversities(response.data.universities || mockUniversities)
          break
        case 'jobs':
          response = await api.get('/admin/jobs')
          setJobs(response.data.jobs || mockJobs)
          break
        case 'applications':
          response = await api.get('/admin/applications')
          setApplications(response.data.applications || mockApplications)
          break
        case 'homepage':
          response = await api.get('/admin/homepage')
          setHomepageSettings(response.data.settings || homepageSettings)
          break
      }
    } catch (error) {
      console.error(`Failed to fetch ${tab} data:`, error)
      // Load mock data on error
      if (tab === 'users') setUsers(mockUsers)
      if (tab === 'universities') setUniversities(mockUniversities)
      if (tab === 'jobs') setJobs(mockJobs)
      if (tab === 'applications') setApplications(mockApplications)
    } finally {
      setLoading(false)
    }
  }

  const mockUsers = [
    { id: 1, firstName: 'Alice', lastName: 'Williams', email: 'alice@example.com', role: 'Student', status: 'active', createdAt: '2024-01-15' },
    { id: 2, firstName: 'David', lastName: 'Brown', email: 'david@example.com', role: 'Employer', status: 'active', createdAt: '2024-02-20' },
    { id: 3, firstName: 'Emma', lastName: 'Davis', email: 'emma@example.com', role: 'Student', status: 'inactive', createdAt: '2024-03-10' }
  ]

  const mockUniversities = [
    { id: 1, name: 'University of Rwanda', location: 'Kigali', programs: 45, rating: 4.5, logo: '' },
    { id: 2, name: 'KIST', location: 'Kigali', programs: 32, rating: 4.3, logo: '' },
    { id: 3, name: 'ALU', location: 'Kigali', programs: 28, rating: 4.7, logo: '' }
  ]

  const mockJobs = [
    { id: 1, title: 'Software Developer', company: 'Tech Corp', location: 'Kigali', salary: '$50k-70k', type: 'Full-time', status: 'active', applicants: 23 },
    { id: 2, title: 'Data Analyst', company: 'Data Inc', location: 'Kigali', salary: '$40k-60k', type: 'Full-time', status: 'active', applicants: 15 },
    { id: 3, title: 'Marketing Manager', company: 'Market Pro', location: 'Kigali', salary: '$45k-65k', type: 'Full-time', status: 'inactive', applicants: 8 }
  ]

  const mockApplications = [
    { id: 1, studentName: 'John Doe', email: 'john@example.com', university: 'University of Rwanda', status: 'pending', createdAt: '2024-09-15' },
    { id: 2, studentName: 'Jane Smith', email: 'jane@example.com', jobTitle: 'Software Developer', status: 'reviewing', createdAt: '2024-09-20' },
    { id: 3, studentName: 'Bob Wilson', email: 'bob@example.com', university: 'KIST', status: 'approved', createdAt: '2024-09-25' }
  ]

  const handleRefresh = () => {
    setRefreshing(true)
    if (activeTab === 'overview') {
      fetchDashboardData()
    } else {
      fetchTabData(activeTab)
    }
  }

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    try {
      await api.delete(`/admin/${type}/${id}`)
      fetchTabData(activeTab)
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedItems.length} items?`)) return
    try {
      await api.post(`/admin/${activeTab}/bulk-delete`, { ids: selectedItems })
      setSelectedItems([])
      fetchTabData(activeTab)
    } catch (error) {
      console.error('Bulk delete failed:', error)
    }
  }

  const openModal = (type, item = null) => {
    setModalType(type)
    setEditingItem(item)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalType('')
    setEditingItem(null)
  }

  const handleSaveItem = async (formData) => {
    try {
      if (editingItem) {
        await api.put(`/admin/${activeTab}/${editingItem.id}`, formData)
      } else {
        await api.post(`/admin/${activeTab}`, formData)
      }
      closeModal()
      fetchTabData(activeTab)
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color, change, onClick }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${onClick ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : ''}`} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {loading ? <div className="w-16 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div> : value}
          </p>
          {change !== undefined && !loading && (
            <div className="flex items-center mt-2">
              {change > 0 ? <TrendingUp className="h-4 w-4 text-green-500 mr-1" /> : change < 0 ? <TrendingDown className="h-4 w-4 text-red-500 mr-1" /> : null}
              <p className={`text-sm ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                {change > 0 ? '+' : ''}{change}% from last month
              </p>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color} relative`}>
          <Icon className="h-6 w-6 text-white" />
          {loading && <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>}
        </div>
      </div>
    </div>
  )

  const TabButton = ({ id, label, icon: Icon, count }) => (
    <button onClick={() => setActiveTab(id)} className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === id ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 shadow-sm' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
      <Icon className="h-4 w-4 mr-2" />
      {label}
      {count !== undefined && (
        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${activeTab === id ? 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200' : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'}`}>
          {count}
        </span>
      )}
    </button>
  )

  const Modal = ({ children, title, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )

  const OverviewTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">System Overview</h3>
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-green-500 animate-pulse" />
            <span className="text-sm text-green-600 dark:text-green-400">Real-time monitoring</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Database Status</h4>
              <Database className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700 dark:text-blue-300">Connection</span>
                <span className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700 dark:text-blue-300">Response Time</span>
                <span className="text-sm text-blue-900 dark:text-blue-100">12ms</span>
              </div>
            </div>
          </div>
  
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-green-900 dark:text-green-100">Email Service</h4>
              <Mail className="h-5 w-5 text-green-600" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700 dark:text-green-300">Status</span>
                <span className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700 dark:text-green-300">Queue</span>
                <span className="text-sm text-green-900 dark:text-green-100">3 pending</span>
              </div>
            </div>
          </div>
  
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-yellow-900 dark:text-yellow-100">File Storage</h4>
              <HardDrive className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-700 dark:text-yellow-300">Usage</span>
                <span className="flex items-center text-yellow-600">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  85% Full
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-700 dark:text-yellow-300">Available</span>
                <span className="text-sm text-yellow-900 dark:text-yellow-100">2.1 GB</span>
              </div>
            </div>
          </div>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              Recent Users
            </h4>
            <div className="space-y-3">
              {stats.recentUsers?.slice(0, 5).map((user, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.firstName?.[0] || 'U'}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )) || [1,2,3].map(i => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg animate-pulse">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="ml-3 space-y-1">
                      <div className="w-20 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      <div className="w-32 h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
              Quick Stats
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-blue-500 mr-3" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Active Sessions</span>
                </div>
                <span className="text-lg font-bold text-blue-600">24</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Today's Signups</span>
                </div>
                <span className="text-lg font-bold text-green-600">8</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-purple-500 mr-3" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Pending Reviews</span>
                </div>
                <span className="text-lg font-bold text-purple-600">{stats.pendingConsultations || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const UsersTab = () => {
    const filteredUsers = users.filter(user => 
      (searchTerm === '' || user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === 'all' || user.status === filterStatus)
    )

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div className="flex gap-2">
            {selectedItems.length > 0 && (
              <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedItems.length})
              </button>
            )}
            <button onClick={() => openModal('user')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </button>
            <button onClick={() => {/* Export */}} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input type="checkbox" className="rounded" onChange={(e) => setSelectedItems(e.target.checked ? filteredUsers.map(u => u.id) : [])} />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <input type="checkbox" checked={selectedItems.includes(user.id)} onChange={(e) => setSelectedItems(e.target.checked ? [...selectedItems, user.id] : selectedItems.filter(id => id !== user.id))} className="rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {user.role || 'Student'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                        {user.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => openModal('user', user)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(user.id, 'users')} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const UniversitiesTab = () => {
    const filteredUniversities = universities.filter(uni => 
      searchTerm === '' || uni.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search universities..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
          </div>
          <button onClick={() => openModal('university')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add University
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUniversities.map((uni) => (
            <div key={uni.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500 relative">
                {uni.logo && <img src={uni.logo} alt={uni.name} className="w-full h-full object-cover" />}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button onClick={() => openModal('university', uni)} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors">
                    <Edit className="h-3 w-3 text-gray-600" />
                  </button>
                  <button onClick={() => handleDelete(uni.id, 'universities')} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors">
                    <Trash2 className="h-3 w-3 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{uni.name}</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {uni.location || 'N/A'}
                  </div>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    {uni.programs?.length || uni.programs || 0} Programs
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    {uni.rating || '4.5'}/5
                  </div>
                </div>
                <button className="mt-4 w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const JobsTab = () => {
    const filteredJobs = jobs.filter(job => 
      searchTerm === '' || job.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search jobs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
          </div>
          <button onClick={() => openModal('job')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Post Job
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Applications</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Briefcase className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{job.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{job.type || 'Full-time'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{job.company}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {job.salary || 'Competitive'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${job.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}`}>
                        {job.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {job.applicants || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => openModal('job', job)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(job.id, 'jobs')} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const ApplicationsTab = () => {
    const filteredApplications = applications.filter(app => 
      (searchTerm === '' || app.studentName?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === 'all' || app.status === filterStatus)
    )

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search applications..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredApplications.map((app) => (
            <div key={app.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                    {app.studentName?.[0] || 'A'}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{app.studentName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{app.email}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-1" />
                        {app.university || app.jobTitle}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    app.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    app.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    app.status === 'reviewing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {app.status || 'Pending'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const HomepageTab = () => {
    const [editingSection, setEditingSection] = useState(null)
    const [formData, setFormData] = useState(homepageSettings)

    const handleSave = async () => {
      try {
        await api.put('/admin/homepage', formData)
        setHomepageSettings(formData)
        setEditingSection(null)
        alert('Homepage updated successfully!')
      } catch (error) {
        console.error('Failed to update homepage:', error)
        alert('Failed to update homepage')
      }
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Homepage Management</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
              <Home className="h-5 w-5 mr-2 text-blue-500" />
              Hero Section
            </h4>
            <button onClick={() => setEditingSection(editingSection === 'hero' ? null : 'hero')} className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
              <Edit className="h-4 w-4" />
            </button>
          </div>
          {editingSection === 'hero' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hero Title</label>
                <input type="text" value={formData.heroTitle} onChange={(e) => setFormData({...formData, heroTitle: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Enter hero title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hero Subtitle</label>
                <textarea value={formData.heroSubtitle} onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})} rows="3" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Enter hero subtitle" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hero Image URL</label>
                <div className="flex gap-2">
                  <input type="text" value={formData.heroImage} onChange={(e) => setFormData({...formData, heroImage: e.target.value})} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Enter image URL" />
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-900 dark:text-white font-medium">{formData.heroTitle || 'Your Hero Title Here'}</p>
              <p className="text-gray-600 dark:text-gray-400">{formData.heroSubtitle || 'Your hero subtitle will appear here'}</p>
              {formData.heroImage && (
                <div className="mt-4 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img src={formData.heroImage} alt="Hero" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
              <Layout className="h-5 w-5 mr-2 text-green-500" />
              Features Section
            </h4>
            <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <Star className="h-8 w-8 text-yellow-500" />
                  <button className="text-gray-400 hover:text-red-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-1">Feature {i}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">Feature description goes here</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-purple-500" />
              Testimonials
            </h4>
            <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                      T{i}
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">Student Name</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">University Name</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">"This is a testimonial quote that will be displayed on the homepage."</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-green-600 hover:text-green-700">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h4 className="font-medium text-gray-900 dark:text-white flex items-center mb-4">
            <Palette className="h-5 w-5 mr-2 text-pink-500" />
            Theme Settings
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Color</label>
              <input type="color" className="w-full h-10 rounded-lg cursor-pointer" defaultValue="#3B82F6" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Secondary Color</label>
              <input type="color" className="w-full h-10 rounded-lg cursor-pointer" defaultValue="#8B5CF6" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Accent Color</label>
              <input type="color" className="w-full h-10 rounded-lg cursor-pointer" defaultValue="#10B981" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Background</label>
              <input type="color" className="w-full h-10 rounded-lg cursor-pointer" defaultValue="#F9FAFB" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const SettingsTab = () => {
    const [settings, setSettings] = useState({
      siteName: 'EduJobs Connect',
      siteEmail: 'admin@edujobs.com',
      enableRegistration: true,
      enableNotifications: true,
      maintenanceMode: false
    })

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h4 className="font-medium text-gray-900 dark:text-white flex items-center mb-6">
            <Settings className="h-5 w-5 mr-2 text-blue-500" />
            General Settings
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site Name</label>
              <input type="text" value={settings.siteName} onChange={(e) => setSettings({...settings, siteName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site Email</label>
              <input type="email" value={settings.siteEmail} onChange={(e) => setSettings({...settings, siteEmail: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h4 className="font-medium text-gray-900 dark:text-white flex items-center mb-6">
            <Shield className="h-5 w-5 mr-2 text-green-500" />
            Security Settings
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Enable User Registration</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Allow new users to register</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.enableRegistration} onChange={(e) => setSettings({...settings, enableRegistration: e.target.checked})} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <div>
                <p className="font-medium text-yellow-900 dark:text-yellow-100">Maintenance Mode</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Put site in maintenance mode</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h4 className="font-medium text-gray-900 dark:text-white flex items-center mb-6">
            <Key className="h-5 w-5 mr-2 text-purple-500" />
            API Keys
          </h4>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900 dark:text-white">Email Service API</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm">Regenerate</button>
              </div>
              <div className="flex items-center gap-2">
                <input type="password" value="sk_live_xxxxxxxxxxxxx" readOnly className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
                <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900 dark:text-white">Payment Gateway API</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm">Regenerate</button>
              </div>
              <div className="flex items-center gap-2">
                <input type="password" value="pk_test_xxxxxxxxxxxxx" readOnly className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
                <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    )
  }

  const UserFormModal = () => {
    const [formData, setFormData] = useState(editingItem || {
      firstName: '', lastName: '', email: '', role: 'Student', status: 'active'
    })

    return (
      <Modal title={editingItem ? 'Edit User' : 'Add New User'} onClose={closeModal}>
        <form onSubmit={(e) => { e.preventDefault(); handleSaveItem(formData); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
              <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
              <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
              <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                <option value="Student">Student</option>
                <option value="Employer">Employer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {editingItem ? 'Update' : 'Create'} User
            </button>
          </div>
        </form>
      </Modal>
    )
  }

  const UniversityFormModal = () => {
    const [formData, setFormData] = useState(editingItem || {
      name: '', location: '', programs: 0, rating: 4.5, logo: ''
    })

    return (
      <Modal title={editingItem ? 'Edit University' : 'Add New University'} onClose={closeModal}>
        <form onSubmit={(e) => { e.preventDefault(); handleSaveItem(formData); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">University Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
            <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Number of Programs</label>
              <input type="number" value={formData.programs} onChange={(e) => setFormData({...formData, programs: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
              <input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Logo URL</label>
            <div className="flex gap-2">
              <input type="text" value={formData.logo} onChange={(e) => setFormData({...formData, logo: e.target.value})} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
              <button type="button" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {editingItem ? 'Update' : 'Create'} University
            </button>
          </div>
        </form>
      </Modal>
    )
  }

  const JobFormModal = () => {
    const [formData, setFormData] = useState(editingItem || {
      title: '', company: '', location: '', salary: '', type: 'Full-time', status: 'active'
    })

    return (
      <Modal title={editingItem ? 'Edit Job' : 'Post New Job'} onClose={closeModal}>
        <form onSubmit={(e) => { e.preventDefault(); handleSaveItem(formData); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company</label>
            <input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Salary Range</label>
              <input type="text" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="e.g., $50k-70k" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Type</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Description</label>
            <textarea rows="4" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Enter job description..." />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {editingItem ? 'Update' : 'Post'} Job
            </button>
          </div>
        </form>
      </Modal>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your platform from one place</p>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={handleRefresh} disabled={refreshing} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard title="Total Users" value={stats.users} icon={Users} color="bg-blue-500" change={stats.growth?.users} onClick={() => setActiveTab('users')} />
          <StatCard title="Universities" value={stats.universities} icon={GraduationCap} color="bg-green-500" change={stats.growth?.universities} onClick={() => setActiveTab('universities')} />
          <StatCard title="Active Jobs" value={stats.jobs} icon={Briefcase} color="bg-purple-500" change={stats.growth?.jobs} onClick={() => setActiveTab('jobs')} />
          <StatCard title="Applications" value={stats.applications} icon={FileText} color="bg-orange-500" change={stats.growth?.applications} onClick={() => setActiveTab('applications')} />
          <StatCard title="Consultations" value={stats.consultations} icon={MessageSquare} color="bg-pink-500" />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-2">
          <div className="flex flex-wrap gap-2">
            <TabButton id="overview" label="Overview" icon={BarChart3} />
            <TabButton id="users" label="Users" icon={Users} count={stats.users} />
            <TabButton id="universities" label="Universities" icon={GraduationCap} count={stats.universities} />
            <TabButton id="jobs" label="Jobs" icon={Briefcase} count={stats.jobs} />
            <TabButton id="applications" label="Applications" icon={FileText} count={stats.applications} />
            <TabButton id="homepage" label="Homepage" icon={Home} />
            <TabButton id="settings" label="Settings" icon={Settings} />
          </div>
        </div>

        <div>
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'universities' && <UniversitiesTab />}
          {activeTab === 'jobs' && <JobsTab />}
          {activeTab === 'applications' && <ApplicationsTab />}
          {activeTab === 'homepage' && <HomepageTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>

        {showModal && modalType === 'user' && <UserFormModal />}
        {showModal && modalType === 'university' && <UniversityFormModal />}
        {showModal && modalType === 'job' && <JobFormModal />}
      </div>
    </div>
  )
}

export default AdminDashboard