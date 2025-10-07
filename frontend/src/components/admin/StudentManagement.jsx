import { useState, useEffect } from 'react'
import { 
  Users, Plus, Search, Trash2, Eye, Edit, Printer, 
  Download, Filter, RefreshCw, UserPlus
} from 'lucide-react'
import StudentList from './StudentList'
import StudentForm from './StudentForm'
import StudentProfile from './StudentProfile'
import api from '../../services/api'
import Loading from '../common/Loading'

const StudentManagement = () => {
  const [view, setView] = useState('list') // list, add, edit, profile
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedStudents, setSelectedStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLevel, setFilterLevel] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [studentsPerPage, setStudentsPerPage] = useState(10)

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    filterAndSearchStudents()
  }, [students, searchQuery, filterLevel, filterStatus])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      console.log('🔄 Fetching students from API at /admin/students...')
      
      const response = await api.get('/admin/students?limit=1000')
      
      console.log('✅ API Response received:', response.data)
      console.log(`📊 Total students in database: ${response.data.students?.length || 0}`)
      
      if (response.data.students && response.data.students.length > 0) {
        console.log('📝 First student sample:', response.data.students[0])
        setStudents(response.data.students)
      } else {
        console.warn('⚠️ No students found in database')
        setStudents([])
      }
    } catch (error) {
      console.error('❌ FAILED TO FETCH STUDENTS FROM DATABASE!')
      console.error('Error message:', error.message)
      console.error('Error response:', error.response?.data)
      console.error('Status code:', error.response?.status)
      console.error('Full error:', error)
      
      // Show detailed alert to user
      const errorMsg = error.response?.data?.message || error.message
      const statusCode = error.response?.status || 'Unknown'
      
      alert(
        `⚠️ FAILED TO LOAD REAL STUDENTS FROM DATABASE!\n\n` +
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
      setStudents(generateMockStudents())
    } finally {
      setLoading(false)
    }
  }

  const filterAndSearchStudents = () => {
    let filtered = [...students]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(student =>
        student.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.registrationNumber?.includes(searchQuery)
      )
    }

    // Level filter
    if (filterLevel !== 'all') {
      filtered = filtered.filter(student => student.level === filterLevel)
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(student => student.status === filterStatus)
    }

    setFilteredStudents(filtered)
  }

  const handleAddStudent = () => {
    setSelectedStudent(null)
    setView('add')
  }

  const handleEditStudent = (student) => {
    setSelectedStudent(student)
    setView('edit')
  }

  const handleViewStudent = (student) => {
    setSelectedStudent(student)
    setView('profile')
  }

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return
    }

    try {
      await api.delete(`/admin/students/${studentId}`)
      setStudents(students.filter(s => s._id !== studentId))
      alert('Student deleted successfully')
    } catch (error) {
      console.error('Failed to delete student:', error)
      alert('Failed to delete student')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedStudents.length === 0) {
      alert('Please select students to delete')
      return
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedStudents.length} student(s)?`)) {
      return
    }

    try {
      await api.post('/admin/students/bulk-delete', { studentIds: selectedStudents })
      setStudents(students.filter(s => !selectedStudents.includes(s._id)))
      setSelectedStudents([])
      alert('Students deleted successfully')
    } catch (error) {
      console.error('Failed to delete students:', error)
      alert('Failed to delete students')
    }
  }

  const handleSaveStudent = async (studentData) => {
    try {
      if (view === 'edit') {
        const response = await api.put(`/admin/students/${selectedStudent._id}`, studentData)
        setStudents(students.map(s => s._id === selectedStudent._id ? response.data.student : s))
        alert('Student updated successfully')
      } else {
        const response = await api.post('/admin/students', studentData)
        setStudents([...students, response.data.student])
        alert('Student added successfully')
      }
      setView('list')
    } catch (error) {
      console.error('Failed to save student:', error)
      throw error
    }
  }

  const handlePrintAll = () => {
    window.print()
  }

  const handleExportCSV = () => {
    const csv = convertToCSV(filteredStudents)
    downloadCSV(csv, 'students.csv')
  }

  const convertToCSV = (data) => {
    const headers = ['ID', 'Name', 'Email', 'Registration Number', 'Level', 'Status', 'Phone']
    const rows = data.map(s => [
      s._id,
      `${s.firstName} ${s.lastName}`,
      s.email,
      s.registrationNumber,
      s.level,
      s.status,
      s.phoneNumber || ''
    ])

    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent)
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage)

  if (loading) {
    return <Loading message="Loading students..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Manage Students</h2>
              <p className="text-blue-100 text-sm">
                {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
          {view === 'list' && (
            <button
              onClick={handleAddStudent}
              className="flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Student</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      {view === 'list' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 space-y-4">
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email or reg number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Level Filter */}
              <div>
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Levels</option>
                  <option value="Level 1">Level 1 (First Year)</option>
                  <option value="Level 2">Level 2 (Second Year)</option>
                  <option value="Level 3">Level 3 (Third Year)</option>
                  <option value="Level 4">Level 4 (Final Year)</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="graduated">Graduated</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
  <label className="text-sm text-gray-600 dark:text-gray-400">Show:</label>
  <select
    value={studentsPerPage}
    onChange={(e) => {
      setStudentsPerPage(Number(e.target.value))
      setCurrentPage(1)
    }}
    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
  >
    <option value={10}>10 per page</option>
    <option value={25}>25 per page</option>
    <option value={50}>50 per page</option>
    <option value={100}>100 per page</option>
  </select>
</div>
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (selectedStudents.length === filteredStudents.length) {
                      setSelectedStudents([])
                    } else {
                      setSelectedStudents(filteredStudents.map(s => s._id))
                    }
                  }}
                  className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
                </button>
                {selectedStudents.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Selected ({selectedStudents.length})</span>
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={fetchStudents}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={handlePrintAll}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print All</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Student List */}
          <StudentList
            students={currentStudents}
            selectedStudents={selectedStudents}
            onSelectStudent={(id) => {
              if (selectedStudents.includes(id)) {
                setSelectedStudents(selectedStudents.filter(sid => sid !== id))
              } else {
                setSelectedStudents([...selectedStudents, id])
              }
            }}
            onView={handleViewStudent}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} students
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {(view === 'add' || view === 'edit') && (
        <StudentForm
          student={selectedStudent}
          onSave={handleSaveStudent}
          onCancel={() => setView('list')}
          isEdit={view === 'edit'}
        />
      )}

      {view === 'profile' && (
        <StudentProfile
          student={selectedStudent}
          onEdit={() => handleEditStudent(selectedStudent)}
          onDelete={() => {
            handleDeleteStudent(selectedStudent._id)
            setView('list')
          }}
          onBack={() => setView('list')}
        />
      )}
    </div>
  )
}

// Mock data generator for development
const generateMockStudents = () => {
  const firstNames = ['John', 'Mary', 'David', 'Sarah', 'Michael', 'Emma', 'James', 'Olivia', 'Robert', 'Sophia']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
  const levels = ['Level 1', 'Level 2', 'Level 3', 'Level 4']
  const statuses = ['active', 'pending', 'suspended']

  return Array.from({ length: 50 }, (_, i) => ({
    _id: `student-${i + 1}`,
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    email: `student${i + 1}@example.com`,
    registrationNumber: `225${String(i + 1).padStart(6, '0')}`,
    level: levels[Math.floor(Math.random() * levels.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    phoneNumber: `+250${Math.floor(Math.random() * 1000000000)}`,
    password: `pass${i + 1}`,
    dateOfBirth: '2000-01-01',
    gender: Math.random() > 0.5 ? 'Male' : 'Female',
    address: 'Kigali, Rwanda',
    institution: 'University of Rwanda',
    admissionDate: '2024-09-01',
    nationalId: `1199${String(i + 1).padStart(12, '0')}`,
    guardianName: 'Parent Name',
    guardianPhone: '+250788000000',
    guardianEmail: `parent${i + 1}@example.com`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }))
}

export default StudentManagement