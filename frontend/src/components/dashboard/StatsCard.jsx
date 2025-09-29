import { useState } from 'react'
import { TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react'

const StatsCard = ({ stat, onClick, isLoading = false }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const handleCardClick = () => {
    if (onClick) {
      onClick(stat)
    }
  }

  const toggleDetails = (e) => {
    e.stopPropagation()
    setShowDetails(!showDetails)
  }

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 cursor-pointer transform ${
        isHovered ? 'scale-105 shadow-lg' : ''
      } ${onClick ? 'hover:shadow-lg' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.gradient || 'from-blue-500 to-blue-600'}`}>
            <stat.icon className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {stat.label}
            </p>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-8 w-16 rounded"></div>
                ) : (
                  stat.value
                )}
              </p>
              {stat.trend && (
                <div className={`flex items-center text-xs ${
                  stat.trend > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend > 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  <span>{Math.abs(stat.trend)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {stat.details && (
          <button
            onClick={toggleDetails}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Expandable Details */}
      {showDetails && stat.details && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            {stat.details.map((detail, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{detail.label}</span>
                <span className="font-medium text-gray-900 dark:text-white">{detail.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar for percentage stats */}
      {stat.type === 'percentage' && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${stat.gradient || 'from-blue-500 to-blue-600'} transition-all duration-500`}
              style={{ width: `${parseInt(stat.value)}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StatsCard
