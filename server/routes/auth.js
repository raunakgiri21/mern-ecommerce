const express = require('express')
const passport = require('passport')
const router = express.Router()

// middleware
const {authenticationMiddleware, isAdminMiddleware} = require('../middleware/auth')

// controllers
const {users, register, login, googleAuth, getUserDetails, profileUpdate} = require('../controllers/auth')

// routes
router.get('/',users)
router.post('/register',register)
router.post('/login',login)

router.get("/login/success",(req,res) => {
    if(req.user) {
        res.status(200).json({
            success: true,
            message: "successful",
            user: req.user,
        })
    }
})
router.get('/google',passport.authenticate('google',{
    scope: ['profile','email']
}))
router.get('/google/redirect',passport.authenticate('google',{
    successRedirect: "http://localhost:3000/",
    failureRedirect: "http://localhost:3000/login"
}),(req,res)=>{
    console.log(req.user) // do something
    res.status(200).json(req.user)
})

router.get('/user-details/:userID',authenticationMiddleware,getUserDetails)
router.put('/profile',authenticationMiddleware,profileUpdate)
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