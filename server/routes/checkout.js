const express = require('express')
const router = express.Router()

// middlewares
const {authenticationMiddleware,isAdminMiddleware} = require('../middleware/auth')

// controllers
const {razorPay,paymentVerification} = require('../controllers/checkout')

router.post('/razor-pay',razorPay)
router.post('/payment-verification',paymentVerification)

module.exports = router