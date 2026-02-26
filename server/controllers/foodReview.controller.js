const FoodReview = require("../models/FoodReview");
const User = require("../models/User");

exports.createReview = async (req, res) => {
  try {
    const { mealType, rating, tags, comment, aiAnalysis } = req.body;

    if (!mealType || !rating) {
      return res.status(400).json({
        success: false,
        message: "Meal type and rating are required."
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alreadyReviewed = await FoodReview.findOne({
      user: req.user.id,
      mealType,
      date: { $gte: today }
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this meal today."
      });
    }

    const review = await FoodReview.create({
      user: req.user.id,
      mealType,
      rating,
      tags: tags || [],
      comment: comment || "",
      aiAnalysis: aiAnalysis || null
    });

    // Add +5 coins to user (as shown in UI)
    const user = await User.findById(req.user.id);
    if (user) {
      user.mealCoins = (user.mealCoins || 0) + 5;
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: "Review saved successfully",
      data: { review, mealCoins: user?.mealCoins }
    });
  } catch (err) {
    console.error("Food review error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to save review"
    });
  }
};

// ADMIN: fetch all reviews
exports.getAllReviews = async (req, res) => {
  // only admins should call this endpoint. tokens issued via admin login
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  try {
    const reviews = await FoodReview.find()
      .populate("user", "name registrationNo messName");

    res.json({ success: true, data: reviews });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};

// ADMIN: update review (mark as read or reply)
exports.updateReview = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  try {
    const { status, reply } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (reply) updateData.reply = reply;

    const review = await FoodReview.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, data: review });
  } catch (err) {
    console.error("Error updating review:", err);
    res.status(500).json({ success: false, message: "Failed to update review" });
  }
};