const express = require('express')
const { body, validationResult } = require('express-validator')
const Contact = require('../models/Contact')
const { authenticate, requireAdmin } = require('../middleware/auth')

const router = express.Router()

// @route   POST /api/contact
// @desc    Submit contact form (public)
// @access  Public
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const { name, email, subject, message } = req.body

    const contact = new Contact({
      name,
      email,
      subject,
      message,
      status: 'new'
    })

    await contact.save()

    res.status(201).json({
      message: 'Message sent successfully!',
      success: true
    })
  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to send message. Please try again later.'
    })
  }
})

// @route   GET /api/contact/admin
// @desc    Get all contact messages (admin only)
// @access  Private (Admin)
router.get('/admin', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query

    const query = {}
    if (status && status !== 'all') {
      query.status = status
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('repliedBy', 'firstName lastName email')

    const count = await Contact.countDocuments(query)

    // Get counts by status
    const statusCounts = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    const counts = {
      new: 0,
      read: 0,
      replied: 0,
      archived: 0,
      total: count
    }

    statusCounts.forEach(item => {
      counts[item._id] = item.count
    })

    res.json({
      contacts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
      counts
    })
  } catch (error) {
    console.error('Get contacts error:', error)
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to fetch contacts'
    })
  }
})

// @route   GET /api/contact/admin/:id
// @desc    Get single contact message
// @access  Private (Admin)
router.get('/admin/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('repliedBy', 'firstName lastName email')

    if (!contact) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Contact message not found'
      })
    }

    // Mark as read if it's new
    if (contact.status === 'new') {
      contact.status = 'read'
      await contact.save()
    }

    res.json({ contact })
  } catch (error) {
    console.error('Get contact error:', error)
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to fetch contact'
    })
  }
})

// @route   PUT /api/contact/admin/:id
// @desc    Update contact message status/notes
// @access  Private (Admin)
router.put('/admin/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, priority, adminNotes } = req.body

    const contact = await Contact.findById(req.params.id)

    if (!contact) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Contact message not found'
      })
    }

    if (status) contact.status = status
    if (priority) contact.priority = priority
    if (adminNotes !== undefined) contact.adminNotes = adminNotes

    if (status === 'replied' && !contact.repliedAt) {
      contact.repliedAt = new Date()
      contact.repliedBy = req.user._id
    }

    await contact.save()

    res.json({
      message: 'Contact updated successfully',
      contact
    })
  } catch (error) {
    console.error('Update contact error:', error)
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to update contact'
    })
  }
})

// @route   DELETE /api/contact/admin/:id
// @desc    Delete contact message
// @access  Private (Admin)
router.delete('/admin/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)

    if (!contact) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Contact message not found'
      })
    }

    res.json({
      message: 'Contact deleted successfully'
    })
  } catch (error) {
    console.error('Delete contact error:', error)
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to delete contact'
    })
  }
})

// @route   POST /api/contact/admin/bulk-delete
// @desc    Delete multiple contacts
// @access  Private (Admin)
router.post('/admin/bulk-delete', authenticate, requireAdmin, async (req, res) => {
  try {
    const { contactIds } = req.body

    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Contact IDs array is required'
      })
    }

    const result = await Contact.deleteMany({
      _id: { $in: contactIds }
    })

    res.json({
      message: `${result.deletedCount} contact(s) deleted successfully`,
      deletedCount: result.deletedCount
    })
  } catch (error) {
    console.error('Bulk delete contacts error:', error)
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to delete contacts'
    })
  }
})

module.exports = router