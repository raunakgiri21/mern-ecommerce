const express = require('express')
const formidable = require('express-formidable')
const router = express.Router()

// middlewares
const {authenticationMiddleware,isAdminMiddleware} = require('../middleware/auth')

// controllers
const {getAllProducts,getSingleProduct,createProduct,updateProduct,deleteProduct,getProductPhoto,getTotalProductsLength} = require('../controllers/product')

// routes
router.get('/',getAllProducts);
router.post('/',authenticationMiddleware,isAdminMiddleware,formidable(),createProduct);
router.get('/length',getTotalProductsLength);
router.get('/:slug',getSingleProduct);
router.get('/image/:productId',getProductPhoto);
router.patch('/:productId',authenticationMiddleware,isAdminMiddleware,formidable(),updateProduct);
router.delete('/:productId',authenticationMiddleware,isAdminMiddleware,deleteProduct);


module.exports = router;
