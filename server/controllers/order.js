const User = require('../models/user')
const Order = require('../models/order')

const createOrder = async(req,res) => {
    try {
        const {products,buyer,razorpay_order_id,razorpay_payment_id,amount} = req.body;
        const order = await Order.create({products,buyer,razorpay_order_id,razorpay_payment_id,amount})
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json(error);
    }
}

const getUserOrders = async(req,res) => {
    try {
        const userID = req.body.userID;
        const orders = await Order.find({buyer: userID})
        res.status(200).json(orders)
    } catch (error) {
        res.status(400).json(error);
    }
}


module.exports = {getUserOrders,createOrder}