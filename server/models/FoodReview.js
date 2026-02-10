const mongoose = require("mongoose");

const foodReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  mealType: {
    type: String,
    enum: ["Breakfast", "Lunch", "Snacks", "Dinner"],
    required: true
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  tags: [{
    type: String,
    default: []
  }],

  comment: {
    type: String,
    default: ""
  },

  aiAnalysis: {
    score: Number,
    keywords: [String]
  },

  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("FoodReview", foodReviewSchema);
