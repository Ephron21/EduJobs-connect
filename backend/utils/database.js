import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    // MongoDB connection options to handle IPv6/IPv4 issues
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4, // Force IPv4
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, options)

    console.log(`📊 MongoDB Connected: ${conn.connection.host}`)
    console.log(`🗄️  Database: ${conn.connection.name}`)
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected')
    })

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected')
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close()
        console.log('🔒 MongoDB connection closed through app termination')
        process.exit(0)
      } catch (error) {
        console.error('❌ Error closing MongoDB connection:', error)
        process.exit(1)
      }
    })

  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    
    // Provide helpful error messages
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Troubleshooting tips:')
      console.log('   1. Check if MongoDB is running: net start MongoDB')
      console.log('   2. Try different connection string: mongodb://127.0.0.1:27017/edujobs')
      console.log('   3. Check MongoDB logs for errors')
    }
    
    // Don't exit in development, allow for reconnection attempts
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    } else {
      console.log('🔄 Will retry connection when server restarts...')
    }
  }
}
