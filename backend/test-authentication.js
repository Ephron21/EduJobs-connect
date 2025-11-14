const axios = require('axios')
const colors = require('colors') // Optional for colored output

const API_BASE = 'http://localhost:5000/api'

// Test credentials from seeding
const testAccounts = {
  admin: {
    email: 'admin@edujobsconnect.rw',
    password: 'Admin123!',
    expectedRole: 'admin'
  },
  student: {
    email: 'jean@example.com',
    password: 'Student123!',
    expectedRole: 'student'
  },
  employer: {
    email: 'employer@company.com',
    password: 'Employer123!',
    expectedRole: 'employer'
  }
}

const testLogin = async (accountType, credentials) => {
  try {
    console.log(`\n🔐 Testing ${accountType} login...`)
    
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: credentials.email,
      password: credentials.password
    })
    
    const { token, user } = response.data
    
    if (user.role !== credentials.expectedRole) {
      console.log(`❌ Role mismatch! Expected: ${credentials.expectedRole}, Got: ${user.role}`)
      return false
    }
    
    console.log(`✅ ${accountType} login successful!`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Name: ${user.firstName} ${user.lastName}`)
    
    // Test authenticated endpoint
    const meResponse = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    console.log(`✅ Token validation successful for ${accountType}`)
    
    return { token, user }
    
  } catch (error) {
    console.log(`❌ ${accountType} login failed:`)
    console.log(`   Error: ${error.response?.data?.message || error.message}`)
    console.log(`   Status: ${error.response?.status}`)
    return false
  }
}

const testHealthCheck = async () => {
  try {
    console.log('🏥 Testing server health...')
    const response = await axios.get(`${API_BASE}/health`)
    console.log('✅ Server is healthy!')
    console.log(`   Status: ${response.data.status}`)
    console.log(`   Environment: ${response.data.environment}`)
    return true
  } catch (error) {
    console.log('❌ Server health check failed!')
    console.log(`   Error: ${error.message}`)
    return false
  }
}

const testDatabaseConnection = async () => {
  try {
    console.log('🗄️  Testing database connection...')
    
    // Test if we can fetch users (this will fail if DB is not connected)
    const adminLogin = await testLogin('admin', testAccounts.admin)
    
    if (adminLogin) {
      // Test admin-only endpoint
      const universitiesResponse = await axios.get(`${API_BASE}/admin/content/universities`, {
        headers: { Authorization: `Bearer ${adminLogin.token}` }
      })
      
      console.log('✅ Database connection successful!')
      console.log(`   Universities in DB: ${universitiesResponse.data.universities?.length || 0}`)
      return true
    }
    
    return false
    
  } catch (error) {
    console.log('❌ Database connection failed!')
    console.log(`   Error: ${error.response?.data?.message || error.message}`)
    return false
  }
}

const runAllTests = async () => {
  console.log('🚀 Starting EduJobs Connect Authentication Tests\n')
  console.log('=' .repeat(50))
  
  let allPassed = true
  
  // Test 1: Health Check
  const healthOk = await testHealthCheck()
  if (!healthOk) allPassed = false
  
  // Test 2: Database Connection
  const dbOk = await testDatabaseConnection()
  if (!dbOk) allPassed = false
  
  // Test 3: All Account Logins
  for (const [accountType, credentials] of Object.entries(testAccounts)) {
    const loginOk = await testLogin(accountType, credentials)
    if (!loginOk) allPassed = false
  }
  
  // Test 4: Invalid Login
  console.log('\n🔒 Testing invalid login...')
  try {
    await axios.post(`${API_BASE}/auth/login`, {
      email: 'invalid@example.com',
      password: 'wrongpassword'
    })
    console.log('❌ Invalid login should have failed!')
    allPassed = false
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Invalid login properly rejected')
    } else {
      console.log(`❌ Unexpected error: ${error.message}`)
      allPassed = false
    }
  }
  
  // Summary
  console.log('\n' + '=' .repeat(50))
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED! Authentication system is working correctly.')
    console.log('\n📝 Login Credentials:')
    Object.entries(testAccounts).forEach(([type, creds]) => {
      console.log(`   ${type}: ${creds.email} / ${creds.password}`)
    })
  } else {
    console.log('❌ SOME TESTS FAILED! Please check the errors above.')
    console.log('\n🔧 Troubleshooting Steps:')
    console.log('   1. Ensure MongoDB is running: net start MongoDB')
    console.log('   2. Seed the database: npm run seed')
    console.log('   3. Restart the server: npm run dev')
    console.log('   4. Clear browser localStorage')
  }
  
  process.exit(allPassed ? 0 : 1)
}

// Run tests
runAllTests().catch(error => {
  console.error('💥 Test runner crashed:', error.message)
  process.exit(1)
})
