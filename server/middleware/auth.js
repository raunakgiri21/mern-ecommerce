const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authenticationMiddleware = async (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(400).json({error: "No Token Provided!"})
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const {_id} = decoded;
        req.user = {_id};
        next();
    } catch (error) {
        res.status(400).json(error)
    }
}

const isAdminMiddleware = async (req,res,next) => {
    try {
        const id = req.user._id;
        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json("User doesnt exists!");
        }
        if(user.role !== 1){
            return res.status(403).json("User has no admin permission!");
        }
        next()
    } catch (error) {
        res.status(400).json(error)
    }
}

module.exports = {authenticationMiddleware, isAdminMiddleware}