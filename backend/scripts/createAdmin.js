import dotenv from 'dotenv'
import { connectDB } from '../utils/database.js'
import User from '../models/User.js'

// Load environment variables
dotenv.config()

const createAdminUser = async () => {
  try {
    // Connect to database
    await connectDB()
    
    const adminEmail = 'ephrontuyishime21@gmail.com'
    const adminPassword = 'EduJobs21%'
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail })
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists')
      console.log('Email:', existingAdmin.email)
      console.log('Role:', existingAdmin.role)
      console.log('Verified:', existingAdmin.isVerified)
      process.exit(0)
    }
    
    // Create admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: adminEmail,
      phoneNumber: '+250788123456',
      password: adminPassword,
      role: 'admin',
      isVerified: true // Skip email verification for admin
    })
    
    console.log('🎉 Admin user created successfully!')
    console.log('Email:', adminUser.email)
    console.log('Password:', adminPassword)
    console.log('Role:', adminUser.role)
    console.log('Verified:', adminUser.isVerified)
    console.log('\n✅ You can now login with these credentials')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    process.exit(1)
  }
}

createAdminUser()
