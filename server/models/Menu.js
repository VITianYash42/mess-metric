const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  type: { type: String, required: true },   // Breakfast, Lunch, Snacks, Dinner
  time: { type: String, required: true },   // e.g. "07:30 - 09:30"
  menu: { type: String, required: true },   // description of items
  calories: { type: Number, default: 0 }
}, { _id: false });

const dayMenuSchema = new mongoose.Schema({
  day: { type: String, required: true, unique: true }, // Monday, Tuesday, ...
  meals: [mealSchema]
}, { _id: true });

const menuSchema = new mongoose.Schema({
  weeklyMenu: [dayMenuSchema],
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// The default _id index is sufficient; MongoDB already enforces uniqueness.
// (redundant custom index removed to avoid warnings)

module.exports = mongoose.model("Menu", menuSchema);
