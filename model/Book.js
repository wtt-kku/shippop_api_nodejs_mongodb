const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    max: 100,
  },
  description: {
    type: String,
    require: true,
    max: 1024,
  },
  price: {
    type: Number,
    require: true,
  },
  discout: {
    type: Number,
  },
  owner: mongoose.Schema.Types.ObjectId,
  visible: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Book", bookSchema);
