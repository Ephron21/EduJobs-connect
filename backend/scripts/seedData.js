import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { connectDB } from '../utils/database.js'

// Import models
import User from '../models/User.js'
import Student from '../models/Student.js'
import University from '../models/University.js'
import Job from '../models/Job.js'
import Application from '../models/Application.js'
import Consultation from '../models/Consultation.js'

dotenv.config()

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...')
    
    // Connect to database
    await connectDB()
    
    // Clear existing data
    console.log('🗑️ Clearing existing data...')
    await User.deleteMany({})
    await Student.deleteMany({})
    await University.deleteMany({})
    await Job.deleteMany({})
    await Application.deleteMany({})
    await Consultation.deleteMany({})
    
    // Create Users
    console.log('👥 Creating users...')
    const hashedPassword = await bcrypt.hash('EduJobs21%', 12)
    
    const users = await User.create([
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@edujobs.com',
        phoneNumber: '+250788123456',
        password: hashedPassword,
        role: 'admin',
        isVerified: true
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        phoneNumber: '+250788234567',
        password: hashedPassword,
        role: 'student',
        isVerified: true
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@gmail.com',
        phoneNumber: '+250788345678',
        password: hashedPassword,
        role: 'student',
        isVerified: true
      },
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@gmail.com',
        phoneNumber: '+250788456789',
        password: hashedPassword,
        role: 'student',
        isVerified: true
      },
      {
        firstName: 'Bob',
        lastName: 'Wilson',
        email: 'bob.wilson@gmail.com',
        phoneNumber: '+250788567890',
        password: hashedPassword,
        role: 'student',
        isVerified: false
      },
      {
        firstName: 'Emma',
        lastName: 'Brown',
        email: 'emma.brown@gmail.com',
        phoneNumber: '+250788678901',
        password: hashedPassword,
        role: 'student',
        isVerified: true
      }
    ])
    
    console.log(`✅ Created ${users.length} users`)
    
    // Create Universities
    console.log('🏛️ Creating universities...')
    const universities = await University.create([
      {
        name: 'University of Rwanda',
        location: 'Kigali, Rwanda',
        country: 'Rwanda',
        website: 'https://www.ur.ac.rw',
        description: 'The University of Rwanda is the largest public university in Rwanda, formed in 2013 through the merger of seven public institutions of higher education.',
        programs: [
          'Computer Science',
          'Engineering',
          'Medicine',
          'Business Administration',
          'Agriculture',
          'Education'
        ],
        requirements: {
          gpa: 3.0,
          languageTest: 'IELTS 6.0 or TOEFL 80',
          documents: ['Transcripts', 'Recommendation Letters', 'Personal Statement']
        },
        tuitionFee: {
          local: 500000,
          international: 2000000,
          currency: 'RWF'
        },
        applicationDeadline: new Date('2024-06-30'),
        isActive: true
      },
      {
        name: 'Makerere University',
        location: 'Kampala, Uganda',
        country: 'Uganda',
        website: 'https://www.mak.ac.ug',
        description: 'Makerere University is Uganda\'s largest and oldest institution of higher learning, first established as a technical school in 1922.',
        programs: [
          'Medicine',
          'Engineering',
          'Law',
          'Business',
          'Arts and Social Sciences',
          'Science'
        ],
        requirements: {
          gpa: 3.2,
          languageTest: 'IELTS 6.5 or TOEFL 90',
          documents: ['Academic Transcripts', 'Birth Certificate', 'Passport Copy']
        },
        tuitionFee: {
          local: 1500000,
          international: 3000000,
          currency: 'UGX'
        },
        applicationDeadline: new Date('2024-07-15'),
        isActive: true
      },
      {
        name: 'University of Nairobi',
        location: 'Nairobi, Kenya',
        country: 'Kenya',
        website: 'https://www.uonbi.ac.ke',
        description: 'The University of Nairobi is a collegiate research university based in Nairobi, Kenya. It is one of the largest universities in Kenya.',
        programs: [
          'Medicine',
          'Engineering',
          'Business',
          'Agriculture',
          'Veterinary Medicine',
          'Architecture'
        ],
        requirements: {
          gpa: 3.3,
          languageTest: 'IELTS 7.0 or TOEFL 100',
          documents: ['KCSE Certificate', 'Transcripts', 'Medical Certificate']
        },
        tuitionFee: {
          local: 120000,
          international: 400000,
          currency: 'KES'
        },
        applicationDeadline: new Date('2024-08-30'),
        isActive: true
      },
      {
        name: 'Harvard University',
        location: 'Cambridge, Massachusetts',
        country: 'United States',
        website: 'https://www.harvard.edu',
        description: 'Harvard University is a private Ivy League research university in Cambridge, Massachusetts. Established in 1636, it is the oldest institution of higher education in the United States.',
        programs: [
          'Computer Science',
          'Medicine',
          'Law',
          'Business Administration',
          'Engineering',
          'Liberal Arts'
        ],
        requirements: {
          gpa: 3.9,
          languageTest: 'IELTS 7.5 or TOEFL 110',
          documents: ['SAT/ACT Scores', 'Transcripts', 'Essays', 'Recommendation Letters']
        },
        tuitionFee: {
          local: 54000,
          international: 54000,
          currency: 'USD'
        },
        applicationDeadline: new Date('2024-01-01'),
        isActive: true
      },
      {
        name: 'University of Cape Town',
        location: 'Cape Town, South Africa',
        country: 'South Africa',
        website: 'https://www.uct.ac.za',
        description: 'The University of Cape Town is a public research university located in Cape Town, South Africa. It was founded in 1829 as the South African College.',
        programs: [
          'Medicine',
          'Engineering',
          'Commerce',
          'Law',
          'Science',
          'Humanities'
        ],
        requirements: {
          gpa: 3.5,
          languageTest: 'IELTS 7.0 or TOEFL 100',
          documents: ['Matric Certificate', 'Academic Record', 'ID Copy']
        },
        tuitionFee: {
          local: 65000,
          international: 180000,
          currency: 'ZAR'
        },
        applicationDeadline: new Date('2024-09-30'),
        isActive: true
      }
    ])
    
    console.log(`✅ Created ${universities.length} universities`)
    
    // Create Students
    console.log('🎓 Creating student profiles...')
    const studentUsers = users.filter(user => user.role === 'student')
    
    const students = await Student.create([
      {
        userId: studentUsers[0]._id,
        dateOfBirth: new Date('2000-05-15'),
        nationality: 'Rwandan',
        currentLevel: 'High School Graduate',
        interestedFields: ['Computer Science', 'Engineering', 'Technology'],
        academicRecords: [
          {
            institution: 'Green Hills Academy',
            level: 'High School',
            grade: 'A',
            year: 2022,
            subjects: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science']
          }
        ],
        languageTests: [
          {
            testType: 'IELTS',
            score: '7.5',
            date: new Date('2023-03-15')
          }
        ],
        workExperience: [
          {
            company: 'Tech Solutions Rwanda',
            position: 'Intern Developer',
            duration: '3 months',
            description: 'Worked on web development projects using React and Node.js'
          }
        ]
      },
      {
        userId: studentUsers[1]._id,
        dateOfBirth: new Date('1999-08-22'),
        nationality: 'Kenyan',
        currentLevel: 'Undergraduate',
        interestedFields: ['Medicine', 'Healthcare', 'Research'],
        academicRecords: [
          {
            institution: 'Nairobi University',
            level: 'Undergraduate',
            grade: 'B+',
            year: 2023,
            subjects: ['Biology', 'Chemistry', 'Physics', 'Mathematics']
          }
        ],
        languageTests: [
          {
            testType: 'TOEFL',
            score: '95',
            date: new Date('2023-01-20')
          }
        ]
      },
      {
        userId: studentUsers[2]._id,
        dateOfBirth: new Date('2001-12-10'),
        nationality: 'Ugandan',
        currentLevel: 'High School Graduate',
        interestedFields: ['Business', 'Economics', 'Finance'],
        academicRecords: [
          {
            institution: 'Kampala International School',
            level: 'High School',
            grade: 'A-',
            year: 2023,
            subjects: ['Economics', 'Mathematics', 'English', 'History']
          }
        ],
        languageTests: [
          {
            testType: 'IELTS',
            score: '6.5',
            date: new Date('2023-06-10')
          }
        ]
      },
      {
        userId: studentUsers[3]._id,
        dateOfBirth: new Date('2000-03-18'),
        nationality: 'Rwandan',
        currentLevel: 'Undergraduate',
        interestedFields: ['Agriculture', 'Environmental Science', 'Sustainability'],
        academicRecords: [
          {
            institution: 'IPRC Kigali',
            level: 'Diploma',
            grade: 'Distinction',
            year: 2022,
            subjects: ['Agriculture', 'Biology', 'Chemistry', 'Environmental Science']
          }
        ]
      },
      {
        userId: studentUsers[4]._id,
        dateOfBirth: new Date('2002-07-25'),
        nationality: 'Tanzanian',
        currentLevel: 'High School',
        interestedFields: ['Engineering', 'Mathematics', 'Physics'],
        academicRecords: [
          {
            institution: 'Dar es Salaam Secondary School',
            level: 'High School',
            grade: 'B+',
            year: 2024,
            subjects: ['Mathematics', 'Physics', 'Chemistry', 'English']
          }
        ]
      }
    ])
    
    console.log(`✅ Created ${students.length} student profiles`)
    
    // Create Jobs
    console.log('💼 Creating job listings...')
    const jobs = await Job.create([
      {
        title: 'Software Developer Intern',
        company: 'Rwanda ICT Chamber',
        location: 'Kigali, Rwanda',
        type: 'Internship',
        category: 'Technology',
        description: 'We are looking for a motivated software developer intern to join our team. You will work on real-world projects and gain valuable experience in web development.',
        requirements: [
          'Basic knowledge of JavaScript, HTML, CSS',
          'Familiarity with React or Vue.js',
          'Good communication skills',
          'Currently pursuing a degree in Computer Science or related field'
        ],
        responsibilities: [
          'Develop and maintain web applications',
          'Collaborate with senior developers',
          'Participate in code reviews',
          'Learn new technologies and frameworks'
        ],
        salary: {
          min: 100000,
          max: 200000,
          currency: 'RWF',
          period: 'monthly'
        },
        benefits: ['Training', 'Mentorship', 'Certificate'],
        deadline: new Date('2024-12-31'),
        isActive: true,
        postedBy: users[0]._id
      },
      {
        title: 'Marketing Assistant',
        company: 'Bank of Kigali',
        location: 'Kigali, Rwanda',
        type: 'Part-time',
        category: 'Marketing',
        description: 'Join our marketing team as an assistant to help with digital marketing campaigns and customer engagement initiatives.',
        requirements: [
          'Degree in Marketing, Communications, or related field',
          'Social media management experience',
          'Excellent written and verbal communication',
          'Creative thinking and problem-solving skills'
        ],
        responsibilities: [
          'Assist in creating marketing content',
          'Manage social media accounts',
          'Conduct market research',
          'Support marketing campaigns'
        ],
        salary: {
          min: 150000,
          max: 250000,
          currency: 'RWF',
          period: 'monthly'
        },
        benefits: ['Health Insurance', 'Training', 'Flexible Hours'],
        deadline: new Date('2024-11-30'),
        isActive: true,
        postedBy: users[0]._id
      },
      {
        title: 'Research Assistant',
        company: 'University of Rwanda',
        location: 'Kigali, Rwanda',
        type: 'Part-time',
        category: 'Research',
        description: 'Research assistant position available in the Department of Computer Science. Perfect for students interested in AI and machine learning research.',
        requirements: [
          'Undergraduate or graduate student in Computer Science',
          'Knowledge of Python and data analysis',
          'Interest in artificial intelligence',
          'Strong analytical skills'
        ],
        responsibilities: [
          'Assist in research projects',
          'Data collection and analysis',
          'Literature review',
          'Prepare research reports'
        ],
        salary: {
          min: 80000,
          max: 120000,
          currency: 'RWF',
          period: 'monthly'
        },
        benefits: ['Research Experience', 'Academic Credit', 'Publication Opportunities'],
        deadline: new Date('2025-01-15'),
        isActive: true,
        postedBy: users[0]._id
      },
      {
        title: 'Junior Data Analyst',
        company: 'MTN Rwanda',
        location: 'Kigali, Rwanda',
        type: 'Full-time',
        category: 'Data Science',
        description: 'Entry-level position for a data analyst to work with our business intelligence team analyzing customer data and market trends.',
        requirements: [
          'Bachelor\'s degree in Statistics, Mathematics, or Computer Science',
          'Proficiency in SQL and Excel',
          'Knowledge of Python or R',
          'Strong analytical and problem-solving skills'
        ],
        responsibilities: [
          'Analyze customer data and trends',
          'Create reports and dashboards',
          'Support business decision-making',
          'Collaborate with cross-functional teams'
        ],
        salary: {
          min: 400000,
          max: 600000,
          currency: 'RWF',
          period: 'monthly'
        },
        benefits: ['Health Insurance', 'Training', 'Career Development', 'Bonus'],
        deadline: new Date('2024-12-15'),
        isActive: true,
        postedBy: users[0]._id
      },
      {
        title: 'Teaching Assistant',
        company: 'AUCA (Adventist University of Central Africa)',
        location: 'Kigali, Rwanda',
        type: 'Part-time',
        category: 'Education',
        description: 'Teaching assistant position for undergraduate courses in Business Administration. Great opportunity for graduate students.',
        requirements: [
          'Master\'s degree in Business or related field',
          'Teaching or tutoring experience preferred',
          'Excellent communication skills',
          'Passion for education'
        ],
        responsibilities: [
          'Assist professors in course delivery',
          'Grade assignments and exams',
          'Conduct tutorial sessions',
          'Support student learning'
        ],
        salary: {
          min: 200000,
          max: 300000,
          currency: 'RWF',
          period: 'monthly'
        },
        benefits: ['Professional Development', 'Flexible Schedule', 'Academic Environment'],
        deadline: new Date('2025-02-28'),
        isActive: true,
        postedBy: users[0]._id
      }
    ])
    
    console.log(`✅ Created ${jobs.length} job listings`)
    
    // Create Applications
    console.log('📄 Creating applications...')
    const applications = await Application.create([
      {
        studentId: students[0]._id,
        universityId: universities[0]._id,
        program: 'Computer Science',
        status: 'pending',
        applicationDate: new Date('2024-03-15'),
        documents: [
          {
            type: 'transcript',
            filename: 'transcript_john_doe.pdf',
            uploadDate: new Date('2024-03-15')
          },
          {
            type: 'recommendation',
            filename: 'recommendation_letter.pdf',
            uploadDate: new Date('2024-03-16')
          }
        ],
        personalStatement: 'I am passionate about computer science and eager to contribute to technological advancement in Rwanda.',
        expectedStartDate: new Date('2024-09-01')
      },
      {
        studentId: students[1]._id,
        universityId: universities[1]._id,
        program: 'Medicine',
        status: 'accepted',
        applicationDate: new Date('2024-02-20'),
        documents: [
          {
            type: 'transcript',
            filename: 'transcript_jane_smith.pdf',
            uploadDate: new Date('2024-02-20')
          }
        ],
        personalStatement: 'My goal is to become a doctor and serve communities in need of quality healthcare.',
        expectedStartDate: new Date('2024-08-15'),
        reviewDate: new Date('2024-04-10'),
        reviewNotes: 'Excellent academic record and strong motivation. Accepted for Fall 2024.'
      },
      {
        studentId: students[2]._id,
        universityId: universities[2]._id,
        program: 'Business Administration',
        status: 'rejected',
        applicationDate: new Date('2024-01-10'),
        documents: [
          {
            type: 'transcript',
            filename: 'transcript_alice_johnson.pdf',
            uploadDate: new Date('2024-01-10')
          }
        ],
        personalStatement: 'I want to pursue business studies to become an entrepreneur and create jobs in Uganda.',
        expectedStartDate: new Date('2024-09-01'),
        reviewDate: new Date('2024-03-15'),
        reviewNotes: 'Good application but limited spaces available. Encourage to reapply next year.'
      },
      {
        studentId: students[0]._id,
        universityId: universities[3]._id,
        program: 'Computer Science',
        status: 'under_review',
        applicationDate: new Date('2024-04-01'),
        documents: [
          {
            type: 'transcript',
            filename: 'transcript_john_harvard.pdf',
            uploadDate: new Date('2024-04-01')
          },
          {
            type: 'essay',
            filename: 'personal_essay.pdf',
            uploadDate: new Date('2024-04-02')
          }
        ],
        personalStatement: 'Harvard represents the pinnacle of academic excellence, and I am committed to contributing to its legacy of innovation.',
        expectedStartDate: new Date('2024-09-01')
      }
    ])
    
    console.log(`✅ Created ${applications.length} applications`)
    
    // Create Consultations
    console.log('💬 Creating consultations...')
    const consultations = await Consultation.create([
      {
        userId: studentUsers[0]._id,
        serviceType: 'university_guidance',
        title: 'Help choosing the right university',
        description: 'I need guidance on selecting the best university for computer science studies. I am particularly interested in programs with strong industry connections.',
        status: 'pending',
        priority: 'medium',
        preferredDate: new Date('2024-10-15'),
        contactMethod: 'video_call',
        notes: [
          {
            author: studentUsers[0]._id,
            content: 'I have a 3.8 GPA and good IELTS scores. Looking for programs with internship opportunities.',
            isInternal: false
          }
        ]
      },
      {
        userId: studentUsers[1]._id,
        serviceType: 'application_review',
        title: 'Review my medical school application',
        description: 'I would like someone to review my application materials for medical school before I submit them.',
        status: 'in_progress',
        priority: 'high',
        preferredDate: new Date('2024-10-10'),
        contactMethod: 'in_person',
        assignedTo: users[0]._id,
        notes: [
          {
            author: studentUsers[1]._id,
            content: 'I have completed all required courses and have volunteer experience at local hospitals.',
            isInternal: false
          },
          {
            author: users[0]._id,
            content: 'Scheduled for review session on October 10th. Student has strong background.',
            isInternal: true
          }
        ]
      },
      {
        userId: studentUsers[2]._id,
        serviceType: 'career_counseling',
        title: 'Career path guidance',
        description: 'I am unsure about my career direction and would like to explore different options in business and entrepreneurship.',
        status: 'completed',
        priority: 'medium',
        preferredDate: new Date('2024-09-20'),
        contactMethod: 'phone_call',
        assignedTo: users[0]._id,
        completedDate: new Date('2024-09-25'),
        notes: [
          {
            author: studentUsers[2]._id,
            content: 'Interested in starting my own business but also considering corporate roles.',
            isInternal: false
          },
          {
            author: users[0]._id,
            content: 'Provided comprehensive career assessment and resource list. Student very engaged.',
            isInternal: true
          }
        ]
      },
      {
        userId: studentUsers[3]._id,
        serviceType: 'scholarship_assistance',
        title: 'Help finding scholarships',
        description: 'I need assistance finding and applying for scholarships for engineering programs.',
        status: 'pending',
        priority: 'high',
        preferredDate: new Date('2024-10-20'),
        contactMethod: 'video_call',
        notes: [
          {
            author: studentUsers[3]._id,
            content: 'Looking for merit-based scholarships. Strong academic record in mathematics and physics.',
            isInternal: false
          }
        ]
      },
      {
        userId: studentUsers[4]._id,
        serviceType: 'document_preparation',
        title: 'Help with personal statement',
        description: 'I need help writing and editing my personal statement for university applications.',
        status: 'cancelled',
        priority: 'low',
        preferredDate: new Date('2024-09-30'),
        contactMethod: 'email',
        notes: [
          {
            author: studentUsers[4]._id,
            content: 'Need to reschedule due to personal commitments.',
            isInternal: false
          }
        ]
      }
    ])
    
    console.log(`✅ Created ${consultations.length} consultations`)
    
    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`👥 Users: ${users.length}`)
    console.log(`🎓 Students: ${students.length}`)
    console.log(`🏛️ Universities: ${universities.length}`)
    console.log(`💼 Jobs: ${jobs.length}`)
    console.log(`📄 Applications: ${applications.length}`)
    console.log(`💬 Consultations: ${consultations.length}`)
    
    console.log('\n🔑 Login Credentials:')
    console.log('Admin: admin@edujobs.com / EduJobs21%')
    console.log('Student: john.doe@gmail.com / EduJobs21%')
    console.log('Student: jane.smith@gmail.com / EduJobs21%')
    
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seeding
seedData()
