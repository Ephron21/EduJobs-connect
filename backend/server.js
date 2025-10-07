// server.js
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const app = express()

/* ---------------------------
   ✅ CORS configuration
---------------------------- */
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

/* ---------------------------
   ✅ Security Middleware
---------------------------- */
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))
app.use(compression())

/* ---------------------------
   ✅ Rate Limiting (only in production)
---------------------------- */
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
  })
  app.use('/api/', limiter)
}

/* ---------------------------
   ✅ Body Parsing
---------------------------- */
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/* ---------------------------
   ✅ Static File Serving
---------------------------- */
app.use('/uploads', express.static('uploads'))

/* ---------------------------
   ✅ Database Connection
---------------------------- */
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edujobs-connect')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err))

/* ---------------------------
   ✅ Routes
---------------------------- */
// Routes - Individual error handling
const routes = [
  { path: '/api/auth', file: './routes/auth' },
  { path: '/api/users', file: './routes/users' },
  { path: '/api/universities', file: './routes/universities' },
  { path: '/api/homepage', file: './routes/homepage' },
  { path: '/api/contact', file: './routes/contact' },
  { path: '/api/services', file: './routes/services' },
  { path: '/api/jobs', file: './routes/jobs' },
  { path: '/api/applications', file: './routes/applications' },
  { path: '/api/admin', file: './routes/admin' },
  { path: '/api/admin/content', file: './routes/adminContent' },
  { path: '/api/notifications', file: './routes/notifications' }
]

routes.forEach(({ path, file }) => {
  try {
    app.use(path, require(file))
  } catch (err) {
    console.error(`❌ Failed to load route ${path}:`, err.message)
  }
})
/* ---------------------------
   ✅ Health Check
---------------------------- */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

/* ---------------------------
   ✅ Root Endpoint
---------------------------- */
app.get('/', (req, res) => {
  res.json({
    message: 'EduJobs Connect API Server',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      universities: '/api/universities',
      homepage: '/api/homepage',
      contact: '/api/contact',
      services: '/api/services',
      jobs: '/api/jobs',
      applications: '/api/applications',
      admin: '/api/admin',
      adminContent: '/api/admin/content',
      notifications: '/api/notifications'
    }
  })
})
/* ---------------------------
   ✅ 404 Handler
---------------------------- */
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      '/api/health', 
      '/api/auth', 
      '/api/users', 
      '/api/universities', 
      '/api/homepage',
      '/api/contact',
      '/api/services',
      '/api/jobs', 
      '/api/applications', 
      '/api/admin',
      '/api/admin/content',
      '/api/notifications'
    ]
  })
})

/* ---------------------------
   ✅ Global Error Handler
---------------------------- */
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack)

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.errors
    })
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format',
      message: 'The provided ID is not valid'
    })
  }

  if (err.code === 11000) {
    return res.status(400).json({
      error: 'Duplicate Entry',
      message: 'A record with this information already exists'
    })
  }

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  })
})

/* ---------------------------
   ✅ Start Server
---------------------------- */
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})
