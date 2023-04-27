const router = require('express').Router()

// routes

const authRoutes = require('./auth.route')

router.use('/api/auth', authRoutes)

module.exports = router