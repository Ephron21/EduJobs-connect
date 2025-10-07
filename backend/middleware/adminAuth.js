// Re-export requireAdmin from auth.js for backward compatibility
const { requireAdmin } = require('./auth')

module.exports = requireAdmin