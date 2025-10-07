const express = require('express')
const { body, validationResult } = require('express-validator')
const Student = require('../models/Student')

const router = express.Router()

// Note: Authentication and authorization are handled by the parent admin router

// @route   GET /api/admin/students
// @desc    Get all students
// @access  Admin
router.get('/', async (req, res) => {
  try {
    const { level, status, search, page = 1, limit = 10 } = req.query

    // Build query
    const query = {}

    if (level && level !== 'all') {
      query.level = level
    }

    if (status && status !== 'all') {
      query.status = status
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } }
      ]
    }

    // Execute query with pagination
    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const count = await Student.countDocuments(query)

    res.json({
      students,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    })
  } catch (error) {
    console.error('Get students error:', error)
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to fetch students'
    })
  }
})

// @route   GET /api/admin/students/:id
// @desc    Get student by ID
// @access  Admin
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)

    if (!student) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Student not found'
      })
    }

    res.json({ student })
  } catch (error) {
    console.error('Get student error:', error)
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to fetch student'
    })
  }
})

// @route   POST /api/admin/students
// @desc    Create new student
// @access  Admin
router.post('/', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('registrationNumber').trim().notEmpty().withMessage('Registration number is required'),
  body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      registrationNumber,
      password,
      dateOfBirth,
      gender,
      address,
      level,
      status,
      institution,
      admissionDate,
      nationalId,
      guardianName,
      guardianPhone,
      guardianEmail
    } = req.body

    // Check if email or registration number already exists
    const existingStudent = await Student.findOne({
      $or: [{ email }, { registrationNumber }]
    })

    if (existingStudent) {
      return res.status(400).json({
        error: 'Duplicate entry',
        message: 'Email or registration number already exists'
      })
    }

    // Create student (password stored as plaintext)
    const student = new Student({
      firstName,
      lastName,
      email,
      phoneNumber,
      registrationNumber,
      password, // Stored as plaintext
      dateOfBirth,
      gender,
      address,
      level: level || 'Level 1',
      status: status || 'active',
      institution,
      admissionDate,
      nationalId,
      guardianName,
      guardianPhone,
      guardianEmail
    })

    await student.save()

    res.status(201).json({
      message: 'Student created successfully',
      student
    })
  } catch (error) {
    console.error('Create student error:', error)
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to create student'
    })
  }
})

// @route   PUT /api/admin/students/:id
// @desc    Update student
// @access  Admin
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)

    if (!student) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Student not found'
      })
    }

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      registrationNumber,
      password,
      dateOfBirth,
      gender,
      address,
      level,
      status,
      institution,
      admissionDate,
      nationalId,
      guardianName,
      guardianPhone,
      guardianEmail
    } = req.body

    // Check for duplicate email or registration number (excluding current student)
    if (email || registrationNumber) {
      const duplicate = await Student.findOne({
        _id: { $ne: req.params.id },
        $or: [
          ...(email ? [{ email }] : []),
          ...(registrationNumber ? [{ registrationNumber }] : [])
        ]
      })

      if (duplicate) {
        return res.status(400).json({
          error: 'Duplicate entry',
          message: 'Email or registration number already exists'
        })
      }
    }

    // Update fields
    if (firstName) student.firstName = firstName
    if (lastName) student.lastName = lastName
    if (email) student.email = email
    if (phoneNumber !== undefined) student.phoneNumber = phoneNumber
    if (registrationNumber) student.registrationNumber = registrationNumber
    if (password) student.password = password // Update plaintext password
    if (dateOfBirth !== undefined) student.dateOfBirth = dateOfBirth
    if (gender !== undefined) student.gender = gender
    if (address !== undefined) student.address = address
    if (level) student.level = level
    if (status) student.status = status
    if (institution !== undefined) student.institution = institution
    if (admissionDate !== undefined) student.admissionDate = admissionDate
    if (nationalId !== undefined) student.nationalId = nationalId
    if (guardianName !== undefined) student.guardianName = guardianName
    if (guardianPhone !== undefined) student.guardianPhone = guardianPhone
    if (guardianEmail !== undefined) student.guardianEmail = guardianEmail

    await student.save()

    res.json({
      message: 'Student updated successfully',
      student
    })
  } catch (error) {
    console.error('Update student error:', error)
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to update student'
    })
  }
})

// @route   DELETE /api/admin/students/:id
// @desc    Delete student
// @access  Admin
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id)

    if (!student) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Student not found'
      })
    }

    res.json({
      message: 'Student deleted successfully'
    })
  } catch (error) {
    console.error('Delete student error:', error)
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to delete student'
    })
  }
})

// @route   POST /api/admin/students/bulk-delete
// @desc    Delete multiple students
// @access  Admin
router.post('/bulk-delete', async (req, res) => {
  try {
    const { studentIds } = req.body

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Student IDs array is required'
      })
    }

    const result = await Student.deleteMany({
      _id: { $in: studentIds }
    })

    res.json({
      message: `${result.deletedCount} student(s) deleted successfully`,
      deletedCount: result.deletedCount
    })
  } catch (error) {
    console.error('Bulk delete error:', error)
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to delete students'
    })
  }
})

module.exports = router