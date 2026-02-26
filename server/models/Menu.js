const mongoose = require("mongoose");

// Generic meal entry for the existing free-form "meals" array
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

// Raw item schema used for categorized meal lists
const rawItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  vegetarian: { type: Boolean, default: false },
  calories: { type: Number },
  notes: { type: String }
}, { _id: false });

// Day schema with explicit categories: breakfast, lunch, snacks, dinner
const dayRawSchema = new mongoose.Schema({
  day: { type: String, required: true, unique: true }, // Monday, Tuesday, ...
  breakfast: { type: [rawItemSchema], default: [] },
  lunch: { type: [rawItemSchema], default: [] },
  snacks: { type: [rawItemSchema], default: [] },
  dinner: { type: [rawItemSchema], default: [] }
}, { _id: true });

const menuSchema = new mongoose.Schema({
  // Preserve existing flexible structure for backward compatibility
  weeklyMenu: { type: [dayMenuSchema], default: [] },

  // New raw, typed menu organized by day and meal category
  rawWeeklyMenu: { type: [dayRawSchema], default: [] },

  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Menu", menuSchema);
