const express = require('express')
const router = express.Router()

// middleware
const {authenticationMiddleware, isAdminMiddleware} = require('../middleware/auth')

// controllers
const {users, register, login} = require('../controllers/auth')

// routes
router.get('/',users)
router.post('/register',register)
router.post('/login',login)
router.get('/auth-check', authenticationMiddleware, (req, res) => {
    res.status(200).json({ok: true});
})
router.get('/admin-check', authenticationMiddleware, isAdminMiddleware, (req, res) => {
    res.status(200).json({ok: true});
})
router.get('/secret', authenticationMiddleware, (req,res) => {
    res.status(200).json(req.user)
})




module.exports = router