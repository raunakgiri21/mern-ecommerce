const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    slug: {
        type: String,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000,
    },
    price: {
        type: Number,
        trim: true,
        required: true,
    },
    category: {
        type: ObjectId,
        ref: "Category",
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    availability: {
        type: Boolean,
        default: true,
    },
    image: {
        filename: {
            type: String,
            required: true,
        },
        contentType: {
            type: String,
            required: true,
        },
        imageBase64: {
            type: String,
            required: true,
        }
    },

},{timestamps: true}) 

module.exports = mongoose.model("Product",productSchema)