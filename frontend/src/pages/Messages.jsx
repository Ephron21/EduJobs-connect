import { useState, useEffect } from 'react'
import { MessageSquare, Send, Search, User, Clock } from 'lucide-react'

const Messages = () => {
  const [messages, setMessages] = useState([])
  
  useEffect(() => {
    // Mock data
    setMessages([
      { id: 1, from: 'John Doe', content: 'Hello admin!', time: '10:30 AM', unread: true },
      { id: 2, from: 'Jane Smith', content: 'Question about application', time: '9:15 AM', unread: false }
    ])
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
          <MessageSquare className="w-8 h-8 mr-3 text-primary-600" />
          Messages
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400">Message system coming soon...</p>
        </div>
      </div>
    </div>
  )
}

export default Messages