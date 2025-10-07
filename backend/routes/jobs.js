const express = require('express')
const Job = require('../models/Job')
const { authenticate, optionalAuth, requireEmployer } = require('../middleware/auth')

const router = express.Router()

// @route   GET /api/jobs
// @desc    Get all jobs with filtering and search
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = '',
      category = '',
      type = '',
      level = '',
      location = '',
      city = '',
      province = '',
      remote = '',
      featured = '',
      sort = 'newest'
    } = req.query

    // Build query
    const query = { status: 'active' }
    
    if (search) {
      query.$text = { $search: search }
    }
    
    if (category) {
      query['employment.category'] = category
    }
    
    if (type) {
      query['employment.type'] = type
    }
    
    if (level) {
      query['employment.level'] = level
    }
    
    if (city) {
      query['location.city'] = new RegExp(city, 'i')
    }
    
    if (province) {
      query['location.province'] = new RegExp(province, 'i')
    }
    
    if (remote === 'true') {
      query['location.type'] = 'remote'
    }
    
    if (featured === 'true') {
      query.featured = true
    }

    // Build sort
    let sortOption = {}
    switch (sort) {
      case 'newest':
        sortOption = { 'timeline.postedDate': -1 }
        break
      case 'oldest':
        sortOption = { 'timeline.postedDate': 1 }
        break
      case 'salary-high':
        sortOption = { 'salary.max': -1 }
        break
      case 'salary-low':
        sortOption = { 'salary.min': 1 }
        break
      case 'title':
        sortOption = { title: 1 }
        break
      case 'company':
        sortOption = { 'company.name': 1 }
        break
      default:
        sortOption = { 'timeline.postedDate': -1 }
    }

    const jobs = await Job.find(query)
      .populate('postedBy', 'firstName lastName')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Job.countDocuments(query)

    res.json({
      jobs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    })

  } catch (error) {
    console.error('Get jobs error:', error)
    res.status(500).json({
      error: 'Failed to fetch jobs',
      message: 'An error occurred while fetching jobs'
    })
  }
})

// @route   GET /api/jobs/featured
// @desc    Get featured jobs
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const jobs = await Job.findFeatured()
      .limit(6)
      .populate('postedBy', 'firstName lastName')

    res.json({ jobs })

  } catch (error) {
    console.error('Get featured jobs error:', error)
    res.status(500).json({
      error: 'Failed to fetch featured jobs',
      message: 'An error occurred while fetching featured jobs'
    })
  }
})

// @route   GET /api/jobs/categories
// @desc    Get job categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Job.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$employment.category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    res.json({ categories })

  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({
      error: 'Failed to fetch categories',
      message: 'An error occurred while fetching job categories'
    })
  }
})

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'firstName lastName email')

    if (!job) {
      return res.status(404).json({
        error: 'Job not found',
        message: 'The specified job does not exist'
      })
    }

    // Increment view count
    await job.incrementViews()

    res.json({ job })

  } catch (error) {
    console.error('Get job error:', error)
    res.status(500).json({
      error: 'Failed to fetch job',
      message: 'An error occurred while fetching the job'
    })
  }
})

// @route   POST /api/jobs
// @desc    Create new job
// @access  Private (Employer or Admin)
router.post('/', authenticate, requireEmployer, async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.user._id
    }

    const job = new Job(jobData)
    await job.save()

    await job.populate('postedBy', 'firstName lastName email')

    res.status(201).json({
      message: 'Job posted successfully',
      job
    })

  } catch (error) {
    console.error('Create job error:', error)
    res.status(500).json({
      error: 'Failed to create job',
      message: 'An error occurred while posting the job'
    })
  }
})

// @route   PUT /api/jobs/:id
// @desc    Update job
// @access  Private (Owner or Admin)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        error: 'Job not found',
        message: 'The specified job does not exist'
      })
    }

    // Check ownership or admin
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only edit your own job postings'
      })
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('postedBy', 'firstName lastName email')

    res.json({
      message: 'Job updated successfully',
      job: updatedJob
    })

  } catch (error) {
    console.error('Update job error:', error)
    res.status(500).json({
      error: 'Failed to update job',
      message: 'An error occurred while updating the job'
    })
  }
})

// @route   DELETE /api/jobs/:id
// @desc    Delete job
// @access  Private (Owner or Admin)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        error: 'Job not found',
        message: 'The specified job does not exist'
      })
    }

    // Check ownership or admin
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own job postings'
      })
    }

    await Job.findByIdAndDelete(req.params.id)

    res.json({
      message: 'Job deleted successfully'
    })

  } catch (error) {
    console.error('Delete job error:', error)
    res.status(500).json({
      error: 'Failed to delete job',
      message: 'An error occurred while deleting the job'
    })
  }
})

// @route   GET /api/jobs/user/my-jobs
// @desc    Get current user's job postings
// @access  Private (Employer or Admin)
router.get('/user/my-jobs', authenticate, requireEmployer, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .sort({ createdAt: -1 })

    res.json({ jobs })

  } catch (error) {
    console.error('Get my jobs error:', error)
    res.status(500).json({
      error: 'Failed to fetch your jobs',
      message: 'An error occurred while fetching your job postings'
    })
  }
})

module.exports = router
