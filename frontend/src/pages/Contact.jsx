import { useState } from 'react'
import { 
  Mail, Phone, MapPin, Send, Clock, MessageSquare, 
  CheckCircle, Star, Sparkles, Zap, Users,
  Globe, Shield
} from 'lucide-react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setShowSuccess(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setShowSuccess(false), 5000)
      } else {
        alert(`Error: ${data.message || 'Failed to send message'}`)
      }
    } catch (error) {
      console.error('Contact form error:', error)
      alert('Failed to send message. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent("Hello! I'm interested in learning more about EduJobs Connect services. Could you please provide me with more information?")
    window.open(`https://wa.me/250787846344?text=${message}`, '_blank')
  }

  const contactMethods = [
    {
      icon: MessageSquare,
      title: 'WhatsApp Support',
      details: '+250 787 846 344',
      description: 'Instant support & quick responses',
      action: handleWhatsAppContact,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: 'info@edujobsconnect.rw',
      description: 'Detailed inquiries & documentation',
      action: () => window.location.href = 'mailto:info@edujobsconnect.rw',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+250 787 846 344',
      description: 'Direct phone consultation',
      action: () => window.location.href = 'tel:+250787846344',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ]

  const officeHours = [
    { day: 'Monday - Friday', hours: '8:00 AM - 5:00 PM', available: true },
    { day: 'Saturday', hours: '9:00 AM - 1:00 PM', available: true },
    { day: 'Sunday', hours: 'Closed', available: false }
  ]

  const supportFeatures = [
    {
      icon: Zap,
      title: 'Instant Response',
      description: 'Get answers within minutes via WhatsApp'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Dedicated professionals ready to help'
    },
    {
      icon: Globe,
      title: '24/7 AI Support',
      description: 'Our AI chatbot is always available'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your information is safe with us'
    }
  ]

  const testimonials = [
    {
      name: 'Marie Uwimana',
      role: 'University Student',
      content: 'The support team helped me find the perfect scholarship. Their response was incredibly fast!',
      rating: 5
    },
    {
      name: 'Jean Baptiste',
      role: 'Job Seeker',
      content: 'Found my dream job through their platform. The WhatsApp support made everything so easy.',
      rating: 5
    },
    {
      name: 'Grace Mukamana',
      role: 'Graduate',
      content: 'Professional guidance throughout my application process. Highly recommend their services!',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium mb-6 animate-bounce">
            <Sparkles className="w-4 h-4 mr-2" />
            We're Here to Help You Succeed!
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Get in Touch
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Have questions? Need guidance? We're here to support your educational and career journey every step of the way.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleWhatsAppContact}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <MessageSquare className="mr-2 w-5 h-5" />
              WhatsApp Us Now
            </button>
            
            <button
              onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-xl border border-gray-200 transform hover:-translate-y-1 transition-all duration-200"
            >
              <Mail className="mr-2 w-5 h-5" />
              Send Message
            </button>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="fixed top-4 right-4 z-50 bg-green-500 text-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Message sent successfully! We'll get back to you soon.</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Multiple Ways to Reach Us
            </h2>
            <p className="text-lg text-gray-600">
              Choose the method that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                onClick={method.action}
                className={`${method.bgColor} rounded-2xl p-8 text-center cursor-pointer transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl group`}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-semibold ${method.textColor} mb-2`}>
                  {method.title}
                </h3>
                <p className={`text-lg font-medium ${method.textColor} mb-2`}>
                  {method.details}
                </p>
                <p className="text-gray-600">
                  {method.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Features */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Our Support is Different
            </h2>
            <p className="text-lg text-gray-600">
              We go above and beyond to ensure your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Office Hours */}
      <section id="contact-form" className="py-16 bg-gray-50 dark:bg-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Send us a Message
                </h2>
                <p className="text-gray-600">
                  We'll respond within 24 hours
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 transition-all duration-200"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 transition-all duration-200"
                    placeholder="What is this about?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 transition-all duration-200"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Office Hours & Info */}
            <div className="space-y-8">
              {/* Office Hours */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-6">
                  <Clock className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Office Hours
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {officeHours.map((schedule, index) => (
                    <div key={index} className={`flex justify-between items-center py-3 px-4 rounded-lg ${
                      schedule.available 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <span className="font-medium text-gray-900">
                        {schedule.day}
                      </span>
                      <span className={`font-semibold ${
                        schedule.available 
                          ? 'text-green-600' 
                          : 'text-gray-500'
                      }`}>
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-6">
                  <MapPin className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Visit Our Office
                  </h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    <strong>Address:</strong><br />
                    KG 9 Ave, Nyarugenge District<br />
                    Kigali, Rwanda
                  </p>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-700">
                      <strong>💡 Pro Tip:</strong> For fastest response, contact us via WhatsApp or use our AI chatbot for instant answers!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Users Say About Our Support
            </h2>
            <p className="text-lg text-gray-600">
              Real feedback from students and professionals we've helped
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact