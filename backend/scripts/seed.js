const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const University = require('../models/University')
const Job = require('../models/Job')
const HomepageSettings = require('../models/HomepageSettings')
const Service = require('../models/Service')
require('dotenv').config()

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...')
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edujobs-connect')
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      University.deleteMany({}),
      Job.deleteMany({}),
      HomepageSettings.deleteMany({}),
      Service.deleteMany({})
    ])
    console.log('🗑️  Cleared existing data')

    // Create admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@edujobsconnect.rw',
      password: 'Admin123!',
      role: 'admin',
      verification: {
        isEmailVerified: true
      }
    })
    await adminUser.save()
    console.log('👤 Created admin user')

    // Create sample students
    const students = [
      {
        firstName: 'Jean',
        lastName: 'Baptiste',
        email: 'jean@example.com',
        password: 'Student123!',
        role: 'student',
        verification: { isEmailVerified: true }
      },
      {
        firstName: 'Marie',
        lastName: 'Claire',
        email: 'marie@example.com',
        password: 'Student123!',
        role: 'student',
        verification: { isEmailVerified: true }
      }
    ]

    const createdStudents = await User.insertMany(students)
    console.log('👥 Created sample students')

    // Create sample employer
    const employer = new User({
      firstName: 'John',
      lastName: 'Employer',
      email: 'employer@company.com',
      password: 'Employer123!',
      role: 'employer',
      verification: { isEmailVerified: true }
    })
    await employer.save()
    console.log('🏢 Created sample employer')

    // Create sample universities
    const universities = [
      {
        name: 'University of Rwanda',
        shortName: 'UR',
        description: 'The leading public university in Rwanda, offering diverse academic programs.',
        location: {
          city: 'Kigali',
          province: 'Kigali',
          country: 'Rwanda'
        },
        programs: [
          {
            name: 'Computer Science',
            degree: 'bachelor',
            faculty: 'Science and Technology',
            duration: { years: 4 },
            tuitionFee: { amount: 500000, currency: 'RWF', period: 'year' },
            description: 'Comprehensive computer science program'
          },
          {
            name: 'Business Administration',
            degree: 'bachelor',
            faculty: 'Economics and Management',
            duration: { years: 4 },
            tuitionFee: { amount: 450000, currency: 'RWF', period: 'year' },
            description: 'Business and management program'
          }
        ],
        rating: {
          overall: 4.5,
          academic: 4.6,
          facilities: 4.2,
          studentLife: 4.7
        },
        featured: true,
        verified: true,
        addedBy: adminUser._id
      },
      {
        name: 'Kigali Institute of Science and Technology',
        shortName: 'KIST',
        description: 'Premier technology institute focusing on science and engineering.',
        location: {
          city: 'Kigali',
          province: 'Kigali',
          country: 'Rwanda'
        },
        programs: [
          {
            name: 'Software Engineering',
            degree: 'bachelor',
            faculty: 'Engineering',
            duration: { years: 4 },
            tuitionFee: { amount: 600000, currency: 'RWF', period: 'year' },
            description: 'Advanced software engineering program'
          }
        ],
        rating: {
          overall: 4.3,
          academic: 4.5,
          facilities: 4.0,
          studentLife: 4.4
        },
        featured: true,
        verified: true,
        addedBy: adminUser._id
      },
      {
        name: 'African Leadership University',
        shortName: 'ALU',
        description: 'Pan-African university developing ethical leaders.',
        location: {
          city: 'Kigali',
          province: 'Kigali',
          country: 'Rwanda'
        },
        programs: [
          {
            name: 'Global Challenges',
            degree: 'bachelor',
            faculty: 'School of Business',
            duration: { years: 4 },
            tuitionFee: { amount: 1200000, currency: 'RWF', period: 'year' },
            description: 'Interdisciplinary program addressing global challenges'
          }
        ],
        rating: {
          overall: 4.7,
          academic: 4.8,
          facilities: 4.9,
          studentLife: 4.5
        },
        featured: true,
        verified: true,
        addedBy: adminUser._id
      }
    ]

    const createdUniversities = await University.insertMany(universities)
    console.log('🎓 Created sample universities')

    // Create sample jobs
    const jobs = [
      {
        title: 'Software Developer',
        description: 'We are looking for a skilled software developer to join our team. You will be responsible for developing and maintaining web applications using modern technologies.',
        company: {
          name: 'Tech Solutions Rwanda',
          description: 'Leading technology company in Rwanda',
          industry: 'Technology'
        },
        location: {
          type: 'onsite',
          city: 'Kigali',
          province: 'Kigali',
          country: 'Rwanda'
        },
        employment: {
          type: 'full-time',
          level: 'junior',
          category: 'technology'
        },
        salary: {
          min: 400000,
          max: 700000,
          currency: 'RWF',
          period: 'month'
        },
        requirements: {
          education: {
            level: 'bachelor',
            field: 'Computer Science or related'
          },
          experience: {
            min: 1,
            max: 3,
            description: '1-3 years of software development experience'
          },
          skills: {
            required: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
            preferred: ['TypeScript', 'AWS', 'Docker']
          },
          languages: [
            { language: 'English', proficiency: 'advanced', required: true },
            { language: 'Kinyarwanda', proficiency: 'native', required: false }
          ]
        },
        responsibilities: [
          'Develop and maintain web applications',
          'Collaborate with cross-functional teams',
          'Write clean, maintainable code',
          'Participate in code reviews'
        ],
        benefits: [
          'Competitive salary',
          'Health insurance',
          'Professional development opportunities',
          'Flexible working hours'
        ],
        featured: true,
        postedBy: employer._id
      },
      {
        title: 'Data Analyst',
        description: 'Join our data team to help drive business decisions through data analysis and insights.',
        company: {
          name: 'Rwanda Analytics Corp',
          description: 'Data analytics and business intelligence company',
          industry: 'Technology'
        },
        location: {
          type: 'hybrid',
          city: 'Kigali',
          province: 'Kigali',
          country: 'Rwanda'
        },
        employment: {
          type: 'full-time',
          level: 'entry',
          category: 'technology'
        },
        salary: {
          min: 350000,
          max: 550000,
          currency: 'RWF',
          period: 'month'
        },
        requirements: {
          education: {
            level: 'bachelor',
            field: 'Statistics, Mathematics, or related'
          },
          experience: {
            min: 0,
            max: 2,
            description: 'Fresh graduates welcome'
          },
          skills: {
            required: ['Excel', 'SQL', 'Python', 'Statistics'],
            preferred: ['R', 'Tableau', 'Power BI']
          }
        },
        responsibilities: [
          'Analyze business data and create reports',
          'Develop dashboards and visualizations',
          'Support data-driven decision making'
        ],
        benefits: [
          'Training and mentorship',
          'Health insurance',
          'Career growth opportunities'
        ],
        featured: true,
        postedBy: employer._id
      },
      {
        title: 'Marketing Manager',
        description: 'Lead our marketing efforts and help grow our brand presence in Rwanda.',
        company: {
          name: 'Rwanda Marketing Pro',
          description: 'Full-service marketing agency',
          industry: 'Marketing'
        },
        location: {
          type: 'onsite',
          city: 'Kigali',
          province: 'Kigali',
          country: 'Rwanda'
        },
        employment: {
          type: 'full-time',
          level: 'mid',
          category: 'marketing'
        },
        salary: {
          min: 500000,
          max: 800000,
          currency: 'RWF',
          period: 'month'
        },
        requirements: {
          education: {
            level: 'bachelor',
            field: 'Marketing, Business, or related'
          },
          experience: {
            min: 3,
            max: 5,
            description: '3-5 years of marketing experience'
          },
          skills: {
            required: ['Digital Marketing', 'Social Media', 'Content Creation', 'Analytics'],
            preferred: ['SEO', 'PPC', 'Email Marketing']
          }
        },
        responsibilities: [
          'Develop and execute marketing strategies',
          'Manage social media presence',
          'Create marketing content',
          'Analyze campaign performance'
        ],
        benefits: [
          'Competitive salary',
          'Performance bonuses',
          'Health insurance',
          'Professional development'
        ],
        postedBy: employer._id
      }
    ]

    const createdJobs = await Job.insertMany(jobs)
    console.log('💼 Created sample jobs')

    // Create homepage settings
    const homepageSettings = new HomepageSettings({
      hero: {
        title: 'Your Gateway to Education and Career Success',
        subtitle: 'Connect with top universities and job opportunities in Rwanda',
        ctaText: 'Get Started',
        ctaLink: '/login'
      },
      stats: {
        universities: { number: '50+', label: 'Universities' },
        jobs: { number: '200+', label: 'Job Opportunities' },
        students: { number: '1000+', label: 'Students Helped' }
      },
      features: [
        {
          title: 'University Applications',
          description: 'Find and apply to universities across Rwanda',
          icon: 'graduation-cap',
          enabled: true
        },
        {
          title: 'Job Opportunities',
          description: 'Discover career opportunities that match your skills',
          icon: 'briefcase',
          enabled: true
        },
        {
          title: 'Career Guidance',
          description: 'Get expert advice on your career path',
          icon: 'users',
          enabled: true
        }
      ],
      testimonials: [
        {
          name: 'Jean Baptiste',
          role: 'Computer Science Student',
          content: 'EduJobs Connect helped me find the perfect university program and secure a scholarship!',
          rating: 5,
          enabled: true
        },
        {
          name: 'Marie Claire',
          role: 'Software Developer',
          content: 'I landed my dream job through this platform. The career guidance was invaluable!',
          rating: 5,
          enabled: true
        },
        {
          name: 'Patrick Nkusi',
          role: 'Business Student',
          content: 'Amazing platform! Made my university application process so much easier.',
          rating: 5,
          enabled: true
        }
      ],
      isActive: true
    })
    await homepageSettings.save()
    console.log('🏠 Created homepage settings')

    // Create consulting services
    const services = [
      {
        title: 'Career Counseling',
        slug: 'career-counseling',
        shortDescription: 'Personalized career guidance and planning sessions',
        description: 'Get professional career counseling to help you make informed decisions about your future. Our expert counselors will work with you to identify your strengths, interests, and career goals.',
        icon: 'target',
        category: 'career',
        features: [
          { title: 'Career Assessment', description: 'Comprehensive evaluation of your skills and interests', included: true },
          { title: 'Goal Setting', description: 'Define clear and achievable career objectives', included: true },
          { title: 'Action Plan', description: 'Detailed roadmap to reach your career goals', included: true }
        ],
        pricing: {
          type: 'free',
          amount: 0,
          currency: 'RWF',
          period: 'one-time'
        },
        benefits: [
          { title: 'Expert Guidance', description: 'Learn from experienced career counselors', icon: 'award' },
          { title: 'Personalized Approach', description: 'Tailored advice for your unique situation', icon: 'user' },
          { title: 'Ongoing Support', description: 'Continued assistance as you progress', icon: 'heart' }
        ],
        isActive: true,
        isFeatured: true,
        order: 1,
        createdBy: adminUser._id
      },
      {
        title: 'CV & Resume Writing',
        slug: 'cv-resume-writing',
        shortDescription: 'Professional CV creation and optimization services',
        description: 'Stand out from the competition with a professionally crafted CV. We optimize your resume for ATS systems and tailor it to your industry.',
        icon: 'file-text',
        category: 'career',
        features: [
          { title: 'ATS Optimization', description: 'Ensure your CV passes automated screening', included: true },
          { title: 'Industry Specific', description: 'Tailored to your target industry', included: true },
          { title: 'Cover Letter', description: 'Compelling cover letter included', included: true }
        ],
        pricing: {
          type: 'paid',
          amount: 25000,
          currency: 'RWF',
          period: 'one-time'
        },
        benefits: [
          { title: 'Professional Quality', description: 'Industry-standard formatting and content', icon: 'star' },
          { title: 'Fast Turnaround', description: 'Delivered within 2-3 business days', icon: 'clock' },
          { title: 'Revisions Included', description: 'Up to 2 rounds of revisions', icon: 'refresh-cw' }
        ],
        isActive: true,
        isFeatured: true,
        order: 2,
        createdBy: adminUser._id
      },
      {
        title: 'Interview Preparation',
        slug: 'interview-preparation',
        shortDescription: 'Mock interviews and comprehensive coaching sessions',
        description: 'Ace your interviews with our comprehensive preparation service. Practice with mock interviews and receive expert feedback to boost your confidence.',
        icon: 'message-square',
        category: 'career',
        features: [
          { title: 'Mock Interview', description: 'Practice with realistic interview scenarios', included: true },
          { title: 'Expert Feedback', description: 'Detailed analysis of your performance', included: true },
          { title: 'Tips & Strategies', description: 'Proven techniques to impress interviewers', included: true }
        ],
        pricing: {
          type: 'paid',
          amount: 30000,
          currency: 'RWF',
          period: 'one-time'
        },
        benefits: [
          { title: 'Build Confidence', description: 'Feel prepared and confident', icon: 'zap' },
          { title: 'Industry Insights', description: 'Learn what employers are looking for', icon: 'lightbulb' },
          { title: 'Personalized Coaching', description: 'One-on-one guidance and support', icon: 'users' }
        ],
        isActive: true,
        isFeatured: true,
        order: 3,
        createdBy: adminUser._id
      }
    ]
    await Service.insertMany(services)
    console.log('🛠️  Created consulting services')

    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`👤 Users: ${await User.countDocuments()}`)
    console.log(`🎓 Universities: ${await University.countDocuments()}`)
    console.log(`💼 Jobs: ${await Job.countDocuments()}`)
    console.log(`🏠 Homepage Settings: ${await HomepageSettings.countDocuments()}`)
    console.log(`🛠️  Services: ${await Service.countDocuments()}`)
    
    console.log('\n🔑 Login Credentials:')
    console.log('Admin: admin@edujobsconnect.rw / Admin123!')
    console.log('Student: jean@example.com / Student123!')
    console.log('Employer: employer@company.com / Employer123!')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
    process.exit(0)
  }
}

// Run seeding
seedData()
