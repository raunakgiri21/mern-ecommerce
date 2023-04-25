const express = require('express')
const router = express.Router()

// middlewares
const {authenticationMiddleware,isAdminMiddleware} = require('../middleware/auth')

// controllers
const {createOrder,getAllOrders,getUserOrders,updateOrder} = require('../controllers/order')

router.get('/admin',authenticationMiddleware,isAdminMiddleware,getAllOrders)
router.post('/',authenticationMiddleware,getUserOrders)
router.post('/create-order',authenticationMiddleware,createOrder)
router.put('/update-order',authenticationMiddleware,isAdminMiddleware,updateOrder)

module.exports = router