const express = require('express')
const University = require('../models/University')
const { authenticate, optionalAuth, requireAdmin } = require('../middleware/auth')

const router = express.Router()

// @route   GET /api/universities
// @desc    Get all universities with filtering and search
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = '',
      city = '',
      province = '',
      featured = '',
      sort = 'name'
    } = req.query

    // Build query
    const query = { status: 'active' }
    
    if (search) {
      query.$text = { $search: search }
    }
    
    if (city) {
      query['location.city'] = new RegExp(city, 'i')
    }
    
    if (province) {
      query['location.province'] = new RegExp(province, 'i')
    }
    
    if (featured === 'true') {
      query.featured = true
    }

    // Build sort
    let sortOption = {}
    switch (sort) {
      case 'name':
        sortOption = { name: 1 }
        break
      case 'rating':
        sortOption = { 'rating.overall': -1 }
        break
      case 'newest':
        sortOption = { createdAt: -1 }
        break
      case 'programs':
        sortOption = { programCount: -1 }
        break
      default:
        sortOption = { name: 1 }
    }

    const universities = await University.find(query)
      .populate('addedBy', 'firstName lastName')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await University.countDocuments(query)

    res.json({
      universities,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    })

  } catch (error) {
    console.error('Get universities error:', error)
    res.status(500).json({
      error: 'Failed to fetch universities',
      message: 'An error occurred while fetching universities'
    })
  }
})

// @route   GET /api/universities/featured
// @desc    Get featured universities
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const universities = await University.findFeatured()
      .limit(6)
      .populate('addedBy', 'firstName lastName')

    res.json({ universities })

  } catch (error) {
    console.error('Get featured universities error:', error)
    res.status(500).json({
      error: 'Failed to fetch featured universities',
      message: 'An error occurred while fetching featured universities'
    })
  }
})

// @route   GET /api/universities/:id
// @desc    Get university by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const university = await University.findById(req.params.id)
      .populate('addedBy', 'firstName lastName email')

    if (!university) {
      return res.status(404).json({
        error: 'University not found',
        message: 'The specified university does not exist'
      })
    }

    res.json({ university })

  } catch (error) {
    console.error('Get university error:', error)
    res.status(500).json({
      error: 'Failed to fetch university',
      message: 'An error occurred while fetching the university'
    })
  }
})

// @route   POST /api/universities
// @desc    Create new university
// @access  Private (Admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const universityData = {
      ...req.body,
      addedBy: req.user._id
    }

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
      message: 'An error occurred while creating the university'
    })
  }
})

// @route   PUT /api/universities/:id
// @desc    Update university
// @access  Private (Admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const university = await University.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('addedBy', 'firstName lastName email')

    if (!university) {
      return res.status(404).json({
        error: 'University not found',
        message: 'The specified university does not exist'
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
      message: 'An error occurred while updating the university'
    })
  }
})

// @route   DELETE /api/universities/:id
// @desc    Delete university
// @access  Private (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const university = await University.findByIdAndDelete(req.params.id)

    if (!university) {
      return res.status(404).json({
        error: 'University not found',
        message: 'The specified university does not exist'
      })
    }

    res.json({
      message: 'University deleted successfully'
    })

  } catch (error) {
    console.error('Delete university error:', error)
    res.status(500).json({
      error: 'Failed to delete university',
      message: 'An error occurred while deleting the university'
    })
  }
})

// @route   GET /api/universities/:id/programs
// @desc    Get university programs
// @access  Public
router.get('/:id/programs', async (req, res) => {
  try {
    const university = await University.findById(req.params.id)

    if (!university) {
      return res.status(404).json({
        error: 'University not found',
        message: 'The specified university does not exist'
      })
    }

    const programs = university.activePrograms

    res.json({ programs })

  } catch (error) {
    console.error('Get programs error:', error)
    res.status(500).json({
      error: 'Failed to fetch programs',
      message: 'An error occurred while fetching university programs'
    })
  }
})

module.exports = router
