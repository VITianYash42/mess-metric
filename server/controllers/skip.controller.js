const SkipRequest = require("../models/SkipRequest");

// POST /api/meals/skip
// body: { mealType }
// Auth middleware must populate req.user with { id }
exports.requestSkip = async (req, res) => {
  try {
    const { mealType } = req.body;
    const studentId = req.user && req.user.id;

    if (!studentId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validMeals = ["Breakfast", "Lunch", "Snacks", "Dinner"];
    if (!mealType || !validMeals.includes(mealType)) {
      return res.status(400).json({ message: "Invalid mealType provided" });
    }

    // compute today's range in server timezone
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const existing = await SkipRequest.findOne({
      studentId,
      mealType,
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    if (existing) {
      return res.status(429).json({
        message: "You have already requested to skip this meal today.",
      });
    }

    const skipReq = new SkipRequest({ studentId, mealType });
    await skipReq.save();

    return res.status(200).json({
      success: true,
      message: "Skip request submitted and is pending approval.",
      requestId: skipReq._id,
    });
  } catch (err) {
    console.error("[skip.controller] error", err);
    return res.status(500).json({
      message: "Server error while processing skip request",
    });
  }
};
