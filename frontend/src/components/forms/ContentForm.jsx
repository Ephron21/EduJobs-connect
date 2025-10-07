import React, { useState, useEffect } from 'react'
import { 
  Upload, X, Plus, Trash2, Calendar, DollarSign, 
  FileText, Image, Save, AlertCircle, CheckCircle 
} from 'lucide-react'
import { toast } from 'react-hot-toast'

const ContentForm = ({ 
  type, 
  item = null, 
  onSave, 
  onCancel, 
  isOpen = false 
}) => {
  const [formData, setFormData] = useState({})
  const [files, setFiles] = useState({})
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Initialize form data based on type and existing item
  useEffect(() => {
    if (isOpen) {
      initializeFormData()
    }
  }, [isOpen, type, item])

  const initializeFormData = () => {
    switch (type) {
      case 'university':
        setFormData({
          name: item?.name || '',
          shortName: item?.shortName || '',
          description: item?.description || '',
          website: item?.website || '',
          email: item?.email || '',
          phone: item?.phone || '',
          location: {
            address: item?.location?.address || '',
            city: item?.location?.city || '',
            province: item?.location?.province || '',
            country: item?.location?.country || 'Rwanda'
          },
          programs: item?.programs || [],
          admissions: {
            applicationDeadline: item?.admissions?.applicationDeadline ? 
              new Date(item.admissions.applicationDeadline).toISOString().split('T')[0] : '',
            startDate: item?.admissions?.startDate ? 
              new Date(item.admissions.startDate).toISOString().split('T')[0] : '',
            applicationFee: {
              amount: item?.admissions?.applicationFee?.amount || 0,
              currency: item?.admissions?.applicationFee?.currency || 'RWF'
            },
            scholarships: item?.admissions?.scholarships || [],
            financialAid: item?.admissions?.financialAid || [],
            paymentOptions: item?.admissions?.paymentOptions || []
          },
          announcements: item?.announcements || [],
          status: item?.status || 'active',
          featured: item?.featured || false
        })
        break
      
      case 'job':
        setFormData({
          title: item?.title || '',
          description: item?.description || '',
          company: {
            name: item?.company?.name || '',
            website: item?.company?.website || '',
            description: item?.company?.description || '',
            size: item?.company?.size || 'medium',
            industry: item?.company?.industry || ''
          },
          location: {
            type: item?.location?.type || 'onsite',
            address: item?.location?.address || '',
            city: item?.location?.city || '',
            province: item?.location?.province || '',
            country: item?.location?.country || 'Rwanda'
          },
          employment: {
            type: item?.employment?.type || 'full-time',
            level: item?.employment?.level || 'entry',
            category: item?.employment?.category || 'technology'
          },
          salary: {
            min: item?.salary?.min || 0,
            max: item?.salary?.max || 0,
            currency: item?.salary?.currency || 'RWF',
            period: item?.salary?.period || 'month',
            negotiable: item?.salary?.negotiable || false
          },
          timeline: {
            applicationDeadline: item?.timeline?.applicationDeadline ? 
              new Date(item.timeline.applicationDeadline).toISOString().split('T')[0] : '',
            startDate: item?.timeline?.startDate ? 
              new Date(item.timeline.startDate).toISOString().split('T')[0] : ''
          },
          requirements: {
            education: {
              level: item?.requirements?.education?.level || 'bachelor',
              field: item?.requirements?.education?.field || ''
            },
            experience: {
              min: item?.requirements?.experience?.min || 0,
              max: item?.requirements?.experience?.max || 5
            },
            skills: {
              required: item?.requirements?.skills?.required || [],
              preferred: item?.requirements?.skills?.preferred || []
            }
          },
          responsibilities: item?.responsibilities || [],
          benefits: item?.benefits || [],
          status: item?.status || 'active',
          featured: item?.featured || false
        })
        break
      
      case 'service':
        setFormData({
          title: item?.title || '',
          description: item?.description || '',
          shortDescription: item?.shortDescription || '',
          category: item?.category || 'consulting',
          pricing: {
            type: item?.pricing?.type || 'free',
            amount: item?.pricing?.amount || 0,
            currency: item?.pricing?.currency || 'RWF',
            period: item?.pricing?.period || 'one-time'
          },
          features: item?.features || [],
          benefits: item?.benefits || [],
          process: item?.process || [],
          requirements: item?.requirements || [],
          deliverables: item?.deliverables || [],
          isActive: item?.isActive !== undefined ? item.isActive : true,
          isFeatured: item?.isFeatured || false,
          order: item?.order || 0
        })
        break
    }
    setFiles({})
    setErrors({})
  }

  const handleInputChange = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev }
      const keys = path.split('.')
      let current = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  const handleArrayAdd = (path, newItem = '') => {
    setFormData(prev => {
      const newData = { ...prev }
      const keys = path.split('.')
      let current = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }
      
      if (!current[keys[keys.length - 1]]) {
        current[keys[keys.length - 1]] = []
      }
      current[keys[keys.length - 1]].push(newItem)
      return newData
    })
  }

  const handleArrayRemove = (path, index) => {
    setFormData(prev => {
      const newData = { ...prev }
      const keys = path.split('.')
      let current = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]].splice(index, 1)
      return newData
    })
  }

  const handleFileChange = (fieldName, fileList) => {
    setFiles(prev => ({
      ...prev,
      [fieldName]: fileList
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    switch (type) {
      case 'university':
        if (!formData.name?.trim()) newErrors.name = 'University name is required'
        if (!formData.location?.city?.trim()) newErrors.city = 'City is required'
        break
      case 'job':
        if (!formData.title?.trim()) newErrors.title = 'Job title is required'
        if (!formData.company?.name?.trim()) newErrors.companyName = 'Company name is required'
        break
      case 'service':
        if (!formData.title?.trim()) newErrors.title = 'Service title is required'
        if (!formData.shortDescription?.trim()) newErrors.shortDescription = 'Short description is required'
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the form errors')
      return
    }

    setLoading(true)
    
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('data', JSON.stringify(formData))
      
      // Append files
      Object.entries(files).forEach(([fieldName, fileList]) => {
        if (fileList && fileList.length > 0) {
          Array.from(fileList).forEach(file => {
            formDataToSend.append(fieldName, file)
          })
        }
      })

      const token = localStorage.getItem('token')
      const url = item 
        ? `/api/admin/content/${type}s/${item._id}`
        : `/api/admin/content/${type}s`
      
      const response = await fetch(url, {
        method: item ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(`${type} ${item ? 'updated' : 'created'} successfully`)
        onSave(result)
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save')
      }
    } catch (error) {
      console.error('Error saving:', error)
      toast.error(error.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const renderUniversityForm = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            University Name *
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter university name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short Name
          </label>
          <input
            type="text"
            value={formData.shortName || ''}
            onChange={(e) => handleInputChange('shortName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., UR, KIST"
          />
        </div>
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Logo
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange('logo', e.target.files)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            value={formData.location?.city || ''}
            onChange={(e) => handleInputChange('location.city', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter city"
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Province
          </label>
          <input
            type="text"
            value={formData.location?.province || ''}
            onChange={(e) => handleInputChange('location.province', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter province"
          />
        </div>
      </div>

      {/* Admissions */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Admissions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Application Deadline
            </label>
            <input
              type="date"
              value={formData.admissions?.applicationDeadline || ''}
              onChange={(e) => handleInputChange('admissions.applicationDeadline', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Application Fee (RWF)
            </label>
            <input
              type="number"
              value={formData.admissions?.applicationFee?.amount || 0}
              onChange={(e) => handleInputChange('admissions.applicationFee.amount', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Status and Featured */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status || 'active'}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured || false}
            onChange={(e) => handleInputChange('featured', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700">
            Featured on Homepage
          </label>
        </div>
      </div>
    </div>
  )

  const renderJobForm = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title *
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter job title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name *
          </label>
          <input
            type="text"
            value={formData.company?.name || ''}
            onChange={(e) => handleInputChange('company.name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.companyName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter company name"
          />
          {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
        </div>
      </div>

      {/* Employment Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Employment Type
          </label>
          <select
            value={formData.employment?.type || 'full-time'}
            onChange={(e) => handleInputChange('employment.type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Level
          </label>
          <select
            value={formData.employment?.level || 'entry'}
            onChange={(e) => handleInputChange('employment.level', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="entry">Entry</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.employment?.category || 'technology'}
            onChange={(e) => handleInputChange('employment.category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="education">Education</option>
            <option value="finance">Finance</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>
      </div>

      {/* Salary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Salary (RWF)
          </label>
          <input
            type="number"
            value={formData.salary?.min || 0}
            onChange={(e) => handleInputChange('salary.min', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Salary (RWF)
          </label>
          <input
            type="number"
            value={formData.salary?.max || 0}
            onChange={(e) => handleInputChange('salary.max', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>
      </div>

      {/* Application Deadline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Application Deadline
        </label>
        <input
          type="date"
          value={formData.timeline?.applicationDeadline || ''}
          onChange={(e) => handleInputChange('timeline.applicationDeadline', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )

  const renderServiceForm = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service Title *
        </label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter service title"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Short Description *
        </label>
        <textarea
          value={formData.shortDescription || ''}
          onChange={(e) => handleInputChange('shortDescription', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            errors.shortDescription ? 'border-red-500' : 'border-gray-300'
          }`}
          rows="3"
          placeholder="Brief description of the service"
        />
        {errors.shortDescription && <p className="text-red-500 text-sm mt-1">{errors.shortDescription}</p>}
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pricing Type
          </label>
          <select
            value={formData.pricing?.type || 'free'}
            onChange={(e) => handleInputChange('pricing.type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="free">Free</option>
            <option value="paid">Paid</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (RWF)
          </label>
          <input
            type="number"
            value={formData.pricing?.amount || 0}
            onChange={(e) => handleInputChange('pricing.amount', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={formData.pricing?.type === 'free'}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Period
          </label>
          <select
            value={formData.pricing?.period || 'one-time'}
            onChange={(e) => handleInputChange('pricing.period', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={formData.pricing?.type === 'free'}
          >
            <option value="one-time">One-time</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {item ? 'Edit' : 'Create'} {type.charAt(0).toUpperCase() + type.slice(1)}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {type === 'university' && renderUniversityForm()}
            {type === 'job' && renderJobForm()}
            {type === 'service' && renderServiceForm()}

            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{loading ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContentForm
