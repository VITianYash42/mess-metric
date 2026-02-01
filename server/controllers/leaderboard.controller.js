const User = require("../models/User");

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().sort({ mealCoins: -1 });

    const leaderboard = users.map((u, index) => ({
      name: u.name,
      email: u.email,
      mealCoins: u.mealCoins,
      rank: index + 1
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error("Error getting leaderboard", err);
    res.status(500).json({ message: "Server error" });
  }
};
