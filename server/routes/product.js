const express = require('express')
const formidable = require('express-formidable')
const router = express.Router()

// middlewares
const {authenticationMiddleware,isAdminMiddleware} = require('../middleware/auth')

// controllers
const {getAllProducts,getSingleProduct,createProduct,updateProduct,deleteProduct,getProductPhoto} = require('../controllers/product')

// routes
router.get('/',getAllProducts);
router.post('/',authenticationMiddleware,isAdminMiddleware,formidable(),createProduct);
router.get('/:slug',getSingleProduct);
router.get('/image/:slug',getProductPhoto);
router.put('/:productId',authenticationMiddleware,isAdminMiddleware,formidable(),updateProduct);
router.delete('/:productId',authenticationMiddleware,isAdminMiddleware,deleteProduct);


module.exports = router;
