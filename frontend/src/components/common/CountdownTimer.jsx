import React, { useState, useEffect } from 'react'
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react'

const CountdownTimer = ({ 
  deadline, 
  showIcon = true, 
  size = 'medium',
  className = '',
  onExpire = null 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (!deadline) return

    const calculateTimeRemaining = () => {
      const now = new Date()
      const deadlineDate = new Date(deadline)
      const timeDiff = deadlineDate.getTime() - now.getTime()

      if (timeDiff <= 0) {
        setIsExpired(true)
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        if (onExpire && !isExpired) {
          onExpire()
        }
        return
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)

      setTimeRemaining({ days, hours, minutes, seconds })
      setIsExpired(false)
    }

    // Calculate immediately
    calculateTimeRemaining()

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [deadline, onExpire, isExpired])

  if (!deadline) {
    return (
      <span className={`text-gray-400 ${className}`}>
        No deadline set
      </span>
    )
  }

  if (!timeRemaining) {
    return (
      <span className={`text-gray-400 ${className}`}>
        Loading...
      </span>
    )
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'text-xs'
      case 'large':
        return 'text-lg'
      default:
        return 'text-sm'
    }
  }

  const getUrgencyColor = () => {
    if (isExpired) return 'text-red-600'
    
    const totalHours = timeRemaining.days * 24 + timeRemaining.hours
    
    if (totalHours <= 24) return 'text-red-500'
    if (totalHours <= 72) return 'text-orange-500'
    if (totalHours <= 168) return 'text-yellow-600'
    return 'text-green-600'
  }

  const formatTimeUnit = (value, unit) => {
    if (value === 0 && unit !== 'seconds') return null
    return (
      <span className="inline-flex flex-col items-center mx-1">
        <span className="font-bold">{value.toString().padStart(2, '0')}</span>
        <span className="text-xs opacity-75">{unit}</span>
      </span>
    )
  }

  const formatCompactTime = () => {
    if (timeRemaining.days > 0) {
      return `${timeRemaining.days}d ${timeRemaining.hours}h`
    } else if (timeRemaining.hours > 0) {
      return `${timeRemaining.hours}h ${timeRemaining.minutes}m`
    } else {
      return `${timeRemaining.minutes}m ${timeRemaining.seconds}s`
    }
  }

  if (isExpired) {
    return (
      <div className={`flex items-center space-x-1 text-red-600 ${getSizeClasses()} ${className}`}>
        {showIcon && <AlertTriangle className="w-4 h-4" />}
        <span className="font-medium">Expired</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-1 ${getUrgencyColor()} ${getSizeClasses()} ${className}`}>
      {showIcon && <Clock className="w-4 h-4" />}
      
      {size === 'large' ? (
        <div className="flex items-center space-x-2">
          {timeRemaining.days > 0 && formatTimeUnit(timeRemaining.days, 'days')}
          {formatTimeUnit(timeRemaining.hours, 'hours')}
          {formatTimeUnit(timeRemaining.minutes, 'min')}
          {timeRemaining.days === 0 && timeRemaining.hours === 0 && formatTimeUnit(timeRemaining.seconds, 'sec')}
        </div>
      ) : (
        <span className="font-medium">
          {formatCompactTime()} remaining
        </span>
      )}
    </div>
  )
}

// Component for displaying multiple countdown timers in a grid
export const CountdownGrid = ({ items, getDeadline, renderItem, className = '' }) => {
  return (
    <div className={`grid gap-4 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {renderItem(item)}
            </div>
            <CountdownTimer 
              deadline={getDeadline(item)}
              size="small"
              className="ml-4"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// Animated countdown for homepage hero sections
export const HeroCountdown = ({ deadline, title, description }) => {
  const [timeRemaining, setTimeRemaining] = useState(null)

  useEffect(() => {
    if (!deadline) return

    const calculateTimeRemaining = () => {
      const now = new Date()
      const deadlineDate = new Date(deadline)
      const timeDiff = deadlineDate.getTime() - now.getTime()

      if (timeDiff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true })
        return
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)

      setTimeRemaining({ days, hours, minutes, seconds, expired: false })
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [deadline])

  if (!timeRemaining || !deadline) return null

  const TimeBlock = ({ value, label }) => (
    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 text-center min-w-[80px]">
      <div className="text-3xl font-bold text-white mb-1">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-sm text-white opacity-80 uppercase tracking-wide">
        {label}
      </div>
    </div>
  )

  if (timeRemaining.expired) {
    return (
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white text-center">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="opacity-90">This deadline has expired</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        {description && <p className="opacity-90">{description}</p>}
      </div>
      
      <div className="flex justify-center space-x-4">
        <TimeBlock value={timeRemaining.days} label="Days" />
        <TimeBlock value={timeRemaining.hours} label="Hours" />
        <TimeBlock value={timeRemaining.minutes} label="Minutes" />
        <TimeBlock value={timeRemaining.seconds} label="Seconds" />
      </div>
    </div>
  )
}

export default CountdownTimer
