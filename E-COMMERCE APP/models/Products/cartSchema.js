const mongoose = require("mongoose");
mongoose.pluralize(null);

const cartSchema = mongoose.Schema({
  email: {
    type: String,
  },
  category_id: {
    type: Number,
  },
  product_id: {
    type: Number,
  },
  productQty: {
    type: Number,
  },
  browserId: {
    type: String,
  },
});

const cartModel = mongoose.model("cart_master", cartSchema);
module.exports = cartModel;
