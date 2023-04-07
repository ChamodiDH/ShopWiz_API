const authController = require('../controller/auth')
const express = require('express')
const router = express.Router()

router.post('/signup',authController.signUp)

module.exports = router