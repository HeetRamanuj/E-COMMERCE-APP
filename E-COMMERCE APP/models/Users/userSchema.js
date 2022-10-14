const mongoose = require("mongoose");
mongoose.pluralize(null);

const userSchema = mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: Number,
  },
  address: {
    type: String,
  },
  dob: {
    type: String,
  },
  password: {
    type: String,
  },
  token: {
    type: String,
  },
});

const userModel = mongoose.model("user_master", userSchema);
module.exports = userModel;
