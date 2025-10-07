import { Eye, Edit, Trash2 } from 'lucide-react'

const StudentList = ({ students, selectedStudents, onSelectStudent, onView, onEdit, onDelete }) => {
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

  if (students.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No students found</h3>
        <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-4 text-left">
              <input
                type="checkbox"
                checked={selectedStudents.length === students.length && students.length > 0}
                onChange={() => {}}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Reg Number
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Level
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {students.map((student) => (
            <tr
              key={student._id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student._id)}
                  onChange={() => onSelectStudent(student._id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {student._id.slice(-6)}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {student.firstName} {student.lastName}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {student.email}
              </td>
              <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">
                {student.registrationNumber}
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getLevelBadgeColor(student.level)}`}>
                  {student.level}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusBadgeColor(student.status)}`}>
                  {student.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onView(student)}
                    className="p-2 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg transition-colors"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(student)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(student._id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StudentList