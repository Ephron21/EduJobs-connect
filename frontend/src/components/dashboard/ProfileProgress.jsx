import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  User, 
  FileText, 
  Camera, 
  GraduationCap, 
  Briefcase, 
  Award,
  CheckCircle,
  Circle,
  ArrowRight,
  Star,
  Target
} from 'lucide-react'

const ProfileProgress = () => {
  const navigate = useNavigate()
  const [expandedStep, setExpandedStep] = useState(null)

  const profileSteps = [
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'Complete your personal details',
      icon: User,
      completed: true,
      progress: 100,
      items: [
        { name: 'Full Name', completed: true },
        { name: 'Email Address', completed: true },
        { name: 'Phone Number', completed: true },
        { name: 'Date of Birth', completed: true }
      ],
      route: '/profile/basic'
    },
    {
      id: 'profile-photo',
      title: 'Profile Photo',
      description: 'Upload your professional photo',
      icon: Camera,
      completed: true,
      progress: 100,
      items: [
        { name: 'Profile Picture', completed: true }
      ],
      route: '/profile/photo'
    },
    {
      id: 'education',
      title: 'Education Background',
      description: 'Add your educational qualifications',
      icon: GraduationCap,
      completed: false,
      progress: 60,
      items: [
        { name: 'High School', completed: true },
        { name: 'University/College', completed: true },
        { name: 'Certifications', completed: false },
        { name: 'Additional Courses', completed: false }
      ],
      route: '/profile/education'
    },
    {
      id: 'experience',
      title: 'Work Experience',
      description: 'Share your professional experience',
      icon: Briefcase,
      completed: false,
      progress: 40,
      items: [
        { name: 'Current Position', completed: true },
        { name: 'Previous Jobs', completed: false },
        { name: 'Skills & Expertise', completed: false },
        { name: 'References', completed: false }
      ],
      route: '/profile/experience'
    },
    {
      id: 'achievements',
      title: 'Achievements & Awards',
      description: 'Highlight your accomplishments',
      icon: Award,
      completed: false,
      progress: 20,
      items: [
        { name: 'Academic Awards', completed: false },
        { name: 'Professional Certifications', completed: true },
        { name: 'Projects Portfolio', completed: false },
        { name: 'Volunteer Work', completed: false }
      ],
      route: '/profile/achievements'
    }
  ]

  const totalProgress = Math.round(
    profileSteps.reduce((sum, step) => sum + step.progress, 0) / profileSteps.length
  )

  const completedSteps = profileSteps.filter(step => step.completed).length
  const totalSteps = profileSteps.length

  const handleStepClick = (step) => {
    navigate(step.route)
  }

  const handleExpandStep = (stepId, e) => {
    e.stopPropagation()
    setExpandedStep(expandedStep === stepId ? null : stepId)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Complete Your Profile
        </h3>
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
            {completedSteps}/{totalSteps} Steps
          </span>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Profile Completion
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {totalProgress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 relative"
            style={{ width: `${totalProgress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {totalProgress >= 80 ? 
            'Excellent! Your profile is almost complete.' :
            totalProgress >= 60 ?
            'Good progress! Complete a few more sections.' :
            'Keep going! Complete your profile to get better matches.'
          }
        </p>
      </div>

      {/* Profile Steps */}
      <div className="space-y-3">
        {profileSteps.map((step, index) => {
          const StepIcon = step.icon
          const isExpanded = expandedStep === step.id

          return (
            <div
              key={step.id}
              className={`border rounded-lg transition-all duration-300 ${
                step.completed 
                  ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20' 
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
              } ${isExpanded ? 'ring-2 ring-primary-500' : ''}`}
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => handleStepClick(step)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      step.completed 
                        ? 'bg-green-100 dark:bg-green-800' 
                        : 'bg-gray-100 dark:bg-gray-600'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <StepIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {step.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-xs font-medium text-gray-900 dark:text-white">
                        {step.progress}%
                      </div>
                      <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-1">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            step.completed 
                              ? 'bg-green-500' 
                              : 'bg-primary-500'
                          }`}
                          style={{ width: `${step.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleExpandStep(step.id, e)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <ArrowRight className={`w-4 h-4 transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Step Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {step.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-2">
                          {item.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-400" />
                          )}
                          <span className={`text-sm ${
                            item.completed 
                              ? 'text-green-700 dark:text-green-300' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => handleStepClick(step)}
                      className="mt-3 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                    >
                      {step.completed ? 'Edit Section' : 'Complete Section'}
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Completion Reward */}
      {totalProgress >= 100 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <Star className="w-6 h-6 text-yellow-500" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Profile Complete! 🎉
              </h4>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                You're now eligible for premium features and better job matches.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileProgress
