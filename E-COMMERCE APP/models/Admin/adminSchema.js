const mongoose = require('mongoose')
mongoose.pluralize(null)

const adminSchema = mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    phone: {
        type: Number,
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    }
})

const adminModel = mongoose.model('admin_master', adminSchema)
module.exports = adminModel