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
        const {amount, cart, address, phone, buyer, email} = req.body;
        const options = {
            amount: Number(amount * 100),  // amount in the smallest currency unit
            currency: "INR",
        };
        const order = await instance.orders.create(options);
        const products = cart.map(c => {
            return {productID: c.productID,quantity: c.quantity}
        })
        const newOrder = await Order.create({products,buyer, amount: amount/100, razorpay_order_id: order.id, address: address, phone: phone})
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
            const updateOrder = await Order.findOneAndUpdate({razorpay_order_id},{success: true},{new: true})
            res.status(200).json({success: true, razorpay_order_id, razorpay_payment_id})
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