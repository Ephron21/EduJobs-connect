const mongoose = require('mongoose')

const homepageSettingsSchema = new mongoose.Schema({
  // Hero Section
  hero: {
    title: {
      type: String,
      default: 'Your Gateway to Education and Career Success'
    },
    subtitle: {
      type: String,
      default: 'Connect with top universities and job opportunities in Rwanda'
    },
    ctaText: {
      type: String,
      default: 'Get Started'
    },
    ctaLink: {
      type: String,
      default: '/login'
    },
    backgroundImage: {
      type: String,
      default: ''
    }
  },

  // Statistics
  stats: {
    universities: {
      number: { type: String, default: '50+' },
      label: { type: String, default: 'Universities' }
    },
    jobs: {
      number: { type: String, default: '200+' },
      label: { type: String, default: 'Job Opportunities' }
    },
    students: {
      number: { type: String, default: '1000+' },
      label: { type: String, default: 'Students Helped' }
    }
  },

  // Features Section
  features: [{
    title: String,
    description: String,
    icon: String,
    enabled: { type: Boolean, default: true }
  }],

  // Testimonials
  testimonials: [{
    name: String,
    role: String,
    content: String,
    avatar: String,
    rating: { type: Number, min: 1, max: 5, default: 5 },
    enabled: { type: Boolean, default: true }
  }],

  // About Section
  about: {
    title: {
      type: String,
      default: 'About EduJobs Connect'
    },
    description: {
      type: String,
      default: 'We connect Rwandan students with educational and career opportunities'
    },
    image: {
      type: String,
      default: ''
    }
  },

  // Call to Action
  cta: {
    title: {
      type: String,
      default: 'Ready to Start Your Journey?'
    },
    description: {
      type: String,
      default: 'Join thousands of students who have found their path to success'
    },
    buttonText: {
      type: String,
      default: 'Sign Up Now'
    },
    buttonLink: {
      type: String,
      default: '/register'
    }
  },

  // SEO
  seo: {
    title: {
      type: String,
      default: 'EduJobs Connect - Education & Career Platform'
    },
    description: {
      type: String,
      default: 'Find universities, jobs, and career guidance in Rwanda'
    },
    keywords: {
      type: String,
      default: 'education, jobs, universities, Rwanda, career'
    }
  },

  // Settings
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('HomepageSettings', homepageSettingsSchema)