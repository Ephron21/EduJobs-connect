import React, { useState, useEffect } from 'react'
import { 
  Plus, Edit3, Trash2, Upload, Eye, Calendar, Clock,
  FileText, Image, Star, AlertCircle, CheckCircle, Search, Filter
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import ContentForm from '../forms/ContentForm'

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState('universities')
  const [universities, setUniversities] = useState([])
  const [jobs, setJobs] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('create')
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Fetch content based on active tab
  useEffect(() => {
    fetchContent()
  }, [activeTab])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/content/${activeTab}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        
        switch (activeTab) {
          case 'universities':
            setUniversities(data.universities || [])
            break
          case 'jobs':
            setJobs(data.jobs || [])
            break
          case 'services':
            setServices(data.services || [])
            break
        }
      }
    } catch (error) {
      console.error('Error fetching content:', error)
      toast.error('Failed to fetch content')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedItem(null)
    setModalType('create')
    setShowModal(true)
  }

  const handleEdit = (item) => {
    setSelectedItem(item)
    setModalType('edit')
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/content/${activeTab}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Item deleted successfully')
        fetchContent()
      } else {
        throw new Error('Failed to delete item')
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('Failed to delete item')
    }
  }

  const handleToggleFeatured = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token')
      const updateData = activeTab === 'services' 
        ? { isFeatured: !currentStatus }
        : { featured: !currentStatus }

      const response = await fetch(`/api/admin/content/${activeTab}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ data: JSON.stringify(updateData) })
      })

      if (response.ok) {
        toast.success('Featured status updated')
        fetchContent()
      } else {
        throw new Error('Failed to update featured status')
      }
    } catch (error) {
      console.error('Error updating featured status:', error)
      toast.error('Failed to update featured status')
    }
  }

  const getFilteredData = () => {
    let data = []
    switch (activeTab) {
      case 'universities':
        data = universities
        break
      case 'jobs':
        data = jobs
        break
      case 'services':
        data = services
        break
    }

    // Apply search filter
    if (searchTerm) {
      data = data.filter(item => {
        const searchFields = activeTab === 'universities' 
          ? [item.name, item.shortName, item.location?.city]
          : activeTab === 'jobs'
          ? [item.title, item.company?.name, item.employment?.category]
          : [item.title, item.category]
        
        return searchFields.some(field => 
          field?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      data = data.filter(item => {
        const status = activeTab === 'services' ? item.isActive : item.status
        return statusFilter === 'active' ? 
          (status === 'active' || status === true) : 
          (status !== 'active' && status !== true)
      })
    }

    return data
  }

  const calculateTimeRemaining = (deadline) => {
    if (!deadline) return null
    
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const timeDiff = deadlineDate.getTime() - now.getTime()
    
    if (timeDiff <= 0) return { expired: true }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    return { days, hours, expired: false }
  }

  const CountdownTimer = ({ deadline }) => {
    const timeRemaining = calculateTimeRemaining(deadline)
    
    if (!timeRemaining) return <span className="text-gray-400">No deadline</span>
    
    if (timeRemaining.expired) {
      return <span className="text-red-500 font-medium">Expired</span>
    }
    
    return (
      <span className="text-blue-600 font-medium">
        {timeRemaining.days}d {timeRemaining.hours}h remaining
      </span>
    )
  }

  const renderUniversityCard = (university) => (
    <div key={university._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {university.logo && (
            <img 
              src={university.logo} 
              alt={university.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
          <div>
            <h3 className="font-semibold text-lg">{university.name}</h3>
            <p className="text-gray-600">{university.location?.city}, {university.location?.country}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleToggleFeatured(university._id, university.featured)}
            className={`p-2 rounded-lg ${university.featured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}
          >
            <Star className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(university)}
            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(university._id)}
            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Programs</p>
          <p className="font-medium">{university.programs?.length || 0}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Rating</p>
          <p className="font-medium">{university.rating?.overall || 0}/5</p>
        </div>
      </div>

      {university.admissions?.applicationDeadline && (
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">Application Deadline</span>
            <CountdownTimer deadline={university.admissions.applicationDeadline} />
          </div>
        </div>
      )}

      {university.admissions?.scholarships?.length > 0 && (
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-sm font-medium text-green-800 mb-1">
            {university.admissions.scholarships.length} Scholarships Available
          </p>
          <div className="space-y-1">
            {university.admissions.scholarships.slice(0, 2).map((scholarship, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-green-700">{scholarship.name}</span>
                <CountdownTimer deadline={scholarship.deadline} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderJobCard = (job) => (
    <div key={job._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {job.company?.logo && (
            <img 
              src={job.company.logo} 
              alt={job.company.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
          <div>
            <h3 className="font-semibold text-lg">{job.title}</h3>
            <p className="text-gray-600">{job.company?.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleToggleFeatured(job._id, job.featured)}
            className={`p-2 rounded-lg ${job.featured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}
          >
            <Star className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(job)}
            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(job._id)}
            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Type</p>
          <p className="font-medium capitalize">{job.employment?.type}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Category</p>
          <p className="font-medium capitalize">{job.employment?.category}</p>
        </div>
      </div>

      {job.salary && (
        <div className="bg-green-50 rounded-lg p-3 mb-4">
          <p className="text-sm font-medium text-green-800">
            Salary: {job.salary.min ? `${job.salary.min.toLocaleString()} - ` : ''}
            {job.salary.max ? `${job.salary.max.toLocaleString()} ` : ''}
            {job.salary.currency}/{job.salary.period}
          </p>
        </div>
      )}

      {job.timeline?.applicationDeadline && (
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">Application Deadline</span>
            <CountdownTimer deadline={job.timeline.applicationDeadline} />
          </div>
        </div>
      )}
    </div>
  )

  const renderServiceCard = (service) => (
    <div key={service._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">{service.title}</h3>
          <p className="text-gray-600">{service.shortDescription}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleToggleFeatured(service._id, service.isFeatured)}
            className={`p-2 rounded-lg ${service.isFeatured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}
          >
            <Star className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(service)}
            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(service._id)}
            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Category</p>
          <p className="font-medium capitalize">{service.category}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Pricing</p>
          <p className="font-medium capitalize">{service.pricing?.type}</p>
        </div>
      </div>

      {service.pricing?.amount > 0 && (
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-sm font-medium text-green-800">
            Price: {service.pricing.amount.toLocaleString()} {service.pricing.currency}
            {service.pricing.period !== 'one-time' && `/${service.pricing.period}`}
          </p>
        </div>
      )}
    </div>
  )

  const filteredData = getFilteredData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New {activeTab.slice(0, -1)}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['universities', 'jobs', 'services'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => {
            switch (activeTab) {
              case 'universities':
                return renderUniversityCard(item)
              case 'jobs':
                return renderJobCard(item)
              case 'services':
                return renderServiceCard(item)
              default:
                return null
            }
          })}
        </div>
      )}

      {filteredData.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : `Get started by creating your first ${activeTab.slice(0, -1)}`
            }
          </p>
        </div>
      )}

      {/* Modal for Create/Edit */}
      {showModal && (
        <ContentForm
          type={activeTab.slice(0, -1)}
          item={selectedItem}
          isOpen={showModal}
          onSave={() => {
            setShowModal(false)
            fetchContent()
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default ContentManager