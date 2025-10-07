const mongoose = require('mongoose')
const User = require('../models/User')
require('dotenv').config()

const addAdmin = async () => {
  try {
    console.log('🔧 Adding new admin account...')
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edujobs-connect')
    console.log('✅ Connected to MongoDB')

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'ephrontuyishime21@gmail.com' })
    
    if (existingAdmin) {
      console.log('⚠️  Admin account already exists - Updating...')
      existingAdmin.password = 'EduJobs21%'
      existingAdmin.role = 'admin'
      existingAdmin.status = 'active'
      existingAdmin.verification.isEmailVerified = true
      await existingAdmin.save()
      console.log('✅ Admin account updated successfully')
    } else {
      // Create new admin user
      const adminUser = new User({
        firstName: 'Ephron',
        lastName: 'Tuyishime',
        email: 'ephrontuyishime21@gmail.com',
        password: 'EduJobs21%',
        role: 'admin',
        status: 'active',
        verification: {
          isEmailVerified: true
        }
      })
      await adminUser.save()
      console.log('✅ Created new admin user successfully')
    }

    console.log('\n🔑 Admin Login Credentials:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Email:    ephrontuyishime21@gmail.com')
    console.log('Password: EduJobs21%')
    console.log('Role:     admin')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n✨ You can now login at: http://localhost:3000/login')

  } catch (error) {
    console.error('❌ Failed to add admin:', error)
    console.error('Error details:', error.message)
    if (error.stack) {
      console.error('Stack trace:', error.stack)
    }
  } finally {
    await mongoose.disconnect()
    console.log('\n🔌 Disconnected from MongoDB')
    process.exit(0)
  }
}

// Run the script
addAdmin()