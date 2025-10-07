const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const University = require('../models/University')
const Job = require('../models/Job')
const Service = require('../models/Service')
const HomepageSettings = require('../models/HomepageSettings')
const { authenticate, requireAdmin } = require('../middleware/auth')

const router = express.Router()

// Apply authentication and admin authorization to all routes
router.use(authenticate)
router.use(requireAdmin)

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads', req.params.type || 'general')
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  // Allow images, PDFs, and documents
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|xlsx|xls|ppt|pptx/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)
  
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Only images, PDFs, and documents are allowed'))
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
})

// ==================== UNIVERSITY MANAGEMENT ====================

// @route   GET /api/admin/content/universities
// @desc    Get all universities with admin details
// @access  Private (Admin only)
router.get('/universities', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const search = req.query.search || ''
    const status = req.query.status || ''

    const query = {}
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortName: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ]
    }
    if (status) query.status = status

    const universities = await University.find(query)
      .populate('addedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await University.countDocuments(query)

    res.json({
      universities,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    })
  } catch (error) {
    console.error('Admin universities error:', error)
    res.status(500).json({
      error: 'Failed to fetch universities',
      message: error.message
    })
  }
})

// @route   POST /api/admin/content/universities
// @desc    Create new university
// @access  Private (Admin only)
router.post('/universities', upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), async (req, res) => {
  try {
    const universityData = JSON.parse(req.body.data || '{}')
    
    // Handle file uploads
    if (req.files) {
      if (req.files.logo) {
        universityData.logo = `/uploads/universities/${req.files.logo[0].filename}`
      }
      if (req.files.images) {
        universityData.images = req.files.images.map(file => 
          `/uploads/universities/${file.filename}`
        )
      }
    }

    universityData.addedBy = req.user._id

    const university = new University(universityData)
    await university.save()

    await university.populate('addedBy', 'firstName lastName email')

    res.status(201).json({
      message: 'University created successfully',
      university
    })
  } catch (error) {
    console.error('Create university error:', error)
    res.status(500).json({
      error: 'Failed to create university',
      message: error.message
    })
  }
})

// @route   PUT /api/admin/content/universities/:id
// @desc    Update university
// @access  Private (Admin only)
router.put('/universities/:id', upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), async (req, res) => {
  try {
    const { id } = req.params
    const updateData = JSON.parse(req.body.data || '{}')

    // Handle file uploads
    if (req.files) {
      if (req.files.logo) {
        updateData.logo = `/uploads/universities/${req.files.logo[0].filename}`
      }
      if (req.files.images) {
        updateData.images = req.files.images.map(file => 
          `/uploads/universities/${file.filename}`
        )
      }
    }

    const university = await University.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('addedBy', 'firstName lastName email')

    if (!university) {
      return res.status(404).json({
        error: 'University not found'
      })
    }

    res.json({
      message: 'University updated successfully',
      university
    })
  } catch (error) {
    console.error('Update university error:', error)
    res.status(500).json({
      error: 'Failed to update university',
      message: error.message
    })
  }
})

// @route   DELETE /api/admin/content/universities/:id
// @desc    Delete university
// @access  Private (Admin only)
router.delete('/universities/:id', async (req, res) => {
  try {
    const { id } = req.params

    const university = await University.findByIdAndDelete(id)

    if (!university) {
      return res.status(404).json({
        error: 'University not found'
      })
    }

    res.json({
      message: 'University deleted successfully'
    })
  } catch (error) {
    console.error('Delete university error:', error)
    res.status(500).json({
      error: 'Failed to delete university',
      message: error.message
    })
  }
})

// @route   POST /api/admin/content/universities/:id/scholarships
// @desc    Add scholarship to university
// @access  Private (Admin only)
router.post('/universities/:id/scholarships', async (req, res) => {
  try {
    const { id } = req.params
    const scholarshipData = req.body

    const university = await University.findById(id)
    if (!university) {
      return res.status(404).json({
        error: 'University not found'
      })
    }

    if (!university.admissions) {
      university.admissions = {}
    }
    if (!university.admissions.scholarships) {
      university.admissions.scholarships = []
    }

    university.admissions.scholarships.push(scholarshipData)
    await university.save()

    res.json({
      message: 'Scholarship added successfully',
      scholarship: university.admissions.scholarships[university.admissions.scholarships.length - 1]
    })
  } catch (error) {
    console.error('Add scholarship error:', error)
    res.status(500).json({
      error: 'Failed to add scholarship',
      message: error.message
    })
  }
})

// @route   POST /api/admin/content/universities/:id/announcements
// @desc    Add announcement to university
// @access  Private (Admin only)
router.post('/universities/:id/announcements', upload.array('attachments', 5), async (req, res) => {
  try {
    const { id } = req.params
    const announcementData = JSON.parse(req.body.data || '{}')

    // Handle file attachments
    if (req.files && req.files.length > 0) {
      announcementData.attachments = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: `/uploads/announcements/${file.filename}`,
        mimetype: file.mimetype,
        size: file.size
      }))
    }

    const university = await University.findById(id)
    if (!university) {
      return res.status(404).json({
        error: 'University not found'
      })
    }

    if (!university.announcements) {
      university.announcements = []
    }

    university.announcements.push(announcementData)
    await university.save()

    res.json({
      message: 'Announcement added successfully',
      announcement: university.announcements[university.announcements.length - 1]
    })
  } catch (error) {
    console.error('Add announcement error:', error)
    res.status(500).json({
      error: 'Failed to add announcement',
      message: error.message
    })
  }
})

// ==================== JOB MANAGEMENT ====================

// @route   GET /api/admin/content/jobs
// @desc    Get all jobs with admin details
// @access  Private (Admin only)
router.get('/jobs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const search = req.query.search || ''
    const status = req.query.status || ''

    const query = {}
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'company.name': { $regex: search, $options: 'i' } },
        { 'employment.category': { $regex: search, $options: 'i' } }
      ]
    }
    if (status) query.status = status

    const jobs = await Job.find(query)
      .populate('postedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Job.countDocuments(query)

    res.json({
      jobs,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    })
  } catch (error) {
    console.error('Admin jobs error:', error)
    res.status(500).json({
      error: 'Failed to fetch jobs',
      message: error.message
    })
  }
})

// @route   POST /api/admin/content/jobs
// @desc    Create new job
// @access  Private (Admin only)
router.post('/jobs', upload.single('companyLogo'), async (req, res) => {
  try {
    const jobData = JSON.parse(req.body.data || '{}')
    
    // Handle company logo upload
    if (req.file) {
      jobData.company.logo = `/uploads/jobs/${req.file.filename}`
    }

    jobData.postedBy = req.user._id

    const job = new Job(jobData)
    await job.save()

    await job.populate('postedBy', 'firstName lastName email')

    res.status(201).json({
      message: 'Job created successfully',
      job
    })
  } catch (error) {
    console.error('Create job error:', error)
    res.status(500).json({
      error: 'Failed to create job',
      message: error.message
    })
  }
})

// @route   PUT /api/admin/content/jobs/:id
// @desc    Update job
// @access  Private (Admin only)
router.put('/jobs/:id', upload.single('companyLogo'), async (req, res) => {
  try {
    const { id } = req.params
    const updateData = JSON.parse(req.body.data || '{}')

    // Handle company logo upload
    if (req.file) {
      if (!updateData.company) updateData.company = {}
      updateData.company.logo = `/uploads/jobs/${req.file.filename}`
    }

    const job = await Job.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('postedBy', 'firstName lastName email')

    if (!job) {
      return res.status(404).json({
        error: 'Job not found'
      })
    }

    res.json({
      message: 'Job updated successfully',
      job
    })
  } catch (error) {
    console.error('Update job error:', error)
    res.status(500).json({
      error: 'Failed to update job',
      message: error.message
    })
  }
})

// @route   DELETE /api/admin/content/jobs/:id
// @desc    Delete job
// @access  Private (Admin only)
router.delete('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params

    const job = await Job.findByIdAndDelete(id)

    if (!job) {
      return res.status(404).json({
        error: 'Job not found'
      })
    }

    res.json({
      message: 'Job deleted successfully'
    })
  } catch (error) {
    console.error('Delete job error:', error)
    res.status(500).json({
      error: 'Failed to delete job',
      message: error.message
    })
  }
})

// ==================== CONSULTING SERVICES MANAGEMENT ====================

// @route   GET /api/admin/content/services
// @desc    Get all consulting services
// @access  Private (Admin only)
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find()
      .populate('createdBy updatedBy', 'firstName lastName email')
      .sort({ order: 1, createdAt: -1 })

    res.json({ services })
  } catch (error) {
    console.error('Admin services error:', error)
    res.status(500).json({
      error: 'Failed to fetch services',
      message: error.message
    })
  }
})

// @route   POST /api/admin/content/services
// @desc    Create new consulting service
// @access  Private (Admin only)
router.post('/services', async (req, res) => {
  try {
    const serviceData = req.body
    serviceData.createdBy = req.user._id

    const service = new Service(serviceData)
    await service.save()

    await service.populate('createdBy', 'firstName lastName email')

    res.status(201).json({
      message: 'Service created successfully',
      service
    })
  } catch (error) {
    console.error('Create service error:', error)
    res.status(500).json({
      error: 'Failed to create service',
      message: error.message
    })
  }
})

// @route   PUT /api/admin/content/services/:id
// @desc    Update consulting service
// @access  Private (Admin only)
router.put('/services/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body
    updateData.updatedBy = req.user._id

    const service = await Service.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy updatedBy', 'firstName lastName email')

    if (!service) {
      return res.status(404).json({
        error: 'Service not found'
      })
    }

    res.json({
      message: 'Service updated successfully',
      service
    })
  } catch (error) {
    console.error('Update service error:', error)
    res.status(500).json({
      error: 'Failed to update service',
      message: error.message
    })
  }
})

// @route   DELETE /api/admin/content/services/:id
// @desc    Delete consulting service
// @access  Private (Admin only)
router.delete('/services/:id', async (req, res) => {
  try {
    const { id } = req.params

    const service = await Service.findByIdAndDelete(id)

    if (!service) {
      return res.status(404).json({
        error: 'Service not found'
      })
    }

    res.json({
      message: 'Service deleted successfully'
    })
  } catch (error) {
    console.error('Delete service error:', error)
    res.status(500).json({
      error: 'Failed to delete service',
      message: error.message
    })
  }
})

// ==================== HOMEPAGE CONTENT MANAGEMENT ====================

// @route   GET /api/admin/content/homepage
// @desc    Get homepage content for admin editing
// @access  Private (Admin only)
router.get('/homepage', async (req, res) => {
  try {
    // Get featured content
    const [featuredUniversities, featuredJobs, featuredServices] = await Promise.all([
      University.find({ featured: true, status: 'active' })
        .select('name shortName logo rating location admissions.scholarships announcements')
        .limit(10),
      Job.find({ featured: true, status: 'active' })
        .select('title company salary employment timeline')
        .limit(10),
      Service.find({ isFeatured: true, isActive: true })
        .select('title shortDescription icon pricing')
        .limit(10)
    ])

    // Get homepage settings
    let settings = await HomepageSettings.findOne({ isActive: true })
    if (!settings) {
      settings = new HomepageSettings()
      await settings.save()
    }

    res.json({
      settings,
      featured: {
        universities: featuredUniversities,
        jobs: featuredJobs,
        services: featuredServices
      }
    })
  } catch (error) {
    console.error('Admin homepage error:', error)
    res.status(500).json({
      error: 'Failed to fetch homepage content',
      message: error.message
    })
  }
})

// @route   PUT /api/admin/content/homepage
// @desc    Update homepage settings and featured content
// @access  Private (Admin only)
router.put('/homepage', async (req, res) => {
  try {
    const { settings, featured } = req.body

    // Update homepage settings
    if (settings) {
      let homepageSettings = await HomepageSettings.findOne({ isActive: true })
      if (!homepageSettings) {
        homepageSettings = new HomepageSettings(settings)
      } else {
        Object.assign(homepageSettings, settings)
      }
      homepageSettings.lastUpdatedBy = req.user._id
      await homepageSettings.save()
    }

    // Update featured content
    if (featured) {
      if (featured.universities) {
        await University.updateMany({}, { featured: false })
        await University.updateMany(
          { _id: { $in: featured.universities } },
          { featured: true }
        )
      }

      if (featured.jobs) {
        await Job.updateMany({}, { featured: false })
        await Job.updateMany(
          { _id: { $in: featured.jobs } },
          { featured: true }
        )
      }

      if (featured.services) {
        await Service.updateMany({}, { isFeatured: false })
        await Service.updateMany(
          { _id: { $in: featured.services } },
          { isFeatured: true }
        )
      }
    }

    res.json({
      message: 'Homepage content updated successfully'
    })
  } catch (error) {
    console.error('Update homepage error:', error)
    res.status(500).json({
      error: 'Failed to update homepage content',
      message: error.message
    })
  }
})

// ==================== FILE UPLOAD ENDPOINT ====================

// @route   POST /api/admin/content/upload/:type
// @desc    Upload files for content
// @access  Private (Admin only)
router.post('/upload/:type', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No files uploaded'
      })
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: `/uploads/${req.params.type}/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size
    }))

    res.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    })
  } catch (error) {
    console.error('File upload error:', error)
    res.status(500).json({
      error: 'Failed to upload files',
      message: error.message
    })
  }
})

module.exports = router
