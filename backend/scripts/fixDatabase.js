import dotenv from 'dotenv'
import { connectDB } from '../utils/database.js'
import User from '../models/User.js'

// Load environment variables
dotenv.config()

const fixDatabase = async () => {
  try {
    // Connect to database
    await connectDB()
    
    console.log('🔧 Fixing database indexes...')
    
    // Drop the users collection to remove old indexes
    try {
      await User.collection.drop()
      console.log('✅ Dropped existing users collection')
    } catch (error) {
      if (error.code === 26) {
        console.log('ℹ️  Users collection does not exist, continuing...')
      } else {
        console.log('⚠️  Could not drop collection:', error.message)
      }
    }
    
    // Recreate the collection with proper indexes
    await User.createIndexes()
    console.log('✅ Created proper indexes')
    
    console.log('🎉 Database fixed successfully!')
    console.log('Now you can run: npm run create-admin')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error fixing database:', error)
    process.exit(1)
  }
}

fixDatabase()
