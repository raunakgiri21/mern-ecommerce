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

const updateOrder = async(req,res) => {
    try {
        const orderID = req.body.orderID;
        const status = req.body.status;
        const order = await Order.findByIdAndUpdate(orderID,{status: status},{new: true})
        res.status(200).json(order)
    } catch (error) {
        res.status(400).json(error);
    }
}

const getAllOrders = async(req,res) => {
    try {
        const orders = await Order.find({})
        res.status(200).json(orders)
    } catch (error) {
        res.status(400).json(error);
    }
}


module.exports = {getUserOrders,getAllOrders,updateOrder,createOrder}