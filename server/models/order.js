const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    products: [{
        productID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        quantity: {
            type: Number,
            default: 1,
        },
    }],
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    amount: {
        type: Number,
    },
    razorpay_order_id: {
        type: String,
        unique: true,
    },
    success: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        default: "Not processed",
        enum: ["Not processed","Processing","Shipped","Delivered","Cancelled"]
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
    }
},{timestamps: true})

module.exports = mongoose.model('Order', orderSchema)