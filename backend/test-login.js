const axios = require('axios')

const testAdminLogin = async () => {
  try {
    console.log('Testing admin login...')
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@edujobsconnect.rw',
      password: 'Admin123!'
    })
    
    console.log('✅ Login successful!')
    console.log('Token:', response.data.token)
    console.log('User:', response.data.user)
    
    // Test admin endpoint
    const adminResponse = await axios.get('http://localhost:5000/api/admin/content/universities', {
      headers: {
        'Authorization': `Bearer ${response.data.token}`
      }
    })
    
    console.log('✅ Admin endpoint working!')
    console.log('Universities count:', adminResponse.data.universities.length)
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message)
  }
}

testAdminLogin()
