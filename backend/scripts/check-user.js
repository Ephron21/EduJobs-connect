// File: backend/scripts/check-user.js
const mongoose = require('mongoose')
const User = require('../models/User')
require('dotenv').config()

const checkUser = async () => {
  try {
    console.log('🔍 Checking user in database...')
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edujobs-connect')
    console.log('✅ Connected to MongoDB:', process.env.MONGODB_URI)

    // Check for the user
    const email = 'ephrontuyishime21@gmail.com'
    console.log('\n🔎 Searching for:', email)
    
    const user = await User.findByEmail(email).select('+password')
    
    if (user) {
      console.log('\n✅ User FOUND!')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('ID:', user._id)
      console.log('Name:', user.firstName, user.lastName)
      console.log('Email:', user.email)
      console.log('Role:', user.role)
      console.log('Status:', user.status)
      console.log('Email Verified:', user.verification?.isEmailVerified)
      console.log('Password Hash Exists:', !!user.password)
      console.log('Password Hash Length:', user.password?.length)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      
      // Test password comparison
      console.log('\n🔐 Testing password comparison...')
      const testPassword = 'EduJobs21%'
      const isValid = await user.comparePassword(testPassword)
      console.log(`Password "${testPassword}" is ${isValid ? '✅ VALID' : '❌ INVALID'}`)
      
    } else {
      console.log('\n❌ User NOT FOUND in database')
      console.log('You need to run: node scripts/add-admin.js')
    }

    // List all users
    console.log('\n📋 All users in database:')
    const allUsers = await User.find({}).select('email role status')
    allUsers.forEach(u => {
      console.log(`  - ${u.email} (${u.role}) [${u.status}]`)
    })

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('\n🔌 Disconnected from MongoDB')
    process.exit(0)
  }
}

checkUser()