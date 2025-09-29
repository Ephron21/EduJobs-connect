import { useTranslation } from 'react-i18next'
import HeroSection from '../components/sections/HeroSection'
import UniversityApplications from '../components/sections/UniversityApplications'
import JobVacancies from '../components/sections/JobVacancies'
import ConsultingServices from '../components/sections/ConsultingServices'

const Home = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* University Applications Section */}
      <section id="universities" className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('sections.universities')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover scholarship opportunities, loan programs, and self-paid options for local and international universities.
            </p>
          </div>
          <UniversityApplications />
        </div>
      </section>

      {/* Job Vacancies Section */}
      <section id="jobs" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('sections.jobs')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find job opportunities across various industries and career levels in Rwanda and beyond.
            </p>
          </div>
          <JobVacancies />
        </div>
      </section>

      {/* Consulting Services Section */}
      <section id="consulting" className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('sections.consulting')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get professional guidance for your career and educational journey with our expert consulting services.
            </p>
          </div>
          <ConsultingServices />
        </div>
      </section>
    </div>
  )
}

export default Home
