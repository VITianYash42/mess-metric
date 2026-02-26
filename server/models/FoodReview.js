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

  // 👇 ADDED FOR ADMIN DASHBOARD FEATURES 👇
  status: {
    type: String,
    enum: ["unread", "read"],
    default: "unread"
  },

  reply: {
    type: String,
    default: null
  },

  likes: {
    type: Number,
    default: 0
  },

  dislikes: {
    type: Number,
    default: 0
  },
  // 👆 END ADDED FIELDS 👆

  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("FoodReview", foodReviewSchema);