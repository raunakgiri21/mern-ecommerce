const express = require('express')
const router = express.Router();

// middleware
const {authenticationMiddleware, isAdminMiddleware} = require('../middleware/auth')

// controllers
const { createCategory, updateCategory, deleteCategory, readCategoryList, readSingleCategory } = require('../controllers/category')
router.post('/',authenticationMiddleware,isAdminMiddleware,createCategory)
router.put('/:categoryId',authenticationMiddleware,isAdminMiddleware,updateCategory)
router.delete('/:categoryId',authenticationMiddleware,isAdminMiddleware,deleteCategory)
router.get('/',readCategoryList)
router.get('/:categoryId',readSingleCategory)


module.exports = router