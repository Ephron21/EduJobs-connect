import { useTheme } from '../../contexts/ThemeContext'

const EduJobsLogo = ({ size = 'default', animated = true, className = '' }) => {
  const { isDark } = useTheme()

  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-12 h-12',
    large: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const textSizeClasses = {
    small: 'text-sm',
    default: 'text-base',
    large: 'text-lg',
    xl: 'text-2xl'
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Image */}
      <div className={`
        ${sizeClasses[size]}
        ${animated ? 'hover:shadow-xl' : ''}
        rounded-lg overflow-hidden
      `}>
        <img
          src="/images/image.png"
          alt="EduJobs Connect Logo"
          className="w-full h-full object-contain bg-transparent"
        />
      </div>

      {/* Company Name */}
      <div className="flex flex-col">
        <span className={`
          ${textSizeClasses[size]}
          font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent
          ${animated ? 'animate-fadeIn' : ''}
        `}>
          EduJobs
        </span>
        <span className={`
          ${textSizeClasses[size]}
          font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}
          ${animated ? 'animate-fadeIn' : ''}
        `}>
          Connect
        </span>
      </div>
    </div>
  )
}

export default EduJobsLogo