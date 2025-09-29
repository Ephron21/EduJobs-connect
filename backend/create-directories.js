import fs from 'fs'
import path from 'path'

// Create upload directories
const directories = [
  'uploads',
  'uploads/images',
  'uploads/documents', 
  'uploads/profiles',
  'uploads/certificates'
]

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`✅ Created directory: ${dir}`)
  } else {
    console.log(`📁 Directory already exists: ${dir}`)
  }
})

console.log('🎉 All upload directories are ready!')
