const mongoose = require("mongoose");

const skipRequestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mealType: {
    type: String,
    enum: ["Breakfast", "Lunch", "Snacks", "Dinner"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
}, {
  timestamps: true,
});

// index to speed up daily lookup
skipRequestSchema.index({ studentId: 1, mealType: 1, date: 1 });

module.exports = mongoose.model("SkipRequest", skipRequestSchema);
