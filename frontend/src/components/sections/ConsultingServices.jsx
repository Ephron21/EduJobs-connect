import { FileText, Users, Settings, ArrowRight } from 'lucide-react'

const ConsultingServices = () => {
  const services = [
    {
      id: 1,
      icon: FileText,
      title: 'CV Writing & Review',
      description: 'Professional CV writing and review services to help you stand out to employers and universities.',
      features: [
        'Professional CV formatting',
        'Content optimization',
        'Industry-specific templates',
        'Cover letter writing'
      ],
      price: '15,000 RWF',
      duration: '2-3 days'
    },
    {
      id: 2,
      icon: Users,
      title: 'University Guidance',
      description: 'Expert guidance on university selection, application processes, and scholarship opportunities.',
      features: [
        'University selection advice',
        'Application assistance',
        'Scholarship guidance',
        'Interview preparation'
      ],
      price: '25,000 RWF',
      duration: '1 week'
    },
    {
      id: 3,
      icon: Settings,
      title: 'MIFOTRA Setup',
      description: 'Complete assistance with MIFOTRA (Ministry of Public Service and Labour) registration and setup.',
      features: [
        'Account registration',
        'Profile optimization',
        'Document preparation',
        'Process guidance'
      ],
      price: '10,000 RWF',
      duration: '1-2 days'
    }
  ]

  return (
    <div>
      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-600"
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-6">
              <service.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {service.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {service.description}
            </p>

            {/* Features */}
            <ul className="space-y-2 mb-6">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-3"></div>
                  {feature}
                </li>
              ))}
            </ul>

            {/* Pricing */}
            <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {service.price}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Delivery: {service.duration}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center group">
              Request Service
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="mt-16 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Need Custom Consultation?
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          Have specific needs or questions? Our expert consultants are here to provide personalized guidance 
          for your educational and career journey.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            Schedule Consultation
          </button>
          <button className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-medium border border-gray-300 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
            Contact Us
          </button>
        </div>
      </div>

      {/* Process Steps */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
          How It Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: '01', title: 'Choose Service', description: 'Select the consulting service that fits your needs' },
            { step: '02', title: 'Submit Request', description: 'Fill out the consultation form with your requirements' },
            { step: '03', title: 'Expert Review', description: 'Our experts review your case and prepare solutions' },
            { step: '04', title: 'Receive Results', description: 'Get your completed work within the promised timeframe' }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                {item.step}
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ConsultingServices
