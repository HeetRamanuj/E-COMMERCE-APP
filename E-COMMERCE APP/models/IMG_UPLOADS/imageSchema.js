const mongoose = require("mongoose");
mongoose.pluralize(null);

const imageSchema = mongoose.Schema({
  email: {
    type: String,
  },
  imgName: {
    type: String,
  },
  img: {
    type: String,
  },
});

const imageModel = mongoose.model("img_master", imageSchema);
module.exports = imageModel;
