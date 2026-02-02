const User = require("../models/User");

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ mealCoins: -1 })
      .select("name email mealCoins");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
