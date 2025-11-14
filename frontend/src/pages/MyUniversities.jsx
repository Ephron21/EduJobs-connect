import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  GraduationCap, MapPin, Star, Building, Users, BookOpen,
  Search, Filter, Download, RefreshCw, Eye, Edit, Trash2, Plus,
  TrendingUp, Award, Target, MoreVertical, Globe, Mail, Phone,
  CheckCircle, XCircle, AlertCircle, Calendar
} from 'lucide-react'
import api from '../services/api'

const MyUniversities = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [universities, setUniversities] = useState([])
  const [filteredUniversities, setFilteredUniversities] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [selectedUniversity, setSelectedUniversity] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    featured: 0,
    totalPrograms: 0
  })

  useEffect(() => {
    fetchUniversities()
  }, [])

  useEffect(() => {
    filterAndSortUniversities()
  }, [universities, searchQuery, filterStatus, sortBy])

  const fetchUniversities = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/universities?limit=1000')
      const uniData = response.data.universities || generateMockUniversities()
      setUniversities(uniData)
      calculateStats(uniData)
    } catch (error) {
      console.error('Failed to fetch universities:', error)
      const mockUnis = generateMockUniversities()
      setUniversities(mockUnis)
      calculateStats(mockUnis)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (uniData) => {
    const newStats = {
      total: uniData.length,
      active: uniData.filter(u => u.status === 'active').length,
      featured: uniData.filter(u => u.featured).length,
      totalPrograms: uniData.reduce((sum, u) => sum + (u.programsCount || 0), 0)
    }
    setStats(newStats)
  }

  const filterAndSortUniversities = () => {
    let filtered = [...universities]

    if (searchQuery) {
      filtered = filtered.filter(uni =>
        uni.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.location?.city?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(uni => uni.status === filterStatus)
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        default:
          return 0
      }
    })

    setFilteredUniversities(filtered)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchUniversities()
    setRefreshing(false)
  }

  const handleDelete = async (uniId) => {
    if (!window.confirm('Are you sure you want to delete this university?')) return
    try {
      await api.delete(`/admin/universities/${uniId}`)
      setUniversities(universities.filter(u => u._id !== uniId))
      alert('University deleted successfully!')
    } catch (error) {
      console.error('Failed to delete:', error)
      alert('Failed to delete university')
    }
  }

  const generateMockUniversities = () => [
    { _id: '1', name: 'University of Rwanda', location: { city: 'Kigali', country: 'Rwanda' }, status: 'active', rating: 4.5, programsCount: 45, featured: true, createdAt: new Date('2024-11-01') },
    { _id: '2', name: 'KIST', location: { city: 'Kigali', country: 'Rwanda' }, status: 'active', rating: 4.3, programsCount: 32, featured: true, createdAt: new Date('2024-10-28') },
    { _id: '3', name: 'ALU', location: { city: 'Kigali', country: 'Rwanda' }, status: 'active', rating: 4.7, programsCount: 28, featured: false, createdAt: new Date('2024-11-03') }
  ]

  const StatCard = ({ title, value, icon: Icon, color, onClick }) => (
    <div onClick={onClick} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  const UniversityCard = ({ uni }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{uni.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {uni.location?.city || 'N/A'}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            {uni.rating || 0} Rating
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <BookOpen className="w-4 h-4 mr-2" />
            {uni.programsCount || 0} Programs
          </div>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => { setSelectedUniversity(uni); setShowDetailModal(true); }} className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">View Details</button>
          <button onClick={() => handleDelete(uni._id)} className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">Delete</button>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading universities...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <GraduationCap className="w-8 h-8 mr-3 text-primary-600" />
                My Universities
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Manage university listings and programs</p>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={handleRefresh} disabled={refreshing} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add University</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Universities" value={stats.total} icon={GraduationCap} color="bg-blue-600" onClick={() => setFilterStatus('all')} />
          <StatCard title="Active" value={stats.active} icon={CheckCircle} color="bg-green-600" onClick={() => setFilterStatus('active')} />
          <StatCard title="Featured" value={stats.featured} icon={Star} color="bg-yellow-600" />
          <StatCard title="Total Programs" value={stats.totalPrograms} icon={BookOpen} color="bg-purple-600" />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search universities..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="name">By Name</option>
              <option value="rating">By Rating</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUniversities.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">No universities found</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            filteredUniversities.map((uni) => <UniversityCard key={uni._id} uni={uni} />)
          )}
        </div>
      </div>

      {showDetailModal && selectedUniversity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">University Details</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
                <p className="text-gray-900 dark:text-white font-medium text-lg">{selectedUniversity.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Location</label>
                <p className="text-gray-900 dark:text-white">{selectedUniversity.location?.city}, {selectedUniversity.location?.country}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Rating</label>
                <p className="text-gray-900 dark:text-white">{selectedUniversity.rating || 0} / 5.0</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Programs</label>
                <p className="text-gray-900 dark:text-white">{selectedUniversity.programsCount || 0} programs offered</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${selectedUniversity.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}`}>
                  {selectedUniversity.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyUniversities