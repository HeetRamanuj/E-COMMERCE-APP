const mongoose = require('mongoose')
mongoose.pluralize(null)

const categorySchema = mongoose.Schema({
    email: {
        type: String,
    },
    category_id: {
        type: Number,
    },
    category_name: {
        type: String,
    },

})


const categoryModel = mongoose.model('category_master', categorySchema)
module.exports = categoryModel