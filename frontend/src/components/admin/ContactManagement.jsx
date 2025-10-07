import { useState, useEffect } from 'react'
import { 
  Mail, Eye, Trash2, RefreshCw, Filter, Search,
  CheckCircle, Clock, MessageSquare, Archive
} from 'lucide-react'
import api from '../../services/api'
import Loading from '../common/Loading'

const ContactManagement = () => {
  const [contacts, setContacts] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [counts, setCounts] = useState({
    new: 0,
    read: 0,
    replied: 0,
    archived: 0,
    total: 0
  })

  useEffect(() => {
    fetchContacts()
  }, [filterStatus])

  useEffect(() => {
    filterContacts()
  }, [contacts, searchQuery])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/contact/admin?status=${filterStatus}&limit=1000`)
      setContacts(response.data.contacts || [])
      setCounts(response.data.counts || counts)
    } catch (error) {
      console.error('Failed to fetch contacts:', error)
      alert('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const filterContacts = () => {
    let filtered = [...contacts]

    if (searchQuery) {
      filtered = filtered.filter(contact =>
        contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.subject?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredContacts(filtered)
  }

  const handleViewContact = async (contact) => {
    setSelectedContact(contact)
    
    // Mark as read if it's new
    if (contact.status === 'new') {
      try {
        await api.put(`/contact/admin/${contact._id}`, { status: 'read' })
        fetchContacts()
      } catch (error) {
        console.error('Failed to update status:', error)
      }
    }
  }

  const handleUpdateStatus = async (contactId, status) => {
    try {
      await api.put(`/contact/admin/${contactId}`, { status })
      fetchContacts()
      if (selectedContact?._id === contactId) {
        setSelectedContact({ ...selectedContact, status })
      }
      alert('Status updated successfully')
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update status')
    }
  }

  const handleDelete = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return
    }

    try {
      await api.delete(`/contact/admin/${contactId}`)
      setContacts(contacts.filter(c => c._id !== contactId))
      if (selectedContact?._id === contactId) {
        setSelectedContact(null)
      }
      alert('Message deleted successfully')
    } catch (error) {
      console.error('Failed to delete contact:', error)
      alert('Failed to delete message')
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      read: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      replied: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      archived: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
    return badges[status] || badges.new
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return <Loading message="Loading messages..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
              <p className="text-purple-100 text-sm">
                {filteredContacts.length} message{filteredContacts.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
          <button
            onClick={fetchContacts}
            className="flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{counts.total}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">New</p>
              <p className="text-2xl font-bold text-blue-600">{counts.new}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Read</p>
              <p className="text-2xl font-bold text-yellow-600">{counts.read}</p>
            </div>
            <Eye className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Replied</p>
              <p className="text-2xl font-bold text-green-600">{counts.replied}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Archived</p>
              <p className="text-2xl font-bold text-gray-600">{counts.archived}</p>
            </div>
            <Archive className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center">
                <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No messages found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact._id}
                    onClick={() => handleViewContact(contact)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedContact?._id === contact._id ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {contact.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{contact.email}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(contact.status)}`}>
                        {contact.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {contact.subject}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {contact.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {formatDate(contact.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {selectedContact ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedContact.subject}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {formatDate(selectedContact.createdAt)}
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadge(selectedContact.status)}`}>
                  {selectedContact.status}
                </span>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">From:</span>
                    <p className="text-gray-900 dark:text-white">{selectedContact.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Email:</span>
                    <p className="text-gray-900 dark:text-white">{selectedContact.email}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Message:</h4>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {selectedContact.message}
                </p>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Actions:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedContact.status !== 'read' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedContact._id, 'read')}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                    >
                      Mark as Read
                    </button>
                  )}
                  {selectedContact.status !== 'replied' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedContact._id, 'replied')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Mark as Replied
                    </button>
                  )}
                  {selectedContact.status !== 'archived' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedContact._id, 'archived')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      Archive
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedContact._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <Mail className="w-16 h-16 mx-auto mb-4" />
                <p>Select a message to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactManagement