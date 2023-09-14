const express = require('express')
const passport = require('passport')
const router = express.Router()

// middleware
const {authenticationMiddleware, isAdminMiddleware} = require('../middleware/auth')

// controllers
const {users, register, login, googleAuth, getAllUsers, getUserDetails, deleteUserByID, profileUpdate} = require('../controllers/auth')

// routes
router.get('/',users)
router.post('/register',register)
router.post('/login',login)

router.get("/login/success",(req,res) => {
    if(req.user) {
        res.status(200).cookie("user",req.user.user).cookie("token",req.user.token).redirect("http://localhost:8000/")
    }
})
router.get('/google',passport.authenticate('google',{
    scope: ['profile','email']
}))
router.get('/google/redirect',passport.authenticate('google',{
    successRedirect: "http://localhost:8000/api/v1/auth/login/success",
    failureRedirect: "http://localhost:8000/login"
}),(req,res)=>{
    res.status(200).json(req.user)
})
router.get('/all-users',authenticationMiddleware,isAdminMiddleware,getAllUsers)
router.delete('/delete-user/:userID',authenticationMiddleware,isAdminMiddleware,deleteUserByID)
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