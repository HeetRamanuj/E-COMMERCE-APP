const mongoose = require("mongoose");
mongoose.pluralize(null);

const productSchema = mongoose.Schema({
  email: {
    type: String,
  },
  category_id: {
    type: Number,
  },
  product_id: {
    type: Number,
  },
  product_name: {
    type: String,
  },
  product_description: {
    type: String,
  },
  product_price: {
    type: Number,
  },
  creation_date: {
    type: String,
  },
  product_image: {
    type: String,
  },
});

const productModel = mongoose.model("product_master", productSchema);
module.exports = productModel;
