import { useTranslation } from 'react-i18next'

const Loading = ({ size = 'medium', text = null }) => {
  const { t } = useTranslation()
  
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 ${sizeClasses[size]}`}></div>
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {text}
        </p>
      )}
      {!text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {t('common.loading')}
        </p>
      )}
    </div>
  )
}

export default Loading
