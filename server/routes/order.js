const express = require('express')
const router = express.Router()

// middlewares
const {authenticationMiddleware,isAdminMiddleware} = require('../middleware/auth')

// controllers
const {createOrder,getUserOrders} = require('../controllers/order')

router.post('/',authenticationMiddleware,getUserOrders)
router.post('/create-order',authenticationMiddleware,createOrder)

module.exports = router