const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLenght: 32,
        unique: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    }
})

module.exports = mongoose.model('Category', categorySchema)