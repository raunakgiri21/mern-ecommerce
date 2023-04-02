const express = require('express')
const router = express.Router()

// middleware
const {authenticationMiddleware, isAdminMiddleware} = require('../middleware/auth')

// controllers
const {getUserCart, addToCart, updateCartItem, deleteCartItem, clearCart, getUserWishlist, addToWishlist, deleteWishlistItem, clearWishlist} = require('../controllers/user')

// routes
router.get('/cart/:userID',authenticationMiddleware,getUserCart) // Get Cart
router.post('/cart/:userID',authenticationMiddleware,addToCart) // Add to Cart
router.put('/cart/:userID/:cartItemID',authenticationMiddleware,updateCartItem) // Update a Cart-item
router.put('/cart/removeItem/:userID/:cartItemID',authenticationMiddleware,deleteCartItem) // Remove an Cart-item
router.put('/cart-clear/:userID',authenticationMiddleware,clearCart) // Clear Cart Completely

router.get('/wishlist/:userID',authenticationMiddleware,getUserWishlist) // Get Wishlist
router.put('/wishlist/:userID',authenticationMiddleware,addToWishlist) // Add to Wislist
router.put('/wishlist/removeItem/:userID/:wishlistProductID',authenticationMiddleware,deleteWishlistItem) // Remove an Wishlist-item
router.put('/wishlist-clear/:userID',authenticationMiddleware,clearWishlist) // Clear Wishlist Completely


// router.get('/order-details',authenticationMiddleware,getOrderDetails)



module.exports = router