const User = require('../models/user')
const Order = require('../models/order')
const Razorpay = require('razorpay')
const crypto = require("crypto");

// Razorpay instance
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

const razorPay = async(req,res) => {
    try {
        const options = {
            amount: Number(req.body.amount * 100),  // amount in the smallest currency unit
            currency: "INR",
        };
        const order = await instance.orders.create(options);
        console.log(order)
        const products = req.body.cart.map(c => {
            return {productID: c.productID,quantity: c.quantity}
        })
        console.log(products)  
        // const newOrder = await Order.create({products})
        res.status(200).json({
            success: true,
            order,
        })
    } catch (error) {
        console.log(error)
        res.status(400).json(error);
    }
}
const paymentVerification = async(req,res) => {
    try {
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET)
                                        .update(body.toString())
                                        .digest('hex');

        if(expectedSignature === razorpay_signature) {
            res.status(200).json({success: true})
        }
        else {
            res.status(200).json({success: false})
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({success: false})
    }
}


module.exports = {razorPay,paymentVerification}