import { useTheme } from '../../contexts/ThemeContext'

const EduJobsIcon = ({ size = 'default', animated = true, className = '' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const textSizeClasses = {
    small: 'text-xs',
    default: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xl: 'text-xl'
  }

  return (
    <div className={`
      ${sizeClasses[size]}
      ${animated ? 'animate-pulse hover:animate-bounce' : ''}
      relative overflow-hidden rounded-lg
      bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600
      shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer
      ${animated ? 'transform hover:scale-110 hover:rotate-3' : ''}
      ${className}
    `}>
      {/* Inner glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />

      {/* Main EJ text */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <span className={`
          ${textSizeClasses[size]}
          font-bold text-white drop-shadow-sm
          ${animated ? 'animate-pulse' : ''}
        `}>
          EJ
        </span>
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 rounded-lg border border-white/30 animate-pulse" />
    </div>
  )
}

export default EduJobsIcon