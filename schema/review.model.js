const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  rating: {
    type: Number,
    default: 0
  },
  comment: {
    type: String
  }
});

module.exports = mongoose.model("Review", reviewSchema);
