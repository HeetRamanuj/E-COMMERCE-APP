const object = require("@hapi/joi/lib/types/object");
const mongoose = require("mongoose");
mongoose.pluralize(null);

const orderSchema = mongoose.Schema({
  email: {
    type: String,
  },
  name: {
    type: String,
  },
  product_ids: {
    type: [Number],
  },
  total_amount: {
    type: Number,
  },
  delivery_address: {
    type: String,
  },
  phone: {
    type: Number,
  },
  // product_qty: {
  //   type: [{}],
  // },
  total_product_qty: {
    type: Number,
  },
  order_date: {
    type: String,
  },
});

const orderModel = mongoose.model("order_master", orderSchema);
module.exports = orderModel;
