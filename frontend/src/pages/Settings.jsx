import { useState } from 'react'
import { Settings as SettingsIcon, Bell, Lock, Palette, Globe, Shield } from 'lucide-react'

const Settings = () => {
  const [notifications, setNotifications] = useState(true)
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
          <SettingsIcon className="w-8 h-8 mr-3 text-primary-600" />
          Settings
        </h1>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </h3>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-gray-700 dark:text-gray-300">Enable email notifications</span>
            </label>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Security
            </h3>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings