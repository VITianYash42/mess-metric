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
