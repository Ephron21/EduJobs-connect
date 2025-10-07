import { useState, useEffect } from 'react'
import { 
  Save, Plus, Trash2, Eye, Edit, Star, Image as ImageIcon,
  Home, Users, Award, MessageSquare, Settings as SettingsIcon
} from 'lucide-react'
import api from '../../services/api'
import Loading from '../common/Loading'

const HomepageEditor = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [settings, setSettings] = useState({
    hero: {
      title: '',
      subtitle: '',
      ctaText: '',
      ctaLink: '',
      backgroundImage: ''
    },
    stats: {
      universities: { number: '', label: '' },
      jobs: { number: '', label: '' },
      students: { number: '', label: '' }
    },
    features: [],
    testimonials: [],
    about: {
      title: '',
      description: '',
      image: ''
    },
    cta: {
      title: '',
      description: '',
      buttonText: '',
      buttonLink: ''
    },
    seo: {
      title: '',
      description: '',
      keywords: ''
    }
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/homepage')
      if (response.data.settings) {
        setSettings(response.data.settings)
      }
    } catch (error) {
      console.error('Failed to fetch homepage settings:', error)
      alert('Failed to load homepage settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await api.put('/admin/homepage', settings)
      alert('Homepage settings saved successfully!')
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const updateHero = (field, value) => {
    setSettings(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }))
  }

  const updateStats = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [category]: { ...prev.stats[category], [field]: value }
      }
    }))
  }

  const addFeature = () => {
    setSettings(prev => ({
      ...prev,
      features: [...prev.features, {
        title: '',
        description: '',
        icon: 'star',
        enabled: true
      }]
    }))
  }

  const updateFeature = (index, field, value) => {
    setSettings(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }))
  }

  const deleteFeature = (index) => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      setSettings(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }))
    }
  }

  const addTestimonial = () => {
    setSettings(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, {
        name: '',
        role: '',
        content: '',
        avatar: '',
        rating: 5,
        enabled: true
      }]
    }))
  }

  const updateTestimonial = (index, field, value) => {
    setSettings(prev => ({
      ...prev,
      testimonials: prev.testimonials.map((testimonial, i) => 
        i === index ? { ...testimonial, [field]: value } : testimonial
      )
    }))
  }

  const deleteTestimonial = (index) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      setSettings(prev => ({
        ...prev,
        testimonials: prev.testimonials.filter((_, i) => i !== index)
      }))
    }
  }

  const updateAbout = (field, value) => {
    setSettings(prev => ({
      ...prev,
      about: { ...prev.about, [field]: value }
    }))
  }

  const updateCTA = (field, value) => {
    setSettings(prev => ({
      ...prev,
      cta: { ...prev.cta, [field]: value }
    }))
  }

  const updateSEO = (field, value) => {
    setSettings(prev => ({
      ...prev,
      seo: { ...prev.seo, [field]: value }
    }))
  }

  if (loading) {
    return <Loading message="Loading homepage settings..." />
  }

  const sections = [
    { id: 'hero', label: 'Hero Section', icon: Home },
    { id: 'stats', label: 'Statistics', icon: Award },
    { id: 'features', label: 'Features', icon: Star },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'about', label: 'About', icon: Users },
    { id: 'cta', label: 'Call to Action', icon: Eye },
    { id: 'seo', label: 'SEO Settings', icon: SettingsIcon }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Homepage Editor</h2>
              <p className="text-indigo-100 text-sm">
                Customize your homepage content and appearance
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeSection === section.id
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <section.icon className="w-4 h-4" />
              <span>{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        {/* Hero Section */}
        {activeSection === 'hero' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Hero Section</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Main Title
              </label>
              <input
                type="text"
                value={settings.hero.title}
                onChange={(e) => updateHero('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Your Gateway to Education and Career Success"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subtitle
              </label>
              <textarea
                value={settings.hero.subtitle}
                onChange={(e) => updateHero('subtitle', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Connect with top universities and job opportunities in Rwanda"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={settings.hero.ctaText}
                  onChange={(e) => updateHero('ctaText', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Get Started"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CTA Button Link
                </label>
                <input
                  type="text"
                  value={settings.hero.ctaLink}
                  onChange={(e) => updateHero('ctaLink', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="/login"
                />
              </div>
            </div>
          </div>
        )}

        {/* Statistics Section */}
        {activeSection === 'stats' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Statistics</h3>
            
            {['universities', 'jobs', 'students'].map((category) => (
              <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 capitalize">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Number
                    </label>
                    <input
                      type="text"
                      value={settings.stats[category]?.number || ''}
                      onChange={(e) => updateStats(category, 'number', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="50+"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Label
                    </label>
                    <input
                      type="text"
                      value={settings.stats[category]?.label || ''}
                      onChange={(e) => updateStats(category, 'label', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Universities"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Features Section */}
        {activeSection === 'features' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Features</h3>
              <button
                onClick={addFeature}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Feature</span>
              </button>
            </div>

            {settings.features.map((feature, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Feature {index + 1}</h4>
                  <button
                    onClick={() => deleteFeature(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => updateFeature(index, 'title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={feature.description}
                      onChange={(e) => updateFeature(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Icon
                      </label>
                      <select
                        value={feature.icon}
                        onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="graduation-cap">Graduation Cap</option>
                        <option value="briefcase">Briefcase</option>
                        <option value="users">Users</option>
                        <option value="star">Star</option>
                        <option value="award">Award</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={feature.enabled}
                          onChange={(e) => updateFeature(index, 'enabled', e.target.checked)}
                          className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enabled</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {settings.features.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No features added yet. Click "Add Feature" to create one.
              </div>
            )}
          </div>
        )}

        {/* Testimonials Section */}
        {activeSection === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Testimonials</h3>
              <button
                onClick={addTestimonial}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Testimonial</span>
              </button>
            </div>

            {settings.testimonials.map((testimonial, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Testimonial {index + 1}</h4>
                  <button
                    onClick={() => deleteTestimonial(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={testimonial.name}
                        onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        value={testimonial.role}
                        onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Content
                    </label>
                    <textarea
                      value={testimonial.content}
                      onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rating
                      </label>
                      <select
                        value={testimonial.rating}
                        onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={testimonial.enabled}
                          onChange={(e) => updateTestimonial(index, 'enabled', e.target.checked)}
                          className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enabled</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {settings.testimonials.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No testimonials added yet. Click "Add Testimonial" to create one.
              </div>
            )}
          </div>
        )}

        {/* About Section */}
        {activeSection === 'about' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About Section</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={settings.about.title}
                onChange={(e) => updateAbout('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={settings.about.description}
                onChange={(e) => updateAbout('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* CTA Section */}
        {activeSection === 'cta' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Call to Action</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={settings.cta.title}
                onChange={(e) => updateCTA('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={settings.cta.description}
                onChange={(e) => updateCTA('description', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  value={settings.cta.buttonText}
                  onChange={(e) => updateCTA('buttonText', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Button Link
                </label>
                <input
                  type="text"
                  value={settings.cta.buttonLink}
                  onChange={(e) => updateCTA('buttonLink', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* SEO Section */}
        {activeSection === 'seo' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">SEO Settings</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Page Title
              </label>
              <input
                type="text"
                value={settings.seo.title}
                onChange={(e) => updateSEO('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meta Description
              </label>
              <textarea
                value={settings.seo.description}
                onChange={(e) => updateSEO('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Keywords (comma separated)
              </label>
              <input
                type="text"
                value={settings.seo.keywords}
                onChange={(e) => updateSEO('keywords', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>
    </div>
  )
}

export default HomepageEditor