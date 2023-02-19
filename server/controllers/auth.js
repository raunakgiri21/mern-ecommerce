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
            return res.status(400).json({error: "email is taken!"})
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
            name: user.name,
            email: user.email,
            role: user.role,
            address: user.address,
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
        const isPasswordCorrect = await comparePassword(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({error: "incorrect password!"})
        }
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
        res.status(201).json({user: {
            name: user.name,
            email: user.email,
            role: user.role,
            address: user.address,
        }, token});
    } catch (error) {
        res.status(400).json(error)
    }
}

module.exports = {
    users, register, login
}