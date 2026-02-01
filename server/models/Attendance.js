const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  mealType: {
    type: String,
    enum: ["breakfast", "lunch", "dinner"],
    required: true
  },

  date: {
    type: Date,
    default: () => new Date().toDateString()
  },

  faceVerified: {
    type: Boolean,
    default: false
  },

  markedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Attendance", attendanceSchema);
