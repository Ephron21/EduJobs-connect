import { ArrowLeft, Edit, Trash2, Printer, Mail, Phone, MapPin, Calendar, GraduationCap, User, Users as UsersIcon, Shield } from 'lucide-react'

const StudentProfile = ({ student, onEdit, onDelete, onBack }) => {
  const handlePrint = () => {
    window.print()
  }

  const getLevelBadgeColor = (level) => {
    const colors = {
      'Level 1': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
      'Level 2': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Level 3': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'Level 4': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    }
    return colors[level] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }

  const getStatusBadgeColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      suspended: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      graduated: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Student Profile</h2>
              <p className="text-blue-100 text-sm">View detailed student information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Student Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {student.firstName?.[0]}{student.lastName?.[0]}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {student.firstName} {student.lastName}
                </h1>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex px-4 py-1.5 text-sm font-semibold rounded-full ${getLevelBadgeColor(student.level)}`}>
                    {student.level}
                  </span>
                  <span className={`inline-flex px-4 py-1.5 text-sm font-semibold rounded-full capitalize ${getStatusBadgeColor(student.status)}`}>
                    {student.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="p-8 space-y-8">
          {/* Registration Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Registration Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Registration Number</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white font-mono">
                  {student.registrationNumber}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Password/PIN</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white font-mono">
                  {student.password || '••••••'}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Registration Date</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatDate(student.createdAt)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last Updated</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatDate(student.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-600" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email Address</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white break-all">
                    {student.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phone Number</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {student.phoneNumber || 'Not provided'}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 md:col-span-2">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Address</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {student.address || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Date of Birth</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {formatDate(student.dateOfBirth)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Gender</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {student.gender || 'Not specified'}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">National ID</p>
                <p className="text-base font-medium text-gray-900 dark:text-white font-mono">
                  {student.nationalId || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
              Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Institution</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {student.institution || 'Not specified'}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Admission Date</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {formatDate(student.admissionDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          {(student.guardianName || student.guardianPhone || student.guardianEmail) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <UsersIcon className="w-5 h-5 mr-2 text-blue-600" />
                Parent/Guardian Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Name</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {student.guardianName || 'Not provided'}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phone</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {student.guardianPhone || 'Not provided'}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white break-all">
                    {student.guardianEmail || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 dark:bg-gray-700/50 px-8 py-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Student</span>
            </button>
            <button
              onClick={onDelete}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Student</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
            >
              <Printer className="w-4 h-4" />
              <span>Print Information</span>
            </button>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students List</span>
        </button>
      </div>
    </div>
  )
}

export default StudentProfile