const express = require('express')
const University = require('../models/University')
const Job = require('../models/Job')
const Service = require('../models/Service')
const HomepageSettings = require('../models/HomepageSettings')

const router = express.Router()

// Helper function to calculate time remaining until deadline
const calculateTimeRemaining = (deadline) => {
  if (!deadline) return null
  
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const timeDiff = deadlineDate.getTime() - now.getTime()
  
  if (timeDiff <= 0) {
    return {
      expired: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  }
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
  
  return {
    expired: false,
    days,
    hours,
    minutes,
    seconds,
    totalMilliseconds: timeDiff
  }
}

// @route   GET /api/homepage/content
// @desc    Get dynamic homepage content with countdown timers
// @access  Public
router.get('/content', async (req, res) => {
  try {
    // Get homepage settings
    const settings = await HomepageSettings.findOne({ isActive: true })
    
    // Get featured universities with scholarships and deadlines
    const featuredUniversities = await University.find({ 
      featured: true, 
      status: 'active' 
    })
    .select('name shortName logo rating location admissions programs announcements')
    .limit(6)
    .lean()

    // Process universities to add countdown timers
    const universitiesWithCountdowns = featuredUniversities.map(university => {
      // Add countdown for application deadline
      if (university.admissions?.applicationDeadline) {
        university.applicationCountdown = calculateTimeRemaining(university.admissions.applicationDeadline)
      }

      // Add countdown for active scholarships
      if (university.admissions?.scholarships) {
        university.admissions.scholarships = university.admissions.scholarships
          .filter(scholarship => scholarship.isActive)
          .map(scholarship => ({
            ...scholarship,
            countdown: calculateTimeRemaining(scholarship.deadline)
          }))
      }

      // Add countdown for active announcements
      if (university.announcements) {
        university.announcements = university.announcements
          .filter(announcement => {
            const now = new Date()
            return announcement.isActive && 
                   (!announcement.expiresAt || announcement.expiresAt > now)
          })
          .map(announcement => ({
            ...announcement,
            countdown: calculateTimeRemaining(announcement.deadline)
          }))
          .slice(0, 3) // Limit to 3 most recent announcements
      }

      return university
    })

    // Get featured jobs with application deadlines
    const featuredJobs = await Job.find({ 
      featured: true, 
      status: 'active' 
    })
    .select('title company salary employment timeline location')
    .limit(6)
    .lean()

    // Process jobs to add countdown timers
    const jobsWithCountdowns = featuredJobs.map(job => {
      if (job.timeline?.applicationDeadline) {
        job.applicationCountdown = calculateTimeRemaining(job.timeline.applicationDeadline)
      }
      return job
    })

    // Get featured consulting services
    const featuredServices = await Service.find({ 
      isFeatured: true, 
      isActive: true 
    })
    .select('title shortDescription icon pricing features benefits')
    .sort({ order: 1 })
    .limit(6)
    .lean()

    // Get statistics for animated counters
    const [universityCount, jobCount, applicationCount] = await Promise.all([
      University.countDocuments({ status: 'active' }),
      Job.countDocuments({ status: 'active' }),
      // Assuming you have an Application model for counting
      50 // Mock count for now
    ])

    // Get recent announcements across all universities
    const recentAnnouncements = await University.aggregate([
      { $match: { status: 'active' } },
      { $unwind: '$announcements' },
      { 
        $match: { 
          'announcements.isActive': true,
          $or: [
            { 'announcements.expiresAt': { $exists: false } },
            { 'announcements.expiresAt': { $gte: new Date() } }
          ]
        }
      },
      { 
        $project: {
          universityName: '$name',
          universityLogo: '$logo',
          announcement: '$announcements'
        }
      },
      { $sort: { 'announcement.publishedAt': -1 } },
      { $limit: 10 }
    ])

    // Add countdown timers to announcements
    const announcementsWithCountdowns = recentAnnouncements.map(item => ({
      ...item,
      announcement: {
        ...item.announcement,
        countdown: calculateTimeRemaining(item.announcement.deadline)
      }
    }))

    res.json({
      settings: settings || {},
      content: {
        universities: universitiesWithCountdowns,
        jobs: jobsWithCountdowns,
        services: featuredServices,
        announcements: announcementsWithCountdowns
      },
      statistics: {
        universities: universityCount,
        jobs: jobCount,
        studentsHelped: 1000, // Mock data
        successRate: 85 // Mock data
      },
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('Homepage content error:', error)
    res.status(500).json({
      error: 'Failed to fetch homepage content',
      message: error.message
    })
  }
})

// @route   GET /api/homepage/scholarships
// @desc    Get all active scholarships with countdown timers
// @access  Public
router.get('/scholarships', async (req, res) => {
  try {
    const universities = await University.find({ 
      status: 'active',
      'admissions.scholarships': { $exists: true, $ne: [] }
    })
    .select('name shortName logo admissions.scholarships')
    .lean()

    const scholarships = []
    
    universities.forEach(university => {
      if (university.admissions?.scholarships) {
        university.admissions.scholarships
          .filter(scholarship => scholarship.isActive)
          .forEach(scholarship => {
            scholarships.push({
              ...scholarship,
              universityName: university.name,
              universityLogo: university.logo,
              countdown: calculateTimeRemaining(scholarship.deadline)
            })
          })
      }
    })

    // Sort by deadline (closest first)
    scholarships.sort((a, b) => {
      if (!a.deadline) return 1
      if (!b.deadline) return -1
      return new Date(a.deadline) - new Date(b.deadline)
    })

    res.json({
      scholarships: scholarships.slice(0, 20), // Limit to 20 scholarships
      total: scholarships.length
    })

  } catch (error) {
    console.error('Scholarships error:', error)
    res.status(500).json({
      error: 'Failed to fetch scholarships',
      message: error.message
    })
  }
})

// @route   GET /api/homepage/announcements
// @desc    Get all active announcements with countdown timers
// @access  Public
router.get('/announcements', async (req, res) => {
  try {
    const type = req.query.type || 'all'
    const limit = parseInt(req.query.limit) || 20

    const matchConditions = {
      status: 'active',
      'announcements.isActive': true,
      $or: [
        { 'announcements.expiresAt': { $exists: false } },
        { 'announcements.expiresAt': { $gte: new Date() } }
      ]
    }

    if (type !== 'all') {
      matchConditions['announcements.type'] = type
    }

    const announcements = await University.aggregate([
      { $match: { status: 'active' } },
      { $unwind: '$announcements' },
      { $match: matchConditions },
      { 
        $project: {
          universityName: '$name',
          universityLogo: '$logo',
          announcement: '$announcements'
        }
      },
      { $sort: { 'announcement.publishedAt': -1 } },
      { $limit: limit }
    ])

    const announcementsWithCountdowns = announcements.map(item => ({
      ...item,
      announcement: {
        ...item.announcement,
        countdown: calculateTimeRemaining(item.announcement.deadline)
      }
    }))

    res.json({
      announcements: announcementsWithCountdowns
    })

  } catch (error) {
    console.error('Announcements error:', error)
    res.status(500).json({
      error: 'Failed to fetch announcements',
      message: error.message
    })
  }
})

// @route   GET /api/homepage/stats
// @desc    Get real-time statistics for homepage counters
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUniversities,
      activeUniversities,
      totalJobs,
      activeJobs,
      totalScholarships,
      activeAnnouncements
    ] = await Promise.all([
      University.countDocuments(),
      University.countDocuments({ status: 'active' }),
      Job.countDocuments(),
      Job.countDocuments({ status: 'active' }),
      University.aggregate([
        { $unwind: '$admissions.scholarships' },
        { $match: { 'admissions.scholarships.isActive': true } },
        { $count: 'total' }
      ]),
      University.aggregate([
        { $unwind: '$announcements' },
        { 
          $match: { 
            'announcements.isActive': true,
            $or: [
              { 'announcements.expiresAt': { $exists: false } },
              { 'announcements.expiresAt': { $gte: new Date() } }
            ]
          }
        },
        { $count: 'total' }
      ])
    ])

    res.json({
      universities: {
        total: totalUniversities,
        active: activeUniversities
      },
      jobs: {
        total: totalJobs,
        active: activeJobs
      },
      scholarships: {
        active: totalScholarships[0]?.total || 0
      },
      announcements: {
        active: activeAnnouncements[0]?.total || 0
      },
      studentsHelped: 1000, // Mock data - replace with actual count
      successRate: 85 // Mock data - calculate from actual data
    })

  } catch (error) {
    console.error('Stats error:', error)
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: error.message
    })
  }
})

module.exports = router
