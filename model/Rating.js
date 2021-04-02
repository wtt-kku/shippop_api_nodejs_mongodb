const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  userRatingID: mongoose.Schema.Types.ObjectId,
  bookRatingID: mongoose.Schema.Types.ObjectId,
  amount: {
    type: Number,
    require: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Rating", ratingSchema);
