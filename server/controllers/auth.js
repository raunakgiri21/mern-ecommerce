const users = (req,res)=>{
    res.status(200).json({msg: "users endpoint"})
}

const User = require('../models/user')
const jwt = require('jsonwebtoken')
const {hashPassword, comparePassword} = require('../helpers/auth')

const register = async (req,res) => {
    try {
        const body = req.body;
        const {name,email,password} = body;
        if(!name.trim()){
            return res.status(400).json({error: "Name is required!"})
        }
        if(!email){
            return res.status(400).json({error: "email is required!"})
        }
        if(!password || password.length<8){
            return res.status(400).json({error: "Password must be atleast 8 characters long!"})
        }
        const isExisting = await User.findOne({email: email})
        if(isExisting){
            return res.status(400).json({error: "User already exixts!"})
        }
        const hashedPassword = await hashPassword(password);
        const user = await User.create({...body, password: hashedPassword})
        // jwt
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
        res.status(201).json({user: {
            userID: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            address: user.address,
            phone: user.phone,
        }, token});
    } catch (error) {
        res.status(400).json(error);
    }
}

const login = async (req,res) => {
    try {
        const body = req.body;
        const {email, password} = body;
        if(!email){
            return res.status(400).json({error: "email is required!"})
        }
        if(!password){
            return res.status(400).json({error: "password is required!"})
        }
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(400).json({error: "User doesn't exists!"})
        }
        if(!user?.password){
            throw ({error:"Failed! Try Google SignIn"})
        }
        const isPasswordCorrect = await comparePassword(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({error: "incorrect password!"})
        }
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
        res.status(201).json({user: {
            userID: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            address: user.address,
            phone: user.phone,
        }, token});
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

const googleAuth = async(req,res) => {
    try {
        res.status(200).json({msg: "Google Login"})
    } catch (error) {
        res.status(400).json(error)
    }
}

const getAllUsers = async(req,res) => {
    try {
        const users = await User.find({}).sort('-role createdAt')
        res.status(200).json(users) 
    } catch (error) {
        res.status(400).json(error)        
    }
}

const getUserDetails = async(req,res) => {
    try {
        const user = await User.findById(req.params.userID);
        res.status(200).json({user :{
            userID: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            address: user.address,
            phone: user.phone,
        }})
    } catch (error) {
        res.status(400).json(error)
    }
}

const deleteUserByID = async(req,res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userID)
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json(error)
    }
}

const profileUpdate = async(req,res) => {
    try {
        const {name,password,address} = req.body;
        const user = await User.findById(req.body._id)
        if(password && password.length<8){
            return res.status(400).json({error: "Password length should be more than 8!"})
        }
        const hashedPassword = password? await hashPassword(password) : undefined;
        const updated = await User.findByIdAndUpdate(req.body._id,{name: name || user.name, password: hashedPassword ,address: address || user.address},{new: true})
        res.status(200).json({user :{
            userID: updated._id,
            name: updated.name,
            email: updated.email,
            role: updated.role,
            address: updated.address,
            phone: updated.phone
        }})
    } catch (error) {
        res.status(400).json(error)
    }
}

module.exports = {
    users, register, login, googleAuth, getAllUsers, deleteUserByID, getUserDetails, profileUpdate
}