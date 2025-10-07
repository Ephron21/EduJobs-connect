const express = require('express')
const Application = require('../models/Application')
const Job = require('../models/Job')
const University = require('../models/University')
const { authenticate, requireAdmin } = require('../middleware/auth')

const router = express.Router()

// Apply authentication to all routes
router.use(authenticate)

// @route   GET /api/applications
// @desc    Get user's applications
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { type, status, page = 1, limit = 10 } = req.query

    // Build query
    const query = { applicant: req.user._id }
    if (type) query.type = type
    if (status) query.status = status

    const applications = await Application.find(query)
      .populate('job', 'title company.name location.city employment.type')
      .populate('university', 'name location.city')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Application.countDocuments(query)

    res.json({
      applications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    })

  } catch (error) {
    console.error('Get applications error:', error)
    res.status(500).json({
      error: 'Failed to fetch applications',
      message: 'An error occurred while fetching your applications'
    })
  }
})

// @route   GET /api/applications/:id
// @desc    Get application by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('applicant', 'firstName lastName email')
      .populate('job', 'title company.name location employment')
      .populate('university', 'name location programs')

    if (!application) {
      return res.status(404).json({
        error: 'Application not found',
        message: 'The specified application does not exist'
      })
    }

    // Check ownership or admin access
    if (application.applicant._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only view your own applications'
      })
    }

    res.json({ application })

  } catch (error) {
    console.error('Get application error:', error)
    res.status(500).json({
      error: 'Failed to fetch application',
      message: 'An error occurred while fetching the application'
    })
  }
})

// @route   POST /api/applications
// @desc    Create new application
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { type, jobId, universityId, ...applicationData } = req.body

    // Validate application type and target
    if (type === 'job' && !jobId) {
      return res.status(400).json({
        error: 'Job ID required',
        message: 'Job ID is required for job applications'
      })
    }

    if (type === 'university' && !universityId) {
      return res.status(400).json({
        error: 'University ID required',
        message: 'University ID is required for university applications'
      })
    }

    // Check if target exists
    if (type === 'job') {
      const job = await Job.findById(jobId)
      if (!job || job.status !== 'active') {
        return res.status(404).json({
          error: 'Job not found',
          message: 'The specified job does not exist or is no longer active'
        })
      }
    }

    if (type === 'university') {
      const university = await University.findById(universityId)
      if (!university || university.status !== 'active') {
        return res.status(404).json({
          error: 'University not found',
          message: 'The specified university does not exist or is no longer active'
        })
      }
    }

    // Check for duplicate applications
    const existingQuery = {
      applicant: req.user._id,
      type,
      status: { $nin: ['withdrawn', 'rejected'] }
    }
    
    if (type === 'job') existingQuery.job = jobId
    if (type === 'university') existingQuery.university = universityId

    const existingApplication = await Application.findOne(existingQuery)
    if (existingApplication) {
      return res.status(400).json({
        error: 'Duplicate application',
        message: 'You have already applied for this position'
      })
    }

    // Create application
    const application = new Application({
      applicant: req.user._id,
      type,
      job: type === 'job' ? jobId : undefined,
      university: type === 'university' ? universityId : undefined,
      ...applicationData,
      personalInfo: {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        ...applicationData.personalInfo
      }
    })

    await application.save()

    // Increment application count
    if (type === 'job') {
      await Job.findByIdAndUpdate(jobId, { $inc: { 'statistics.applications': 1 } })
    }

    await application.populate([
      { path: 'job', select: 'title company.name' },
      { path: 'university', select: 'name' }
    ])

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    })

  } catch (error) {
    console.error('Create application error:', error)
    res.status(500).json({
      error: 'Failed to submit application',
      message: 'An error occurred while submitting your application'
    })
  }
})

// @route   PUT /api/applications/:id
// @desc    Update application
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)

    if (!application) {
      return res.status(404).json({
        error: 'Application not found',
        message: 'The specified application does not exist'
      })
    }

    // Check ownership
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own applications'
      })
    }

    // Check if application is editable
    if (!application.isEditable()) {
      return res.status(400).json({
        error: 'Cannot edit application',
        message: 'This application can no longer be edited'
      })
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: 'job', select: 'title company.name' },
      { path: 'university', select: 'name' }
    ])

    res.json({
      message: 'Application updated successfully',
      application: updatedApplication
    })

  } catch (error) {
    console.error('Update application error:', error)
    res.status(500).json({
      error: 'Failed to update application',
      message: 'An error occurred while updating your application'
    })
  }
})

// @route   PUT /api/applications/:id/submit
// @desc    Submit application
// @access  Private
router.put('/:id/submit', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)

    if (!application) {
      return res.status(404).json({
        error: 'Application not found',
        message: 'The specified application does not exist'
      })
    }

    // Check ownership
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only submit your own applications'
      })
    }

    // Check if application can be submitted
    if (application.status !== 'draft') {
      return res.status(400).json({
        error: 'Cannot submit application',
        message: 'This application has already been submitted'
      })
    }

    await application.updateStatus('submitted')

    res.json({
      message: 'Application submitted successfully',
      application
    })

  } catch (error) {
    console.error('Submit application error:', error)
    res.status(500).json({
      error: 'Failed to submit application',
      message: 'An error occurred while submitting your application'
    })
  }
})

// @route   PUT /api/applications/:id/withdraw
// @desc    Withdraw application
// @access  Private
router.put('/:id/withdraw', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)

    if (!application) {
      return res.status(404).json({
        error: 'Application not found',
        message: 'The specified application does not exist'
      })
    }

    // Check ownership
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only withdraw your own applications'
      })
    }

    // Check if application can be withdrawn
    if (!application.canWithdraw()) {
      return res.status(400).json({
        error: 'Cannot withdraw application',
        message: 'This application cannot be withdrawn at this stage'
      })
    }

    await application.updateStatus('withdrawn', req.body.reason || 'Withdrawn by applicant')

    res.json({
      message: 'Application withdrawn successfully',
      application
    })

  } catch (error) {
    console.error('Withdraw application error:', error)
    res.status(500).json({
      error: 'Failed to withdraw application',
      message: 'An error occurred while withdrawing your application'
    })
  }
})

// @route   DELETE /api/applications/:id
// @desc    Delete application (draft only)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)

    if (!application) {
      return res.status(404).json({
        error: 'Application not found',
        message: 'The specified application does not exist'
      })
    }

    // Check ownership
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own applications'
      })
    }

    // Only allow deletion of draft applications
    if (application.status !== 'draft') {
      return res.status(400).json({
        error: 'Cannot delete application',
        message: 'Only draft applications can be deleted'
      })
    }

    await Application.findByIdAndDelete(req.params.id)

    res.json({
      message: 'Application deleted successfully'
    })

  } catch (error) {
    console.error('Delete application error:', error)
    res.status(500).json({
      error: 'Failed to delete application',
      message: 'An error occurred while deleting your application'
    })
  }
})

// @route   GET /api/applications/stats
// @desc    Get application statistics for user
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const stats = await Application.aggregate([
      { $match: { applicant: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    const formattedStats = {
      total: 0,
      draft: 0,
      submitted: 0,
      'under-review': 0,
      shortlisted: 0,
      interviewed: 0,
      accepted: 0,
      rejected: 0,
      withdrawn: 0
    }

    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count
      formattedStats.total += stat.count
    })

    res.json({ stats: formattedStats })

  } catch (error) {
    console.error('Get application stats error:', error)
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: 'An error occurred while fetching application statistics'
    })
  }
})

module.exports = router
