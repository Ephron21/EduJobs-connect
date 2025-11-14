// server.js
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const path = require('path')
require('dotenv').config()

const app = express()

/* ---------------------------
   ✅ CORS configuration
---------------------------- */
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

/* ---------------------------
   ✅ Security Middleware
---------------------------- */
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:3001']
    }
  }
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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

/* ---------------------------
   ✅ Database Connection
---------------------------- */
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edujobs-connect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err)
    process.exit(1)
  })

/* ---------------------------
   Routes
---------------------------- */
// Import routes
const authRoutes = require('./routes/auth')
const usersRoutes = require('./routes/users')
const universitiesRoutes = require('./routes/universities')
const homepageRoutes = require('./routes/homepage')
const jobsRoutes = require('./routes/jobs')
const adminRoutes = require('./routes/admin')
const contactRoutes = require('./routes/contact')

// Mount routes with error handling
const mountRoute = (path, router) => {
  try {
    app.use(path, router)
    console.log(`✅ Route mounted: ${path}`)
  } catch (err) {
    console.error(`❌ Failed to mount route ${path}:`, err)
  }
}

mountRoute('/api/auth', authRoutes)
mountRoute('/api/users', usersRoutes)
mountRoute('/api/universities', universitiesRoutes)
mountRoute('/api/homepage', homepageRoutes)
mountRoute('/api/jobs', jobsRoutes)
mountRoute('/api/admin', adminRoutes)
mountRoute('/api/contact', contactRoutes)

/* ---------------------------
   Health Check
---------------------------- */
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  res.json({
    status: 'OK',
    dbStatus,
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
      jobs: '/api/jobs'
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
      '/api/jobs'
    ]
  })
})

/* ---------------------------
   ✅ Global Error Handler
---------------------------- */
app.use((err, req, res, next) => {
  console.error('🔥 Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body
  })
// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

  const errorResponse = {
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  }

  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack
  }

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

  res.status(err.status || 500).json(errorResponse)
})

/* ---------------------------
   ✅ Start Server
---------------------------- */
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3001'}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('🔥 Unhandled Rejection:', err)
  server.close(() => process.exit(1))
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err)
  server.close(() => process.exit(1))
})