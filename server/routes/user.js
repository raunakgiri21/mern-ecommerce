const express = require('express')
const router = express.Router()

// middleware
const {authenticationMiddleware, isAdminMiddleware} = require('../middleware/auth')

// controllers
const {getUserCart, addToCart, updateCartItem, deleteCartItem, clearCart} = require('../controllers/user')

// routes
router.get('/cart/:userID',authenticationMiddleware,getUserCart) // Get Cart
router.post('/cart/:userID',authenticationMiddleware,addToCart) // Add to Cart
router.put('/cart/:userID/:cartItemID',authenticationMiddleware,updateCartItem) // Update a Cart-item
router.put('/cart/removeItem/:userID/:cartItemID',authenticationMiddleware,deleteCartItem) // Remove an Cart-item
router.put('/cart-clear/:userID',authenticationMiddleware,clearCart) // Clear Cart Completely


// router.get('/wishlist',authenticationMiddleware,getUserWishlist)
// router.get('/order-details',authenticationMiddleware,getOrderDetails)
// router.post('/wishlist',authenticationMiddleware,addToWishlist)



module.exports = router