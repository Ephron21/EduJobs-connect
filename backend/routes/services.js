const express = require('express')
const router = express.Router()
const Service = require('../models/Service')
const { authenticate, requireAdmin } = require('../middleware/auth')
// @route   GET /api/services
// @desc    Get all active services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query
    
    let filter = { isActive: true }
    
    if (category) {
      filter.category = category
    }
    
    if (featured === 'true') {
      filter.isFeatured = true
    }
    
    const services = await Service.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .select('-__v')
    
    res.json({ services })
  } catch (error) {
    console.error('Get services error:', error)
    res.status(500).json({
      error: 'Failed to fetch services',
      message: 'An error occurred while fetching services'
    })
  }
})

// @route   GET /api/services/:slug
// @desc    Get service by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    }).select('-__v')
    
    if (!service) {
      return res.status(404).json({
        error: 'Service not found',
        message: 'The requested service could not be found'
      })
    }
    
    res.json({ service })
  } catch (error) {
    console.error('Get service error:', error)
    res.status(500).json({
      error: 'Failed to fetch service',
      message: 'An error occurred while fetching the service'
    })
  }
})

// @route   POST /api/services
// @desc    Create new service
// @access  Private (Admin only)
router.post('/', [authenticate, requireAdmin], async (req, res) => {
  try {
    const service = new Service({
      ...req.body,
      createdBy: req.user._id,
      updatedBy: req.user._id
    })
    
    await service.save()
    
    res.status(201).json({
      message: 'Service created successfully',
      service
    })
  } catch (error) {
    console.error('Create service error:', error)
    
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Service already exists',
        message: 'A service with this title already exists'
      })
    }
    
    res.status(500).json({
      error: 'Failed to create service',
      message: 'An error occurred while creating the service'
    })
  }
})

// @route   PUT /api/services/:id
// @desc    Update service
// @access  Private (Admin only)
router.put('/:id', [authenticate, requireAdmin], async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    
    if (!service) {
      return res.status(404).json({
        error: 'Service not found',
        message: 'The service you are trying to update does not exist'
      })
    }
    
    Object.assign(service, req.body)
    service.updatedBy = req.user._id
    
    await service.save()
    
    res.json({
      message: 'Service updated successfully',
      service
    })
  } catch (error) {
    console.error('Update service error:', error)
    res.status(500).json({
      error: 'Failed to update service',
      message: 'An error occurred while updating the service'
    })
  }
})

// @route   DELETE /api/services/:id
// @desc    Delete service
// @access  Private (Admin only)
router.delete('/:id', [authenticate, requireAdmin], async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    
    if (!service) {
      return res.status(404).json({
        error: 'Service not found',
        message: 'The service you are trying to delete does not exist'
      })
    }
    
    await Service.findByIdAndDelete(req.params.id)
    
    res.json({
      message: 'Service deleted successfully'
    })
  } catch (error) {
    console.error('Delete service error:', error)
    res.status(500).json({
      error: 'Failed to delete service',
      message: 'An error occurred while deleting the service'
    })
  }
})

module.exports = router