import { useState, useEffect } from 'react'
import {
  GraduationCap, Plus, Search, Trash2, Eye, Edit, Printer,
  Download, Filter, RefreshCw, Building
} from 'lucide-react'
import UniversitiesList from './UniversitiesList'
import UniversitiesForm from './UniversitiesForm'
import api from '../../services/api'
import Loading from '../common/Loading'

const UniversitiesManagement = () => {
  const [view, setView] = useState('list') // list, add, edit
  const [universities, setUniversities] = useState([])
  const [filteredUniversities, setFilteredUniversities] = useState([])
  const [selectedUniversity, setSelectedUniversity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [universitiesPerPage, setUniversitiesPerPage] = useState(10)

  useEffect(() => {
    fetchUniversities()
  }, [])

  useEffect(() => {
    filterAndSearchUniversities()
  }, [universities, searchQuery, filterStatus])

  const fetchUniversities = async () => {
    try {
      setLoading(true)
      console.log('🔄 Fetching universities from API at /admin/universities...')

      const response = await api.get('/admin/universities?limit=1000')

      console.log('✅ API Response received:', response.data)
      console.log(`📊 Total universities in database: ${response.data.universities?.length || 0}`)

      if (response.data.universities && response.data.universities.length > 0) {
        console.log('📝 First university sample:', response.data.universities[0])
        setUniversities(response.data.universities)
      } else {
        console.warn('⚠️ No universities found in database')
        setUniversities([])
      }
    } catch (error) {
      console.error('❌ FAILED TO FETCH UNIVERSITIES FROM DATABASE!')
      console.error('Error message:', error.message)
      console.error('Error response:', error.response?.data)
      console.error('Status code:', error.response?.status)
      console.error('Full error:', error)

      // Show detailed alert to user
      const errorMsg = error.response?.data?.message || error.message
      const statusCode = error.response?.status || 'Unknown'

      alert(
        `⚠️ FAILED TO LOAD UNIVERSITIES FROM DATABASE!\n\n` +
        `Error: ${errorMsg}\n` +
        `Status: ${statusCode}\n\n` +
        `Showing MOCK DATA instead.\n\n` +
        `Please check:\n` +
        `1. Backend server is running on localhost:5000\n` +
        `2. You're logged in as admin\n` +
        `3. MongoDB is running\n` +
        `4. Check browser console (F12) for details`
      )

      // Mock data for development
      console.warn('⚠️ Loading mock data as fallback...')
      setUniversities(generateMockUniversities())
    } finally {
      setLoading(false)
    }
  }

  const filterAndSearchUniversities = () => {
    let filtered = [...universities]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(university =>
        university.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        university.shortName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        university.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        university.location?.city?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(university => university.status === filterStatus)
    }

    setFilteredUniversities(filtered)
  }

  const handleAddUniversity = () => {
    setSelectedUniversity(null)
    setView('add')
  }

  const handleEditUniversity = (university) => {
    setSelectedUniversity(university)
    setView('edit')
  }

  const handleViewUniversity = (university) => {
    setSelectedUniversity(university)
    setView('view')
  }

  const handleDeleteUniversity = async (universityId) => {
    if (window.confirm('Are you sure you want to delete this university?')) {
      try {
        await api.delete(`/admin/universities/${universityId}`)
        await fetchUniversities() // Refresh the list
        alert('University deleted successfully!')
      } catch (error) {
        console.error('Delete university error:', error)
        alert('Failed to delete university. Please try again.')
      }
    }
  }

  const handleFormSubmit = async (universityData) => {
    try {
      if (selectedUniversity) {
        // Update existing university
        await api.put(`/admin/universities/${selectedUniversity._id}`, universityData)
        alert('University updated successfully!')
      } else {
        // Create new university
        await api.post('/admin/universities', universityData)
        alert('University created successfully!')
      }

      await fetchUniversities() // Refresh the list
      setView('list')
    } catch (error) {
      console.error('Form submission error:', error)
      alert('Failed to save university. Please try again.')
    }
  }

  const handleBackToList = () => {
    setView('list')
    setSelectedUniversity(null)
  }

  // Generate mock data for development
  const generateMockUniversities = () => {
    return [
      {
        _id: '1',
        name: 'University of Rwanda',
        shortName: 'UR',
        description: 'Leading public university in Rwanda offering comprehensive programs',
        location: { city: 'Kigali', country: 'Rwanda' },
        status: 'active',
        featured: true,
        createdAt: new Date('2023-01-15'),
        createdBy: { firstName: 'Admin', lastName: 'User' }
      },
      {
        _id: '2',
        name: 'African Leadership University',
        shortName: 'ALU',
        description: 'Innovative university focused on leadership and entrepreneurship',
        location: { city: 'Kigali', country: 'Rwanda' },
        status: 'active',
        featured: true,
        createdAt: new Date('2023-02-20'),
        createdBy: { firstName: 'Admin', lastName: 'User' }
      },
      {
        _id: '3',
        name: 'Kigali Institute of Science and Technology',
        shortName: 'KIST',
        description: 'Premier institution for science and technology education',
        location: { city: 'Kigali', country: 'Rwanda' },
        status: 'active',
        featured: false,
        createdAt: new Date('2023-03-10'),
        createdBy: { firstName: 'Admin', lastName: 'User' }
      }
    ]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (view === 'add' || view === 'edit') {
    return (
      <UniversitiesForm
        university={selectedUniversity}
        onSubmit={handleFormSubmit}
        onCancel={handleBackToList}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Building className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Universities Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage universities, programs, and admissions
                </p>
              </div>
            </div>

            <button
              onClick={handleAddUniversity}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add University
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Universities
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {universities.length}
                </p>
              </div>
              <Building className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {universities.filter(u => u.status === 'active').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Featured
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {universities.filter(u => u.featured).length}
                </p>
              </div>
              <GraduationCap className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  This Month
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  +{Math.floor(universities.length * 0.1)}
                </p>
              </div>
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Universities List */}
        <UniversitiesList
          universities={filteredUniversities}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          onEdit={handleEditUniversity}
          onDelete={handleDeleteUniversity}
          onRefresh={fetchUniversities}
        />
      </div>
    </div>
  )
}

export default UniversitiesManagement
