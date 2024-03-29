const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: [50,"Name should not be more than 50 characters!"]
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    google_ID: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        trim: true,
        min: 8,
    },
    address: [
        {
            street1: {
                type: String,
            },
            street2: {
                type: String,
            },
            state: {
                type: String,
            },
            city: {
                type: String,
            },
            pinCode: {
                type: String,
            },
            phone: {
                type: String,
                trim: true,
            }
        }
    ],
    role: {
        type: Number,
        default: 0,
    },
    cart: [
        {
            productID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        }
    ]
}, {timestamps: true})

module.exports = mongoose.model("User", userSchema);